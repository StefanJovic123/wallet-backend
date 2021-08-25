import cron from 'node-cron';
import { Order } from '../models/order.model';
import { Op } from 'sequelize';
import moment from 'moment';

// 2021-08-24 21:19:09.506 +00:00

// Check orders every 2 minutes
export default (): void => {
  cron.schedule('* * * * *', async () => {
    return Order.update({
      status: 'COMPLETED'
    }, {
      where: {
        createdAt: {
          [Op.lte]: moment().subtract(1, 'minutes').toDate()
        },
        status: 'PENDING'
      }
    }).then(orders => {
      for (let i = 0; i < orders.length; i++) {
        const order: Order = orders[i] as any;
      }
    }).catch(e => {
      console.log('error', e);
    });
  });  
}
