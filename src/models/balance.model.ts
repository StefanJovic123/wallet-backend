import { Model } from 'sequelize';

export class Balance extends Model {
	public id!: number;

  // Total amount of money
	public balance!: number;

  // Amount of money reserved by current orders
  public blockedBalance!: number;

  public token!: string;

  // Id of related user
  public userId!: number;

  public availableBalance() {
    return this.balance - this.blockedBalance;
  }
}
