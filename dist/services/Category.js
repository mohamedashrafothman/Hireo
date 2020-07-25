"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

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

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var CategoryService = /*#__PURE__*/function (_Service) {
  (0, _inherits2["default"])(CategoryService, _Service);

  var _super = _createSuper(CategoryService);

  function CategoryService(model) {
    var _this;

    (0, _classCallCheck2["default"])(this, CategoryService);
    _this = _super.call(this, model);
    _this.getEditCategoryData = _this.getEditCategoryData.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(CategoryService, [{
    key: "addCategory",
    value: function () {
      var _addCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(body) {
        var existedCategory, createdUser, updatedParent;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.readOne({
                  "name.en": body["name.en"]
                });

              case 2:
                existedCategory = _context.sent;

                if (!existedCategory.error) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", existedCategory);

              case 5:
                if ((0, _lodash.isEmpty)(existedCategory.data)) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", {
                  error: true,
                  statusCode: 202,
                  errors: ["This category already exist."]
                });

              case 7:
                _context.next = 9;
                return this.create(body);

              case 9:
                createdUser = _context.sent;

                if (!createdUser.error) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return", createdUser);

              case 12:
                if (!body.parent) {
                  _context.next = 18;
                  break;
                }

                _context.next = 15;
                return this.updateOne({
                  _id: body.parent
                }, {
                  $addToSet: {
                    children: createdUser.data._id
                  }
                });

              case 15:
                updatedParent = _context.sent;

                if (!updatedParent.error) {
                  _context.next = 18;
                  break;
                }

                return _context.abrupt("return", updatedParent);

              case 18:
                return _context.abrupt("return", createdUser);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function addCategory(_x) {
        return _addCategory.apply(this, arguments);
      }

      return addCategory;
    }()
  }, {
    key: "deleteCategory",
    value: function () {
      var _deleteCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
        var deletedCategories, updatedCategories;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.deleteMany({
                  $or: [{
                    _id: id
                  }, {
                    parent: id
                  }]
                }, {
                  pagination: false
                });

              case 2:
                deletedCategories = _context2.sent;

                if (!deletedCategories.error) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", deletedCategories);

              case 5:
                _context2.next = 7;
                return this.updateMany({
                  $or: [{
                    children: deletedCategories.data.map(function (category) {
                      return category._id;
                    })
                  }, {
                    parent: deletedCategories.data.map(function (category) {
                      return category._id;
                    })
                  }]
                }, {
                  $pull: {
                    children: deletedCategories.data.map(function (category) {
                      return category._id;
                    }),
                    parent: deletedCategories.data.map(function (category) {
                      return category._id;
                    })
                  }
                });

              case 7:
                updatedCategories = _context2.sent;

                if (!updatedCategories.error) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", updatedCategories);

              case 10:
                return _context2.abrupt("return", deletedCategories);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function deleteCategory(_x2) {
        return _deleteCategory.apply(this, arguments);
      }

      return deleteCategory;
    }()
  }, {
    key: "getEditCategoryData",
    value: function () {
      var _getEditCategoryData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(slug) {
        var _yield$to, _yield$to2, err, categories;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _awaitToJs["default"])(this.model.findOne({
                  slug: slug
                }).populate("parent children icon picture"));

              case 2:
                _yield$to = _context3.sent;
                _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 2);
                err = _yield$to2[0];
                categories = _yield$to2[1];

                if (!err) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: err
                });

              case 8:
                if (categories) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["Not Found"]
                });

              case 10:
                return _context3.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: categories
                });

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getEditCategoryData(_x3) {
        return _getEditCategoryData.apply(this, arguments);
      }

      return getEditCategoryData;
    }()
  }, {
    key: "editCategory",
    value: function () {
      var _editCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(slug, body) {
        var existedCategory, updatedCategory;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.readOne({
                  slug: slug
                });

              case 2:
                existedCategory = _context4.sent;

                if (!existedCategory.error) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", existedCategory);

              case 5:
                if (!(0, _lodash.isEmpty)(existedCategory.data)) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["Not Found"]
                });

              case 7:
                _context4.next = 9;
                return this.updateOne({
                  slug: slug
                }, {
                  $set: body
                });

              case 9:
                updatedCategory = _context4.sent;

                if (!updatedCategory.error) {
                  _context4.next = 12;
                  break;
                }

                return _context4.abrupt("return", updatedCategory);

              case 12:
                return _context4.abrupt("return", updatedCategory);

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function editCategory(_x4, _x5) {
        return _editCategory.apply(this, arguments);
      }

      return editCategory;
    }()
  }]);
  return CategoryService;
}(_Service2["default"]);

exports["default"] = CategoryService;