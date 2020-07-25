"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _path = _interopRequireDefault(require("path"));

var _i18n = _interopRequireDefault(require("i18n"));

var Internationalization = function Internationalization() {
  (0, _classCallCheck2["default"])(this, Internationalization);

  _i18n["default"].configure({
    locales: ["en", "ar"],
    cookie: "lang",
    directory: _path["default"].join(_path["default"].dirname(__dirname), "/languages"),
    // where to store json files - defaults to './locales' relative to modules directory
    register: global,
    objectNotation: true,
    autoReload: true // watch for changes in json files to reload locale on updates - defaults to false

  });
};

var _default = new Internationalization();

exports["default"] = _default;