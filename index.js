var sdkMan = require('./lib/sdk');
var appId = 'L5QethA7ATmIltNr';
var appSecret = 'fv4lkB8ijghio7XPoocsVD1MgOsJHZ';
var crypto = require('crypto');

var sdk = sdkMan({
  host: "https://ecs.aliyuncs.com/",
  actions: {
    "describeRegions": {
      "required": [],
      "optional": []
    }
  },
  createCommonParam: function() {
    // 获取公共参数
    return {
      RegionId: 'cn-hangzhou',
      ImageId: '_32_23c472_20120822172155_aliguest.vhd',
      SecurityGroupId: 'sg-c0003e8b9',
      HostName: 'Bctest01',
      InstanceType: 'ecs.t1.small',
      Format: 'JSON',
      Version: '2014-05-26',
      AccessKeyId: appId,
      Timestamp: new Date().toISOString(),
      SignatureMethod: 'HMAC-SHA1',
      SignatureVersion: '1.0',
      SignatureNonce: Math.random().toString(36).substring(2)
    }
  },
  getSign: function(params) {
    // 获取签名
    var Signature = getSignature(params, appSecret);
    return {
      Signature: Signature
    }
  }
});


function getSignature(params, secret) {
  var keys = Object.keys(params).sort();
  var _keys = [];
  for (var i = 0, len = keys.length; i < len; i++) {
    _keys.push(percentEncode(keys[i]) + '=' + percentEncode(params[keys[i]]));
  }
  var queryString = _keys.join('&');
  var stringToSign = 'GET&%2F&' + percentEncode(queryString);
  var hmac = crypto.createHmac('sha1', secret + '&');
  hmac.update(stringToSign);
  return hmac.digest('base64');
}

function percentEncode(str) {
  var res = encodeURIComponent(str);
  res = res.replace(/\+/g, '%20');
  res = res.replace(/\*/g, '%2A');
  res = res.replace(/%7E/g, '~');
  return res;
}


sdk.describeRegions(function(err, data) {
  console.log(err);
  console.log(JSON.stringify(data));
}, {});
