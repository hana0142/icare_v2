const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('check_info', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    check_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "check_info_check_id_key"
    },
    check_category: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'check_info',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "check_info_check_id_key",
        unique: true,
        fields: [
          { name: "check_id" },
        ]
      },
      {
        name: "check_info_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
