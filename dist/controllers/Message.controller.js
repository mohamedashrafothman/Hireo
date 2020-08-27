"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _expressValidator = require("express-validator");

var _lodash = require("lodash");

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _User = _interopRequireDefault(require("../services/User"));

var _Message = _interopRequireDefault(require("../services/Message"));

var _Conversation = _interopRequireDefault(require("../services/Conversation"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var MessageController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(MessageController, _Controller);

  var _super = _createSuper(MessageController);

  function MessageController(service) {
    var _this;

    (0, _classCallCheck2["default"])(this, MessageController);
    _this = _super.call(this, service);
    _this.addMessage = _this.addMessage.bind((0, _assertThisInitialized2["default"])(_this));
    _this.readAllMessages = _this.readAllMessages.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(MessageController, [{
    key: "validator",
    value: function validator(method) {
      switch (method) {
        case "add message":
          return [(0, _expressValidator.body)("content").notEmpty().withMessage("Message Can't be Empty!").trim().escape()];

        default:
          return [];
      }
    }
  }, {
    key: "addMessage",
    value: function () {
      var _addMessage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var errors, err, to, _req$app$get, io, conversationReadResponse, _messageCreateResponse, _conversationUpdateResponse, _userReadResponse, conversationCreateResponse, messageCreateResponse, conversationUpdateResponse, userReadResponse;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context.next = 5;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context.abrupt("return", res.redirect("back"));

              case 5:
                to = req.params.to;
                _req$app$get = req.app.get("io"), io = _req$app$get.io;
                _context.next = 9;
                return _Conversation["default"].readOne({
                  users: {
                    $size: 2,
                    $all: [req.user._id, to]
                  }
                });

              case 9:
                conversationReadResponse = _context.sent;

                if (!conversationReadResponse.error) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return", next(conversationReadResponse.errors));

              case 12:
                if ((0, _lodash.isEmpty)(conversationReadResponse.data)) {
                  _context.next = 32;
                  break;
                }

                req.body = _objectSpread({
                  user: req.user._id,
                  conversation: conversationReadResponse.data._id
                }, req.body);
                _context.next = 16;
                return this.service.create(req.body);

              case 16:
                _messageCreateResponse = _context.sent;

                if (!_messageCreateResponse.error) {
                  _context.next = 19;
                  break;
                }

                return _context.abrupt("return", next(_messageCreateResponse.errors));

              case 19:
                _context.next = 21;
                return _Conversation["default"].updateOne({
                  _id: conversationReadResponse.data._id
                }, {
                  $addToSet: {
                    messages: _messageCreateResponse.data._id
                  },
                  $set: {
                    is_deleted: false
                  },
                  $pull: {
                    deleted_by: to
                  }
                });

              case 21:
                _conversationUpdateResponse = _context.sent;

                if (!_conversationUpdateResponse.error) {
                  _context.next = 24;
                  break;
                }

                return _context.abrupt("return", next(_conversationUpdateResponse.errors));

              case 24:
                _context.next = 26;
                return _User["default"].readMany({
                  _id: {
                    $in: conversationReadResponse.data.users
                  }
                }, {
                  pagination: false,
                  select: "email slug account is_active",
                  populate: [{
                    path: "account.picture",
                    select: "path name"
                  }, {
                    path: "account.picture_sm",
                    select: "path name"
                  }, {
                    path: "account.picture_md",
                    select: "path name"
                  }, {
                    path: "account.picture_lg",
                    select: "path name"
                  }]
                });

              case 26:
                _userReadResponse = _context.sent;

                if (!_userReadResponse.error) {
                  _context.next = 29;
                  break;
                }

                throw _userReadResponse.errors;

              case 29:
                // sending created message using sockets to all users in the conversation.
                io.sockets["in"](conversationReadResponse.data._id).emit("message", {
                  to: _userReadResponse.data.filter(function (current) {
                    return String(current._id) === String(to);
                  })[0],
                  to_gravatar: _userReadResponse.data.filter(function (current) {
                    return String(current._id) === String(to);
                  })[0].gravatar(50),
                  from: _userReadResponse.data.filter(function (current) {
                    return String(current._id) === String(req.user._id);
                  })[0],
                  from_gravatar: _userReadResponse.data.filter(function (current) {
                    return String(current._id) === String(req.user._id);
                  })[0].gravatar(50),
                  message: _messageCreateResponse.data
                });
                req.flash("success", "Direct Message Sent Successfully");
                return _context.abrupt("return", res.status(_messageCreateResponse.statusCode).redirect("back"));

              case 32:
                _context.next = 34;
                return _Conversation["default"].create({
                  users: [req.user._id, to]
                });

              case 34:
                conversationCreateResponse = _context.sent;

                if (!conversationCreateResponse.error) {
                  _context.next = 37;
                  break;
                }

                return _context.abrupt("return", next(conversationCreateResponse.errors));

              case 37:
                req.body = _objectSpread({
                  user: req.user._id,
                  conversation: conversationCreateResponse.data._id
                }, req.body);
                _context.next = 40;
                return this.service.create(req.body);

              case 40:
                messageCreateResponse = _context.sent;

                if (!messageCreateResponse.error) {
                  _context.next = 43;
                  break;
                }

                return _context.abrupt("return", next(messageCreateResponse.errors));

              case 43:
                _context.next = 45;
                return _Conversation["default"].updateOne({
                  _id: conversationCreateResponse.data._id
                }, {
                  $addToSet: {
                    messages: messageCreateResponse.data._id
                  },
                  $set: {
                    is_deleted: false
                  },
                  $pull: {
                    deleted_by: to
                  }
                });

              case 45:
                conversationUpdateResponse = _context.sent;

                if (!conversationUpdateResponse.error) {
                  _context.next = 48;
                  break;
                }

                return _context.abrupt("return", next(conversationUpdateResponse.errors));

              case 48:
                _context.next = 50;
                return _User["default"].readMany({
                  _id: {
                    $in: conversationCreateResponse.data.users
                  }
                }, {
                  pagination: false,
                  select: "email slug account is_active",
                  populate: [{
                    path: "account.picture",
                    select: "path name"
                  }, {
                    path: "account.picture_sm",
                    select: "path name"
                  }, {
                    path: "account.picture_md",
                    select: "path name"
                  }, {
                    path: "account.picture_lg",
                    select: "path name"
                  }]
                });

              case 50:
                userReadResponse = _context.sent;

                if (!userReadResponse.error) {
                  _context.next = 53;
                  break;
                }

                throw userReadResponse.errors;

              case 53:
                // sending created message using sockets to all users in the conversation.
                io.sockets["in"](conversationCreateResponse.data._id).emit("message", {
                  to: userReadResponse.data.filter(function (current) {
                    return String(current._id) === String(to);
                  })[0],
                  to_gravatar: userReadResponse.data.filter(function (current) {
                    return String(current._id) === String(to);
                  })[0].gravatar(50),
                  from: userReadResponse.data.filter(function (current) {
                    return String(current._id) === String(req.user._id);
                  })[0],
                  from_gravatar: userReadResponse.data.filter(function (current) {
                    return String(current._id) === String(req.user._id);
                  })[0].gravatar(50),
                  message: messageCreateResponse.data
                });
                req.flash("success", "Direct Message Sent Successfully");
                res.status(messageCreateResponse.statusCode).redirect("back");

              case 56:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function addMessage(_x, _x2, _x3) {
        return _addMessage.apply(this, arguments);
      }

      return addMessage;
    }()
  }, {
    key: "readAllMessages",
    value: function () {
      var _readAllMessages = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var messages, messagesUpdateResponse, messagesReadResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                messages = req.body.messages;
                _context2.next = 3;
                return this.service.updateMany({
                  _id: {
                    $in: messages
                  }
                }, {
                  $set: {
                    was_read: true
                  }
                });

              case 3:
                messagesUpdateResponse = _context2.sent;

                if (!messagesUpdateResponse.error) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", next(messagesUpdateResponse.errors));

              case 6:
                _context2.next = 8;
                return this.service.readMany({
                  _id: {
                    $in: messages
                  }
                }, {
                  pagination: false,
                  select: "_id was_read"
                });

              case 8:
                messagesReadResponse = _context2.sent;

                if (!messagesReadResponse.error) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt("return", next(messagesReadResponse.errors));

              case 11:
                return _context2.abrupt("return", res.json(messagesReadResponse.data));

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function readAllMessages(_x4, _x5, _x6) {
        return _readAllMessages.apply(this, arguments);
      }

      return readAllMessages;
    }()
  }]);
  return MessageController;
}(_Controller2["default"]);

var _default = new MessageController(_Message["default"]);

exports["default"] = _default;