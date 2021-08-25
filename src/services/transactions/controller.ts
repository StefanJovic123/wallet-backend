import { NextFunction, Request, Response } from 'express';
import { Transaction as OrmTrans } from 'sequelize';
import { sequelize } from '../../db';

import { Transaction } from '../../models/transaction.model';
import { Balance } from '../../models/balance.model';

export const findDeposists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions: Transaction[] = await Transaction.findAll({
      where: {
        userId: (req as any).user.payload.id,
        transType: 'DEPOSIT'
      },
      order: [
        ['id', 'DESC']
      ]
    });

    return res.json(transactions);
  } catch (e) {
    next(e);
  }
};

export const deposit = async (req: Request, res: Response, next: NextFunction) => {
  const trx: OrmTrans = await sequelize.transaction();
  
  try {
    const payload = {
      ...req.body,
      userId: (req as any).user.payload.id,
      transType: 'DEPOSIT',
      status: 'COMPLETED'
    }

    const deposit: Transaction = await Transaction.create(payload, { transaction: trx });
    const bl = await Balance.findOne({
      where: {
        userId: (req as any).user.payload.id,
        token: req.body.token
      },
      transaction: trx
    });

    if (!bl) {
      await trx.rollback();
      return res.status(404).json({ error: `Balance for token: ${req.body.token} is not found` });
    }

    await bl.update({
      balance: Number(bl.balance) + Number(req.body.amount)
    }, { transaction: trx })

    await trx.commit();
    return res.json(deposit);
  } catch (e) {
    await trx.rollback();
    next(e);
  }
};
