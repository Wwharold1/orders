module.exports = {
  apps: [
    {
      name: 'app-name',
      script: '/home/site/wwwroot/node_modules/next',
      args: 'start -p ' + (process.env.PORT || 3000),
      watch: false,
      autorestart: true,
    },
  ],
};
