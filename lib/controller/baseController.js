'use strict';

const {
  DobLogApi
} = require('@dob/log');
const BaseError = require('../error/baseError');
const BaseModel = require('../model/baseModel');

class BaseController {
  static get Model() {
    return null;
  }

  /**
   * @description 检查模型
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {BaseModel} param1.model 模型
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag] 抛出错误标志
   * @param {Object} param2.ctx 上下文
   * 
   * @returns {Boolean} 是否检查成功
   */
  static checkModel(
    {
      model
    },
    {
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::checkModel';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      if(this.Model?.prototype instanceof BaseModel === false) {
        throw new Error('模型配置错误');
      }

      if (model instanceof this.Model === false) {
        throw new Error('模型类型错误');
      }

      return true;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        logger.error(error);
        return false;
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 获取模型
   * 
   * @static
   * 
   * @async
   * 
   * @param {Object} param1
   * @param {Array} param1.attributes 属性
   * @param {Array} param1.include 关联模型
   * @param {Object} param1.where 条件
   * @param {Object} param1.order 排序
   * @param {Object} param1.lock 锁
   * @param {Object} param2
   * @param {Boolean} [param2.checkModelFlag] 是否检查模型
   * @param {Object} param2.ctx 上下文
   * 
   * @returns {Promise<BaseModel>|Null} 模型
   */
  static async getModelFromDb(
    {
      attributes,
      include,
      where,
      order,
      lock
    },
    {
      checkModelFlag = true,
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::getModelFromDb';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //获取事务
      let transaction = ctx.state?.transaction;

      //获取模型
      let model = await this.Model.findOne(
        {
          attributes,
          include,
          where,
          order,
          lock,
          transaction
        }
      );

      //检查模型
      if (checkModelFlag === true) {
        this.checkModel(
          {
            model
          },
          {
            ctx
          }
        );
      }

      //返回
      return model;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return null;
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 获取模型列表
   * 
   * @static
   * 
   * @async
   * 
   * @param {Object} param1
   * @param {Array} param1.attributes 属性
   * @param {Array} param1.include 关联模型
   * @param {Object} param1.where 条件
   * @param {Object} param1.order 排序
   * @param {Object} param1.offset 偏移
   * @param {Object} param1.limit 限制
   * @param {Object} param1.lock 锁
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag] 是否抛出错误
   * @param {Object} param2.ctx 上下文
   * 
   * @returns {Promise<Array<BaseModel>>} 模型列表
   */
  static async getModelListFromDb(
    {
      attributes,
      include,
      where,
      order,
      offset,
      limit,
      lock
    },
    {
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::getModelListFromDb';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //获取事务
      let transaction = ctx.state?.transaction;

      //检查模型配置
      if(this.Model?.prototype instanceof BaseModel === false) {
        throw new Error('模型配置错误');
      }

      //获取模型列表
      let modelList = await this.Model.findAll(
        {
          attributes,
          include,
          where,
          order,
          offset,
          limit,
          lock,
          transaction
        }
      );
      
      //返回
      return modelList;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        logger.error(error);
        return [];
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 初始化缓存
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {Boolean} [param1.throwErrorFlag] 是否抛出错误
   * @param {Object} param1.ctx 上下文
   */
  static initCache(
    {
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::initCache';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //初始化缓存
      if(ctx.state.cache === undefined) {
        ctx.state.cache = {};
      }
      //检查模型
      if(this.Model?.prototype instanceof BaseModel === false) {
        throw new Error('模型配置错误');
      }
      //初始化模型缓存
      let modelName = this.Model.name;

      if (ctx.state.cache[modelName] === undefined) {
        ctx.state.cache[modelName] = {};
      }

      let modelCache = ctx.state.cache[modelName];

      if(modelCache.list === undefined) {
        modelCache.list = [];
      }

      if(modelCache.map === undefined) {
        modelCache.map = {};
      }
      //返回
      return true;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        logger.error(error);
        return false;
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 获取缓存
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {Boolean} [param1.throwErrorFlag] 是否抛出错误
   * @param {Object} param1.ctx 上下文
   * 
   * @returns {Object | Null} 缓存
   */
  static getCache(
    {
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::getCache';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //初始化缓存
      this.initCache(
        {
          ctx
        }
      );

      //获取缓存
      let modelName = this.Model.name;
      let modelCache = ctx.state.cache[modelName];

      //返回
      return modelCache;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return null;
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 清空缓存
   */
  static clearCache(
    {
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::clearCache';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    //初始化缓存
    this.initCache(
      {
        ctx
      }
    );

    //清空缓存
    let modelName = this.Model.name;
    let modelCache = ctx.state.cache[modelName];

    modelCache.list = [];
    modelCache.map = {};

    //结束执行
    logger.debug(`=====结束执行${identifier}=====`);
  }


  /**
   * @description 添加模型到缓存
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {BaseModel} param1.model 模型
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag] 是否抛出错误
   * @param {Object} param2.ctx 上下文
   * 
   * @returns {Boolean} 是否添加成功
   */
  static addModelToCache(
    {
      model
    },
    {
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::addModelToCache';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //检查模型
      this.checkModel(
        {
          model
        },
        {
          ctx
        }
      );

      //获取缓存
      let modelCache = this.getCache(
        {
          ctx
        }
      );

      //添加到缓存
      if(modelCache.map[model.id] === undefined) {
        modelCache.list.push(model);
        modelCache.map[model.id] = model;
      }

      //返回
      return true;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        logger.error(error);
        return false;
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 从缓存中删除模型
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {BaseModel} param1.model 模型
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag] 是否抛出错误
   * @param {Object} param2.ctx 上下文
   * 
   * @returns {Boolean} 是否删除成功
   */
  static removeModelFromCache(
    {
      model
    },
    {
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::removeModelFromCache';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //检查模型
      this.checkModel(
        {
          model
        },
        {
          ctx
        }
      );

      //获取缓存
      let modelCache = this.getCache(
        {
          ctx
        }
      );

      //从缓存中删除模型
      if(modelCache.map[model.id] !== undefined) {
        let index = modelCache.list.indexOf(model);

        if(index !== -1) {
          modelCache.list.splice(index, 1);
        }
        
        delete modelCache.map[model.id];
      }

      //返回
      return true;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        logger.error(error);
        return false;
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 从缓存中获取模型By Id
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {Number} param1.id ID
   * @param {Object} param2
   * @param {Boolean} [param2.checkModelFlag] 是否检查模型
   * @param {Boolean} [param2.throwErrorFlag] 是否抛出错误
   * @param {Object} param2.ctx 上下文
   * 
   * @returns {BaseModel | Null} 模型
   */
  static getModelFromCacheById(
    {
      id
    },
    {
      checkModelFlag = true,
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::getModelFromCacheById';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //获取缓存
      let modelCache = this.getCache(
        {
          ctx
        }
      );

      //获取模型
      let model = modelCache.map[id] !== undefined ? modelCache.map[id] : null;

      //检查模型
      if(checkModelFlag === true) {
        this.checkModel(
          {
            model
          },
          {
            ctx
          }
        );
      }

      //返回
      return model;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        logger.error(error);
        return null;
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 从缓存中获取模型列表
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {Function} param1.filterHandler 过滤处理器
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag] 是否抛出错误
   * @param {Object} param2.ctx 上下文
   * 
   * @returns {Array<BaseModel>} 模型列表
   */
  static getModelListFromCache(
    {
      filterHandler
    },
    {
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::getModelListFromCache';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //获取缓存
      let modelCache = this.getCache(
        {
          ctx
        }
      );

      //获取模型列表
      let modelList = modelCache.list;

      //过滤模型列表
      if(filterHandler !== undefined) {
        modelList = modelList.filter(filterHandler);
      }

      //返回
      return modelList;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        logger.error(error);
        return [];
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 保存模型
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {BaseModel} param1.model 模型
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag] 是否抛出错误
   * @param {Object} param2.ctx 上下文
   * 
   * @returns {Promise<Boolean>} 是否保存成功
   */
  static async saveModel(
    {
      model
    },
    {
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::saveModel';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //获取事务
      const transaction = ctx.state?.transaction;

      //检查模型
      this.checkModel(
        {
          model
        },
        {
          ctx
        }
      );

      //保存模型
      await model.save(
        {
          transaction
        }
      );

      //返回
      return true;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        logger.error(error);
        return false;
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 从数据库加载到缓存
   * 
   * @static
   * 
   * @async
   * 
   * @param {Object} param1
   * @param {Object} param1.where 条件
   * @param {Object} param1.order 排序
   * @param {Object} param1.offset 偏移
   * @param {Object} param1.limit 限制
   * @param {Object} param1.lock 锁
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag] 是否抛出错误
   * @param {Object} param2.ctx 上下文
   * 
   * @returns {Promise<Boolean>} 是否加载成功
   */
  static async loadCacheFromDb(
    {
      where,
      order,
      offset,
      limit,
      lock
    },
    {
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::loadCacheFromDb';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //获取模型列表
      let modelList = await this.getModelListFromDb(
        {
          where,
          order,
          offset,
          limit,
          lock
        },
        {
          ctx
        }
      );

      //添加到缓存
      for(let model of modelList) {
        this.addModelToCache(
          {
            model
          },
          {
            throwErrorFlag,
            ctx
          }
        );
      }

      //返回
      return true;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        logger.error(error);
        return false;
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 保存缓存到数据库
   * 
   * @static
   * 
   * @async
   * 
   * @param {Object} param1
   * @param {Boolean} [param1.throwErrorFlag] 是否抛出错误
   * @param {Object} param1.ctx 上下文
   * 
   * @returns {Promise<Boolean>} 是否保存成功
   */
  static async saveCacheToDb(
    {
      throwErrorFlag = true,
      ctx
    }
  ) {
    const identifier = 'DmmBaseController::saveCacheToDb';
  
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      },
      {
        ctx
      }
    );
    
    //开始执行
    logger.debug(`=====开始执行${identifier}=====`);
    
    try {
      //获取事务
      let transaction = ctx.state?.transaction;

      //获取缓存
      let modelCache = this.getCache(
        {
          ctx
        }
      );

      //保存缓存到数据库
      for(let model of modelCache.list) {
        await this.saveModel(
          {
            model
          },
          {
            throwErrorFlag,
            ctx
          }
        );
      }

      //返回
      return true;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return null;
      }
    }
    finally {
      //结束执行
      logger.debug(`=====结束执行${identifier}=====`);
    }
  }
}

module.exports = BaseController;