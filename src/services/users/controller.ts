import { NextFunction, Request, Response } from 'express';

import { User } from '../../models/user.model';
import { Balance } from '../../models/balance.model';

export const find = async (req: Request, res: Response, next: NextFunction) => {
	// If a query string ?publicAddress=... is given, then filter results
	try {
		const whereClause =
		req.query && req.query.publicAddress
			? {
					where: { publicAddress: req.query.publicAddress },
			  }
			: undefined;

		const users = await User.findAll(whereClause);
		return res.json(users);
	} catch(e) {
		next(e);
	}
};

export const get = (req: Request, res: Response, next: NextFunction) => {
	try {
		// AccessToken payload is in req.user.payload, especially its `id` field
		// UserId is the param in /users/:userId
		// We only allow user accessing herself, i.e. require payload.id==userId
		if ((req as any).user.payload.id !== +req.params.userId) {
			return res
				.status(401)
				.send({ error: 'You can can only access yourself' });
		}

		const user = User.findByPk(req.params.userId);
		return res.json(user);
	}  catch(e) {
		next(e);
	}
	
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Create User
		const user = await User.create(req.body);

		// create initial balance
		await Balance.create({
			userId: user.id,
			balance: 0,
			blockedBalance: 0,
			token: 'ETH'
		})

		await Balance.create({
			userId: user.id,
			balance: 0,
			blockedBalance: 0,
			token: 'USDT'
		})

		await Balance.create({
			userId: user.id,
			balance: 0,
			blockedBalance: 0,
			token: 'DVF'
		})

		return res.json(user);
	} catch(e) {
		next(e);
	}
}

export const patch = async (req: Request, res: Response, next: NextFunction) => {
	// Only allow to fetch current user
	try {
		if ((req as any).user.payload.id !== +req.params.userId) {
			return res
				.status(401)
				.send({ error: 'You can can only access yourself' });
		}
		let user = await User.findByPk(req.params.userId);
		if (!user) {
			return res.status(404).json({ error: 'User is not found' });
		}

		Object.assign(user, req.body);
		user = await user.save();

		return res.json(user)
	} catch (e) {
		next(e);
	}
};
