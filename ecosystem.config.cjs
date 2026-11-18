module.exports = {
  apps: [
    {
      name: "global-scientific-trade",
      script: "server/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      },
      watch: false,
      max_memory_restart: "400M"
    }
  ]
};
