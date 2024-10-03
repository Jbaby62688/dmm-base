'use strict';

const {
  Sequelize
} = require('@dob/db');
const BaseError = require('../error/baseError');

class BaseConfig {
  static _dbClient;

  static get dbClient() {
    if(this._dbClient === undefined) {
      throw new Error('数据库配置错误');
    }

    return this._dbClient;
  }

  static set dbClient(value) {
    if(value instanceof Sequelize === false) {
      throw new Error('数据库配置错误');
    }

    this._dbClient = value;
  }
}

module.exports = BaseConfig;