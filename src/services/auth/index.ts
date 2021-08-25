import * as controller from './controller';

export default [
  {
    path: '/auth',
    method: 'POST',
    middlewares: null,
    handler: controller.create
  }
];
