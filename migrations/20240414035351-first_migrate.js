"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      userId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.NOW,
        allowNull: false,
      },
      passwordRecoveryToken: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      passwordRecoveryExpiresIn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: true,
      },
      emailValidationToken: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      emailValidationExpiresIn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
    });
    await queryInterface.createTable("Authentications", {
      id: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      codeExpiresIn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
      },
      token: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.NOW,
        allowNull: false,
      },
      expiresIn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
    });
    await queryInterface.addConstraint("Authentications", {
      fields: ["userId"],
      type: "FOREIGN KEY",
      name: "FK_Authentications_Users",
      references: {
        table: "Users",
        field: "userId",
      },
      onDelete: "no action",
      onUpdate: "no action",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Authentications",
      "FK_Authentications_Users"
    );
    await queryInterface.dropTable("Authentications");
    await queryInterface.dropTable("Users");
  },
};
