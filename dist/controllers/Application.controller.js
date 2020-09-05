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

var _path = _interopRequireDefault(require("path"));

var _lodash = require("lodash");

var _multer = _interopRequireDefault(require("multer"));

var _expressValidator = require("express-validator");

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _Job = _interopRequireDefault(require("../services/Job"));

var _User = _interopRequireDefault(require("../services/User"));

var _Attachment = _interopRequireDefault(require("../services/Attachment"));

var _Application = _interopRequireDefault(require("../services/Application"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ApplicationController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(ApplicationController, _Controller);

  var _super = _createSuper(ApplicationController);

  function ApplicationController(service) {
    var _this;

    (0, _classCallCheck2["default"])(this, ApplicationController);
    _this = _super.call(this, service);
    _this.changeStatus = _this.changeStatus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.addApplication = _this.addApplication.bind((0, _assertThisInitialized2["default"])(_this));
    _this.isAppliedBefore = _this.isAppliedBefore.bind((0, _assertThisInitialized2["default"])(_this));
    _this.uploadAttachments = _this.uploadAttachments.bind((0, _assertThisInitialized2["default"])(_this));
    _this.downloadAttachment = _this.downloadAttachment.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getApplicationsList = _this.getApplicationsList.bind((0, _assertThisInitialized2["default"])(_this));
    _this.withdrawApplication = _this.withdrawApplication.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ApplicationController, [{
    key: "validator",
    value: function validator(method) {
      switch (method) {
        case "add application":
        case "edit application":
          return [(0, _expressValidator.body)("name").notEmpty().withMessage("Name can't be empty!").trim().escape(), (0, _expressValidator.body)("email").notEmpty().withMessage("Email must supply an E-mail.").isEmail().withMessage("Email must be in an E-mail format.").trim().normalizeEmail()];

        default:
          return [];
      }
    }
  }, {
    key: "getApplicationsList",
    value: function () {
      var _getApplicationsList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var _req$query;

        var query, options, applicationReadResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = _objectSpread(_objectSpread({}, ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.q) && {
                  $or: [{
                    status: {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    seen_at: {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "job.title": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "created_by.email": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }]
                }), req.user && req.user.role !== "admin" && {
                  created_by: req.user._id
                });
                options = _objectSpread({}, req.query);
                _context.next = 4;
                return this.service.readMany(query, options);

              case 4:
                applicationReadResponse = _context.sent;

                if (!applicationReadResponse.error) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", next(applicationReadResponse.errors));

              case 7:
                if (!(!applicationReadResponse.data.length && applicationReadResponse.offset === undefined && applicationReadResponse.page !== 1)) {
                  _context.next = 10;
                  break;
                }

                req.flash("info", "Hey! you asked for page ".concat(req.query.page || 1, ". But that dosen't exist. So i put you on page ").concat(applicationReadResponse.pages, "."));
                return _context.abrupt("return", res.status(applicationReadResponse.statusCode).redirect("/dashboard/applications/list?page=".concat(applicationReadResponse.pages)));

              case 10:
                res.render("dashboard/applications/list", _objectSpread(_objectSpread({
                  page_title: "Manage All Applications"
                }, applicationReadResponse), {}, {
                  data: {
                    applications: applicationReadResponse.data
                  },
                  query: req.query
                }));

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getApplicationsList(_x, _x2, _x3) {
        return _getApplicationsList.apply(this, arguments);
      }

      return getApplicationsList;
    }()
  }, {
    key: "uploadAttachments",
    value: function () {
      var _uploadAttachments = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var storageEngine, attachmentUpload;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                storageEngine = _Attachment["default"].initStorageEngine({
                  accept: ["application", "image"],
                  square: false,
                  fileHashName: false,
                  upload_path: "".concat(process.env.UPLOAD_STORAGE, "/applications/").concat(new Date().getFullYear(), "/").concat(new Date().getMonth() + 1, "/").concat(new Date().getDate(), "/").concat(req.params.id, "/").concat(req.user._id),
                  upload_base_path: "/".concat(req.user._id)
                });
                attachmentUpload = (0, _multer["default"])({
                  storage: storageEngine,
                  limits: {
                    files: 1,
                    // allow only 1 files per Application
                    fileSize: 1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB) // 5 MB (max file size)

                  },
                  fileFilter: function fileFilter(request, file, cb) {
                    // supported image file mimetypes
                    var isFileTypeValid = storageEngine.options.accept.includes(file.mimetype.split("/")[0]);

                    if (isFileTypeValid) {
                      // allow supported image files
                      cb(null, true);
                    } else {
                      // throw error for invalid files
                      cb(new Error("That fileType isn't allowed!"));
                    }
                  }
                });
                attachmentUpload.array("attachments")(req, res, /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            if (!err) {
                              _context2.next = 3;
                              break;
                            }

                            req.flash("error", err.message);
                            return _context2.abrupt("return", res.redirect("back"));

                          case 3:
                            req.body.files = req.files;
                            next();

                          case 5:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x7) {
                    return _ref.apply(this, arguments);
                  };
                }());

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function uploadAttachments(_x4, _x5, _x6) {
        return _uploadAttachments.apply(this, arguments);
      }

      return uploadAttachments;
    }()
  }, {
    key: "isAppliedBefore",
    value: function () {
      var _isAppliedBefore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var isAppliedBeforeResponse;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.service.isAppliedBefore(req.params.id, req.user._id);

              case 2:
                isAppliedBeforeResponse = _context4.sent;

                if (!isAppliedBeforeResponse.error) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", next(isAppliedBeforeResponse.errors));

              case 5:
                if (!isAppliedBeforeResponse.data.isAppliedBefore) {
                  _context4.next = 9;
                  break;
                }

                req.flash("info", "You can't add more than one application to the job.");
                req.session.data = {
                  old: req.body
                };
                return _context4.abrupt("return", res.status(isAppliedBeforeResponse.statusCode).redirect("back"));

              case 9:
                next();

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function isAppliedBefore(_x8, _x9, _x10) {
        return _isAppliedBefore.apply(this, arguments);
      }

      return isAppliedBefore;
    }()
  }, {
    key: "addApplication",
    value: function () {
      var _addApplication = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var errors, err, savedAttachments, port, base, files, i, fileCreationResponse, applicationCreationResponse, jobUpdateResponse, userUpdateResponse;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context5.next = 6;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                req.session.data = {
                  old: req.body
                };
                return _context5.abrupt("return", res.redirect("back"));

              case 6:
                savedAttachments = [];

                if (!req.body.files.length) {
                  _context5.next = 22;
                  break;
                }

                port = req.app.get("port");
                base = "".concat(req.protocol, "://").concat(req.hostname).concat(port ? ":".concat(port) : "");
                files = _Attachment["default"].handelFilesForDBCreation(req.body.files, base);
                i = 0;

              case 12:
                if (!(i < files.length)) {
                  _context5.next = 22;
                  break;
                }

                _context5.next = 15;
                return _Attachment["default"].create(files[i]);

              case 15:
                fileCreationResponse = _context5.sent;

                if (!fileCreationResponse.error) {
                  _context5.next = 18;
                  break;
                }

                return _context5.abrupt("return", next(fileCreationResponse.errors));

              case 18:
                savedAttachments.push(fileCreationResponse.data[0]);

              case 19:
                i++;
                _context5.next = 12;
                break;

              case 22:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  created_by: req.user._id,
                  job: req.params.id
                }, savedAttachments.length && {
                  attachment: savedAttachments.map(function (attach) {
                    return attach._id;
                  })
                });
                _context5.next = 25;
                return this.service.create(req.body);

              case 25:
                applicationCreationResponse = _context5.sent;

                if (!applicationCreationResponse.error) {
                  _context5.next = 28;
                  break;
                }

                return _context5.abrupt("return", next(applicationCreationResponse.errors));

              case 28:
                _context5.next = 30;
                return _Job["default"].updateOne({
                  _id: req.params.id
                }, {
                  $addToSet: {
                    applications: applicationCreationResponse.data._id
                  }
                });

              case 30:
                jobUpdateResponse = _context5.sent;

                if (!jobUpdateResponse.error) {
                  _context5.next = 33;
                  break;
                }

                return _context5.abrupt("return", next(jobUpdateResponse.errors));

              case 33:
                _context5.next = 35;
                return _User["default"].updateOne({
                  _id: req.user._id
                }, {
                  $addToSet: {
                    applications: applicationCreationResponse.data._id
                  }
                });

              case 35:
                userUpdateResponse = _context5.sent;

                if (!userUpdateResponse.error) {
                  _context5.next = 38;
                  break;
                }

                return _context5.abrupt("return", next(userUpdateResponse.errors));

              case 38:
                req.flash("success", "Successfully applied to ".concat(jobUpdateResponse.data.title, " Job"));
                res.status(applicationCreationResponse.statusCode).redirect("back");

              case 40:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function addApplication(_x11, _x12, _x13) {
        return _addApplication.apply(this, arguments);
      }

      return addApplication;
    }()
  }, {
    key: "changeStatus",
    value: function () {
      var _changeStatus = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
        var _req$params, application, job, status, applicationUpdateResponse, applicationRejectResponse, jobUpdateResponse, message;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _req$params = req.params, application = _req$params.application, job = _req$params.job, status = _req$params.status;
                _context6.next = 3;
                return this.service.updateOne({
                  _id: application,
                  job: job
                }, {
                  $set: {
                    status: status
                  }
                });

              case 3:
                applicationUpdateResponse = _context6.sent;

                if (!applicationUpdateResponse.error) {
                  _context6.next = 8;
                  break;
                }

                if (!(0, _lodash.isEmpty)(applicationUpdateResponse.data)) {
                  _context6.next = 7;
                  break;
                }

                return _context6.abrupt("return", next());

              case 7:
                return _context6.abrupt("return", next(applicationUpdateResponse.errors));

              case 8:
                if (!(status === 4)) {
                  _context6.next = 19;
                  break;
                }

                _context6.next = 11;
                return this.service.updateMany({
                  _id: {
                    $ne: application
                  },
                  job: job,
                  status: {
                    $in: [1, 2]
                  }
                }, {
                  $set: {
                    status: 3
                  }
                });

              case 11:
                applicationRejectResponse = _context6.sent;

                if (!applicationRejectResponse.error) {
                  _context6.next = 14;
                  break;
                }

                return _context6.abrupt("return", next(applicationRejectResponse.errors));

              case 14:
                _context6.next = 16;
                return _Job["default"].updateOne({
                  _id: job,
                  status: {
                    $nin: [2]
                  }
                }, {
                  $set: {
                    status: 2
                  }
                });

              case 16:
                jobUpdateResponse = _context6.sent;

                if (!jobUpdateResponse.error) {
                  _context6.next = 19;
                  break;
                }

                return _context6.abrupt("return", next(jobUpdateResponse.errors));

              case 19:
                message = "";
                _context6.t0 = status;
                _context6.next = _context6.t0 === "1" ? 23 : _context6.t0 === "2" ? 25 : _context6.t0 === "3" ? 27 : _context6.t0 === "4" ? 29 : 31;
                break;

              case 23:
                message = "Application Status has been set to Waiting.";
                return _context6.abrupt("break", 33);

              case 25:
                message = "Application Status has been set to Withdrawn.";
                return _context6.abrupt("break", 33);

              case 27:
                message = "Application Status has been set to Rejected.";
                return _context6.abrupt("break", 33);

              case 29:
                message = "Application Status has been set to Accepted.";
                return _context6.abrupt("break", 33);

              case 31:
                message = "Application Status has been changed successfully.";
                return _context6.abrupt("break", 33);

              case 33:
                req.flash("success", message);
                res.status(applicationUpdateResponse.statusCode).redirect("back");

              case 35:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function changeStatus(_x14, _x15, _x16) {
        return _changeStatus.apply(this, arguments);
      }

      return changeStatus;
    }()
  }, {
    key: "downloadAttachment",
    value: function () {
      var _downloadAttachment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
        var attachment, attachmentReadResponse, storage_path_array, storage_path;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                attachment = req.params.attachment;
                _context7.next = 3;
                return _Attachment["default"].readOne({
                  _id: attachment
                });

              case 3:
                attachmentReadResponse = _context7.sent;

                if (!attachmentReadResponse.error) {
                  _context7.next = 8;
                  break;
                }

                if (!(0, _lodash.isEmpty)(attachmentReadResponse.data)) {
                  _context7.next = 7;
                  break;
                }

                return _context7.abrupt("return", next());

              case 7:
                return _context7.abrupt("return", next(attachmentReadResponse.errors));

              case 8:
                storage_path_array = process.env.UPLOAD_STORAGE.split("/");
                storage_path = storage_path_array.slice(0, storage_path_array.length - 1).join("/");
                res.download(_path["default"].resolve(__dirname, "../../".concat(storage_path), attachmentReadResponse.data.path), attachmentReadResponse.data.name);

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function downloadAttachment(_x17, _x18, _x19) {
        return _downloadAttachment.apply(this, arguments);
      }

      return downloadAttachment;
    }()
  }, {
    key: "withdrawApplication",
    value: function () {
      var _withdrawApplication = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
        var id, applicationUpdateResponse;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                id = req.params.id;
                _context8.next = 3;
                return this.service.updateOne({
                  _id: id,
                  status: 1
                }, {
                  $set: {
                    status: 2
                  }
                });

              case 3:
                applicationUpdateResponse = _context8.sent;

                if (!applicationUpdateResponse.error) {
                  _context8.next = 6;
                  break;
                }

                return _context8.abrupt("return", next(applicationUpdateResponse.errors));

              case 6:
                req.flash("success", "successfully withdrawn the application.");
                res.status(applicationUpdateResponse.statusCode).redirect("back");

              case 8:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function withdrawApplication(_x20, _x21, _x22) {
        return _withdrawApplication.apply(this, arguments);
      }

      return withdrawApplication;
    }()
  }]);
  return ApplicationController;
}(_Controller2["default"]);

var _default = new ApplicationController(_Application["default"]);

exports["default"] = _default;