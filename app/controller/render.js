const Nightmare = require('../util/nightmare');


module.exports = app => {
  class NewsController extends app.Controller {
    async list() {
    
      const nightmare = Nightmare({
        executionTimeout: 5000,
        show: true,
        frame: false,
        useContentSize: true,
        paths: {
          userData: '/dev/null',
        },
      });

      // const waitOnload = function() {
      //   return new Promise(function(resolve, reject, done) {
      //     window.onload = function() {
      //       done();
      //     };
      //   });
      // };

      // nightmare.action('windowOnload', done => {
      //   const maxWaitTime = 5000;
      //   this.evaluate_now(function() {
      //     return new Promise(function(resolve, reject) {
      //       window.onload = () => {
      //         resolve();
      //       };
      //       // window.addEventListener('load', () => {
      //       //   resolve();
      //       // });
      //     });
      //   }, done);
      //   setTimeout(() => {
      //     done({ message: 'windowOnload timeout' });
      //   }, maxWaitTime);
      // });
      nightmare.useragent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1');
      const { ctx } = this;
      console.log(ctx.request.body);
      const htmlString = await this.ctx.renderView('scTpl/index.tpl', ctx.request.body, {
        viewEngine: 'nunjucks',
      });
      const res = await nightmare
        .viewport(414, 736)
        //
        .goto('http://www.taobao.com')
        .ewait('dom-ready')
        .evaluate(function() {
          const s = document.styleSheets[0];
          s.insertRule('::-webkit-scrollbar { display:none; }');
        })
        .wait(200)
        .screenshot({ x: 0, y: 0, width: 414, height: 736 })
        .end()
        .then(function(result) {
          console.log(result);
          return (result);
        })
        .catch(function(error) {
          console.error('Search failed:', error);
        });
      ctx.type = 'image/png';
      ctx.response.body = res;
    }
  }
  return NewsController;
};
