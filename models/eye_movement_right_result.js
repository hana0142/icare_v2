const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('eye_movement_right_result', {
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
      unique: "eye_movement_right_result_check_id_key"
    },
    location_t: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location_st: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location_it: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location_sn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location_in: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'eye_movement_right_result',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "eye_movement_right_result_check_id_key",
        unique: true,
        fields: [
          { name: "check_id" },
        ]
      },
      {
        name: "eye_movement_right_result_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
