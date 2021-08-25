import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export default [
  {
    path: '/deposits',
    method: 'GET',
    middlewares: {
      preRoute: [ jwt(config) ]
    },
    handler: controller.findDeposists
  },
  {
    path: '/deposits',
    method: 'POST',
    middlewares: {
      preRoute: [ jwt(config) ],
      postRoute: []
    },
    handler: controller.deposit
  },
];

