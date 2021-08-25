import { Application } from 'express';
import authRoutes from './auth';
import usersRoute from './users';
import balancesRoutes from './balances';
import transactionRoutes from './transactions';
import ordersRoutes from './order';

export default (app: Application) => {
  const routes = [
    ...authRoutes,
    ...usersRoute,
    ...balancesRoutes,
    ...transactionRoutes,
    ...ordersRoutes
  ];
  
  routes.forEach(route => {
    // @ts-ignore
    app[route.method.toLowerCase()](
      route.path,
      route.middlewares ? route.middlewares.preRoute || [] : [], 
      route.handler,
      route.middlewares ? route.middlewares.postRoute || [] : []
    );
  });

  return routes;
};
