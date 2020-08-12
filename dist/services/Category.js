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

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _lodash = require("lodash");

var _Service2 = _interopRequireDefault(require("../utilities/Service"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var CategoryService = /*#__PURE__*/function (_Service) {
  (0, _inherits2["default"])(CategoryService, _Service);

  var _super = _createSuper(CategoryService);

  function CategoryService(model) {
    var _this;

    (0, _classCallCheck2["default"])(this, CategoryService);
    _this = _super.call(this, model);
    _this.addCategory = _this.addCategory.bind((0, _assertThisInitialized2["default"])(_this));
    _this.editCategory = _this.editCategory.bind((0, _assertThisInitialized2["default"])(_this));
    _this.deleteCategory = _this.deleteCategory.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(CategoryService, [{
    key: "addCategory",
    value: function () {
      var _addCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(body) {
        var existedCategory, createdCategory, updatedParent;
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
                createdCategory = _context.sent;

                if (!createdCategory.error) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return", createdCategory);

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
                    children: createdCategory.data._id
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
                return _context.abrupt("return", createdCategory);

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
      var _deleteCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(query) {
        var readCategoryResponse, _deleteCategoryRespon, _deleteCategoryRespon2, _deleteCategoryRespon3, deleteCategoryResponse, _deleteCategoryRespon4, updateCategoryResponse;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.readOne(query);

              case 2:
                readCategoryResponse = _context2.sent;

                if (!readCategoryResponse.error) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", readCategoryResponse);

              case 5:
                if (!(0, _lodash.isEmpty)(readCategoryResponse.data)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["category not found."]
                });

              case 7:
                if (readCategoryResponse.data.children.length) {
                  _context2.next = 15;
                  break;
                }

                _context2.next = 10;
                return this.deleteOne(query);

              case 10:
                deleteCategoryResponse = _context2.sent;

                if (!(((_deleteCategoryRespon = deleteCategoryResponse.data) === null || _deleteCategoryRespon === void 0 ? void 0 : (_deleteCategoryRespon2 = _deleteCategoryRespon.parent) === null || _deleteCategoryRespon2 === void 0 ? void 0 : (_deleteCategoryRespon3 = _deleteCategoryRespon2.children) === null || _deleteCategoryRespon3 === void 0 ? void 0 : _deleteCategoryRespon3.length) <= 1)) {
                  _context2.next = 14;
                  break;
                }

                _context2.next = 14;
                return this.deleteCategory({
                  _id: (_deleteCategoryRespon4 = deleteCategoryResponse.data) === null || _deleteCategoryRespon4 === void 0 ? void 0 : _deleteCategoryRespon4.parent
                });

              case 14:
                return _context2.abrupt("return", deleteCategoryResponse);

              case 15:
                _context2.next = 17;
                return this.updateOne(query, {
                  $set: {
                    "description.en": ".xX This category has been deleted Xx.",
                    "description.ar": ".xX This category has been deleted Xx.",
                    is_deleted: true
                  }
                });

              case 17:
                updateCategoryResponse = _context2.sent;
                return _context2.abrupt("return", updateCategoryResponse);

              case 19:
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
    key: "editCategory",
    value: function () {
      var _editCategory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(query, body) {
        var existedCategory, updatedCategory;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.readOne(query);

              case 2:
                existedCategory = _context3.sent;

                if (!existedCategory.error) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", existedCategory);

              case 5:
                if (!(0, _lodash.isEmpty)(existedCategory.data)) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["Not Found"]
                });

              case 7:
                _context3.next = 9;
                return this.updateOne(query, {
                  $set: body
                });

              case 9:
                updatedCategory = _context3.sent;
                return _context3.abrupt("return", updatedCategory);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function editCategory(_x3, _x4) {
        return _editCategory.apply(this, arguments);
      }

      return editCategory;
    }()
  }]);
  return CategoryService;
}(_Service2["default"]);

exports["default"] = CategoryService;