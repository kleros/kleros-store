module.exports = {
  secret: process.env.SECRET ? process.env.SECRET : 'nosecret',
  database: process.env.DB_URI ? process.env.DB_URI : 'mongodb://localhost/kleros',
  ipsAllowed: [
    '::1',
    '127.0.0.1',
  ]
}
