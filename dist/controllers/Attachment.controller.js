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

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _lodash = require("lodash");

var _path = _interopRequireDefault(require("path"));

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _Attachment = _interopRequireDefault(require("../models/Attachment.model"));

var _Attachment2 = _interopRequireDefault(require("../services/Attachment"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var attachmentService = new _Attachment2["default"](_Attachment["default"]);

var AttachmentController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(AttachmentController, _Controller);

  var _super = _createSuper(AttachmentController);

  function AttachmentController(service) {
    (0, _classCallCheck2["default"])(this, AttachmentController);
    return _super.call(this, service);
  }

  (0, _createClass2["default"])(AttachmentController, [{
    key: "downloadAttachment",
    value: function () {
      var _downloadAttachment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var attachment, attachmentReadResponse, storage_path_array, storage_path;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                attachment = req.params.attachment;
                _context.next = 3;
                return attachmentService.readOne({
                  _id: attachment
                });

              case 3:
                attachmentReadResponse = _context.sent;

                if (!attachmentReadResponse.error) {
                  _context.next = 8;
                  break;
                }

                if (!(0, _lodash.isEmpty)(attachmentReadResponse.data)) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", next());

              case 7:
                return _context.abrupt("return", next(attachmentReadResponse.errors));

              case 8:
                storage_path_array = process.env.UPLOAD_STORAGE.split("/");
                storage_path = storage_path_array.slice(0, storage_path_array.length - 1).join("/");
                res.download(_path["default"].resolve(__dirname, "../../".concat(storage_path), attachmentReadResponse.data.path), attachmentReadResponse.data.name);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function downloadAttachment(_x, _x2, _x3) {
        return _downloadAttachment.apply(this, arguments);
      }

      return downloadAttachment;
    }()
  }]);
  return AttachmentController;
}(_Controller2["default"]);

var _default = new AttachmentController(attachmentService);

exports["default"] = _default;