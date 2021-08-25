import { Model } from 'sequelize';

export class Order extends Model {
	public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public amount!: number;
  public token!: string;
  public orderType!: 'BUY' | 'SELL';
  public userId!: number;
  public status!: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
  public price!: number;
}
