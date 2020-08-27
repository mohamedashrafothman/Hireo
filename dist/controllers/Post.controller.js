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

var _multer = _interopRequireDefault(require("multer"));

var _lodash = require("lodash");

var _expressValidator = require("express-validator");

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _Post = _interopRequireDefault(require("../services/Post"));

var _User = _interopRequireDefault(require("../services/User"));

var _Device = _interopRequireDefault(require("../services/Device"));

var _Category = _interopRequireDefault(require("../services/Category"));

var _Attachment = _interopRequireDefault(require("../services/Attachment"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var PostController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(PostController, _Controller);

  var _super = _createSuper(PostController);

  function PostController(service) {
    var _this;

    (0, _classCallCheck2["default"])(this, PostController);
    _this = _super.call(this, service);
    _this.browseAllPosts = _this.browseAllPosts.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getPostPage = _this.getPostPage.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getPostsList = _this.getPostsList.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getAddPosts = _this.getAddPosts.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getEditPosts = _this.getEditPosts.bind((0, _assertThisInitialized2["default"])(_this));
    _this.uploadAttachment = _this.uploadAttachment.bind((0, _assertThisInitialized2["default"])(_this));
    _this.addPost = _this.addPost.bind((0, _assertThisInitialized2["default"])(_this));
    _this.editPost = _this.editPost.bind((0, _assertThisInitialized2["default"])(_this));
    _this.deletePost = _this.deletePost.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(PostController, [{
    key: "validator",
    value: function validator(method) {
      switch (method) {
        case "add post":
        case "edit post":
          return [(0, _expressValidator.body)("title").notEmpty().withMessage("Post title can't be empty!").trim().escape(), (0, _expressValidator.body)("content").notEmpty().withMessage("Post content can't be empty!").trim().escape(), (0, _expressValidator.body)("category").notEmpty().withMessage("Job category can't be empty!"), (0, _expressValidator.body)("tags").isArray({
            min: 1,
            max: 10
          }).withMessage("Tags count shall be 10 tag")];

        default:
          return [];
      }
    }
  }, {
    key: "browseAllPosts",
    value: function () {
      var _browseAllPosts = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var query, recentPostsReadResponse, getTrendingPostsByViewsResponse, trends, postsTagsReadResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = req.query;
                _context.next = 3;
                return this.service.readMany(_objectSpread(_objectSpread({}, (query === null || query === void 0 ? void 0 : query.q) && {
                  $or: [{
                    title: {
                      $regex: query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    content: {
                      $regex: query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }]
                }), (query === null || query === void 0 ? void 0 : query.tags) && query.tags.length && {
                  tags: {
                    $in: query.tags
                  }
                }), _objectSpread({
                  select: "title tags content thumbnail _id created_by created_at slug",
                  populate: [{
                    path: "category",
                    select: "name"
                  }, {
                    path: "thumbnail.sm",
                    select: "path name _id"
                  }, {
                    path: "thumbnail.md",
                    select: "path name _id"
                  }, {
                    path: "thumbnail.lg",
                    select: "path name _id"
                  }]
                }, query));

              case 3:
                recentPostsReadResponse = _context.sent;

                if (!recentPostsReadResponse.error) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", next(recentPostsReadResponse.errors));

              case 6:
                _context.next = 8;
                return this.service.getTrendingPostsByViews({
                  limit: 3,
                  days: 30,
                  query: query
                });

              case 8:
                getTrendingPostsByViewsResponse = _context.sent;

                if (!getTrendingPostsByViewsResponse.error) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", next(getTrendingPostsByViewsResponse.errors));

              case 11:
                trends = getTrendingPostsByViewsResponse.data.map(function (item) {
                  return _objectSpread({
                    views_count: item.views_count,
                    zScore: item.zScore
                  }, item.post);
                });
                _context.next = 14;
                return this.service.getTags({});

              case 14:
                postsTagsReadResponse = _context.sent;

                if (!postsTagsReadResponse.error) {
                  _context.next = 17;
                  break;
                }

                return _context.abrupt("return", next(postsTagsReadResponse.errors));

              case 17:
                res.render("blog-list", _objectSpread(_objectSpread({
                  title: "Browse Blog Posts"
                }, recentPostsReadResponse), {}, {
                  data: {
                    posts: {
                      recent: recentPostsReadResponse.data,
                      trends: trends
                    },
                    tags: postsTagsReadResponse.data
                  },
                  query: query
                }));

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function browseAllPosts(_x, _x2, _x3) {
        return _browseAllPosts.apply(this, arguments);
      }

      return browseAllPosts;
    }()
  }, {
    key: "getPostPage",
    value: function () {
      var _getPostPage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var slug, getSinglePostBySlugResponse, getTrendingPostsByViewsResponse, trends, postsTagsReadResponse, client_ip, deviceReadResponse, devicesCreateResponse, postUpdateResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                slug = req.params.slug;
                _context2.next = 3;
                return this.service.getSinglePostPageBySlug(slug);

              case 3:
                getSinglePostBySlugResponse = _context2.sent;

                if (!getSinglePostBySlugResponse.error) {
                  _context2.next = 8;
                  break;
                }

                if (!(getSinglePostBySlugResponse.statusCode === 404)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", next());

              case 7:
                return _context2.abrupt("return", next(getSinglePostBySlugResponse.errors));

              case 8:
                _context2.next = 10;
                return this.service.getTrendingPostsByViews({
                  limit: 3,
                  days: 7
                });

              case 10:
                getTrendingPostsByViewsResponse = _context2.sent;

                if (!getTrendingPostsByViewsResponse.error) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt("return", next(getTrendingPostsByViewsResponse.errors));

              case 13:
                trends = getTrendingPostsByViewsResponse.data.map(function (item) {
                  return _objectSpread({
                    views_count: item.views_count,
                    zScore: item.zScore
                  }, item.post);
                });
                _context2.next = 16;
                return this.service.getTags({});

              case 16:
                postsTagsReadResponse = _context2.sent;

                if (!postsTagsReadResponse.error) {
                  _context2.next = 19;
                  break;
                }

                return _context2.abrupt("return", next(postsTagsReadResponse.errors));

              case 19:
                // checking for user views in last month.
                client_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
                _context2.next = 22;
                return _Device["default"].readMany({
                  post: getSinglePostBySlugResponse.data.post._id,
                  ip: client_ip,
                  "browser.name": req.useragent.browser,
                  created_at: {
                    $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1),
                    // last day
                    $lte: new Date()
                  }
                }, {
                  pagination: false
                });

              case 22:
                deviceReadResponse = _context2.sent;

                if (!deviceReadResponse.error) {
                  _context2.next = 25;
                  break;
                }

                return _context2.abrupt("return", next(deviceReadResponse.errors));

              case 25:
                if (!(deviceReadResponse.data.length < 1)) {
                  _context2.next = 36;
                  break;
                }

                _context2.next = 28;
                return _Device["default"].create({
                  post: getSinglePostBySlugResponse.data.post._id,
                  ip: client_ip,
                  source: req.useragent.source,
                  browser: {
                    name: req.useragent.browser,
                    version: req.useragent.version
                  },
                  os: req.useragent.os,
                  platform: req.useragent.platform
                });

              case 28:
                devicesCreateResponse = _context2.sent;

                if (!devicesCreateResponse.error) {
                  _context2.next = 31;
                  break;
                }

                return _context2.abrupt("return", next(devicesCreateResponse.errors));

              case 31:
                _context2.next = 33;
                return this.service.updateOne({
                  _id: getSinglePostBySlugResponse.data.post._id
                }, {
                  $inc: {
                    "views.count": 1
                  },
                  $addToSet: {
                    "views.devices": devicesCreateResponse.data._id
                  }
                });

              case 33:
                postUpdateResponse = _context2.sent;

                if (!postUpdateResponse.error) {
                  _context2.next = 36;
                  break;
                }

                return _context2.abrupt("return", next(postUpdateResponse.errors));

              case 36:
                res.render("blog-single", {
                  page_title: "Blog",
                  page_subtitle: "Blog post page",
                  data: _objectSpread(_objectSpread({}, getSinglePostBySlugResponse.data), {}, {
                    trends: trends,
                    tags: postsTagsReadResponse.data
                  })
                });

              case 37:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getPostPage(_x4, _x5, _x6) {
        return _getPostPage.apply(this, arguments);
      }

      return getPostPage;
    }()
  }, {
    key: "getPostsList",
    value: function () {
      var _getPostsList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var _req$query;

        var query, options, postsReadResponse;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                query = _objectSpread(_objectSpread({}, ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.q) && {
                  $or: [{
                    title: {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    content: {
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
                _context3.next = 4;
                return this.service.readMany(query, options);

              case 4:
                postsReadResponse = _context3.sent;

                if (!postsReadResponse.error) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt("return", next(postsReadResponse.errors));

              case 7:
                if (!(!postsReadResponse.data.length && postsReadResponse.offset === undefined && postsReadResponse.page !== 1)) {
                  _context3.next = 10;
                  break;
                }

                req.flash("info", "Hey! you asked for page ".concat(req.query.page || 1, ". But that doesn't exist. So i put you on page ").concat(postsReadResponse.pages, "."));
                return _context3.abrupt("return", res.status(postsReadResponse.statusCode).redirect("/dashboard/jobs/list?page=".concat(postsReadResponse.pages)));

              case 10:
                res.render("dashboard/blogs/list", _objectSpread(_objectSpread({
                  page_title: "Manage All Posts"
                }, postsReadResponse), {}, {
                  data: {
                    posts: postsReadResponse.data
                  },
                  query: req.query
                }));

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getPostsList(_x7, _x8, _x9) {
        return _getPostsList.apply(this, arguments);
      }

      return getPostsList;
    }()
  }, {
    key: "getAddPosts",
    value: function () {
      var _getAddPosts = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var categoriesListResponse;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _Category["default"].readMany({
                  parent: {
                    $exists: false
                  }
                }, {
                  select: "id children icon name",
                  pagination: false
                });

              case 2:
                categoriesListResponse = _context4.sent;

                if (!categoriesListResponse.error) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", next(categoriesListResponse.errors));

              case 5:
                res.render("dashboard/blogs/add", {
                  page_title: "Add New Post",
                  data: {
                    categories: categoriesListResponse.data
                  }
                });

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function getAddPosts(_x10, _x11, _x12) {
        return _getAddPosts.apply(this, arguments);
      }

      return getAddPosts;
    }()
  }, {
    key: "getEditPosts",
    value: function () {
      var _getEditPosts = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var slug, categoriesListResponse, postReadResponse;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                slug = req.params.slug;
                _context5.next = 3;
                return _Category["default"].readMany({
                  parent: {
                    $exists: false
                  }
                }, {
                  select: "id children icon name",
                  pagination: false
                });

              case 3:
                categoriesListResponse = _context5.sent;

                if (!categoriesListResponse.error) {
                  _context5.next = 6;
                  break;
                }

                return _context5.abrupt("return", next(categoriesListResponse.errors));

              case 6:
                _context5.next = 8;
                return this.service.readOne(_objectSpread({
                  slug: slug
                }, req.user.role !== "admin" && {
                  created_by: req.user._id
                }));

              case 8:
                postReadResponse = _context5.sent;

                if (!postReadResponse.error) {
                  _context5.next = 11;
                  break;
                }

                return _context5.abrupt("return", next(postReadResponse.errors));

              case 11:
                if (!(0, _lodash.isEmpty)(postReadResponse.data)) {
                  _context5.next = 13;
                  break;
                }

                return _context5.abrupt("return", next());

              case 13:
                res.render("dashboard/blogs/edit", {
                  page_title: "Edit a Post",
                  data: {
                    categories: categoriesListResponse.data,
                    post: postReadResponse.data
                  }
                });

              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getEditPosts(_x13, _x14, _x15) {
        return _getEditPosts.apply(this, arguments);
      }

      return getEditPosts;
    }()
  }, {
    key: "uploadAttachment",
    value: function () {
      var _uploadAttachment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
        var storageEngine, attachmentUpload;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                storageEngine = _Attachment["default"].initStorageEngine({
                  accept: ["image"],
                  square: false,
                  responsive: true,
                  fileHashName: true,
                  quality: 2,
                  upload_path: "".concat(process.env.UPLOAD_STORAGE, "/posts/").concat(new Date().getFullYear(), "/").concat(new Date().getMonth() + 1, "/").concat(new Date().getDate(), "/").concat(req.user._id),
                  upload_base_path: "/".concat(req.user._id)
                });
                attachmentUpload = (0, _multer["default"])({
                  storage: storageEngine,
                  limits: {
                    files: 1,
                    // allow only 2 files per request
                    fileSize: 1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB) // 5 MB (max file size)

                  },
                  fileFilter: function fileFilter(request, file, cb) {
                    // supported image file mimeTypes
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
                attachmentUpload.array("thumbnail")(req, res, /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(err) {
                    return _regenerator["default"].wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            if (!err) {
                              _context6.next = 3;
                              break;
                            }

                            req.flash("error", err.message);
                            return _context6.abrupt("return", res.redirect("back"));

                          case 3:
                            req.body.files = req.files;
                            next();

                          case 5:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }));

                  return function (_x19) {
                    return _ref.apply(this, arguments);
                  };
                }());

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function uploadAttachment(_x16, _x17, _x18) {
        return _uploadAttachment.apply(this, arguments);
      }

      return uploadAttachment;
    }()
  }, {
    key: "addPost",
    value: function () {
      var _addPost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
        var errors, err, categoriesListResponse, savedAttachments, port, base, files, i, fileCreationResponse, postCreateResponse, categoryUpdatedResponse, updatedUserResponse;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context8.next = 10;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                _context8.next = 6;
                return _Category["default"].readMany({
                  parent: {
                    $exists: false
                  }
                }, {
                  select: "id children icon name",
                  pagination: false
                });

              case 6:
                categoriesListResponse = _context8.sent;

                if (!categoriesListResponse.error) {
                  _context8.next = 9;
                  break;
                }

                return _context8.abrupt("return", next(categoriesListResponse.errors));

              case 9:
                return _context8.abrupt("return", res.render("dashboard/blogs/add", {
                  page_title: "Add new Post",
                  data: {
                    old: req.body,
                    categories: categoriesListResponse.data
                  }
                }));

              case 10:
                savedAttachments = [];

                if (!req.body.files.length) {
                  _context8.next = 27;
                  break;
                }

                port = req.app.get("port");
                base = "".concat(req.protocol, "://").concat(req.hostname).concat(port ? ":".concat(port) : "");
                files = _Attachment["default"].handelFilesForDBCreation(req.body.files, base)[0];
                i = 0;

              case 16:
                if (!(i < files.length)) {
                  _context8.next = 26;
                  break;
                }

                _context8.next = 19;
                return _Attachment["default"].create(files[i]);

              case 19:
                fileCreationResponse = _context8.sent;

                if (!fileCreationResponse.error) {
                  _context8.next = 22;
                  break;
                }

                return _context8.abrupt("return", next(fileCreationResponse.errors));

              case 22:
                savedAttachments.push(fileCreationResponse.data);

              case 23:
                i++;
                _context8.next = 16;
                break;

              case 26:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  "thumbnail.lg": _Attachment["default"].options.responsive ? savedAttachments.filter(function (file) {
                    return file.path.match(/^(.+?)_lg\.(.+)$/i);
                  })[0]._id : null,
                  "thumbnail.md": _Attachment["default"].options.responsive ? savedAttachments.filter(function (file) {
                    return file.path.match(/^(.+?)_md\.(.+)$/i);
                  })[0]._id : null,
                  "thumbnail.sm": _Attachment["default"].options.responsive ? savedAttachments.filter(function (file) {
                    return file.path.match(/^(.+?)_sm\.(.+)$/i);
                  })[0]._id : null
                });

              case 27:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  tags: req.body.tags.filter(Boolean),
                  // remove null values from array
                  created_by: req.user._id
                });
                _context8.next = 30;
                return this.service.create(req.body);

              case 30:
                postCreateResponse = _context8.sent;

                if (!postCreateResponse.error) {
                  _context8.next = 33;
                  break;
                }

                return _context8.abrupt("return", next(postCreateResponse.errors));

              case 33:
                _context8.next = 35;
                return _Category["default"].updateOne({
                  _id: postCreateResponse.data.category
                }, {
                  $addToSet: {
                    posts: postCreateResponse.data._id
                  }
                });

              case 35:
                categoryUpdatedResponse = _context8.sent;

                if (!categoryUpdatedResponse.error) {
                  _context8.next = 38;
                  break;
                }

                return _context8.abrupt("return", categoryUpdatedResponse);

              case 38:
                _context8.next = 40;
                return _User["default"].updateOne({
                  _id: postCreateResponse.data.created_by
                }, {
                  $addToSet: {
                    posts: postCreateResponse.data._id
                  }
                });

              case 40:
                updatedUserResponse = _context8.sent;

                if (!updatedUserResponse.error) {
                  _context8.next = 43;
                  break;
                }

                return _context8.abrupt("return", updatedUserResponse);

              case 43:
                req.flash("success", "New Post added successfully");
                res.status(postCreateResponse.statusCode).redirect("/dashboard/posts/list");

              case 45:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function addPost(_x20, _x21, _x22) {
        return _addPost.apply(this, arguments);
      }

      return addPost;
    }()
  }, {
    key: "editPost",
    value: function () {
      var _editPost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
        var slug, errors, err, categoriesListResponse, postReadResponse, savedAttachments, port, base, files, i, fileCreationResponse, tags, postUpdateResponse, categoryUpdateResponse, userUpdateResponse;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                slug = req.params.slug;
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context9.next = 18;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                _context9.next = 7;
                return _Category["default"].readMany({
                  parent: {
                    $exists: false
                  }
                }, {
                  select: "id children icon name",
                  pagination: false
                });

              case 7:
                categoriesListResponse = _context9.sent;

                if (!categoriesListResponse.error) {
                  _context9.next = 10;
                  break;
                }

                return _context9.abrupt("return", next(categoriesListResponse.errors));

              case 10:
                _context9.next = 12;
                return this.service.readOne(_objectSpread({
                  slug: slug
                }, req.user.role !== "admin" && {
                  created_by: req.user._id
                }));

              case 12:
                postReadResponse = _context9.sent;

                if (!postReadResponse.error) {
                  _context9.next = 15;
                  break;
                }

                return _context9.abrupt("return", next(postReadResponse.errors));

              case 15:
                if (!(0, _lodash.isEmpty)(postReadResponse.data)) {
                  _context9.next = 17;
                  break;
                }

                return _context9.abrupt("return", next());

              case 17:
                return _context9.abrupt("return", res.render("dashboard/blogs/edit", {
                  page_title: "Edit a Post",
                  data: {
                    old: req.body,
                    post: postReadResponse.data,
                    categories: categoriesListResponse.data
                  }
                }));

              case 18:
                savedAttachments = [];

                if (!req.body.files.length) {
                  _context9.next = 35;
                  break;
                }

                port = req.app.get("port");
                base = "".concat(req.protocol, "://").concat(req.hostname).concat(port ? ":".concat(port) : "");
                files = _Attachment["default"].handelFilesForDBCreation(req.body.files, base)[0];
                i = 0;

              case 24:
                if (!(i < files.length)) {
                  _context9.next = 34;
                  break;
                }

                _context9.next = 27;
                return _Attachment["default"].create(files[i]);

              case 27:
                fileCreationResponse = _context9.sent;

                if (!fileCreationResponse.error) {
                  _context9.next = 30;
                  break;
                }

                return _context9.abrupt("return", next(fileCreationResponse.errors));

              case 30:
                savedAttachments.push(fileCreationResponse.data);

              case 31:
                i++;
                _context9.next = 24;
                break;

              case 34:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  "thumbnail.lg": _Attachment["default"].options.responsive ? savedAttachments.filter(function (file) {
                    return file.path.match(/^(.+?)_lg\.(.+)$/i);
                  })[0]._id : null,
                  "thumbnail.md": _Attachment["default"].options.responsive ? savedAttachments.filter(function (file) {
                    return file.path.match(/^(.+?)_md\.(.+)$/i);
                  })[0]._id : null,
                  "thumbnail.sm": _Attachment["default"].options.responsive ? savedAttachments.filter(function (file) {
                    return file.path.match(/^(.+?)_sm\.(.+)$/i);
                  })[0]._id : null
                });

              case 35:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  created_by: req.user._id
                });
                tags = req.body.tags;
                delete req.body.tags;
                _context9.next = 40;
                return this.service.updateOne(_objectSpread({
                  slug: slug
                }, req.user.role !== "admin" && {
                  created_at: req.user._id
                }), {
                  $set: req.body,
                  $addToSet: {
                    tags: tags
                  }
                });

              case 40:
                postUpdateResponse = _context9.sent;

                if (!postUpdateResponse.error) {
                  _context9.next = 45;
                  break;
                }

                if (!(postUpdateResponse.statusCode === 404)) {
                  _context9.next = 44;
                  break;
                }

                return _context9.abrupt("return", next());

              case 44:
                return _context9.abrupt("return", next(postUpdateResponse.errors));

              case 45:
                _context9.next = 47;
                return _Category["default"].updateOne({
                  _id: postUpdateResponse.data.category
                }, {
                  $addToSet: {
                    posts: postUpdateResponse.data._id
                  }
                });

              case 47:
                categoryUpdateResponse = _context9.sent;

                if (!categoryUpdateResponse.error) {
                  _context9.next = 50;
                  break;
                }

                return _context9.abrupt("return", next(categoryUpdateResponse.errors));

              case 50:
                _context9.next = 52;
                return _User["default"].updateOne({
                  _id: req.user._id
                }, {
                  $addToSet: {
                    posts: postUpdateResponse.data._id
                  }
                });

              case 52:
                userUpdateResponse = _context9.sent;

                if (!userUpdateResponse.error) {
                  _context9.next = 55;
                  break;
                }

                return _context9.abrupt("return", next(userUpdateResponse.errors));

              case 55:
                req.flash("success", "successfully updated ".concat(postUpdateResponse.data.title, " data."));
                res.status(postUpdateResponse.statusCode).redirect("/dashboard/posts/list");

              case 57:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function editPost(_x23, _x24, _x25) {
        return _editPost.apply(this, arguments);
      }

      return editPost;
    }()
  }, {
    key: "deletePost",
    value: function () {
      var _deletePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
        var id, postDeleteResponse, categoryUpdateResponse, userUpdateResponse, attachments_ids, attachmentDeleteResponse, attachmentFilesDeleteResponse, devicesDeleteResponse;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                id = req.params.id;
                _context10.next = 3;
                return this.service.deleteOne({
                  _id: id
                });

              case 3:
                postDeleteResponse = _context10.sent;

                if (!postDeleteResponse.error) {
                  _context10.next = 8;
                  break;
                }

                if (!(postDeleteResponse.statusCode === 404)) {
                  _context10.next = 7;
                  break;
                }

                return _context10.abrupt("return", next());

              case 7:
                return _context10.abrupt("return", next(postDeleteResponse.errors));

              case 8:
                _context10.next = 10;
                return _Category["default"].updateOne({
                  _id: postDeleteResponse.data.category
                }, {
                  $pull: {
                    posts: postDeleteResponse.data._id
                  }
                });

              case 10:
                categoryUpdateResponse = _context10.sent;

                if (!categoryUpdateResponse.error) {
                  _context10.next = 13;
                  break;
                }

                return _context10.abrupt("return", next(categoryUpdateResponse.errors));

              case 13:
                _context10.next = 15;
                return _User["default"].updateOne({
                  _id: postDeleteResponse.data.created_by
                }, {
                  $pull: {
                    posts: postDeleteResponse.data._id
                  }
                });

              case 15:
                userUpdateResponse = _context10.sent;

                if (!userUpdateResponse.error) {
                  _context10.next = 18;
                  break;
                }

                return _context10.abrupt("return", next(userUpdateResponse.errors));

              case 18:
                attachments_ids = [postDeleteResponse.data.thumbnail.lg, postDeleteResponse.data.thumbnail.md, postDeleteResponse.data.thumbnail.sm];
                _context10.next = 21;
                return _Attachment["default"].deleteMany({
                  _id: {
                    $in: attachments_ids
                  }
                });

              case 21:
                attachmentDeleteResponse = _context10.sent;

                if (!attachmentDeleteResponse.error) {
                  _context10.next = 24;
                  break;
                }

                return _context10.abrupt("return", next(attachmentDeleteResponse.errors));

              case 24:
                _context10.next = 26;
                return _Attachment["default"].handelFilesForDirDeletion(attachmentDeleteResponse.data.map(function (current) {
                  return current.path;
                }));

              case 26:
                attachmentFilesDeleteResponse = _context10.sent;

                if (!attachmentFilesDeleteResponse.error) {
                  _context10.next = 29;
                  break;
                }

                return _context10.abrupt("return", next(attachmentFilesDeleteResponse.errors));

              case 29:
                _context10.next = 31;
                return _Device["default"].deleteMany({
                  post: postDeleteResponse.data._id
                });

              case 31:
                devicesDeleteResponse = _context10.sent;

                if (!devicesDeleteResponse.error) {
                  _context10.next = 34;
                  break;
                }

                return _context10.abrupt("return", next(devicesDeleteResponse.errors));

              case 34:
                req.flash("success", "".concat(postDeleteResponse.data.title, " Blog Post has been deleted!"));
                res.status(postDeleteResponse.statusCode).redirect("back");

              case 36:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function deletePost(_x26, _x27, _x28) {
        return _deletePost.apply(this, arguments);
      }

      return deletePost;
    }()
  }]);
  return PostController;
}(_Controller2["default"]);

var _default = new PostController(_Post["default"]);

exports["default"] = _default;