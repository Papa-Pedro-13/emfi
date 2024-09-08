
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `https://${AMOCRM_SUBDOMAIN}.amocrm.ru`,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
