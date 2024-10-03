'use strict';

const moment = require('moment');
const {
  Model
} = require('@dob/db');

class BaseModel extends Model {
  //实例方法
  /**
   * @description 获取时间戳类型的字段值
   * 
   * @param {Object} param1
   * @param {String} param1.columnName 字段名
   * 
   * @returns {Number|null} 时间戳
   */
  timestampTypeGetHandler({columnName}) {
    let value = this.getDataValue(columnName);

    if(value === null) {
      return null;
    }
    else {
      return moment(value).unix();
    }
  }

  /**
   * @description 设置时间戳类型的字段值
   * 
   * @param {Object} param1
   * @param {String} param1.columnName 字段名
   * @param {Number|null} param1.value 时间戳
   */
  timestampTypeSetHandler({columnName, value}) {
    if(value === null) {
      this.setDataValue(columnName, null);
    }
    else {
      this.setDataValue(columnName, moment.unix(value).toDate());
    }
  }
}

module.exports = BaseModel;