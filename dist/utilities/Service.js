"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = require("lodash");

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * TODO: Update all wrap regular (non-JSONP) responses with the following properties:
		code,		- Contains the HTTP response status code as an integer.
		status, 	- Contains the text: “success”, “fail”, or “error”. Where “fail” is for HTTP status
						response values from 500-599, “error” is for statuses 400-499, and “success” is for everything
						else (e.g. 1XX, 2XX and 3XX responses).
		message, 	- Only used for “fail” and “error” statuses to contain the error message. For
						internationalization (i18n) purposes, this could contain a message number or code, either alone
						or contained within delimiters.
		data 		- That contains the response body. In the case of “error” or “fail” statuses, this contains the
						cause, or exception name.
 */
var Service = /*#__PURE__*/function () {
  function Service(model) {
    (0, _classCallCheck2["default"])(this, Service);
    this.model = model;
    this.create = this.create.bind(this);
    this.readOne = this.readOne.bind(this);
    this.readMany = this.readMany.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.updateMany = this.updateMany.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.deleteMany = this.deleteMany.bind(this);
  }

  (0, _createClass2["default"])(Service, [{
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
        var _yield$to, _yield$to2, err, item;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _awaitToJs["default"])(this.model.create(data));

              case 2:
                _yield$to = _context.sent;
                _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 2);
                err = _yield$to2[0];
                item = _yield$to2[1];

                if (!err) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: err
                });

              case 8:
                return _context.abrupt("return", {
                  error: false,
                  statusCode: 201,
                  data: item
                });

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function create(_x) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: "readMany",
    value: function () {
      var _readMany = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(query, options) {
        var _yield$to3, _yield$to4, err, cursor;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _awaitToJs["default"])(this.model.paginate(query, options));

              case 2:
                _yield$to3 = _context2.sent;
                _yield$to4 = (0, _slicedToArray2["default"])(_yield$to3, 2);
                err = _yield$to4[0];
                cursor = _yield$to4[1];

                if (!err) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: err
                });

              case 8:
                return _context2.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: cursor.docs,
                  page: cursor.page,
                  pages: cursor.totalPages,
                  total: cursor.totalDocs,
                  limit: cursor.limit,
                  prevPage: cursor.prevPage,
                  nextPage: cursor.nextPage,
                  hasPrevPage: cursor.hasPrevPage,
                  hasNextPage: cursor.hasNextPage
                });

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function readMany(_x2, _x3) {
        return _readMany.apply(this, arguments);
      }

      return readMany;
    }()
  }, {
    key: "readOne",
    value: function () {
      var _readOne = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(query) {
        var _yield$to5, _yield$to6, err, item;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _awaitToJs["default"])(this.model.findOne(query));

              case 2:
                _yield$to5 = _context3.sent;
                _yield$to6 = (0, _slicedToArray2["default"])(_yield$to5, 2);
                err = _yield$to6[0];
                item = _yield$to6[1];

                if (!err) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: err
                });

              case 8:
                return _context3.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: item
                });

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function readOne(_x4) {
        return _readOne.apply(this, arguments);
      }

      return readOne;
    }()
  }, {
    key: "updateOne",
    value: function () {
      var _updateOne = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(query, data) {
        var _yield$to7, _yield$to8, err, item;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _awaitToJs["default"])(this.model.findOneAndUpdate(query, data, {
                  "new": true
                }));

              case 2:
                _yield$to7 = _context4.sent;
                _yield$to8 = (0, _slicedToArray2["default"])(_yield$to7, 2);
                err = _yield$to8[0];
                item = _yield$to8[1];

                if (!err) {
                  _context4.next = 8;
                  break;
                }

                return _context4.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: err
                });

              case 8:
                return _context4.abrupt("return", {
                  error: false,
                  statusCode: 202,
                  data: item
                });

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function updateOne(_x5, _x6) {
        return _updateOne.apply(this, arguments);
      }

      return updateOne;
    }()
  }, {
    key: "updateMany",
    value: function () {
      var _updateMany = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(query, data) {
        var _yield$to9, _yield$to10, err, items;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (0, _awaitToJs["default"])(this.model.updateMany(query, data, {
                  "new": true,
                  multi: true
                }));

              case 2:
                _yield$to9 = _context5.sent;
                _yield$to10 = (0, _slicedToArray2["default"])(_yield$to9, 2);
                err = _yield$to10[0];
                items = _yield$to10[1];

                if (!err) {
                  _context5.next = 8;
                  break;
                }

                return _context5.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: err
                });

              case 8:
                return _context5.abrupt("return", {
                  error: false,
                  statusCde: 202,
                  data: items
                });

              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function updateMany(_x7, _x8) {
        return _updateMany.apply(this, arguments);
      }

      return updateMany;
    }()
  }, {
    key: "deleteOne",
    value: function () {
      var _deleteOne = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(query) {
        var items, _yield$to11, _yield$to12, deleteErr;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.readOne(query);

              case 2:
                items = _context6.sent;

                if (!items.error) {
                  _context6.next = 5;
                  break;
                }

                return _context6.abrupt("return", items);

              case 5:
                if (!(0, _lodash.isEmpty)(items.data)) {
                  _context6.next = 7;
                  break;
                }

                return _context6.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: new Error("Data not found")
                });

              case 7:
                _context6.next = 9;
                return (0, _awaitToJs["default"])(this.model.deleteOne(query));

              case 9:
                _yield$to11 = _context6.sent;
                _yield$to12 = (0, _slicedToArray2["default"])(_yield$to11, 1);
                deleteErr = _yield$to12[0];

                if (!deleteErr) {
                  _context6.next = 14;
                  break;
                }

                return _context6.abrupt("return", {
                  error: true,
                  deleted: false,
                  statusCode: 500,
                  errors: deleteErr
                });

              case 14:
                return _context6.abrupt("return", {
                  error: false,
                  deleted: true,
                  statusCode: 202,
                  data: items.data
                });

              case 15:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function deleteOne(_x9) {
        return _deleteOne.apply(this, arguments);
      }

      return deleteOne;
    }()
  }, {
    key: "deleteMany",
    value: function () {
      var _deleteMany = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(query, options) {
        var items, _yield$to13, _yield$to14, deletedErr;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.readMany(query, options);

              case 2:
                items = _context7.sent;

                if (!items.error) {
                  _context7.next = 5;
                  break;
                }

                return _context7.abrupt("return", items);

              case 5:
                _context7.next = 7;
                return (0, _awaitToJs["default"])(this.model.deleteMany(query));

              case 7:
                _yield$to13 = _context7.sent;
                _yield$to14 = (0, _slicedToArray2["default"])(_yield$to13, 1);
                deletedErr = _yield$to14[0];

                if (!deletedErr) {
                  _context7.next = 12;
                  break;
                }

                return _context7.abrupt("return", {
                  error: true,
                  deleted: false,
                  statusCode: 500,
                  errors: deletedErr
                });

              case 12:
                return _context7.abrupt("return", {
                  error: false,
                  deleted: true,
                  statusCode: 202,
                  data: items.data
                });

              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function deleteMany(_x10, _x11) {
        return _deleteMany.apply(this, arguments);
      }

      return deleteMany;
    }()
  }, {
    key: "constructPopulateConfigOption",
    value: function () {
      var _constructPopulateConfigOption = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(level, path, options) {
        var obj;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                obj = {
                  path: path
                };

                while (level) {
                  if (level !== 1) {
                    obj.populate = _objectSpread(_objectSpread({}, obj), options);
                  }

                  obj = _objectSpread(_objectSpread({}, obj), options);
                  --level;
                }

                return _context8.abrupt("return", obj);

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function constructPopulateConfigOption(_x12, _x13, _x14) {
        return _constructPopulateConfigOption.apply(this, arguments);
      }

      return constructPopulateConfigOption;
    }()
  }]);
  return Service;
}();

exports["default"] = Service;