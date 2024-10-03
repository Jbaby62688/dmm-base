'use strict';
const {
  DobUtilConstant
} = require('@dob/util');

class BaseConstant {
  //ID
  static PROP_ID_TYPE = DobUtilConstant.VALUE_TYPE_NUMBER;
  static PROP_ID_RULE = {
    ...DobUtilConstant.VALUE_RULE_POSITIVE_BIGINT
  }

  //IP
  static PROP_IP_TYPE = DobUtilConstant.VALUE_TYPE_STRING;
  static PROP_IP_RULE = {
    ...DobUtilConstant.VALUE_RULE_STRING
  }

  //Transaction ID
  static PROP_TRANSACTION_ID_TYPE = DobUtilConstant.VALUE_TYPE_STRING;
  static PROP_TRANSACTION_ID_RULE = {
    ...DobUtilConstant.VALUE_RULE_STRING
  }

  //Timestamp
  static PROP_TIMESTAMP_TYPE = DobUtilConstant.VALUE_TYPE_NUMBER;
  static PROP_TIMESTAMP_RULE = {
    ...DobUtilConstant.VALUE_RULE_POSITIVE_INT
  }

  //Flag
  static PROP_FLAG_TYPE = DobUtilConstant.VALUE_TYPE_NUMBER;
  static PROP_FLAG_RULE = {
    gte: 0,
    lte: 1
  }
}

module.exports = BaseConstant;