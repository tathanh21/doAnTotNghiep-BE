'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
        await queryInterface.createTable('doctor_Info', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
            },
      doctorId: {
        type:Sequelize.STRING
            },
         priceId: {
        type:Sequelize.STRING
            },
         provinceId: {
        type:Sequelize.STRING
            },
         paymentId: {
        type:Sequelize.STRING
            },
            addressClinic: {
                 allowNull: false,
        type:Sequelize.STRING
            },
            nameClinic: {
                  allowNull: false,
        type:Sequelize.STRING
            },
            note: {
                 allowNull: false,
        type:Sequelize.STRING
    },
      count: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue:0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doctor_Info');
  }
};