"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("dotenv/config");

var _chalk = require("chalk");

require("./config/passport");

require("./config/i18n");

require("./config/acl");

var _pagination = _interopRequireDefault(require("./config/pagination"));

var _server = require("./config/server");

//
// ─── LISTEN TO SERVER ───────────────────────────────────────────────────────────
//
_server.server.listen(_server.app.get("port"), function () {
  console.log("\u2705  App is running at ".concat((0, _chalk.blue)("http://localhost:".concat(_server.app.get("port"))), " in ").concat(_server.app.get("env"), " mode"));
  console.log("\u26A0\uFE0F  Press ".concat((0, _chalk.blue)("CTRL-C"), " to stop\n"));
  new _server.DatabaseConnection();
  new _pagination["default"]();
});