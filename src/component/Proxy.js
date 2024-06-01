const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=00bc5c1d2a1cdb0deeadc7a642ae9e3b', // Измените target на базовый URL API
    changeOrigin: true, 
    pathRewrite: {
      '^/api': '', 
    },
  }),
);

app.listen(3000);