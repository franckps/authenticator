import { DataTypes, ModelDefined, Sequelize } from "sequelize";
import { Authentication } from "../../models/Authentication";
import { User } from "../../models/User";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database/database.sqlite",
});

export const SequelizeUser: ModelDefined<User, User> = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.NOW,
      allowNull: false,
    },
    passwordRecoveryToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordRecoveryExpiresIn: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
  }
);

export const SequelizeAuthentication: ModelDefined<
  Authentication,
  Authentication
> = sequelize.define("Authentication", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codeExpiresIn: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.NOW,
    allowNull: false,
  },
  expiresIn: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});
