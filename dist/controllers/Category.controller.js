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

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _multer = _interopRequireDefault(require("multer"));

var _lodash = require("lodash");

var _expressValidator = require("express-validator");

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _Icon = _interopRequireDefault(require("../services/Icon"));

var _Category = _interopRequireDefault(require("../services/Category"));

var _Attachment = _interopRequireDefault(require("../services/Attachment"));

var _Icon2 = _interopRequireDefault(require("../models/Icon.model"));

var _Category2 = _interopRequireDefault(require("../models/Category.model"));

var _Attachment2 = _interopRequireDefault(require("../models/Attachment.model"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var iconService = new _Icon["default"](_Icon2["default"]);
var categoryService = new _Category["default"](_Category2["default"]);
var attachmentService = new _Attachment["default"](_Attachment2["default"]);

var CategoryController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(CategoryController, _Controller);

  var _super = _createSuper(CategoryController);

  function CategoryController(service) {
    var _this;

    (0, _classCallCheck2["default"])(this, CategoryController);
    _this = _super.call(this, service);
    _this.uploadImage = _this.uploadImage.bind((0, _assertThisInitialized2["default"])(_this));
    _this.addCategory = _this.addCategory.bind((0, _assertThisInitialized2["default"])(_this));
    _this.editCategory = _this.editCategory.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getAddCategory = _this.getAddCategory.bind((0, _assertThisInitialized2["default"])(_this));
    _this.deleteCategory = _this.deleteCategory.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getEditCategory = _this.getEditCategory.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getCategoryList = _this.getCategoryList.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(CategoryController, [{
    key: "validator",
    value: function validator(method) {
      switch (method) {
        case "add category":
        case "edit category":
          return [(0, _expressValidator.body)("name.en").notEmpty().withMessage("Skill english name can't be empty!").trim(), (0, _expressValidator.body)("name.ar").notEmpty().withMessage("Skill arabic name can't be empty!").trim(), (0, _expressValidator.body)("description.en").notEmpty().withMessage("Skill english description can't be empty!").trim(), (0, _expressValidator.body)("description.ar").notEmpty().withMessage("Skill arabic description can't be empty!").trim(), (0, _expressValidator.body)("icon")["if"](function (value, _ref) {
            var req = _ref.req;
            return !req.body.parent;
          }).notEmpty().withMessage("For parent categories you must add an icon.")];

        default:
          return [];
      }
    }
  }, {
    key: "getAddCategory",
    value: function () {
      var _getAddCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var categoryReadResponse, iconReadResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.service.readMany({
                  is_deleted: false
                }, {
                  pagination: false,
                  sort: {
                    created_at: "asc"
                  }
                });

              case 2:
                categoryReadResponse = _context.sent;

                if (!categoryReadResponse.error) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", next(categoryReadResponse.errors));

              case 5:
                _context.next = 7;
                return iconService.readMany({}, {
                  pagination: false
                });

              case 7:
                iconReadResponse = _context.sent;

                if (!iconReadResponse.error) {
                  _context.next = 10;
                  break;
                }

                return _context.abrupt("return", next(iconReadResponse.errors));

              case 10:
                res.render("dashboard/categories/add", {
                  page_title: "Add a Category",
                  data: {
                    categories: categoryReadResponse.data,
                    icons: iconReadResponse.data
                  }
                });

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getAddCategory(_x, _x2, _x3) {
        return _getAddCategory.apply(this, arguments);
      }

      return getAddCategory;
    }()
  }, {
    key: "getEditCategory",
    value: function () {
      var _getEditCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var categoryReadResponse, categoriesReadResponse, iconsReadResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.service.readOne({
                  slug: req.params.slug,
                  is_deleted: false
                });

              case 2:
                categoryReadResponse = _context2.sent;

                if (!categoryReadResponse.error) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", next(categoryReadResponse.errors));

              case 5:
                if (!(0, _lodash.isEmpty)(categoryReadResponse.data)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", next());

              case 7:
                _context2.next = 9;
                return this.service.readMany({
                  _id: {
                    $ne: categoryReadResponse.data._id
                  }
                }, {
                  pagination: false,
                  sort: {
                    created_at: "asc"
                  }
                });

              case 9:
                categoriesReadResponse = _context2.sent;

                if (!categoriesReadResponse.error) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt("return", next(categoriesReadResponse.errors));

              case 12:
                _context2.next = 14;
                return iconService.readMany({}, {
                  pagination: false
                });

              case 14:
                iconsReadResponse = _context2.sent;

                if (!iconsReadResponse.error) {
                  _context2.next = 17;
                  break;
                }

                return _context2.abrupt("return", next(iconsReadResponse.errors));

              case 17:
                res.render("dashboard/categories/edit", {
                  page_title: "Edit a Category",
                  data: {
                    category: categoryReadResponse.data,
                    categories: categoriesReadResponse.data,
                    icons: iconsReadResponse.data
                  }
                });

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getEditCategory(_x4, _x5, _x6) {
        return _getEditCategory.apply(this, arguments);
      }

      return getEditCategory;
    }()
  }, {
    key: "getCategoryList",
    value: function () {
      var _getCategoryList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var categoryReadResponse;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.service.readMany({
                  parent: {
                    $exists: false
                  }
                }, {
                  pagination: false,
                  sort: {
                    created_at: "asc"
                  }
                });

              case 2:
                categoryReadResponse = _context3.sent;

                if (!categoryReadResponse.error) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", next(categoryReadResponse.errors));

              case 5:
                res.render("dashboard/categories/list", {
                  page_title: "Manage All Categories",
                  data: {
                    categories: categoryReadResponse.data
                  }
                });

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getCategoryList(_x7, _x8, _x9) {
        return _getCategoryList.apply(this, arguments);
      }

      return getCategoryList;
    }()
  }, {
    key: "uploadImage",
    value: function () {
      var _uploadImage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var _this2 = this;

        var storageEngine, imageUpload;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                storageEngine = attachmentService.initStorageEngine({
                  accept: ["image"],
                  square: true,
                  quality: 50,
                  fileHashName: true,
                  upload_path: "".concat(process.env.UPLOAD_STORAGE, "/categories"),
                  upload_base_path: ""
                });
                imageUpload = (0, _multer["default"])({
                  storage: storageEngine,
                  limits: {
                    files: 1,
                    // allow only 1 file per request
                    fileSize: 1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB) // 5 MB (max file size)

                  },
                  fileFilter: function fileFilter(request, file, cb) {
                    // supported image file mimeTypes
                    var isFileTypeValid = file.mimetype.startsWith(storageEngine.options.accept);

                    if (isFileTypeValid) {
                      // allow supported image files
                      cb(null, true);
                    } else {
                      // throw error for invalid files
                      cb(new Error("That fileType isn't allowed! "));
                    }
                  }
                });
                imageUpload.single("picture")(req, res, /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(err) {
                    var categoryReadResponse, iconReadResponse;
                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            if (!err) {
                              _context4.next = 13;
                              break;
                            }

                            _context4.next = 3;
                            return _this2.service.readMany({}, {
                              pagination: false,
                              sort: {
                                created_at: "asc"
                              }
                            });

                          case 3:
                            categoryReadResponse = _context4.sent;

                            if (!categoryReadResponse.error) {
                              _context4.next = 6;
                              break;
                            }

                            return _context4.abrupt("return", next(categoryReadResponse.errors));

                          case 6:
                            _context4.next = 8;
                            return iconService.readMany({}, {
                              pagination: false
                            });

                          case 8:
                            iconReadResponse = _context4.sent;

                            if (!iconReadResponse.error) {
                              _context4.next = 11;
                              break;
                            }

                            return _context4.abrupt("return", next(iconReadResponse.errors));

                          case 11:
                            req.flash("error", err.message);
                            return _context4.abrupt("return", res.render("dashboard/categories/add", {
                              page_title: "Add a Category",
                              data: {
                                old: req.body,
                                categories: categoryReadResponse.data,
                                icons: iconReadResponse.data
                              },
                              flashes: req.flash()
                            }));

                          case 13:
                            req.body.files = [req.file];
                            next();

                          case 15:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x13) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function uploadImage(_x10, _x11, _x12) {
        return _uploadImage.apply(this, arguments);
      }

      return uploadImage;
    }()
  }, {
    key: "addCategory",
    value: function () {
      var _addCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
        var errors, categoryReadResponse, iconReadResponse, err, savedAttachments, port, base, files, i, fileCreationResponse, categoryCreationResponse;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!req.body.parent) delete req.body.parent;
                if (!req.body.icon) delete req.body.icon;
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context6.next = 17;
                  break;
                }

                _context6.next = 6;
                return this.service.readMany({}, {
                  pagination: false,
                  sort: {
                    created_at: "asc"
                  }
                });

              case 6:
                categoryReadResponse = _context6.sent;

                if (!categoryReadResponse.error) {
                  _context6.next = 9;
                  break;
                }

                return _context6.abrupt("return", next(categoryReadResponse.errors));

              case 9:
                _context6.next = 11;
                return iconService.readMany({}, {
                  pagination: false
                });

              case 11:
                iconReadResponse = _context6.sent;

                if (!iconReadResponse.error) {
                  _context6.next = 14;
                  break;
                }

                return _context6.abrupt("return", next(iconReadResponse.errors));

              case 14:
                err = errors.array();
                req.flash("error", err);
                return _context6.abrupt("return", res.render("dashboard/categories/add", {
                  page_title: "Add a Category",
                  data: {
                    old: req.body,
                    categories: categoryReadResponse.data,
                    icons: iconReadResponse.data
                  },
                  flashes: req.flash()
                }));

              case 17:
                savedAttachments = [];

                if (!req.body.files.filter(Boolean).length) {
                  _context6.next = 34;
                  break;
                }

                port = req.app.get("port");
                base = "".concat(req.protocol, "://").concat(req.hostname).concat(port ? ":".concat(port) : "");
                files = attachmentService.handelFilesForDBCreation(req.body.files.filter(Boolean), base)[0];
                i = 0;

              case 23:
                if (!(i < files.length)) {
                  _context6.next = 33;
                  break;
                }

                _context6.next = 26;
                return attachmentService.create(files[i]);

              case 26:
                fileCreationResponse = _context6.sent;

                if (!fileCreationResponse.error) {
                  _context6.next = 29;
                  break;
                }

                return _context6.abrupt("return", next(fileCreationResponse.errors));

              case 29:
                savedAttachments.push(fileCreationResponse.data);

              case 30:
                i++;
                _context6.next = 23;
                break;

              case 33:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  picture: savedAttachments[0]._id
                });

              case 34:
                _context6.next = 36;
                return this.service.addCategory(req.body);

              case 36:
                categoryCreationResponse = _context6.sent;

                if (!categoryCreationResponse.error) {
                  _context6.next = 42;
                  break;
                }

                if (!(categoryCreationResponse.statusCode === 202)) {
                  _context6.next = 41;
                  break;
                }

                req.flash("error", categoryCreationResponse.errors);
                return _context6.abrupt("return", res.status(categoryCreationResponse.statusCode).redirect("/dashboard/categories/list"));

              case 41:
                return _context6.abrupt("return", next(categoryCreationResponse.errors));

              case 42:
                req.flash("success", "New Category added successfully");
                res.status(categoryCreationResponse.statusCode).redirect("/dashboard/categories/list");

              case 44:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function addCategory(_x14, _x15, _x16) {
        return _addCategory.apply(this, arguments);
      }

      return addCategory;
    }()
  }, {
    key: "editCategory",
    value: function () {
      var _editCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
        var errors, categoryReadResponse, iconReadResponse, err, savedAttachments, port, base, files, i, fileCreationResponse, categoryUpdateResponse;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!req.body.parent) delete req.body.parent;
                if (!req.body.icon) delete req.body.icon;
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context7.next = 17;
                  break;
                }

                _context7.next = 6;
                return this.service.readMany({}, {
                  pagination: false,
                  sort: {
                    created_at: "asc"
                  }
                });

              case 6:
                categoryReadResponse = _context7.sent;

                if (!categoryReadResponse.error) {
                  _context7.next = 9;
                  break;
                }

                return _context7.abrupt("return", next(categoryReadResponse.errors));

              case 9:
                _context7.next = 11;
                return iconService.readMany({}, {
                  pagination: false
                });

              case 11:
                iconReadResponse = _context7.sent;

                if (!iconReadResponse.error) {
                  _context7.next = 14;
                  break;
                }

                return _context7.abrupt("return", next(iconReadResponse.errors));

              case 14:
                err = errors.array();
                req.flash("error", err);
                return _context7.abrupt("return", res.render("dashboard/categories/edit", {
                  page_title: "Edit a Category",
                  data: {
                    old: req.body,
                    categories: categoryReadResponse.data,
                    icons: iconReadResponse.data
                  },
                  flashes: req.flash()
                }));

              case 17:
                savedAttachments = [];

                if (!req.body.files.filter(Boolean).length) {
                  _context7.next = 34;
                  break;
                }

                port = req.app.get("port");
                base = "".concat(req.protocol, "://").concat(req.hostname).concat(port ? ":".concat(port) : "");
                files = attachmentService.handelFilesForDBCreation(req.body.files.filter(Boolean), base)[0];
                i = 0;

              case 23:
                if (!(i < files.length)) {
                  _context7.next = 33;
                  break;
                }

                _context7.next = 26;
                return attachmentService.create(files[i]);

              case 26:
                fileCreationResponse = _context7.sent;

                if (!fileCreationResponse.error) {
                  _context7.next = 29;
                  break;
                }

                return _context7.abrupt("return", next(fileCreationResponse.errors));

              case 29:
                savedAttachments.push(fileCreationResponse.data);

              case 30:
                i++;
                _context7.next = 23;
                break;

              case 33:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  picture: savedAttachments[0]._id
                });

              case 34:
                _context7.next = 36;
                return this.service.editCategory({
                  slug: req.params.slug
                }, req.body);

              case 36:
                categoryUpdateResponse = _context7.sent;

                if (!categoryUpdateResponse.error) {
                  _context7.next = 39;
                  break;
                }

                return _context7.abrupt("return", next(categoryUpdateResponse.errors));

              case 39:
                req.flash("success", "successfully updated category.");
                res.status(categoryUpdateResponse.statusCode).redirect("/dashboard/categories/list");

              case 41:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function editCategory(_x17, _x18, _x19) {
        return _editCategory.apply(this, arguments);
      }

      return editCategory;
    }()
  }, {
    key: "deleteCategory",
    value: function () {
      var _deleteCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
        var categoryDeletionResponse;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.service.deleteCategory({
                  _id: req.params.id
                });

              case 2:
                categoryDeletionResponse = _context8.sent;

                if (!categoryDeletionResponse.error) {
                  _context8.next = 5;
                  break;
                }

                return _context8.abrupt("return", next(categoryDeletionResponse.errors));

              case 5:
                req.flash("success", "Category successfully deleted");
                res.status(categoryDeletionResponse.statusCode).redirect("/dashboard/categories/list");

              case 7:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function deleteCategory(_x20, _x21, _x22) {
        return _deleteCategory.apply(this, arguments);
      }

      return deleteCategory;
    }()
  }]);
  return CategoryController;
}(_Controller2["default"]);

var _default = new CategoryController(categoryService);

exports["default"] = _default;