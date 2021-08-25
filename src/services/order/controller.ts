import { NextFunction, Request, Response } from 'express';

import { Order } from '../../models/order.model';

export const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const balances = await Order.findAll({
      where: { userId: (req as any).user.payload.id },
      order: [
        ['id', 'DESC']
      ]
    });
    res.json(balances);
    next();
  } catch (e) {
    next(e);
  }
};

export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = {
      ...req.body,
      userId: (req as any).user.payload.id,
      status: 'PENDING'
    }

    const order = await Order.create(payload);
    res.json(order);
    
    next();
  } catch (e) {
    next(e);
  }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOne({
      where: {
        id:  (req as any).params.id
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = 'CANCELED';
    await order.save();

    res.locals.order = order.toJSON();

    res.json({
      message: 'Success'
    });
    next();
  } catch (e) {
    next(e);
  }
};
