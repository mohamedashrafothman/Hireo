"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _lodash = require("lodash");

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

var _crypto = _interopRequireDefault(require("crypto"));

var _Service2 = _interopRequireDefault(require("../utilities/Service"));

var _User = _interopRequireDefault(require("../models/User.model"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var UserService = /*#__PURE__*/function (_Service) {
  (0, _inherits2["default"])(UserService, _Service);

  var _super = _createSuper(UserService);

  function UserService(model) {
    var _this;

    (0, _classCallCheck2["default"])(this, UserService);
    _this = _super.call(this, model);
    _this.register = _this.register.bind((0, _assertThisInitialized2["default"])(_this));
    _this.verify = _this.verify.bind((0, _assertThisInitialized2["default"])(_this));
    _this.forgotPassword = _this.forgotPassword.bind((0, _assertThisInitialized2["default"])(_this));
    _this.resetPassword = _this.resetPassword.bind((0, _assertThisInitialized2["default"])(_this));
    _this.logout = _this.logout.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getSettingsUserData = _this.getSettingsUserData.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(UserService, [{
    key: "register",
    value: function () {
      var _register = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(body) {
        var existedUser, createdUser;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.readOne({
                  email: body.email
                });

              case 2:
                existedUser = _context.sent;

                if (!existedUser.error) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", existedUser);

              case 5:
                if ((0, _lodash.isEmpty)(existedUser.data)) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", {
                  error: true,
                  statusCode: 202,
                  errors: ["Account with that email address already exists."]
                });

              case 7:
                _context.next = 9;
                return this.create(body);

              case 9:
                createdUser = _context.sent;
                return _context.abrupt("return", createdUser);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function register(_x) {
        return _register.apply(this, arguments);
      }

      return register;
    }()
  }, {
    key: "deserialize",
    value: function () {
      var _deserialize = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_id) {
        var _yield$to, _yield$to2, userError, user;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _awaitToJs["default"])(this.model.findOne({
                  _id: _id
                }));

              case 2:
                _yield$to = _context2.sent;
                _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 2);
                userError = _yield$to2[0];
                user = _yield$to2[1];

                if (!userError) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: userError
                });

              case 8:
                return _context2.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: user
                });

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function deserialize(_x2) {
        return _deserialize.apply(this, arguments);
      }

      return deserialize;
    }()
  }, {
    key: "verify",
    value: function () {
      var _verify = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(params) {
        var existedUser, updatedUser;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.readOne({
                  email: params.email,
                  hash: params.hash,
                  is_verified: {
                    $lt: 1
                  }
                });

              case 2:
                existedUser = _context3.sent;

                if (!existedUser.error) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", existedUser);

              case 5:
                if (!(0, _lodash.isEmpty)(existedUser.data)) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["Invalid approach, please use the link that has been send to your email."]
                });

              case 7:
                _context3.next = 9;
                return this.updateOne({
                  _id: existedUser.data._id
                }, {
                  $set: {
                    is_verified: 1,
                    hash: null
                  }
                });

              case 9:
                updatedUser = _context3.sent;
                return _context3.abrupt("return", updatedUser);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function verify(_x3) {
        return _verify.apply(this, arguments);
      }

      return verify;
    }()
  }, {
    key: "forgotPassword",
    value: function () {
      var _forgotPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(body) {
        var existedUser, updatedUser;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.readOne({
                  email: body.email
                });

              case 2:
                existedUser = _context4.sent;

                if (!existedUser.error) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", existedUser);

              case 5:
                if (!(0, _lodash.isEmpty)(existedUser.data)) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["No account found with this email."]
                });

              case 7:
                _context4.next = 9;
                return this.updateOne({
                  email: body.email
                }, {
                  $set: {
                    resetPasswordToken: _crypto["default"].randomBytes(16).toString("hex"),
                    resetPasswordExpires: Date.now() + 1000 * 60 * 60 * process.env.PASSWORD_RESET_TIME_LIMIT_IN_HOURS
                  }
                });

              case 9:
                updatedUser = _context4.sent;
                return _context4.abrupt("return", updatedUser);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function forgotPassword(_x4) {
        return _forgotPassword.apply(this, arguments);
      }

      return forgotPassword;
    }()
  }, {
    key: "resetPassword",
    value: function () {
      var _resetPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(body, params) {
        var existedUser, _yield$to3, _yield$to4, savedUserError, savedUser;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.readOne({
                  resetPasswordToken: params.token,
                  resetPasswordExpires: {
                    $gt: Date.now()
                  }
                });

              case 2:
                existedUser = _context5.sent;

                if (!existedUser.error) {
                  _context5.next = 5;
                  break;
                }

                return _context5.abrupt("return", existedUser);

              case 5:
                if (!(0, _lodash.isEmpty)(existedUser.data)) {
                  _context5.next = 7;
                  break;
                }

                return _context5.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["Password reset token is invalid or has expired."]
                });

              case 7:
                existedUser.data.password = body.password;
                existedUser.data.resetPasswordToken = undefined;
                existedUser.data.resetPasswordExpires = undefined;
                _context5.next = 12;
                return (0, _awaitToJs["default"])(existedUser.data.save());

              case 12:
                _yield$to3 = _context5.sent;
                _yield$to4 = (0, _slicedToArray2["default"])(_yield$to3, 2);
                savedUserError = _yield$to4[0];
                savedUser = _yield$to4[1];

                if (!savedUserError) {
                  _context5.next = 18;
                  break;
                }

                return _context5.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: savedUserError
                });

              case 18:
                return _context5.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: savedUser
                });

              case 19:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function resetPassword(_x5, _x6) {
        return _resetPassword.apply(this, arguments);
      }

      return resetPassword;
    }()
  }, {
    key: "logout",
    value: function () {
      var _logout = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(user) {
        var loggedOutUser;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.updateOne({
                  email: user.email,
                  is_active: 1
                }, {
                  $set: {
                    is_active: 0
                  }
                });

              case 2:
                loggedOutUser = _context6.sent;
                return _context6.abrupt("return", loggedOutUser);

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function logout(_x7) {
        return _logout.apply(this, arguments);
      }

      return logout;
    }()
  }, {
    key: "getSettingsUserData",
    value: function () {
      var _getSettingsUserData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_id) {
        var _yield$to5, _yield$to6, userError, user;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return (0, _awaitToJs["default"])(this.model.findOne({
                  _id: _id
                }).select("account location email slug role profile"));

              case 2:
                _yield$to5 = _context7.sent;
                _yield$to6 = (0, _slicedToArray2["default"])(_yield$to5, 2);
                userError = _yield$to6[0];
                user = _yield$to6[1];

                if (!userError) {
                  _context7.next = 8;
                  break;
                }

                return _context7.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: userError
                });

              case 8:
                return _context7.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: user
                });

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getSettingsUserData(_x8) {
        return _getSettingsUserData.apply(this, arguments);
      }

      return getSettingsUserData;
    }()
  }, {
    key: "updatePassword",
    value: function () {
      var _updatePassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_id, body) {
        var user, _yield$to7, _yield$to8, savedUserError, savedUser;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.readOne({
                  _id: _id
                });

              case 2:
                user = _context8.sent;

                if (!user.error) {
                  _context8.next = 5;
                  break;
                }

                return _context8.abrupt("return", user);

              case 5:
                if (!(0, _lodash.isEmpty)(user.data)) {
                  _context8.next = 7;
                  break;
                }

                return _context8.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["No User Found!"]
                });

              case 7:
                user.data.password = body.password;
                _context8.next = 10;
                return (0, _awaitToJs["default"])(user.data.save());

              case 10:
                _yield$to7 = _context8.sent;
                _yield$to8 = (0, _slicedToArray2["default"])(_yield$to7, 2);
                savedUserError = _yield$to8[0];
                savedUser = _yield$to8[1];

                if (!savedUserError) {
                  _context8.next = 16;
                  break;
                }

                return _context8.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: savedUserError
                });

              case 16:
                return _context8.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: savedUser
                });

              case 17:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function updatePassword(_x9, _x10) {
        return _updatePassword.apply(this, arguments);
      }

      return updatePassword;
    }()
  }, {
    key: "getUserBySlug",
    value: function () {
      var _getUserBySlug = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(slug) {
        var _yield$to9, _yield$to10, userErrors, user;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return (0, _awaitToJs["default"])(this.model.findOne({
                  slug: slug,
                  role: {
                    $ne: "admin"
                  }
                }).populate({
                  path: "jobs",
                  match: {
                    status: {
                      $nin: [2, 4]
                    }
                  },
                  populate: {
                    path: "type",
                    select: "name"
                  }
                }));

              case 2:
                _yield$to9 = _context9.sent;
                _yield$to10 = (0, _slicedToArray2["default"])(_yield$to9, 2);
                userErrors = _yield$to10[0];
                user = _yield$to10[1];

                if (!userErrors) {
                  _context9.next = 8;
                  break;
                }

                return _context9.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: userErrors
                });

              case 8:
                if (!(0, _lodash.isEmpty)(user)) {
                  _context9.next = 10;
                  break;
                }

                return _context9.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["Not Found!"]
                });

              case 10:
                return _context9.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: user
                });

              case 11:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getUserBySlug(_x11) {
        return _getUserBySlug.apply(this, arguments);
      }

      return getUserBySlug;
    }()
  }, {
    key: "getBookmarked",
    value: function () {
      var _getBookmarked = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(_id) {
        var _yield$to11, _yield$to12, userError, user;

        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return (0, _awaitToJs["default"])(this.model.findOne({
                  _id: _id
                }).select("_id bookmarked"));

              case 2:
                _yield$to11 = _context10.sent;
                _yield$to12 = (0, _slicedToArray2["default"])(_yield$to11, 2);
                userError = _yield$to12[0];
                user = _yield$to12[1];

                if (!userError) {
                  _context10.next = 8;
                  break;
                }

                return _context10.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: userError
                });

              case 8:
                return _context10.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: user
                });

              case 9:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getBookmarked(_x12) {
        return _getBookmarked.apply(this, arguments);
      }

      return getBookmarked;
    }()
  }]);
  return UserService;
}(_Service2["default"]);

var _default = new UserService(_User["default"]);

exports["default"] = _default;