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
// ─── SCHEMA PLUGINS ─────────────────────────────────────────────────────────────
//

AttachmentSchema.plugin(_mongoosePaginateV["default"]);

function preDeleteOneMethod(_x) {
  return _preDeleteOneMethod.apply(this, arguments);
}

function _preDeleteOneMethod() {
  _preDeleteOneMethod = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(next) {
    var attachmentService, attachmentReadResponse, attachmentFilesDeleteResponse;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Initializing needed services.
            attachmentService = new _Attachment["default"](this.model); // Get deleted store document.

            _context.next = 3;
            return attachmentService.readMany(this.getQuery());

          case 3:
            attachmentReadResponse = _context.sent;

            if (!attachmentReadResponse.error) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", next(attachmentReadResponse.errors));

          case 6:
            _context.next = 8;
            return attachmentService.handelFilesForDirDeletion(attachmentReadResponse.data.map(function (attachment) {
              return attachment.path;
            }));

          case 8:
            attachmentFilesDeleteResponse = _context.sent;

            if (!attachmentFilesDeleteResponse.error) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", next(attachmentFilesDeleteResponse.errors));

          case 11:
            next();

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _preDeleteOneMethod.apply(this, arguments);
}

AttachmentSchema.pre("deleteOne", preDeleteOneMethod); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Attachment = _mongoose["default"].model("Attachment", AttachmentSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Attachment;
exports["default"] = _default;