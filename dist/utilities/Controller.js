"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _mongoosePaginateV = require("mongoose-paginate-v2");

var _expressValidator = require("express-validator");

var Controller = /*#__PURE__*/function () {
  function Controller(service) {
    (0, _classCallCheck2["default"])(this, Controller);
    this.service = service;
    this.create = this.create.bind(this);
    this.readMany = this.readMany.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.updateMany = this.updateMany.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.deleteMany = this.deleteMany.bind(this);
  }

  (0, _createClass2["default"])(Controller, [{
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var errors, err, response;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context.next = 4;
                  break;
                }

                err = errors.array();
                return _context.abrupt("return", res.status(422).json({
                  errors: err
                }));

              case 4:
                _context.next = 6;
                return this.service.create(req.body);

              case 6:
                response = _context.sent;

                if (!response.error) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt("return", next(response.errors));

              case 9:
                return _context.abrupt("return", res.status(response.statusCode).send(response));

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function create(_x, _x2, _x3) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: "readMany",
    value: function () {
      var _readMany = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var query, _query$page, page, _query$limit, limit, response;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                query = req.query;
                _query$page = query.page, page = _query$page === void 0 ? _mongoosePaginateV.paginate.options.page : _query$page, _query$limit = query.limit, limit = _query$limit === void 0 ? _mongoosePaginateV.paginate.options.limit : _query$limit;
                if (query.page) delete query.page;
                if (query.limit) delete query.limit;
                _context2.next = 6;
                return this.service.read(query, {
                  page: page,
                  limit: limit
                });

              case 6:
                response = _context2.sent;

                if (!response.error) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt("return", next(response.errors));

              case 9:
                if (!(!response.data.length && response.offset === undefined && response.page !== 1)) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt("return", res.redirect(req.prevPrevPath));

              case 11:
                return _context2.abrupt("return", res.status(response.statusCode).send(response));

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function readMany(_x4, _x5, _x6) {
        return _readMany.apply(this, arguments);
      }

      return readMany;
    }()
  }, {
    key: "readOne",
    value: function () {
      var _readOne = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var response;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.service.readOne(req.query);

              case 2:
                response = _context3.sent;

                if (!response.error) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", next(response.errors));

              case 5:
                return _context3.abrupt("return", res.status(response.statusCode).send(response));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function readOne(_x7, _x8, _x9) {
        return _readOne.apply(this, arguments);
      }

      return readOne;
    }()
  }, {
    key: "updateOne",
    value: function () {
      var _updateOne = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var errors, err, response;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context4.next = 4;
                  break;
                }

                err = errors.array();
                return _context4.abrupt("return", res.status(422).json({
                  errors: err
                }));

              case 4:
                _context4.next = 6;
                return this.service.updateOne(req.query, req.body);

              case 6:
                response = _context4.sent;

                if (!response.error) {
                  _context4.next = 9;
                  break;
                }

                return _context4.abrupt("return", next(response.errors));

              case 9:
                return _context4.abrupt("return", res.status(response.statusCode).send(response));

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function updateOne(_x10, _x11, _x12) {
        return _updateOne.apply(this, arguments);
      }

      return updateOne;
    }()
  }, {
    key: "updateMany",
    value: function () {
      var _updateMany = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var errors, err, response;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context5.next = 4;
                  break;
                }

                err = errors.array();
                return _context5.abrupt("return", res.status(422).json({
                  errors: err
                }));

              case 4:
                _context5.next = 6;
                return this.service.updateMany(req.query, req.body);

              case 6:
                response = _context5.sent;

                if (!response.error) {
                  _context5.next = 9;
                  break;
                }

                return _context5.abrupt("return", next(response.errors));

              case 9:
                return _context5.abrupt("return", res.status(response.statusCode).send(response));

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function updateMany(_x13, _x14, _x15) {
        return _updateMany.apply(this, arguments);
      }

      return updateMany;
    }()
  }, {
    key: "deleteOne",
    value: function () {
      var _deleteOne = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
        var response;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.service.deleteOne(req.params.id);

              case 2:
                response = _context6.sent;

                if (!response.error) {
                  _context6.next = 5;
                  break;
                }

                return _context6.abrupt("return", next(response.errors));

              case 5:
                return _context6.abrupt("return", res.status(response.statusCode).send(response));

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function deleteOne(_x16, _x17, _x18) {
        return _deleteOne.apply(this, arguments);
      }

      return deleteOne;
    }()
  }, {
    key: "deleteMany",
    value: function () {
      var _deleteMany = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
        var response;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.service.deleteMany(req.params);

              case 2:
                response = _context7.sent;

                if (!response.error) {
                  _context7.next = 5;
                  break;
                }

                return _context7.abrupt("return", next(response.errors));

              case 5:
                return _context7.abrupt("return", res.status(response.statusCode).send(response));

              case 6:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function deleteMany(_x19, _x20, _x21) {
        return _deleteMany.apply(this, arguments);
      }

      return deleteMany;
    }()
  }]);
  return Controller;
}();

var _default = Controller;
exports["default"] = _default;