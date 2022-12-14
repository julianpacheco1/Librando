const Sequelize = require("sequelize");
const db = require("../config/db");
const bcrypt = require("bcrypt");

class User extends Sequelize.Model {
  hash(password, salt) {
    return bcrypt.hash(password, salt);
  }
  validatePassword(password) {
    return this.hash(password, this.salt).then(
      (newHash) => newHash === this.password
    );
  }
}

User.init(
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dni: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    salt: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize: db,
    modelName: "user",
  }
);

User.beforeCreate((user) => {
  const salt = bcrypt.genSaltSync();
  user.salt = salt;
  return user.hash(user.password, salt).then((hash) => {
    user.password = hash;
  });
});

module.exports = User;
