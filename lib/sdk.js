/*
*
* Module: sdkMan
* Date: 2016-08-11
* Author: fanwei
*
*/
var request = require('request');
var qs = require('querystring');

var sdkMan = {};

/*
* 多参数正则
*/
var Reg = /\.n/;



/*
* 创建方法
*/
function createFunc(a, info, config) {
  var fn = function(cbk, opts) {
    opts = opts || {};
    // 检查必要参数
    for (var i in info.required) {
      var p = info.required[i];
      if (opts[p] === undefined) {
        return cbk('Lack required params: ' + p);
      }
    }

    // 组转param
    var params = config.createCommonParam && config.createCommonParam();
    params.action = a;
    var sign = config.getSign && config.getSign(params);
    for (var i in sign) {
      params[i] = sign[i];
    }
    var ps = [].concat(info.required).concat(info.optional);
    for (var i in ps) {
      var p = ps[i];
      if (opts[p] !== undefined) {
        if (!Reg.test(p)) {
          params[p] = opts[p];
        } else if (Array.isArray(opts[p])) { // 数组形式参数处理
          for (var j in opts[p]) {
            var tmpp = p;
            params[tmpp.replace(Reg, '.' + (Number(j) + 1))] = opts[p][j];
          }
        } else {
          return cbk(new Error('Param ' + p + ' should be a array'));
        }
      }
    }

    // URL 编码
    var params_arra = [];
    for (var i in params) {
      params_arra.push(i + '=' + qs.escape(params[i]));
    }

    // 排序
    var query = params_arra.sort().join('&');

    var url = config.host + '?' + query;

    request(url, function(err, response, body) {
      if (err)
        cbk(err);
      else
        cbk(null, JSON.parse(body));
    });
  }
  return fn;
}


/*
* 输出Module
*/

module.exports = function(opts) {
  opts = opts || {};
  // 生成API
  for (var a in opts.actions) {
    var info = opts.actions[a];
    sdkMan[a] = createFunc(a, info, opts);
  }
  return sdkMan;
}
