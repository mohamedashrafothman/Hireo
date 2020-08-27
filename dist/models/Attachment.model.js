"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

var _Attachment = _interopRequireDefault(require("../services/Attachment"));

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
var AttachmentSchema = new _mongoose["default"].Schema({
  path: {
    type: String
  },
  dir: {
    type: String
  },
  name: {
    type: String
  },
  extname: {
    type: String
  },
  base: {
    type: String
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGINS AND HOOKS ───────────────────────────────────────────────────
//

AttachmentSchema.plugin(_mongoosePaginateV["default"]);

var preDeleteMethod = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(next) {
    var attachmentReadResponse, attachmentFilesDeleteResponse;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _Attachment["default"].readMany(this.getQuery());

          case 2:
            attachmentReadResponse = _context.sent;

            if (!attachmentReadResponse.error) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", next(attachmentReadResponse.errors));

          case 5:
            _context.next = 7;
            return _Attachment["default"].handelFilesForDirDeletion(attachmentReadResponse.data.map(function (attachment) {
              return attachment.path;
            }));

          case 7:
            attachmentFilesDeleteResponse = _context.sent;

            if (!attachmentFilesDeleteResponse.error) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", next(attachmentFilesDeleteResponse.errors));

          case 10:
            next();

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function preDeleteMethod(_x) {
    return _ref.apply(this, arguments);
  };
}();

AttachmentSchema.pre("deleteOne", preDeleteMethod);
AttachmentSchema.pre("deleteMany", preDeleteMethod); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Attachment = _mongoose["default"].model("Attachment", AttachmentSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Attachment;
exports["default"] = _default;