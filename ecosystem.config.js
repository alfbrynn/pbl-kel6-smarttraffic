module.exports = {
  apps: [
    {
      name:         'smartraf-bridge',
      script:       'bridge.js',
      watch:        false,
      restart_delay: 3000,
      max_restarts:  10,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name:         'smartraf-bigdata',
      script:       'bigdata/listener.js',
      watch:        false,
      restart_delay: 3000,
      max_restarts:  10,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
