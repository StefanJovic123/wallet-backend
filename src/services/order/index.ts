import { NextFunction, Request, Response } from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

// @ts-ignore
const logPlaceOrCancelOrder = function(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/placeOrder') {
    console.log(
      `PLACED ${req.body.orderType} @ ${req.body.price} ${req.body.amount}`
    )
  }

  if (req.path.includes('/cancelOrder/')) {
    const order = res.locals.order;
    console.log(
      `CANCELED ${order.orderType} @ ${order.price} ${order.amount}`
    )
  }
  next(); /* Can be removed safely */
}

export default [
  {
    path: '/getOrders',
    method: 'GET',
    middlewares: {
      preRoute: [
        jwt(config)
      ],
      postRoute: []
    },
    handler: controller.find
  },
  {
    path: '/placeOrder',
    method: 'POST',
    middlewares: {
      preRoute: [
        jwt(config)
      ],
      postRoute: [
        logPlaceOrCancelOrder
      ]
    },
    handler: controller.placeOrder
  },
  {
    path: '/cancelOrder/:id',
    method: 'DELETE',
    middlewares: {
      preRoute: [
        jwt(config)
      ],
      postRoute: [
        logPlaceOrCancelOrder
      ]
    },
    handler: controller.cancelOrder
  },
];
