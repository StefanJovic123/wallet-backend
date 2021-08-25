import { NextFunction, Request, Response } from 'express';

import { Balance } from '../../models/balance.model';

export const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const whereClause = {
      where: { userId: (req as any).user.payload.id }
    };

    const balances = await Balance.findAll(whereClause);
    return res.json(balances);
  } catch (e) {
    next(e);
  }
};

export const getByToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const whereClause = {
      where: {
        userId: (req as any).user.payload.id,
        token: req.query.token
      }
    };

    const balances = await Balance.findAll(whereClause);;
    return res.json(balances);
  } catch (e) {
    next(e);
  }
};
