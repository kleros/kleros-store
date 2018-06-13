const defaultConfig = {
  secret: process.env.SECRET ? process.env.SECRET : 'nosecret',
  seedDb: process.env.SEED_DB ? process.env.SEED_DB : false,
  database: process.env.DB_URI ? process.env.DB_URI : 'mongodb://localhost/kleros',
  ipsAllowed: process.env.IPS_ALLOWED ? process.env.IPS_ALLOWED.split(',') : [
    '::1',
    '127.0.0.1',
  ],
  authTokenLengthSeconds: process.env.AUTH_TOKEN_LENGTH || 604800, // auth tokens by default last a week
  authTokenVersion: process.env.AUTH_TOKEN_VERSION || 1 // default version 1
}

// Export the config object based on the NODE_ENV
// ==============================================
let config;
try {
  config = Object.assign(defaultConfig, require(`./config.${process.env.NODE_ENV}-env.js`));
} catch (e) {
  console.warn(`Config file for current environment was not found. \
Proceeding with default config. ${e}`);
}

module.exports = config || defaultConfig;
