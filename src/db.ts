import os from 'os';
import path from 'path';
import { INTEGER, Sequelize, STRING, DECIMAL } from 'sequelize';

import { User, Balance, Transaction, Order } from './models';

const tmpDir = os.tmpdir();

const sequelize = new Sequelize('login-with-metamask-database', '', undefined, {
	dialect: 'sqlite',
	storage: path.join(tmpDir, 'db.sqlite'),
	logging: false,
});

// Init all models
User.init(
	{
		nonce: {
			allowNull: false,
			type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
			defaultValue: (): number => Math.floor(Math.random() * 10000), // Initialize with a random nonce
		},
		publicAddress: {
			allowNull: false,
			type: STRING,
			unique: true,
			validate: { isLowercase: true },
		},
		username: {
			type: STRING,
			unique: true,
		},
	},
	{
		modelName: 'users',
		sequelize, // This bit is important
		timestamps: false,
	}
);

Balance.init(
	{
		balance: {
			allowNull: false,
			type: DECIMAL,
			defaultValue: 0,
		},
		blockedBalance: {
			type: DECIMAL,
			defaultValue: 0,
		},
		token: {
			type: STRING,
			allowNull: false
		},
		userId: {
			type: INTEGER.UNSIGNED,
			allowNull: false
		}
	},
	{
		modelName: 'balances',
		sequelize, // This bit is important
		timestamps: true,
	}
);

Order.init(
	{
		amount: {
			allowNull: false,
			type: DECIMAL,
			defaultValue: 0,
		},
		token: {
			allowNull: false,
			type: STRING,
		},
		price: {
			allowNull: false,
			type: DECIMAL,
		},
		orderType: {
			allowNull: false,
			type: STRING,
		},
		userId: {
			allowNull: false,
			type: INTEGER.UNSIGNED,
		},
		status: {
			allowNull: false,
			type: STRING,
			defaultValue: 'PENDING'
		}
	},
	{
		modelName: 'orders',
		sequelize, // This bit is important
		timestamps: true,
	}
);

Transaction.init(
	{
		amount: {
			type: DECIMAL,
			defaultValue: 0,
		},
		token: {
			allowNull: false,
			type: STRING,
		},
		transType: {
			allowNull: false,
			type: STRING,
		},
		userId: {
			type: INTEGER.UNSIGNED,
			allowNull: false
		},
		status: {
			allowNull: false,
			type: STRING,
			defaultValue: 'PENDING'
		}
	},
	{
		modelName: 'transactions',
		sequelize, // This bit is important
		timestamps: true,
	}
);

// Create new tables
sequelize.sync();

export { sequelize };
