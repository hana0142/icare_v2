const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blind_spot_left_result', {
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
      allowNull: true,
      unique: "blind_spot_left_result_check_id_key"
    },
    blind_spot_point: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'blind_spot_left_result',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "blind_spot_left_result_check_id_key",
        unique: true,
        fields: [
          { name: "check_id" },
        ]
      },
      {
        name: "blind_spot_left_result_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
