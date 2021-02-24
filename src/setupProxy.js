const proxy = require('http-proxy-middleware');
//const consoleUrl = 'http://localhost:8091'
const consoleUrl = 'http://10.9.43.140:8091'
// 超时时间
const TIME_OUT = 600000;

const RsProxy = require('./project-rs/devProxy');
const GsProxy = require('./project-gs/devProxy');
const TkProxy = require('./project-tk/devProxy');

const devProxys = [...RsProxy, ...GsProxy, ...TkProxy]

module.exports = function(app) {
    app.use(proxy('/api/console/**', { target: consoleUrl, changeOrigin: true, timeout: TIME_OUT }));

    devProxys.map(item => (
        app.use(proxy(item.url, { target: item.targetUrl, changeOrigin: true, timeout: item.timeout }))
    ))
};
