const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blind_spot_detail_left_result', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    check_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    location_t: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    location_st: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    location_it: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    location_sn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    location_in: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'blind_spot_detail_left_result',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "blind_spot_detail_left_result_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
