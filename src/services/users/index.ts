import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export default [
  {
    path: '/users',
    method: 'GET',
    middlewares: {
      preRoute: [],
      postRoute: []
    },
    handler: controller.find
  },
  {
    path: '/users/:userId',
    method: 'GET',
    middlewares: {
      preRoute: [ jwt(config) ],
      postRoute: []
    },
    handler: controller.get
  },
  {
    path: '/users',
    method: 'POST',
    middlewares: null,
    handler: controller.create
  },
  {
    path: '/users/:userId',
    method: 'PUT',
    middlewares: {
      preRoute: [ jwt(config) ],
      postRoute: []
    },
    handler: controller.create
  }
];
