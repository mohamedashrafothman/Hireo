"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _chalk = require("chalk");

var _mongoose = _interopRequireDefault(require("mongoose"));

//
// ─── DATABASE CONNECTION ────────────────────────────────────────────────────────
// This ODM and database combination is extremely popular in the Node community,
// partially because the document storage and query system looks very much like JSON,
// and is hence familiar to JavaScript developers.
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Using_Mongoose_and_MongoDb_for_the_LocalLibrary
//
var MongoDBConnection = function MongoDBConnection() {
  (0, _classCallCheck2["default"])(this, MongoDBConnection);

  if (!MongoDBConnection.instance) {
    _mongoose["default"].Promise = global.Promise;

    _mongoose["default"].set("useNewUrlParser", true);

    _mongoose["default"].set("useFindAndModify", false);

    _mongoose["default"].set("useCreateIndex", true);

    _mongoose["default"].set("useUnifiedTopology", true);

    _mongoose["default"].connect(process.env.MONGODB_URI);

    _mongoose["default"].connection.once("open", function () {
      console.log(_chalk.blue.bold("✅  Connected to the database"));
    }).on("error", function (error) {
      console.error(error);
      console.log("\u26D4\uFE0F  ".concat((0, _chalk.red)("MongoDB connection error"), ".\n Please make sure MongoDB server is running."));
      process.exit();
    });

    var _mongoose$connections = (0, _slicedToArray2["default"])(_mongoose["default"].connections, 1);

    this.db = _mongoose$connections[0];
    MongoDBConnection.instance = this;
  }

  return MongoDBConnection.instance;
};

exports["default"] = MongoDBConnection;