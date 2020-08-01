"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _multer = _interopRequireDefault(require("multer"));

var _lodash = require("lodash");

var _expressValidator = require("express-validator");

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _Helper = _interopRequireDefault(require("../utilities/Helper"));

var _Job = _interopRequireDefault(require("../models/Job.model"));

var _User = _interopRequireDefault(require("../models/User.model"));

var _Job_type = _interopRequireDefault(require("../models/Job_type.model"));

var _Category = _interopRequireDefault(require("../models/Category.model"));

var _Attachment = _interopRequireDefault(require("../models/Attachment.model"));

var _Application = _interopRequireDefault(require("../models/Application.model"));

var _Job2 = _interopRequireDefault(require("../services/Job"));

var _User2 = _interopRequireDefault(require("../services/User"));

var _JobTypeService = _interopRequireDefault(require("../services/JobTypeService"));

var _Category2 = _interopRequireDefault(require("../services/Category"));

var _Attachment2 = _interopRequireDefault(require("../services/Attachment"));

var _Application2 = _interopRequireDefault(require("../services/Application"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var jobService = new _Job2["default"](_Job["default"]);
var userService = new _User2["default"](_User["default"]);
var jobTypeService = new _JobTypeService["default"](_Job_type["default"]);
var categoryService = new _Category2["default"](_Category["default"]);
var attachmentService = new _Attachment2["default"](_Attachment["default"]);
var applicationService = new _Application2["default"](_Application["default"]);
var helper = new _Helper["default"]();

var JobController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(JobController, _Controller);

  var _super = _createSuper(JobController);

  function JobController(service) {
    var _this;

    (0, _classCallCheck2["default"])(this, JobController);
    _this = _super.call(this, service);
    _this.getJobsLists = _this.getJobsLists.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getAddJob = _this.getAddJob.bind((0, _assertThisInitialized2["default"])(_this));
    _this.uploadAttachments = _this.uploadAttachments.bind((0, _assertThisInitialized2["default"])(_this));
    _this.addJob = _this.addJob.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getEdit = _this.getEdit.bind((0, _assertThisInitialized2["default"])(_this));
    _this.editJob = _this.editJob.bind((0, _assertThisInitialized2["default"])(_this));
    _this.deleteJob = _this.deleteJob.bind((0, _assertThisInitialized2["default"])(_this));
    _this.refreshJob = _this.refreshJob.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getAllJobApplications = _this.getAllJobApplications.bind((0, _assertThisInitialized2["default"])(_this));
    _this.browseAllJobs = _this.browseAllJobs.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getJobPage = _this.getJobPage.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(JobController, [{
    key: "validator",
    value: function validator(method) {
      switch (method) {
        case "add job":
        case "edit job":
          return [(0, _expressValidator.body)("title").notEmpty().withMessage("Job title can't be empty!").trim().escape(), (0, _expressValidator.body)("type").notEmpty().withMessage("Job type can't be empty!"), (0, _expressValidator.body)("category").notEmpty().withMessage("Job category can't be empty!"), (0, _expressValidator.body)("location.address").notEmpty().withMessage("Job location can't be empty!").trim().escape(), (0, _expressValidator.body)("salary.min").notEmpty().withMessage("Job minimum salary can't be empty!"), (0, _expressValidator.body)("salary.max").notEmpty().withMessage("Job maximum salary can't be empty!").custom(function (value, _ref) {
            var req = _ref.req;
            return Number(value) > Number(req.body["salary.min"]);
          }).withMessage("Salary maximum value can't be less than minimum value."), (0, _expressValidator.body)("tags").optional().isArray({
            min: 1,
            max: 10
          }).withMessage("Skills count shall be between 1 and 10"), (0, _expressValidator.body)("description").optional().trim().escape()];

        default:
          return [];
      }
    }
  }, {
    key: "getJobsLists",
    value: function () {
      var _getJobsLists = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var _req$query;

        var query, options, jobsListResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = _objectSpread(_objectSpread({}, ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.q) && {
                  $or: [{
                    title: {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, // { status: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
                  {
                    description: {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }]
                }), req.user.role !== "admin" && {
                  created_by: req.user._id
                });
                options = _objectSpread({
                  populate: [{
                    path: "created_by",
                    populate: [{
                      path: "account.picture",
                      select: "-_id path"
                    }, {
                      path: "account.picture_sm",
                      select: "-_id path"
                    }, {
                      path: "account.picture_md",
                      select: "-_id path"
                    }, {
                      path: "account.picture_lg",
                      select: "-_id path"
                    }]
                  }]
                }, req.query);
                _context.next = 4;
                return this.service.readMany(query, options);

              case 4:
                jobsListResponse = _context.sent;

                if (!jobsListResponse.error) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", next(jobsListResponse.errors));

              case 7:
                if (!(!jobsListResponse.data.length && jobsListResponse.offset === undefined && jobsListResponse.page !== 1)) {
                  _context.next = 10;
                  break;
                }

                req.flash("info", "Hey! you asked for page ".concat(req.query.page || 1, ". But that dosen't exist. So i put you on page ").concat(jobsListResponse.pages, "."));
                return _context.abrupt("return", res.status(jobsListResponse.statusCode).redirect("/dashboard/jobs/list?page=".concat(jobsListResponse.pages)));

              case 10:
                res.render("dashboard/jobs/list", _objectSpread(_objectSpread({
                  page_title: "Manage All Jobs"
                }, jobsListResponse), {}, {
                  data: {
                    jobs: jobsListResponse.data
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

      function getJobsLists(_x, _x2, _x3) {
        return _getJobsLists.apply(this, arguments);
      }

      return getJobsLists;
    }()
  }, {
    key: "getAddJob",
    value: function () {
      var _getAddJob = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var categoriesListResponse, jobTypeListResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return categoryService.readMany({
                  parent: {
                    $exists: false
                  },
                  is_deleted: false
                }, {
                  pagination: false
                });

              case 2:
                categoriesListResponse = _context2.sent;

                if (!categoriesListResponse.error) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", next(categoriesListResponse.errors));

              case 5:
                _context2.next = 7;
                return jobTypeService.readMany({}, {
                  select: "name",
                  pagination: false
                });

              case 7:
                jobTypeListResponse = _context2.sent;

                if (!jobTypeListResponse.error) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", next(jobTypeListResponse.errors));

              case 10:
                res.render("dashboard/jobs/add", {
                  page_title: "Post a Job",
                  data: {
                    jobTypes: jobTypeListResponse.data,
                    categories: categoriesListResponse.data
                  }
                });

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getAddJob(_x4, _x5, _x6) {
        return _getAddJob.apply(this, arguments);
      }

      return getAddJob;
    }()
  }, {
    key: "uploadAttachments",
    value: function () {
      var _uploadAttachments = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var storageEngine, attachmentUpload;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                storageEngine = attachmentService.initStorageEngine({
                  accept: ["application", "image"],
                  square: false,
                  fileHashName: false,
                  upload_path: "".concat(process.env.UPLOAD_STORAGE, "/jobs/").concat(new Date().getFullYear(), "/").concat(new Date().getMonth() + 1, "/").concat(new Date().getDate(), "/").concat(req.user._id),
                  upload_base_path: "/".concat(req.user._id)
                });
                attachmentUpload = (0, _multer["default"])({
                  storage: storageEngine,
                  limits: {
                    files: 2,
                    // allow only 2 files per request
                    fileSize: 1024 * 1024 * Number(process.env.ATTATCHMENT_MAX_SIZE_IN_MB) // 5 MB (max file size)

                  },
                  fileFilter: function fileFilter(request, file, cb) {
                    // supported image file mimetypes
                    var isFileTypeValid = storageEngine.options.accept.includes(file.mimetype.split("/")[0]);

                    if (isFileTypeValid) {
                      // allow supported image files
                      cb(null, true);
                    } else {
                      // throw error for invalid files
                      cb(new Error("That fileType isn't allowed! "));
                    }
                  }
                });
                attachmentUpload.array("attachments")(req, res, /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err) {
                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!err) {
                              _context3.next = 3;
                              break;
                            }

                            req.flash("error", err.message);
                            return _context3.abrupt("return", res.redirect("back"));

                          case 3:
                            req.body.files = req.files;
                            next();

                          case 5:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x10) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function uploadAttachments(_x7, _x8, _x9) {
        return _uploadAttachments.apply(this, arguments);
      }

      return uploadAttachments;
    }()
  }, {
    key: "addJob",
    value: function () {
      var _addJob = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var errors, err, categoriesListResponse, jobTypeListResponse, savedAttachments, port, base, files, i, fileCreationResponse, jobCreationResponse, categoryUpdatedResponse, updatedUserResponse;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context5.next = 15;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                _context5.next = 6;
                return categoryService.readMany({
                  parent: {
                    $exists: false
                  },
                  is_deleted: false
                }, {
                  pagination: false
                });

              case 6:
                categoriesListResponse = _context5.sent;

                if (!categoriesListResponse.error) {
                  _context5.next = 9;
                  break;
                }

                return _context5.abrupt("return", next(categoriesListResponse.errors));

              case 9:
                _context5.next = 11;
                return jobTypeService.readMany({}, {
                  select: "name",
                  pagination: false
                });

              case 11:
                jobTypeListResponse = _context5.sent;

                if (!jobTypeListResponse.error) {
                  _context5.next = 14;
                  break;
                }

                return _context5.abrupt("return", next(jobTypeListResponse.errors));

              case 14:
                return _context5.abrupt("return", res.render("dashboard/jobs/add", {
                  page_title: "Post a Job",
                  data: {
                    old: req.body,
                    jobTypes: jobTypeListResponse.data,
                    categories: categoriesListResponse.data
                  }
                }));

              case 15:
                savedAttachments = [];

                if (!req.body.files.length) {
                  _context5.next = 31;
                  break;
                }

                port = req.app.get("port");
                base = "".concat(req.protocol, "://").concat(req.hostname).concat(port ? ":".concat(port) : "");
                files = attachmentService.handelFilesForDBCreation(req.body.files, base);
                i = 0;

              case 21:
                if (!(i < files.length)) {
                  _context5.next = 31;
                  break;
                }

                _context5.next = 24;
                return attachmentService.create(files[i]);

              case 24:
                fileCreationResponse = _context5.sent;

                if (!fileCreationResponse.error) {
                  _context5.next = 27;
                  break;
                }

                return _context5.abrupt("return", next(fileCreationResponse.errors));

              case 27:
                savedAttachments.push(fileCreationResponse.data[0]);

              case 28:
                i++;
                _context5.next = 21;
                break;

              case 31:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  created_by: req.user._id
                }, savedAttachments.length && {
                  attachments: savedAttachments.map(function (attach) {
                    return attach._id;
                  })
                });
                _context5.next = 34;
                return this.service.create(req.body);

              case 34:
                jobCreationResponse = _context5.sent;

                if (!jobCreationResponse.error) {
                  _context5.next = 37;
                  break;
                }

                return _context5.abrupt("return", next(jobCreationResponse.errors));

              case 37:
                _context5.next = 39;
                return categoryService.updateOne({
                  _id: jobCreationResponse.data.category
                }, {
                  $addToSet: {
                    jobs: jobCreationResponse.data._id
                  }
                });

              case 39:
                categoryUpdatedResponse = _context5.sent;

                if (!categoryUpdatedResponse.error) {
                  _context5.next = 42;
                  break;
                }

                return _context5.abrupt("return", categoryUpdatedResponse);

              case 42:
                _context5.next = 44;
                return userService.updateOne({
                  _id: req.user._id
                }, {
                  $addToSet: {
                    jobs: jobCreationResponse.data._id
                  }
                });

              case 44:
                updatedUserResponse = _context5.sent;

                if (!updatedUserResponse.error) {
                  _context5.next = 47;
                  break;
                }

                return _context5.abrupt("return", updatedUserResponse);

              case 47:
                req.flash("success", "New Job added successfully");
                res.status(jobCreationResponse.statusCode).redirect("/dashboard/jobs/list");

              case 49:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function addJob(_x11, _x12, _x13) {
        return _addJob.apply(this, arguments);
      }

      return addJob;
    }()
  }, {
    key: "getEdit",
    value: function () {
      var _getEdit = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
        var categoriesListResponse, jobTypeListResponse, jobResponse;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return categoryService.readMany({
                  parent: {
                    $exists: false
                  },
                  is_deleted: false
                }, {
                  pagination: false
                });

              case 2:
                categoriesListResponse = _context6.sent;

                if (!categoriesListResponse.error) {
                  _context6.next = 5;
                  break;
                }

                return _context6.abrupt("return", next(categoriesListResponse.errors));

              case 5:
                _context6.next = 7;
                return jobTypeService.readMany({}, {
                  select: "name",
                  pagination: false
                });

              case 7:
                jobTypeListResponse = _context6.sent;

                if (!jobTypeListResponse.error) {
                  _context6.next = 10;
                  break;
                }

                return _context6.abrupt("return", next(jobTypeListResponse.errors));

              case 10:
                _context6.next = 12;
                return this.service.readOne(_objectSpread({
                  slug: req.params.slug
                }, req.user.role !== "admin" && {
                  created_by: req.user._id
                }));

              case 12:
                jobResponse = _context6.sent;

                if (!jobResponse.error) {
                  _context6.next = 15;
                  break;
                }

                return _context6.abrupt("return", next(jobResponse.errors));

              case 15:
                if (!(0, _lodash.isEmpty)(jobResponse.data)) {
                  _context6.next = 17;
                  break;
                }

                return _context6.abrupt("return", next());

              case 17:
                res.render("dashboard/jobs/edit", {
                  page_title: "Edit a Job",
                  data: {
                    job: jobResponse.data,
                    jobTypes: jobTypeListResponse.data,
                    categories: categoriesListResponse.data
                  }
                });

              case 18:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getEdit(_x14, _x15, _x16) {
        return _getEdit.apply(this, arguments);
      }

      return getEdit;
    }()
  }, {
    key: "editJob",
    value: function () {
      var _editJob = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
        var errors, err, categoriesListResponse, jobTypeListResponse, jobResponse, savedAttachments, port, base, files, i, fileCreationResponse, tags, jobUpdateResponse, categoryUpdatedResponse, userUpdateResponse;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context7.next = 22;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                _context7.next = 6;
                return categoryService.readMany({
                  parent: {
                    $exists: false
                  },
                  is_deleted: false
                }, {
                  pagination: false
                });

              case 6:
                categoriesListResponse = _context7.sent;

                if (!categoriesListResponse.error) {
                  _context7.next = 9;
                  break;
                }

                return _context7.abrupt("return", next(categoriesListResponse.errors));

              case 9:
                _context7.next = 11;
                return jobTypeService.readMany({}, {
                  select: "name",
                  pagination: false
                });

              case 11:
                jobTypeListResponse = _context7.sent;

                if (!jobTypeListResponse.error) {
                  _context7.next = 14;
                  break;
                }

                return _context7.abrupt("return", next(jobTypeListResponse.errors));

              case 14:
                _context7.next = 16;
                return this.service.readOne(_objectSpread({
                  slug: req.params.slug
                }, req.user.role !== "admin" && {
                  created_by: req.user._id
                }));

              case 16:
                jobResponse = _context7.sent;

                if (!jobResponse.error) {
                  _context7.next = 19;
                  break;
                }

                return _context7.abrupt("return", next(jobResponse.errors));

              case 19:
                if (!(0, _lodash.isEmpty)(jobResponse.data)) {
                  _context7.next = 21;
                  break;
                }

                return _context7.abrupt("return", next());

              case 21:
                return _context7.abrupt("return", res.render("dashboard/jobs/edit", {
                  page_title: "Edit a Job",
                  data: {
                    job: jobResponse,
                    jobTypes: jobTypeListResponse.data,
                    categories: categoriesListResponse.data
                  }
                }));

              case 22:
                savedAttachments = [];

                if (!req.body.files.length) {
                  _context7.next = 38;
                  break;
                }

                port = req.app.get("port");
                base = "".concat(req.protocol, "://").concat(req.hostname).concat(port ? ":".concat(port) : "");
                files = attachmentService.handelFilesForDBCreation(req.body.files, base);
                i = 0;

              case 28:
                if (!(i < files.length)) {
                  _context7.next = 38;
                  break;
                }

                _context7.next = 31;
                return attachmentService.create(files[i]);

              case 31:
                fileCreationResponse = _context7.sent;

                if (!fileCreationResponse.error) {
                  _context7.next = 34;
                  break;
                }

                return _context7.abrupt("return", next(fileCreationResponse.errors));

              case 34:
                savedAttachments.push(fileCreationResponse.data[0]);

              case 35:
                i++;
                _context7.next = 28;
                break;

              case 38:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  created_by: req.user._id
                }, savedAttachments.length && {
                  attachments: savedAttachments.map(function (attach) {
                    return attach._id;
                  })
                });
                tags = req.body.tags;
                delete req.body.tags;
                _context7.next = 43;
                return this.service.updateOne(_objectSpread({
                  slug: req.params.slug
                }, req.user.role !== "admin" && {
                  created_by: req.user._id
                }), {
                  $set: req.body,
                  $addToSet: {
                    tags: tags
                  }
                });

              case 43:
                jobUpdateResponse = _context7.sent;

                if (!jobUpdateResponse.error) {
                  _context7.next = 48;
                  break;
                }

                if (!(jobUpdateResponse.statusCode === 404)) {
                  _context7.next = 47;
                  break;
                }

                return _context7.abrupt("return", next());

              case 47:
                return _context7.abrupt("return", next(jobUpdateResponse.errors));

              case 48:
                _context7.next = 50;
                return categoryService.updateOne({
                  _id: jobUpdateResponse.data.category
                }, {
                  $addToSet: {
                    jobs: jobUpdateResponse.data._id
                  }
                });

              case 50:
                categoryUpdatedResponse = _context7.sent;

                if (!categoryUpdatedResponse.error) {
                  _context7.next = 53;
                  break;
                }

                return _context7.abrupt("return", next(categoryUpdatedResponse.errors));

              case 53:
                _context7.next = 55;
                return userService.updateOne({
                  _id: req.user._id
                }, {
                  $addToSet: {
                    jobs: jobUpdateResponse.data._id
                  }
                });

              case 55:
                userUpdateResponse = _context7.sent;

                if (!userUpdateResponse.error) {
                  _context7.next = 58;
                  break;
                }

                return _context7.abrupt("return", next(userUpdateResponse.errors));

              case 58:
                req.flash("success", "successfully updated ".concat(jobUpdateResponse.data.title, " data."));
                res.redirect("/dashboard/jobs/list");

              case 60:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function editJob(_x17, _x18, _x19) {
        return _editJob.apply(this, arguments);
      }

      return editJob;
    }()
  }, {
    key: "deleteJob",
    value: function () {
      var _deleteJob = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
        var jobDeleteResponse, categoryUpdateResponse, applicationDeleteResponse, userUpdateResponse, attachments_ids, attachmentDeleteResponse, attachmentFilesDeleteResponse;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.service.deleteOne({
                  _id: req.params.id
                });

              case 2:
                jobDeleteResponse = _context8.sent;

                if (!jobDeleteResponse.error) {
                  _context8.next = 7;
                  break;
                }

                if (!(jobDeleteResponse.statusCode === 404)) {
                  _context8.next = 6;
                  break;
                }

                return _context8.abrupt("return", next());

              case 6:
                return _context8.abrupt("return", next(jobDeleteResponse.errors));

              case 7:
                _context8.next = 9;
                return categoryService.updateOne({
                  _id: jobDeleteResponse.data.category
                }, {
                  $pull: {
                    jobs: req.params.id
                  }
                });

              case 9:
                categoryUpdateResponse = _context8.sent;

                if (!categoryUpdateResponse.error) {
                  _context8.next = 12;
                  break;
                }

                return _context8.abrupt("return", next(categoryUpdateResponse.errors));

              case 12:
                _context8.next = 14;
                return applicationService.deleteMany({
                  job: req.params.id
                });

              case 14:
                applicationDeleteResponse = _context8.sent;

                if (!applicationDeleteResponse.error) {
                  _context8.next = 17;
                  break;
                }

                return _context8.abrupt("return", next(applicationDeleteResponse.errors));

              case 17:
                _context8.next = 19;
                return userService.updateMany({
                  $or: [{
                    _id: jobDeleteResponse.data.created_by
                  }, {
                    applications: {
                      $in: applicationDeleteResponse.data.map(function (current) {
                        return current._id;
                      })
                    }
                  }, {
                    "bookmarked.job": req.params._id
                  }]
                }, {
                  $pull: {
                    jobs: req.params.id,
                    applications: {
                      $in: applicationDeleteResponse.data.map(function (current) {
                        return current._id;
                      })
                    },
                    "bookmarked.job": req.params.id
                  }
                });

              case 19:
                userUpdateResponse = _context8.sent;

                if (!userUpdateResponse.error) {
                  _context8.next = 22;
                  break;
                }

                return _context8.abrupt("return", next(userUpdateResponse.errors));

              case 22:
                // concat all of job's attachments ids and applications's attachments ids
                attachments_ids = [].concat((0, _toConsumableArray2["default"])(jobDeleteResponse.data.attachments), (0, _toConsumableArray2["default"])(applicationDeleteResponse.data.map(function (application) {
                  return application.attachment;
                })));
                _context8.next = 25;
                return attachmentService.deleteMany({
                  _id: {
                    $in: attachments_ids
                  }
                });

              case 25:
                attachmentDeleteResponse = _context8.sent;

                if (!attachmentDeleteResponse.error) {
                  _context8.next = 28;
                  break;
                }

                return _context8.abrupt("return", next(attachmentDeleteResponse.errors));

              case 28:
                _context8.next = 30;
                return attachmentService.handelFilesForDirDeletion(attachmentDeleteResponse.data.map(function (current) {
                  return current.path;
                }));

              case 30:
                attachmentFilesDeleteResponse = _context8.sent;

                if (!attachmentFilesDeleteResponse.error) {
                  _context8.next = 33;
                  break;
                }

                return _context8.abrupt("return", next(attachmentFilesDeleteResponse.errors));

              case 33:
                req.flash("success", "".concat(jobDeleteResponse.data.title, " job has been deleted!"));
                res.status(jobDeleteResponse.statusCode).redirect("back");

              case 35:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function deleteJob(_x20, _x21, _x22) {
        return _deleteJob.apply(this, arguments);
      }

      return deleteJob;
    }()
  }, {
    key: "refreshJob",
    value: function () {
      var _refreshJob = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
        var jobUpdateResponse;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.service.updateOne(_objectSpread({
                  _id: req.params.id,
                  status: 3
                }, req.user.role !== "admin" && {
                  created_by: req.user._id
                }), {
                  $set: {
                    status: 1,
                    expiring_at: +new Date() + 1000 * 60 * 60 * 24 * process.env.JOB_EXPERATION_TIME_IN_DAYS
                  },
                  $inc: {
                    refresh_count: 1
                  }
                });

              case 2:
                jobUpdateResponse = _context9.sent;

                if (!jobUpdateResponse.error) {
                  _context9.next = 5;
                  break;
                }

                return _context9.abrupt("return", next(jobUpdateResponse.errors));

              case 5:
                if (!(0, _lodash.isEmpty)(jobUpdateResponse.data)) {
                  _context9.next = 7;
                  break;
                }

                return _context9.abrupt("return", next());

              case 7:
                req.flash("success", "successfully refreshed ".concat(jobUpdateResponse.data.title, " job for another ").concat(process.env.JOB_EXPERATION_TIME_IN_DAYS, " days."));
                res.redirect("back");

              case 9:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function refreshJob(_x23, _x24, _x25) {
        return _refreshJob.apply(this, arguments);
      }

      return refreshJob;
    }()
  }, {
    key: "getAllJobApplications",
    value: function () {
      var _getAllJobApplications = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
        var jobReadResponse, query, options, applicationReadResponse, applicationSeenResponse;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.service.readOne({
                  slug: req.params.slug
                });

              case 2:
                jobReadResponse = _context10.sent;

                if (!jobReadResponse.error) {
                  _context10.next = 5;
                  break;
                }

                return _context10.abrupt("return", next(jobReadResponse.errors));

              case 5:
                if (!(0, _lodash.isEmpty)(jobReadResponse.data)) {
                  _context10.next = 7;
                  break;
                }

                return _context10.abrupt("return", next());

              case 7:
                query = {
                  job: jobReadResponse.data._id
                };
                options = _objectSpread({
                  select: "name email status attachment job created_by",
                  populate: [{
                    path: "attachment",
                    select: "path name extname"
                  }, {
                    path: "job",
                    select: "title slug"
                  }, {
                    path: "created_by",
                    select: "email slug is_verified account.name account.picture account.picture_sm account.picture_md account.picture_lg profile.nationality ",
                    populate: [{
                      path: "profile.nationality",
                      select: "name code -_id"
                    }, {
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
                  }]
                }, req.query);
                _context10.next = 11;
                return applicationService.readMany(query, options);

              case 11:
                applicationReadResponse = _context10.sent;

                if (!applicationReadResponse.error) {
                  _context10.next = 14;
                  break;
                }

                return _context10.abrupt("return", next(applicationReadResponse.errors));

              case 14:
                if (!(!applicationReadResponse.data.length && applicationReadResponse.offset === undefined && applicationReadResponse.page !== 1)) {
                  _context10.next = 17;
                  break;
                }

                req.flash("info", "Hey! you asked for page ".concat(req.query.page || 1, ". But that dosen't exist. So i put you on page ").concat(applicationReadResponse.pages, "."));
                return _context10.abrupt("return", res.status(applicationReadResponse.statusCode).redirect("/dashboard/jobs/".concat(req.params.slug, "/list?page=").concat(applicationReadResponse.pages)));

              case 17:
                if (!(req.user && req.user.role !== "admin" && req.user._id.toString() === jobReadResponse.data.created_by.toString())) {
                  _context10.next = 23;
                  break;
                }

                _context10.next = 20;
                return applicationService.updateMany({
                  _id: {
                    $in: applicationReadResponse.data.map(function (current) {
                      return current._id;
                    })
                  },
                  was_seen: false,
                  job: jobReadResponse.data._id
                }, {
                  $set: {
                    was_seen: true,
                    seen_at: +new Date()
                  }
                });

              case 20:
                applicationSeenResponse = _context10.sent;

                if (!applicationSeenResponse.error) {
                  _context10.next = 23;
                  break;
                }

                return _context10.abrupt("return", next(applicationSeenResponse.errors));

              case 23:
                res.render("dashboard/jobs/candidates", _objectSpread(_objectSpread({
                  page_title: "Manage Candidates"
                }, applicationReadResponse), {}, {
                  data: {
                    job: jobReadResponse.data,
                    applications: applicationReadResponse.data
                  },
                  query: req.query
                }));

              case 24:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getAllJobApplications(_x26, _x27, _x28) {
        return _getAllJobApplications.apply(this, arguments);
      }

      return getAllJobApplications;
    }()
  }, {
    key: "browseAllJobs",
    value: function () {
      var _browseAllJobs = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
        var _jobMinMaxResponse$da, _jobMinMaxResponse$da2;

        var categoryReadResponse, query, options, jobReadResponse, jobTypeReadResponse, jobTagsResponse, jobMinMaxResponse;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return categoryService.readMany(_objectSpread({}, req.query.categories && req.query.categories.length && {
                  $or: [{
                    _id: {
                      $in: req.query.categories
                    }
                  }, {
                    parent: {
                      $in: req.query.categories
                    }
                  }]
                }), {
                  select: "_id",
                  pagination: false
                });

              case 2:
                categoryReadResponse = _context11.sent;

                if (!categoryReadResponse.error) {
                  _context11.next = 5;
                  break;
                }

                return _context11.abrupt("return", next(categoryReadResponse.errors));

              case 5:
                query = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
                  is_published: true,
                  category: {
                    $in: categoryReadResponse.data.map(function (category) {
                      return category._id;
                    })
                  }
                }, req.query["long"] && req.query.lat && {
                  location: {
                    $geoWithin: {
                      $centerSphere: [[Number(req.query["long"]), Number(req.query.lat)], helper.kmToRadian(process.env.LOCATION_RANGE_IN_KM)]
                    }
                  }
                }), req.query.keywords && req.query.keywords.filter(Boolean).length && {
                  $or: [{
                    title: {
                      $regex: req.query.keywords.filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    description: {
                      $regex: req.query.keywords.filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }]
                }), req.query.salary && {
                  "salary.min": {
                    $gte: Number(req.query.salary.split(",")[0])
                  },
                  "salary.max": {
                    $lte: Number(req.query.salary.split(",")[1])
                  }
                }), req.query.job_types && req.query.job_types.length && {
                  type: {
                    $in: req.query.job_types
                  }
                }), req.query.tags && req.query.tags.length && {
                  tags: {
                    $in: req.query.tags
                  }
                });
                options = _objectSpread({
                  select: "slug title status created_at category location type.name created_by.account.name created_by.is_verified created_by.account.picture created_by.account.picture_sm created_by.account.picture_md created_by.account.picture_lg",
                  populate: [{
                    path: "created_by",
                    populate: [{
                      path: "account.picture",
                      select: "path -_id"
                    }, {
                      path: "account.picture_sm",
                      select: "path -_id"
                    }, {
                      path: "account.picture_md",
                      select: "path -_id"
                    }, {
                      path: "account.picture_lg",
                      select: "path -_id"
                    }]
                  }, {
                    path: "type"
                  }, {
                    path: "category"
                  }]
                }, req.query);
                _context11.next = 9;
                return this.service.readMany(query, options);

              case 9:
                jobReadResponse = _context11.sent;

                if (!jobReadResponse.error) {
                  _context11.next = 12;
                  break;
                }

                return _context11.abrupt("return", next(jobReadResponse.errors));

              case 12:
                if (!(!jobReadResponse.data.length && jobReadResponse.offset === undefined && jobReadResponse.page !== 1)) {
                  _context11.next = 15;
                  break;
                }

                req.flash("info", "Hey! you asked for page ".concat(req.query.page || 1, ". But that dosen't exist. So i put you on page ").concat(jobReadResponse.pages, "."));
                return _context11.abrupt("return", res.status(jobReadResponse.statusCode).redirect("/browse/jobs/".concat(jobReadResponse.pages)));

              case 15:
                _context11.next = 17;
                return jobTypeService.readMany({}, {
                  select: "name",
                  pagination: false
                });

              case 17:
                jobTypeReadResponse = _context11.sent;

                if (!jobTypeReadResponse.error) {
                  _context11.next = 20;
                  break;
                }

                return _context11.abrupt("return", next(jobTypeReadResponse.errors));

              case 20:
                _context11.next = 22;
                return this.service.getTags({});

              case 22:
                jobTagsResponse = _context11.sent;

                if (!jobTagsResponse.error) {
                  _context11.next = 25;
                  break;
                }

                return _context11.abrupt("return", next(jobTagsResponse.errors));

              case 25:
                _context11.next = 27;
                return this.service.getMinMax({});

              case 27:
                jobMinMaxResponse = _context11.sent;

                if (!jobMinMaxResponse.error) {
                  _context11.next = 30;
                  break;
                }

                return _context11.abrupt("return", next(jobMinMaxResponse.errors));

              case 30:
                res.render("jobs-list", _objectSpread(_objectSpread({
                  page_title: "Browse Jobs"
                }, jobReadResponse), {}, {
                  query: req.query,
                  full_url: helper.fullUrl(req),
                  data: {
                    jobTypes: jobTypeReadResponse.data,
                    tags: jobTagsResponse.data,
                    min_price: (jobMinMaxResponse === null || jobMinMaxResponse === void 0 ? void 0 : (_jobMinMaxResponse$da = jobMinMaxResponse.data[0]) === null || _jobMinMaxResponse$da === void 0 ? void 0 : _jobMinMaxResponse$da.minValue) || 0,
                    max_price: (jobMinMaxResponse === null || jobMinMaxResponse === void 0 ? void 0 : (_jobMinMaxResponse$da2 = jobMinMaxResponse.data[0]) === null || _jobMinMaxResponse$da2 === void 0 ? void 0 : _jobMinMaxResponse$da2.maxValue) || 1,
                    jobs: jobReadResponse.data
                  }
                }));

              case 31:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function browseAllJobs(_x29, _x30, _x31) {
        return _browseAllJobs.apply(this, arguments);
      }

      return browseAllJobs;
    }()
  }, {
    key: "getJobPage",
    value: function () {
      var _getJobPage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
        var _req$session$data;

        var old, jobReadBySlugResponse, categoryReadResponse, jobRelatedResponse;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                old = ((_req$session$data = req.session.data) === null || _req$session$data === void 0 ? void 0 : _req$session$data.old) || null;
                req.session.data = null;
                _context12.next = 4;
                return this.service.getBySlug(req.params.slug, req.user);

              case 4:
                jobReadBySlugResponse = _context12.sent;

                if (!jobReadBySlugResponse.error) {
                  _context12.next = 9;
                  break;
                }

                if (!(jobReadBySlugResponse.statusCode === 404)) {
                  _context12.next = 8;
                  break;
                }

                return _context12.abrupt("return", next());

              case 8:
                return _context12.abrupt("return", next(jobReadBySlugResponse.errors));

              case 9:
                _context12.next = 11;
                return categoryService.readMany({
                  $or: [{
                    _id: jobReadBySlugResponse.data.category._id
                  }, {
                    parent: {
                      $in: jobReadBySlugResponse.data.category.parent
                    }
                  }]
                }, {
                  select: "_id",
                  pagination: false
                });

              case 11:
                categoryReadResponse = _context12.sent;

                if (!categoryReadResponse.error) {
                  _context12.next = 14;
                  break;
                }

                return _context12.abrupt("return", next(categoryReadResponse.errors));

              case 14:
                _context12.next = 16;
                return this.service.readMany({
                  _id: {
                    $ne: jobReadBySlugResponse.data._id
                  },
                  $or: [{
                    category: {
                      $in: categoryReadResponse.data.map(function (category) {
                        return category._id;
                      })
                    }
                  }, {
                    type: jobReadBySlugResponse.data.type._id
                  }, {
                    location: {
                      $geoWithin: {
                        $centerSphere: [[jobReadBySlugResponse.data.location.coordinates[0], jobReadBySlugResponse.data.location.coordinates[1]], helper.kmToRadian(process.env.LOCATION_RANGE_IN_KM)]
                      }
                    }
                  }, {
                    tags: {
                      $in: jobReadBySlugResponse.data.tags
                    }
                  }, {
                    "salary.min": {
                      $gte: jobReadBySlugResponse.data.salary.min
                    },
                    "salary.max": {
                      $lte: jobReadBySlugResponse.data.salary.max
                    }
                  }]
                }, {
                  populate: [{
                    path: "created_by",
                    select: "_id rating email is_verified slug account.name account.picture account.picture_sm account.picture_md account.picture_lg profile.nationality",
                    populate: [{
                      path: "profile.nationality",
                      select: "name code -_id"
                    }, {
                      path: "account.picture",
                      select: "path -_id"
                    }, {
                      path: "account.picture_sm",
                      select: "path -_id"
                    }, {
                      path: "account.picture_md",
                      select: "path -_id"
                    }, {
                      path: "account.picture_lg",
                      select: "path -_id"
                    }]
                  }, {
                    path: "attachments",
                    select: "_id path name extname base"
                  }],
                  sort: {
                    create_at: 1
                  },
                  limit: 4
                });

              case 16:
                jobRelatedResponse = _context12.sent;

                if (!jobRelatedResponse.error) {
                  _context12.next = 19;
                  break;
                }

                return _context12.abrupt("return", next(jobRelatedResponse.errors));

              case 19:
                res.render("job", {
                  page_title: "".concat(jobReadBySlugResponse.data.title, " Page"),
                  data: {
                    job: jobReadBySlugResponse.data,
                    relatedJobs: jobRelatedResponse.data,
                    old: old
                  }
                });

              case 20:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getJobPage(_x32, _x33, _x34) {
        return _getJobPage.apply(this, arguments);
      }

      return getJobPage;
    }()
  }]);
  return JobController;
}(_Controller2["default"]);

var _default = new JobController(jobService);

exports["default"] = _default;