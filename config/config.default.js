'use strict';

const isInnerIp = ip => (true);

module.exports = appInfo => {

  const config = {};
  // should change to your own
  config.keys = appInfo.name + '_1498314449485_5275';
  // add your config here
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };
  //
  config.security = {
    csrf: {
    // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      ignore: ctx => isInnerIp(ctx.ip),
    },
  };

  return config;
};

