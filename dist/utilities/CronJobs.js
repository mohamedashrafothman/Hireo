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

var _cron = require("cron");

var _Job = _interopRequireDefault(require("../models/Job.model"));

var _Message = _interopRequireDefault(require("../models/Message.model"));

var _Conversation = _interopRequireDefault(require("../models/Conversation.model"));

var _Job2 = _interopRequireDefault(require("../services/Job"));

var _Message2 = _interopRequireDefault(require("../services/Message"));

var _Conversation2 = _interopRequireDefault(require("../services/Conversation"));

var jobService = new _Job2["default"](_Job["default"]);
var messageService = new _Message2["default"](_Message["default"]);
var conversationService = new _Conversation2["default"](_Conversation["default"]);

var CronJobs = /*#__PURE__*/function () {
  function CronJobs() {
    (0, _classCallCheck2["default"])(this, CronJobs);
    this.makeJobsExpire();
    this.deleteExpiredConversations();
  }

  (0, _createClass2["default"])(CronJobs, [{
    key: "makeJobsExpire",
    value: function makeJobsExpire() {
      new _cron.CronJob("00 * * * * *", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var jobExpiringResponse, jobExpiredResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return jobService.updateMany({
                  status: 1,
                  expiring_at: {
                    $gte: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
                    $lt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
                  }
                }, {
                  $set: {
                    status: 3
                  }
                });

              case 2:
                jobExpiringResponse = _context.sent;

                if (!jobExpiringResponse.error) {
                  _context.next = 5;
                  break;
                }

                throw jobExpiringResponse.errors;

              case 5:
                _context.next = 7;
                return jobService.updateMany({
                  status: 3,
                  expiring_at: {
                    $gte: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
                    $lt: new Date(new Date().getTime() + 3 * 60 * 60 * 1000)
                  }
                }, {
                  $set: {
                    status: 4
                  }
                });

              case 7:
                jobExpiredResponse = _context.sent;

                if (!jobExpiredResponse.error) {
                  _context.next = 10;
                  break;
                }

                throw jobExpiredResponse.errors;

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })), null, true, "Africa/Cairo");
    }
  }, {
    key: "deleteExpiredConversations",
    value: function deleteExpiredConversations() {
      new _cron.CronJob("00 * * * * *", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var conversationReadResponse, conversationExpiredResponse, messagesReadResponse, messagesExpiredResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return conversationService.readMany({
                  is_deleted: true,
                  deleted_by: {
                    $size: 2
                  },
                  created_at: {
                    $lt: new Date().setMonth(new Date().getMonth() - 1)
                  }
                }, {
                  pagination: false
                });

              case 2:
                conversationReadResponse = _context2.sent;

                if (!conversationReadResponse.error) {
                  _context2.next = 5;
                  break;
                }

                throw conversationReadResponse.errors;

              case 5:
                if (!conversationReadResponse.data.length) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 8;
                return conversationService.deleteMany({
                  is_deleted: true,
                  deleted_by: {
                    $size: 2
                  },
                  created_at: {
                    $lt: new Date().setMonth(new Date().getMonth() - 1)
                  }
                }, {
                  pagination: false
                });

              case 8:
                conversationExpiredResponse = _context2.sent;

                if (!conversationExpiredResponse.error) {
                  _context2.next = 11;
                  break;
                }

                throw conversationExpiredResponse.errors;

              case 11:
                _context2.next = 13;
                return messageService.readMany({
                  is_deleted: true,
                  created_at: {
                    $lt: new Date().setMonth(new Date().getMonth() - 1)
                  }
                }, {
                  pagination: false
                });

              case 13:
                messagesReadResponse = _context2.sent;

                if (!messagesReadResponse.error) {
                  _context2.next = 16;
                  break;
                }

                throw messagesReadResponse.errors;

              case 16:
                if (!messagesReadResponse.data.length) {
                  _context2.next = 22;
                  break;
                }

                _context2.next = 19;
                return messageService.deleteMany({
                  is_deleted: true,
                  created_at: {
                    $lt: new Date().setMonth(new Date().getMonth() - 1)
                  }
                }, {
                  pagination: false
                });

              case 19:
                messagesExpiredResponse = _context2.sent;

                if (!messagesExpiredResponse.error) {
                  _context2.next = 22;
                  break;
                }

                throw messagesExpiredResponse.errors;

              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })), null, true, "Africa/Cairo");
    }
  }]);
  return CronJobs;
}();

exports["default"] = CronJobs;