//
// reads environment variables from
// a .env file for local environments
//
var dotenv = require('dotenv');

dotenv.config({silent: true});
dotenv.load();

var path = require('path');

module.exports = {
  template: process.env.KS_TEMPLATE || 'default',
  templateDir: process.env.KS_TEMPLATE_DIR || path.join(__dirname, 'templates'),
  target: process.env.KS_TARGET || process.cwd()
};
