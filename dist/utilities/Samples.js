"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _fs = _interopRequireDefault(require("fs"));

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

var _chalk = require("chalk");

var _database = _interopRequireDefault(require("../config/database"));

var _User = _interopRequireDefault(require("../models/User.model"));

var _Icon = _interopRequireDefault(require("../models/Icon.model"));

var _Skill = _interopRequireDefault(require("../models/Skill.model"));

var _Category = _interopRequireDefault(require("../models/Category.model"));

var _Nationality = _interopRequireDefault(require("../models/Nationality.model"));

var _Job_type = _interopRequireDefault(require("../models/Job_type.model"));

_dotenv["default"].config({
  path: "".concat(__dirname, "/../../.env")
});

var Samples = /*#__PURE__*/function () {
  function Samples(users, skills, nationalities, icons, categories, jobType) {
    (0, _classCallCheck2["default"])(this, Samples);
    this.users = users;
    this.skills = skills;
    this.nationalities = nationalities;
    this.icons = icons;
    this.categories = categories;
    this.jobType = jobType;
    this.connectMongoDB();
    this.users = this.readJsonFiles("".concat(__dirname, "/../samples/users.json"));
    this.skills = this.readJsonFiles("".concat(__dirname, "/../samples/skills.json"));
    this.nationalities = this.readJsonFiles("".concat(__dirname, "/../samples/nationalities.json"));
    this.icons = this.readJsonFiles("".concat(__dirname, "/../samples/icons.json"));
    this.categories = this.readJsonFiles("".concat(__dirname, "/../samples/categories.json"));
    this.jobType = this.readJsonFiles("".concat(__dirname, "/../samples/job_type.json"));

    if (process.argv.includes("--drop")) {
      this.dropSamples();
    } else {
      this.loadSamples();
    }
  }

  (0, _createClass2["default"])(Samples, [{
    key: "connectMongoDB",
    value: function connectMongoDB() {
      new _database["default"](function () {
        console.log(_chalk.blue.bold("✅  Conencted to the database"));
      }, function (error) {
        console.error(error);
        console.log("\u26D4\uFE0F  ".concat((0, _chalk.red)("MongoDB connection error"), ".\n Please make sure MongoDB server is running."));
        process.exit();
      });
    }
  }, {
    key: "readJsonFiles",
    value: function readJsonFiles(path) {
      return JSON.parse(_fs["default"].readFileSync(path, "utf-8"));
    }
  }, {
    key: "dropSamples",
    value: function () {
      var _dropSamples = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var _yield$to, _yield$to2, removeUsersError, _yield$to3, _yield$to4, removeSkillsError, _yield$to5, _yield$to6, removeNationalitiesError, _yield$to7, _yield$to8, removeIconsError, _yield$to9, _yield$to10, removeCategoriesError, _yield$to11, _yield$to12, removeJobTypeError;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _awaitToJs["default"])(_User["default"].deleteMany({}));

              case 2:
                _yield$to = _context.sent;
                _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 1);
                removeUsersError = _yield$to2[0];

                if (removeUsersError) {
                  console.log(removeUsersError);
                  process.exit();
                }

                _context.next = 8;
                return (0, _awaitToJs["default"])(_Skill["default"].deleteMany({}));

              case 8:
                _yield$to3 = _context.sent;
                _yield$to4 = (0, _slicedToArray2["default"])(_yield$to3, 1);
                removeSkillsError = _yield$to4[0];

                if (removeSkillsError) {
                  console.log(removeSkillsError);
                  process.exit();
                }

                _context.next = 14;
                return (0, _awaitToJs["default"])(_Nationality["default"].deleteMany({}));

              case 14:
                _yield$to5 = _context.sent;
                _yield$to6 = (0, _slicedToArray2["default"])(_yield$to5, 1);
                removeNationalitiesError = _yield$to6[0];

                if (removeNationalitiesError) {
                  console.log(removeNationalitiesError);
                  process.exit();
                }

                _context.next = 20;
                return (0, _awaitToJs["default"])(_Icon["default"].deleteMany({}));

              case 20:
                _yield$to7 = _context.sent;
                _yield$to8 = (0, _slicedToArray2["default"])(_yield$to7, 1);
                removeIconsError = _yield$to8[0];

                if (removeIconsError) {
                  console.log(removeIconsError);
                  process.exit();
                }

                _context.next = 26;
                return (0, _awaitToJs["default"])(_Category["default"].deleteMany({}));

              case 26:
                _yield$to9 = _context.sent;
                _yield$to10 = (0, _slicedToArray2["default"])(_yield$to9, 1);
                removeCategoriesError = _yield$to10[0];

                if (removeCategoriesError) {
                  console.log(removeCategoriesError);
                  process.exit();
                }

                _context.next = 32;
                return (0, _awaitToJs["default"])(_Job_type["default"].deleteMany({}));

              case 32:
                _yield$to11 = _context.sent;
                _yield$to12 = (0, _slicedToArray2["default"])(_yield$to11, 1);
                removeJobTypeError = _yield$to12[0];

                if (removeJobTypeError) {
                  console.log(removeJobTypeError);
                  process.exit();
                }

                console.log("\u2705  ".concat((0, _chalk.blue)("Data Deleted.")));
                process.exit();

              case 38:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function dropSamples() {
        return _dropSamples.apply(this, arguments);
      }

      return dropSamples;
    }()
  }, {
    key: "loadSamples",
    value: function () {
      var _loadSamples = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _yield$to13, _yield$to14, saveUsersError, _yield$to15, _yield$to16, saveSkillsError, _yield$to17, _yield$to18, saveNationalitiesError, _yield$to19, _yield$to20, saveIconsError, _yield$to21, _yield$to22, saveCategoriesError, _yield$to23, _yield$to24, saveJobTypeError;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _awaitToJs["default"])(_User["default"].insertMany(this.users));

              case 2:
                _yield$to13 = _context2.sent;
                _yield$to14 = (0, _slicedToArray2["default"])(_yield$to13, 1);
                saveUsersError = _yield$to14[0];

                if (saveUsersError) {
                  console.log((0, _chalk.red)("\u26D4\uFE0F  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ".concat((0, _chalk.blue)("npm run blowitallaway"), "\n\n\n")));
                  console.log(saveUsersError);
                }

                _context2.next = 8;
                return (0, _awaitToJs["default"])(_Skill["default"].insertMany(this.skills));

              case 8:
                _yield$to15 = _context2.sent;
                _yield$to16 = (0, _slicedToArray2["default"])(_yield$to15, 1);
                saveSkillsError = _yield$to16[0];

                if (saveSkillsError) {
                  console.log((0, _chalk.red)("\u26D4\uFE0F  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ".concat((0, _chalk.blue)("npm run blowitallaway"), "\n\n\n")));
                  console.log(saveSkillsError);
                }

                _context2.next = 14;
                return (0, _awaitToJs["default"])(_Nationality["default"].insertMany(this.nationalities));

              case 14:
                _yield$to17 = _context2.sent;
                _yield$to18 = (0, _slicedToArray2["default"])(_yield$to17, 1);
                saveNationalitiesError = _yield$to18[0];

                if (saveNationalitiesError) {
                  console.log((0, _chalk.red)("\u26D4\uFE0F  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ".concat((0, _chalk.blue)("npm run blowitallaway"), "\n\n\n")));
                  console.log(saveNationalitiesError);
                }

                _context2.next = 20;
                return (0, _awaitToJs["default"])(_Icon["default"].insertMany(this.icons));

              case 20:
                _yield$to19 = _context2.sent;
                _yield$to20 = (0, _slicedToArray2["default"])(_yield$to19, 1);
                saveIconsError = _yield$to20[0];

                if (saveIconsError) {
                  console.log((0, _chalk.red)("\u26D4\uFE0F  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ".concat((0, _chalk.blue)("npm run blowitallaway"), "\n\n\n")));
                  console.log(saveIconsError);
                }

                _context2.next = 26;
                return (0, _awaitToJs["default"])(_Category["default"].insertMany(this.categories));

              case 26:
                _yield$to21 = _context2.sent;
                _yield$to22 = (0, _slicedToArray2["default"])(_yield$to21, 1);
                saveCategoriesError = _yield$to22[0];

                if (saveCategoriesError) {
                  console.log((0, _chalk.red)("\u26D4\uFE0F  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ".concat((0, _chalk.blue)("npm run blowitallaway"), "\n\n\n")));
                  console.log(saveCategoriesError);
                }

                _context2.next = 32;
                return (0, _awaitToJs["default"])(_Job_type["default"].insertMany(this.jobType));

              case 32:
                _yield$to23 = _context2.sent;
                _yield$to24 = (0, _slicedToArray2["default"])(_yield$to23, 1);
                saveJobTypeError = _yield$to24[0];

                if (saveJobTypeError) {
                  console.log((0, _chalk.red)("\u26D4\uFE0F  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ".concat((0, _chalk.blue)("npm run blowitallaway"), "\n\n\n")));
                  console.log(saveJobTypeError);
                }

                console.log("\u2705  ".concat((0, _chalk.blue)("Done!")));
                process.exit();

              case 38:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function loadSamples() {
        return _loadSamples.apply(this, arguments);
      }

      return loadSamples;
    }()
  }]);
  return Samples;
}();

var _default = new Samples();

exports["default"] = _default;