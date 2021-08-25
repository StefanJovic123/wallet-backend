import { Model } from 'sequelize';

export class Transaction extends Model {
	public id!: number; // Note that the `null assertion` `!` is required in strict mode.
	public amount!: number;
  public token!: string;
  public transType!: 'DEPOSIT' | 'WITHDRAWAL';
  public userId!: number;
  public status!: 'PENDING' | 'COMPLETED' | 'FAILED'
}
