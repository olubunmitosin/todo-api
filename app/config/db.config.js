require('dotenv').config();

module.exports = {
  development: {
    database: {
      url: `mongodb://${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      options: {
        "useNewUrlParser": true
      }
    },
  },
  production: {
    database: {
      protocol: process.env.DB_PROTOCOL,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
      host: process.env.DB_HOSTNAME,
      port: process.env.DB_PORT,
      options: {
        useNewUrlParser: true
      }
    },
  },
};