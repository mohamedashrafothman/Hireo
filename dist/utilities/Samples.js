"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _fs = _interopRequireDefault(require("fs"));

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

var _glob = _interopRequireDefault(require("glob"));

var _path = _interopRequireDefault(require("path"));

var _chalk = require("chalk");

var _lodash = require("lodash");

var _database = _interopRequireDefault(require("../config/database"));

var _User = _interopRequireDefault(require("../models/User.model"));

var _Icon = _interopRequireDefault(require("../models/Icon.model"));

var _Skill = _interopRequireDefault(require("../models/Skill.model"));

var _Category = _interopRequireDefault(require("../models/Category.model"));

var _Nationality = _interopRequireDefault(require("../models/Nationality.model"));

var _Job_type = _interopRequireDefault(require("../models/Job_type.model"));

_dotenv["default"].config({
  path: "".concat(__dirname, "/../../.env")
});

var Samples = /*#__PURE__*/function () {
  function Samples() {
    var _this = this;

    (0, _classCallCheck2["default"])(this, Samples);
    this.files = [];
    this.schemas = {
      User: _User["default"],
      Icon: _Icon["default"],
      Skill: _Skill["default"],
      Category: _Category["default"],
      Nationality: _Nationality["default"],
      JobType: _Job_type["default"]
    }; // Connecting to mongodb

    new _database["default"](); // getting all sample json files.

    (0, _glob["default"])("".concat(__dirname, "/../samples/*.json"), {}, /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err, files) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // exiting the process if there is an error.
                if (err) {
                  console.log(err);
                  process.exit();
                } // handling/reshaping each file data.


                _context2.next = 3;
                return _this.asyncForEach(files, /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(file) {
                    var file_extension, file_name, file_schema, file_data;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            file_extension = _path["default"].extname(file);
                            file_name = _path["default"].basename(file, file_extension);
                            file_schema = (0, _lodash.upperFirst)((0, _lodash.camelCase)(file_name));
                            file_data = JSON.parse(_fs["default"].readFileSync(file, "utf-8"));
                            _this.files = [].concat((0, _toConsumableArray2["default"])(_this.files), [{
                              file_extension: file_extension,
                              file_name: file_name,
                              file_schema: file_schema,
                              file_data: file_data
                            }]);

                          case 5:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 3:
                if (process.argv.includes("--drop")) {
                  // calling drop data function if there is --drop argument flag.
                  _this.dropSamples(function () {
                    console.log("\u2705  ".concat((0, _chalk.blue)("Data Deleted.")));
                    process.exit();
                  });
                } else {
                  // calling load data function.
                  _this.loadSamples(function () {
                    console.log("\u2705  ".concat((0, _chalk.blue)("Done!")));
                    process.exit();
                  });
                }

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  }

  (0, _createClass2["default"])(Samples, [{
    key: "dropSamples",
    value: function () {
      var _dropSamples = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(cb) {
        var _this2 = this;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.asyncForEach(this.files, /*#__PURE__*/function () {
                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(file) {
                    var _yield$to, _yield$to2, err;

                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return (0, _awaitToJs["default"])(_this2.schemas[file.file_schema].deleteMany({}));

                          case 2:
                            _yield$to = _context3.sent;
                            _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 1);
                            err = _yield$to2[0];

                            if (err) {
                              console.log(err);
                              process.exit();
                            }

                          case 6:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x5) {
                    return _ref3.apply(this, arguments);
                  };
                }());

              case 2:
                if (!cb) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt("return", cb());

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function dropSamples(_x4) {
        return _dropSamples.apply(this, arguments);
      }

      return dropSamples;
    }()
  }, {
    key: "loadSamples",
    value: function () {
      var _loadSamples = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(cb) {
        var _this3 = this;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.asyncForEach(this.files, /*#__PURE__*/function () {
                  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(file) {
                    var _yield$to3, _yield$to4, err;

                    return _regenerator["default"].wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return (0, _awaitToJs["default"])(_this3.schemas[file.file_schema].insertMany(file.file_data));

                          case 2:
                            _yield$to3 = _context5.sent;
                            _yield$to4 = (0, _slicedToArray2["default"])(_yield$to3, 1);
                            err = _yield$to4[0];

                            if (err) {
                              console.log((0, _chalk.red)("\u26D4\uFE0F  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ".concat((0, _chalk.blue)("npm run samples:drop"), "\n\n\n")));
                              console.log(err);
                            }

                          case 6:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x7) {
                    return _ref4.apply(this, arguments);
                  };
                }());

              case 2:
                if (!cb) {
                  _context6.next = 4;
                  break;
                }

                return _context6.abrupt("return", cb());

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function loadSamples(_x6) {
        return _loadSamples.apply(this, arguments);
      }

      return loadSamples;
    }()
  }, {
    key: "asyncForEach",
    value: function () {
      var _asyncForEach = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(array, cb) {
        var i;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                i = 0;

              case 1:
                if (!(i < array.length)) {
                  _context7.next = 7;
                  break;
                }

                _context7.next = 4;
                return cb(array[i], i, array);

              case 4:
                i++;
                _context7.next = 1;
                break;

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function asyncForEach(_x8, _x9) {
        return _asyncForEach.apply(this, arguments);
      }

      return asyncForEach;
    }()
  }]);
  return Samples;
}();

var _default = new Samples();

exports["default"] = _default;