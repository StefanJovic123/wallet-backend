import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../../config';
import { User } from '../../models/user.model';

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { signature, publicAddress } = req.body;
		if (!signature || !publicAddress) {
			return res
				.status(400)
				.send({ error: 'Request should have signature and publicAddress' });
		}

		////////////////////////////////////////////////////
		// Step 1: Get the user with the given publicAddress
		////////////////////////////////////////////////////
		let user = await User.findOne({ where: { publicAddress } });
		if (!user) {
			return res.status(404).send({
				error: `User with publicAddress ${publicAddress} is not found in database`,
			});
		}

		////////////////////////////////////////////////////
		// Step 2: Verify digital signature
		////////////////////////////////////////////////////
		if (!(user instanceof User)) {
			// Should not happen, we should have already sent the response
			throw new Error(
				'User is not defined in "Verify digital signature".'
			);
		}

		const msg = `I am signing my one-time nonce: ${user.nonce}`;

		// We now are in possession of msg, publicAddress and signature. We
		// will use a helper from eth-sig-util to extract the address from the signature
		const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
		const address = recoverPersonalSignature({
			data: msgBufferHex,
			sig: signature,
		});

		// The signature verification is successful if the address found with
		// sigUtil.recoverPersonalSignature matches the initial publicAddress
		if (address.toLowerCase() !== publicAddress.toLowerCase()) {
			return res.status(400).send({
				error: 'Signature verification failed',
			});
		}

		////////////////////////////////////////////////////
		// Step 3: Generate a new nonce for the user
		////////////////////////////////////////////////////
		user.nonce = Math.floor(Math.random() * 10000);
		user = await user.save();


		////////////////////////////////////////////////////
		// Step 4: Create JWT
		////////////////////////////////////////////////////
		const accessToken = jwt.sign(
			{
				payload: {
					id: user.id,
					publicAddress,
				},
			},
			config.secret,
			{
				algorithm: config.algorithms[0],
			},
		);

		if (!accessToken) {
			throw new Error('Empty token');
		}

		return res.json({ accessToken });
	} catch (e) {
		next(e);
	}
};
