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

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _Post = _interopRequireDefault(require("../services/Post"));

var _Device = _interopRequireDefault(require("../services/Device"));

var _Comment = _interopRequireDefault(require("../services/Comment"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var CommentController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(CommentController, _Controller);

  var _super = _createSuper(CommentController);

  function CommentController(service) {
    var _this;

    (0, _classCallCheck2["default"])(this, CommentController);
    _this = _super.call(this, service);
    _this.addComment = _this.addComment.bind((0, _assertThisInitialized2["default"])(_this));
    _this.editComment = _this.editComment.bind((0, _assertThisInitialized2["default"])(_this));
    _this.deleteComment = _this.deleteComment.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(CommentController, [{
    key: "validator",
    value: function validator(method) {
      switch (method) {
        case "add comment":
        case "edit comment":
          return [(0, _expressValidator.body)("content").notEmpty().withMessage("Comment's content can't be empty!").isLength({
            max: 500
          }).withMessage("Comment's content exceeds the limit of 500 letter!").trim().escape()];

        default:
          return [];
      }
    }
  }, {
    key: "addComment",
    value: function () {
      var _addComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var _req$params, post_id, _req$params$parent, parent, client_ip, errors, err, commentCreateResponse, deviceCreateResponse, commentUpdateResponse, postUpdateResponse;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _req$params = req.params, post_id = _req$params.id, _req$params$parent = _req$params.parent, parent = _req$params$parent === void 0 ? null : _req$params$parent;
                client_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context.next = 7;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context.abrupt("return", res.redirect("back"));

              case 7:
                _context.next = 9;
                return this.service.create(_objectSpread(_objectSpread({}, req.body), {}, {
                  created_by: req.user._id,
                  post: post_id
                }, parent && {
                  parent: [parent]
                }));

              case 9:
                commentCreateResponse = _context.sent;

                if (!commentCreateResponse.error) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return", next(commentCreateResponse.errors));

              case 12:
                _context.next = 14;
                return _Device["default"].create({
                  ip: client_ip,
                  source: req.useragent.source,
                  browser: {
                    name: req.useragent.browser,
                    version: req.useragent.version
                  },
                  os: req.useragent.os,
                  platform: req.useragent.platform
                });

              case 14:
                deviceCreateResponse = _context.sent;

                if (!deviceCreateResponse.error) {
                  _context.next = 17;
                  break;
                }

                return _context.abrupt("return", next(deviceCreateResponse.errors));

              case 17:
                _context.next = 19;
                return this.service.updateOne({
                  _id: commentCreateResponse.data._id
                }, {
                  $set: {
                    created_from: deviceCreateResponse.data._id
                  }
                });

              case 19:
                commentUpdateResponse = _context.sent;

                if (!commentUpdateResponse.error) {
                  _context.next = 22;
                  break;
                }

                return _context.abrupt("return", next(commentUpdateResponse.errors));

              case 22:
                _context.next = 24;
                return _Post["default"].updateOne({
                  _id: post_id
                }, {
                  $push: {
                    comments: commentCreateResponse.data._id
                  }
                });

              case 24:
                postUpdateResponse = _context.sent;

                if (!postUpdateResponse.error) {
                  _context.next = 27;
                  break;
                }

                return _context.abrupt("return", next(postUpdateResponse.errors));

              case 27:
                res.redirect("back");

              case 28:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function addComment(_x, _x2, _x3) {
        return _addComment.apply(this, arguments);
      }

      return addComment;
    }()
  }, {
    key: "editComment",
    value: function () {
      var _editComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                res.json({
                  title: "edit comment page"
                });

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function editComment(_x4, _x5) {
        return _editComment.apply(this, arguments);
      }

      return editComment;
    }()
  }, {
    key: "deleteComment",
    value: function () {
      var _deleteComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                res.json({
                  title: "delete comment page"
                });

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function deleteComment(_x6, _x7) {
        return _deleteComment.apply(this, arguments);
      }

      return deleteComment;
    }()
  }]);
  return CommentController;
}(_Controller2["default"]);

var _default = new CommentController(_Comment["default"]);

exports["default"] = _default;