module.exports = {
  secret: 'nosecret', // TODO use process var
  database: 'mongodb://localhost/kleros',  // TODO use process var
  ipsAllowed: [
    '::1',
    '127.0.0.1',
  ]
}
