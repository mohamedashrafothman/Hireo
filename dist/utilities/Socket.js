"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _chalk = require("chalk");

var _User = _interopRequireDefault(require("../services/User"));

var _Message = _interopRequireDefault(require("../services/Message"));

var _Conversation = _interopRequireDefault(require("../services/Conversation"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var SocketConnection = /*#__PURE__*/function () {
  function SocketConnection(io) {
    (0, _classCallCheck2["default"])(this, SocketConnection);
    this.io = io;
    this.connectionEvent = this.connectionEvent.bind(this);
    this.joinChatEvent = this.joinChatEvent.bind(this);
    this.newMessageEvent = this.newMessageEvent.bind(this);
    this.userTypingEvent = this.userTypingEvent.bind(this);
    this.disconnectingEvent = this.disconnectingEvent.bind(this);
    this.connectionEvent();
  }

  (0, _createClass2["default"])(SocketConnection, [{
    key: "connectionEvent",
    value: function () {
      var _connectionEvent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var _this = this;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.io.sockets.on("connection", function (socket) {
                  console.log("\u2705  ".concat((0, _chalk.blue)("Socket connection has been opened!"))); // Save socket.io in the session

                  socket.request.session.socketio = socket.id;
                  socket.request.session.save(); // Add socket to all class for all methods accessability.

                  _this.socket = socket;
                  _this.session = socket.request.session; // Socket Event handlers.

                  _this.socket.on("conversations/join", function (conversation) {
                    return _this.joinChatEvent(conversation);
                  });

                  _this.socket.on("messages/new", function (data) {
                    return _this.newMessageEvent(data);
                  });

                  _this.socket.on("messages/typing", function (data) {
                    return _this.userTypingEvent(data);
                  });

                  _this.socket.on("messages/read_all", function (data) {
                    return _this.readAllMessages(data);
                  });

                  _this.socket.on("disconnect", function () {
                    return _this.disconnectingEvent();
                  });
                });

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connectionEvent() {
        return _connectionEvent.apply(this, arguments);
      }

      return connectionEvent;
    }()
  }, {
    key: "disconnectingEvent",
    value: function () {
      var _disconnectingEvent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log("\u2705  ".concat((0, _chalk.red)("Socket connection has been closed!")));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function disconnectingEvent() {
        return _disconnectingEvent.apply(this, arguments);
      }

      return disconnectingEvent;
    }()
  }, {
    key: "joinChatEvent",
    value: function () {
      var _joinChatEvent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(conversation) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.socket.join(conversation);

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function joinChatEvent(_x) {
        return _joinChatEvent.apply(this, arguments);
      }

      return joinChatEvent;
    }()
  }, {
    key: "newMessageEvent",
    value: function () {
      var _newMessageEvent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
        var userReadResponse, messageCreateResponse, conversationUpdateResponse, _ref;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _User["default"].readMany({
                  _id: {
                    $in: [data.to, data.from]
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

              case 2:
                userReadResponse = _context4.sent;

                if (!userReadResponse.error) {
                  _context4.next = 5;
                  break;
                }

                throw userReadResponse.errors;

              case 5:
                _context4.next = 7;
                return _Message["default"].create({
                  user: data.from,
                  conversation: data.conversation,
                  content: data.message
                });

              case 7:
                messageCreateResponse = _context4.sent;

                if (!messageCreateResponse.error) {
                  _context4.next = 10;
                  break;
                }

                throw messageCreateResponse.errors;

              case 10:
                _context4.next = 12;
                return _Conversation["default"].updateOne({
                  _id: data.conversation
                }, {
                  $addToSet: {
                    messages: messageCreateResponse.data._id
                  },
                  $set: {
                    is_deleted: false
                  },
                  $pull: {
                    deleted_by: data.to
                  }
                });

              case 12:
                conversationUpdateResponse = _context4.sent;

                if (!conversationUpdateResponse.error) {
                  _context4.next = 15;
                  break;
                }

                throw conversationUpdateResponse.errors;

              case 15:
                _ref = [userReadResponse.data.filter(function (current) {
                  return String(current._id) === data.to;
                })[0], userReadResponse.data.filter(function (current) {
                  return String(current._id) === data.to;
                })[0].gravatar(50), userReadResponse.data.filter(function (current) {
                  return String(current._id) === data.from;
                })[0], userReadResponse.data.filter(function (current) {
                  return String(current._id) === data.from;
                })[0].gravatar(50), messageCreateResponse.data];
                data.to = _ref[0];
                data.to_gravatar = _ref[1];
                data.from = _ref[2];
                data.from_gravatar = _ref[3];
                data.message = _ref[4];
                // Emitting new message to all users in conversation.
                this.io.sockets["in"](data.conversation).emit("message", data);

              case 22:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function newMessageEvent(_x2) {
        return _newMessageEvent.apply(this, arguments);
      }

      return newMessageEvent;
    }()
  }, {
    key: "userTypingEvent",
    value: function () {
      var _userTypingEvent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(data) {
        var userReadResponse, _ref2;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _User["default"].readMany({
                  _id: {
                    $in: [data.to, data.from]
                  }
                }, {
                  pagination: false,
                  select: "email account is_active",
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

              case 2:
                userReadResponse = _context5.sent;

                if (!userReadResponse.error) {
                  _context5.next = 5;
                  break;
                }

                throw userReadResponse.errors;

              case 5:
                _ref2 = [userReadResponse.data.filter(function (current) {
                  return String(current._id) === data.to;
                })[0], userReadResponse.data.filter(function (current) {
                  return String(current._id) === data.from;
                })[0]];
                data.to = _ref2[0];
                data.from = _ref2[1];
                // Emitting new message to all users in conversation.
                this.io.sockets["in"](data.conversation).emit("typing", data);

              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function userTypingEvent(_x3) {
        return _userTypingEvent.apply(this, arguments);
      }

      return userTypingEvent;
    }()
  }, {
    key: "readAllMessages",
    value: function () {
      var _readAllMessages = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(data) {
        var messagesReadResponse, messagesUpdateResponse;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return _Message["default"].readMany({
                  conversation: data.conversation,
                  user: data.receiver,
                  was_read: false
                });

              case 2:
                messagesReadResponse = _context6.sent;

                if (!messagesReadResponse.error) {
                  _context6.next = 5;
                  break;
                }

                throw messagesReadResponse.errors;

              case 5:
                _context6.next = 7;
                return _Message["default"].updateMany({
                  conversation: data.conversation,
                  user: data.receiver,
                  was_read: false
                }, {
                  $set: {
                    was_read: true
                  }
                });

              case 7:
                messagesUpdateResponse = _context6.sent;

                if (!messagesUpdateResponse.error) {
                  _context6.next = 10;
                  break;
                }

                throw messagesUpdateResponse.errors;

              case 10:
                // Emit to sender only.
                this.io.sockets["in"](data.conversation).emit("all_messages_readed", _objectSpread(_objectSpread({}, data), {}, {
                  messages: messagesReadResponse.data
                }));

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function readAllMessages(_x4) {
        return _readAllMessages.apply(this, arguments);
      }

      return readAllMessages;
    }()
  }]);
  return SocketConnection;
}();

exports["default"] = SocketConnection;