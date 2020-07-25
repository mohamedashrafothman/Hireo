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

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _lodash = require("lodash");

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _Message = _interopRequireDefault(require("../models/Message.model"));

var _Conversation = _interopRequireDefault(require("../models/Conversation.model"));

var _Message2 = _interopRequireDefault(require("../services/Message"));

var _Conversation2 = _interopRequireDefault(require("../services/Conversation"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var messageService = new _Message2["default"](_Message["default"]);
var conversationService = new _Conversation2["default"](_Conversation["default"]);

var ConversationController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(ConversationController, _Controller);

  var _super = _createSuper(ConversationController);

  function ConversationController(service) {
    (0, _classCallCheck2["default"])(this, ConversationController);
    return _super.call(this, service);
  }

  (0, _createClass2["default"])(ConversationController, [{
    key: "getAllConversations",
    value: function () {
      var _getAllConversations = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var id, options, conversationQuery, conversationsQuery, conversationReadResponse, conversationsReadResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = req.params.id;
                options = {
                  populate: [{
                    path: "users",
                    select: "is_active email account",
                    populate: "account.picture account.picture_sm account.picture_md account.picture_lg"
                  }, {
                    path: "messages",
                    match: {
                      is_deleted: false
                    },
                    options: {
                      sort: {
                        created_at: "desc"
                      }
                    },
                    populate: {
                      path: "user",
                      populate: "account.picture account.picture_sm account.picture_md account.picture_lg"
                    }
                  }],
                  sort: {
                    updated_at: "desc"
                  }
                };
                conversationQuery = _objectSpread(_objectSpread(_objectSpread({}, id && {
                  _id: id
                }), req.user.role !== "admin" && {
                  users: req.user._id
                }), !id && {
                  is_deleted: false,
                  deleted_by: {
                    $ne: req.user._id
                  }
                });
                conversationsQuery = _objectSpread(_objectSpread({}, req.user.role !== "admin" && {
                  users: req.user._id
                }), {}, {
                  is_deleted: false,
                  deleted_by: {
                    $ne: req.user._id
                  }
                });
                _context.next = 6;
                return conversationService.readMany(conversationQuery, options);

              case 6:
                conversationReadResponse = _context.sent;

                if (!conversationReadResponse.error) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt("return", next(conversationReadResponse.errors));

              case 9:
                _context.next = 11;
                return conversationService.readMany(conversationsQuery, options);

              case 11:
                conversationsReadResponse = _context.sent;

                if (!conversationsReadResponse.error) {
                  _context.next = 14;
                  break;
                }

                return _context.abrupt("return", next(conversationsReadResponse.errors));

              case 14:
                res.render("dashboard/messages", _objectSpread(_objectSpread({
                  page_title: "Messages"
                }, conversationsReadResponse), {}, {
                  data: {
                    conversations: conversationsReadResponse.data,
                    conversation: conversationReadResponse.data[0]
                  },
                  query: req.query
                }));

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getAllConversations(_x, _x2, _x3) {
        return _getAllConversations.apply(this, arguments);
      }

      return getAllConversations;
    }()
  }, {
    key: "deleteConversation",
    value: function () {
      var _deleteConversation = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var conversation, query, conversationReadResponse, conversationUpdateResponse, messagesUpdateResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                conversation = req.params.conversation;
                query = {
                  _id: conversation,
                  users: req.user._id
                }; // Check if conversation found.

                _context2.next = 4;
                return conversationService.readOne(query);

              case 4:
                conversationReadResponse = _context2.sent;

                if (!conversationReadResponse.error) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", next(conversationReadResponse.errors));

              case 7:
                if (!(0, _lodash.isEmpty)(conversationReadResponse.data)) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt("return", next());

              case 9:
                _context2.next = 11;
                return conversationService.updateOne(query, _objectSpread(_objectSpread({}, conversationReadResponse.data.deleted_by.length >= 1 && {
                  $set: {
                    is_deleted: true
                  }
                }), conversationReadResponse.data.deleted_by.length <= 1 && {
                  $addToSet: {
                    deleted_by: req.user._id
                  }
                }));

              case 11:
                conversationUpdateResponse = _context2.sent;

                if (!conversationUpdateResponse.error) {
                  _context2.next = 14;
                  break;
                }

                return _context2.abrupt("return", next(conversationUpdateResponse.errors));

              case 14:
                _context2.next = 16;
                return messageService.updateMany({
                  conversation: conversationReadResponse.data._id,
                  created_at: {
                    $lt: new Date()
                  }
                }, _objectSpread({}, conversationReadResponse.data.deleted_by.length >= 1 && {
                  $set: {
                    is_deleted: true
                  }
                }));

              case 16:
                messagesUpdateResponse = _context2.sent;

                if (!messagesUpdateResponse.error) {
                  _context2.next = 19;
                  break;
                }

                return _context2.abrupt("return", next(messagesUpdateResponse.errors));

              case 19:
                res.status(conversationUpdateResponse.statusCode).redirect("/dashboard/conversations");

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function deleteConversation(_x4, _x5, _x6) {
        return _deleteConversation.apply(this, arguments);
      }

      return deleteConversation;
    }()
  }]);
  return ConversationController;
}(_Controller2["default"]);

var _default = new ConversationController(conversationService);

exports["default"] = _default;