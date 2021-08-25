import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export default [
  {
    path: '/balances/:token',
    method: 'GET',
    middlewares: {
      preRoute: [ jwt(config) ],
      postRoute: []
    },
    handler: controller.getByToken
  },
  {
    path: '/balances',
    method: 'GET',
    middlewares: {
      preRoute: [ jwt(config) ],
      postRoute: []
    },
    handler: controller.find
  },
];

