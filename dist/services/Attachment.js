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

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _url = _interopRequireDefault(require("url"));

var _Service2 = _interopRequireDefault(require("../utilities/Service"));

var _StorageEngine = _interopRequireDefault(require("../utilities/StorageEngine"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var AttachmentService = /*#__PURE__*/function (_Service) {
  (0, _inherits2["default"])(AttachmentService, _Service);

  var _super = _createSuper(AttachmentService);

  function AttachmentService(model) {
    var _this;

    (0, _classCallCheck2["default"])(this, AttachmentService);
    _this = _super.call(this, model);
    _this.handelFilesForDBCreation = _this.handelFilesForDBCreation.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handelFilesForDirDeletion = _this.handelFilesForDirDeletion.bind((0, _assertThisInitialized2["default"])(_this));
    _this.initStorageEngine = _this.initStorageEngine.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(AttachmentService, [{
    key: "initStorageEngine",
    value: function initStorageEngine(opts) {
      var storageEngine = new _StorageEngine["default"](opts);
      this.options = storageEngine.options;
      return storageEngine;
    }
  }, {
    key: "handelFilesForDBCreation",
    value: function handelFilesForDBCreation(files, base) {
      var _this2 = this;

      return files.map(function (file) {
        var nameParser = file.filename.split(".");

        var upload_path = _this2.options.upload_path.split(_this2.options.responsive ? _path["default"].sep : "/");

        var url_Path = function url_Path(size) {
          return _path["default"].join("".concat(upload_path.slice(1, upload_path.length).join(_this2.options.responsive ? _path["default"].sep : "/")), size ? "".concat(file.filename.split("_").slice(0, file.filename.split("_").length - 1), "_").concat(size, ".").concat(nameParser.slice(nameParser.length - 1)) : file.filename).replace(/[\\\/]+/g, _this2.options.responsive ? _path["default"].sep : "/").replace(/^[\/]+/g, "");
        };

        var dir = _path["default"].join("".concat(upload_path.slice(1, upload_path.length).join(_this2.options.responsive ? _path["default"].sep : "/"))).replace(/[\\\/]+/g, _this2.options.responsive ? _path["default"].sep : "/").replace(/^[\/]+/g, "");

        var file_data = _this2.options.responsive && _this2.options.sizes.length > 0 ? _this2.options.sizes.map(function (size) {
          return {
            path: process.env.NODE_ENV.trim() === "development" ? "".concat(url_Path(size)) : "".concat(base, "/").concat(url_Path()),
            dir: process.env.NODE_ENV.trim() === "development" ? "".concat(dir) : "".concat(base, "/").concat(dir),
            name: "".concat(file.filename.split("_").slice(0, file.filename.split("_").length - 1), "_").concat(size, ".").concat(nameParser.slice(nameParser.length - 1)),
            extname: "".concat(nameParser.slice(nameParser.length - 1)),
            base: "".concat(file.filename.split("_").slice(0, file.filename.split("_").length - 1), "_").concat(size)
          };
        }) : [{
          path: process.env.NODE_ENV.trim() === "development" ? "".concat(url_Path()) : "".concat(base, "/").concat(url_Path()),
          dir: process.env.NODE_ENV.trim() === "development" ? "".concat(dir) : "".concat(base, "/").concat(dir),
          name: file.filename,
          extname: "".concat(nameParser.slice(nameParser.length - 1)),
          base: "".concat(nameParser.slice(0, nameParser.length - 1))
        }];
        return file_data;
      });
    }
  }, {
    key: "handelFilesForDirDeletion",
    value: function () {
      var _handelFilesForDirDeletion = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(filePaths) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (Array.isArray(filePaths)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: ["handelFilesForDirDeletion() method takes paths in an array format"]
                });

              case 2:
                filePaths.filter(Boolean).forEach( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(file) {
                    var upload_path_array, upload_path, filePath;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            upload_path_array = process.env.UPLOAD_STORAGE.split("/").filter(Boolean);
                            upload_path = upload_path_array.slice(0, upload_path_array.length - 1).join("/");
                            filePath = _path["default"].join(__dirname, "../../".concat(upload_path), _url["default"].parse(file).path);

                            _fs["default"].unlink(filePath, function (err) {
                              if (err) {
                                return {
                                  error: true,
                                  statusCode: 500,
                                  errors: err
                                };
                              }

                              return {
                                error: false,
                                statusCode: 200,
                                data: {}
                              };
                            });

                          case 4:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2) {
                    return _ref.apply(this, arguments);
                  };
                }());
                return _context2.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: {}
                });

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function handelFilesForDirDeletion(_x) {
        return _handelFilesForDirDeletion.apply(this, arguments);
      }

      return handelFilesForDirDeletion;
    }()
  }]);
  return AttachmentService;
}(_Service2["default"]);

exports["default"] = AttachmentService;