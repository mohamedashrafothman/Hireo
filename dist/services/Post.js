"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

var _lodash = require("lodash");

var _Service2 = _interopRequireDefault(require("../utilities/Service"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Post = /*#__PURE__*/function (_Service) {
  (0, _inherits2["default"])(Post, _Service);

  var _super = _createSuper(Post);

  function Post(model) {
    var _this;

    (0, _classCallCheck2["default"])(this, Post);
    _this = _super.call(this, model);
    _this.getTags = _this.getTags.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(Post, [{
    key: "getTags",
    value: function () {
      var _getTags = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(match_query) {
        var _yield$to, _yield$to2, tagsErrors, tags;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _awaitToJs["default"])(this.model.aggregate([{
                  $match: match_query
                }, {
                  $project: {
                    tags: 1
                  }
                }, {
                  $unwind: "$tags"
                }, {
                  $group: {
                    _id: "$tags",
                    count: {
                      $sum: 1
                    }
                  }
                }, {
                  $project: {
                    _id: 0,
                    name: "$_id",
                    count: 1
                  }
                }, {
                  $sort: {
                    count: -1
                  }
                }, {
                  $limit: 20
                }]));

              case 2:
                _yield$to = _context.sent;
                _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 2);
                tagsErrors = _yield$to2[0];
                tags = _yield$to2[1];

                if (!tagsErrors) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: tagsErrors
                });

              case 8:
                return _context.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: tags
                });

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getTags(_x) {
        return _getTags.apply(this, arguments);
      }

      return getTags;
    }()
  }, {
    key: "getSinglePostPageBySlug",
    value: function () {
      var _getSinglePostPageBySlug = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(slug) {
        var _yield$to3, _yield$to4, populateRecursiveErr, populateRecursive, _yield$to5, _yield$to6, postErr, post, _yield$to7, _yield$to8, nextPostErr, nextPost, _yield$to9, _yield$to10, prevPostErr, prevPost, _yield$to11, _yield$to12, relatedPostsErr, relatedPosts;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _awaitToJs["default"])(this.constructPopulateConfigOption(3, "children", {
                  match: {
                    is_published: true,
                    is_deleted: false
                  },
                  select: "_id parent children content created_by"
                }));

              case 2:
                _yield$to3 = _context2.sent;
                _yield$to4 = (0, _slicedToArray2["default"])(_yield$to3, 2);
                populateRecursiveErr = _yield$to4[0];
                populateRecursive = _yield$to4[1];

                if (!populateRecursiveErr) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: populateRecursiveErr
                });

              case 8:
                _context2.next = 10;
                return (0, _awaitToJs["default"])(this.model.findOne({
                  slug: slug,
                  status: 1
                }).populate({
                  path: "thumbnail.sm",
                  select: "path name"
                }).populate({
                  path: "thumbnail.md",
                  select: "path name"
                }).populate({
                  path: "thumbnail.lg",
                  select: "path name"
                }).populate({
                  path: "category",
                  select: "name _id"
                }).populate({
                  path: "comments",
                  match: {
                    is_published: true,
                    is_deleted: false,
                    parent: {
                      $eq: null
                    }
                  },
                  select: "_id parent children content created_by",
                  populate: [{
                    path: "created_by",
                    select: "_id slug email account"
                  }, populateRecursive]
                }).select("slug title category tags content thumbnail created_at"));

              case 10:
                _yield$to5 = _context2.sent;
                _yield$to6 = (0, _slicedToArray2["default"])(_yield$to5, 2);
                postErr = _yield$to6[0];
                post = _yield$to6[1];

                if (!postErr) {
                  _context2.next = 16;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: postErr
                });

              case 16:
                if (!(0, _lodash.isEmpty)(post)) {
                  _context2.next = 18;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["Not Found!"]
                });

              case 18:
                _context2.next = 20;
                return (0, _awaitToJs["default"])(this.model.findOne({
                  _id: {
                    $gt: post._id
                  },
                  status: 1
                }).populate({
                  path: "thumbnail.sm",
                  select: "path name"
                }).populate({
                  path: "thumbnail.md",
                  select: "path name"
                }).populate({
                  path: "thumbnail.lg",
                  select: "path name"
                }).populate({
                  path: "category",
                  select: "name _id"
                }).select("slug title category tags content thumbnail created_at"));

              case 20:
                _yield$to7 = _context2.sent;
                _yield$to8 = (0, _slicedToArray2["default"])(_yield$to7, 2);
                nextPostErr = _yield$to8[0];
                nextPost = _yield$to8[1];

                if (!nextPostErr) {
                  _context2.next = 26;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: nextPostErr
                });

              case 26:
                _context2.next = 28;
                return (0, _awaitToJs["default"])(this.model.findOne({
                  _id: {
                    $lt: post._id
                  },
                  status: 1
                }).populate({
                  path: "thumbnail.sm",
                  select: "path name"
                }).populate({
                  path: "thumbnail.md",
                  select: "path name"
                }).populate({
                  path: "thumbnail.lg",
                  select: "path name"
                }).populate({
                  path: "category",
                  select: "name _id"
                }).select("slug title category tags content thumbnail created_at"));

              case 28:
                _yield$to9 = _context2.sent;
                _yield$to10 = (0, _slicedToArray2["default"])(_yield$to9, 2);
                prevPostErr = _yield$to10[0];
                prevPost = _yield$to10[1];

                if (!prevPostErr) {
                  _context2.next = 34;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: prevPostErr
                });

              case 34:
                _context2.next = 36;
                return (0, _awaitToJs["default"])(this.model.find({
                  _id: {
                    $ne: post._id
                  },
                  status: 1,
                  $or: [{
                    category: post.category._id
                  }, {
                    tags: {
                      $in: post.tags
                    }
                  }]
                }).populate({
                  path: "thumbnail.sm",
                  select: "path name"
                }).populate({
                  path: "thumbnail.md",
                  select: "path name"
                }).populate({
                  path: "thumbnail.lg",
                  select: "path name"
                }).populate({
                  path: "category",
                  select: "name _id"
                }).select("slug title category tags content thumbnail created_at").limit(2));

              case 36:
                _yield$to11 = _context2.sent;
                _yield$to12 = (0, _slicedToArray2["default"])(_yield$to11, 2);
                relatedPostsErr = _yield$to12[0];
                relatedPosts = _yield$to12[1];

                if (!relatedPostsErr) {
                  _context2.next = 42;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: relatedPostsErr
                });

              case 42:
                return _context2.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: {
                    post: post,
                    nextPost: nextPost,
                    prevPost: prevPost,
                    relatedPosts: relatedPosts
                  }
                });

              case 43:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getSinglePostPageBySlug(_x2) {
        return _getSinglePostPageBySlug.apply(this, arguments);
      }

      return getSinglePostPageBySlug;
    }()
  }, {
    key: "getTrendingPostsByViews",
    value: function () {
      var _getTrendingPostsByViews = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var _options$query, _options$query2;

        var options,
            _yield$to13,
            _yield$to14,
            postsErr,
            posts,
            _args3 = arguments;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {
                  limit: 10,
                  days: 1
                };
                _context3.next = 3;
                return (0, _awaitToJs["default"])(this.model.aggregate([{
                  $match: _objectSpread(_objectSpread({}, ((_options$query = options.query) === null || _options$query === void 0 ? void 0 : _options$query.q) && {
                    $or: [{
                      title: {
                        $regex: options.query.q.split(" ").filter(Boolean).join("|") || "",
                        $options: "i"
                      }
                    }, {
                      content: {
                        $regex: options.query.q.split(" ").filter(Boolean).join("|") || "",
                        $options: "i"
                      }
                    }]
                  }), ((_options$query2 = options.query) === null || _options$query2 === void 0 ? void 0 : _options$query2.tags) && options.query.tags.length && {
                    tags: {
                      $in: options.query.tags
                    }
                  })
                }, {
                  $lookup: {
                    from: "devices",
                    localField: "views.devices",
                    foreignField: "_id",
                    as: "views.devices"
                  }
                }, {
                  $unwind: "$views.devices"
                }, {
                  $match: {
                    "views.devices.created_at": {
                      $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * options.days),
                      $lte: new Date()
                    }
                  }
                }, {
                  $project: {
                    _id: 1,
                    created_at: 1,
                    "views.count": 1,
                    "views.devices._id": 1,
                    "views.devices.created_at": 1
                  }
                }, {
                  $group: {
                    _id: {
                      post: "$_id",
                      day: {
                        $dayOfMonth: "$views.devices.created_at"
                      },
                      month: {
                        $month: "$views.devices.created_at"
                      },
                      year: {
                        $year: "$views.devices.created_at"
                      }
                    },
                    views_count: {
                      $sum: 1
                    }
                  }
                }, {
                  $sort: {
                    views_count: -1,
                    "_id.day": -1
                  }
                }, {
                  $group: {
                    _id: "$_id.post",
                    views_count: {
                      $sum: "$views_count"
                    },
                    average_views: {
                      $avg: "$views_count"
                    },
                    views: {
                      $push: "$views_count"
                    }
                  }
                }, {
                  $project: {
                    _id: 1,
                    views_count: 1,
                    average_views: 1,
                    standard_deviation: {
                      $stdDevSamp: "$views"
                    }
                  }
                }, {
                  $project: {
                    _id: 1,
                    views_count: 1,
                    zScore: {
                      $cond: [{
                        $eq: ["$standard_deviation", 0]
                      }, 0, {
                        $divide: [{
                          $subtract: ["$views_count", "$average_views"]
                        }, "$standard_deviation"]
                      }]
                    }
                  }
                }, // uncomment this to enforce sorting from highest zScore to lowest, unless it will be shuffled.
                // { $sort: { zScore: -1 } },
                {
                  $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "post"
                  }
                }, {
                  $unwind: "$post"
                }, {
                  $limit: options.limit
                }, {
                  $lookup: {
                    from: "attachments",
                    "let": {
                      id: "$post.thumbnail.sm"
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$id"]
                        }
                      }
                    }, {
                      $project: {
                        _id: 1,
                        path: 1,
                        name: 1
                      }
                    }],
                    as: "post.thumbnail.sm"
                  }
                }, {
                  $unwind: "$post.thumbnail.sm"
                }, {
                  $lookup: {
                    from: "attachments",
                    "let": {
                      id: "$post.thumbnail.md"
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$id"]
                        }
                      }
                    }, {
                      $project: {
                        _id: 1,
                        path: 1,
                        name: 1
                      }
                    }],
                    as: "post.thumbnail.md"
                  }
                }, {
                  $unwind: "$post.thumbnail.md"
                }, {
                  $lookup: {
                    from: "attachments",
                    "let": {
                      id: "$post.thumbnail.lg"
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$id"]
                        }
                      }
                    }, {
                      $project: {
                        _id: 1,
                        path: 1,
                        name: 1
                      }
                    }],
                    as: "post.thumbnail.lg"
                  }
                }, {
                  $unwind: "$post.thumbnail.lg"
                }]));

              case 3:
                _yield$to13 = _context3.sent;
                _yield$to14 = (0, _slicedToArray2["default"])(_yield$to13, 2);
                postsErr = _yield$to14[0];
                posts = _yield$to14[1];

                if (!postsErr) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: postsErr
                });

              case 9:
                return _context3.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: posts
                });

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getTrendingPostsByViews() {
        return _getTrendingPostsByViews.apply(this, arguments);
      }

      return getTrendingPostsByViews;
    }()
  }]);
  return Post;
}(_Service2["default"]);

exports["default"] = Post;