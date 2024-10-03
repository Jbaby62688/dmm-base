'use strict';

class BaseError extends Error {
  //静态属性
  static SYSTEM_ERROR = {code: 10001, msg: '系统错误'};


  //构造函数
  /**
   * @description 构造函数
   * 
   * @param {Object} param1
   * @param {Number} param1.code 错误码
   * @param {String} param1.msg 错误信息
   */
  constructor(
    {
      code,
      msg
    } = {}
  ) {
    super(msg);
    this.code = code;
    this.msg = msg;
  }



  //实例属性
  _module = 'base';
  _code;
  _msg;

  get module() {
    return this._module;
  }

  set module(module) {
    this._module = module;
  }

  get code() {
    return this._code || BaseError.SYSTEM_ERROR.code;
  }

  set code(code) {
    this._code = code;
  }

  get msg() {
    return this._msg || BaseError.SYSTEM_ERROR.msg;
  }

  set msg(msg) {
    this._msg = msg;
  }



  //实例方法
  toJSON() {
    return {
      module: this.module,
      code: this.code,
      msg: this.msg
    };
  }
}

module.exports = BaseError;