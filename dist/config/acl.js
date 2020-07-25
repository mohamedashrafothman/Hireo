"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _expressAcl = _interopRequireDefault(require("express-acl"));

var Acl = function Acl() {
  (0, _classCallCheck2["default"])(this, Acl);

  _expressAcl["default"].config({
    decodedObjectName: "user",
    roleSearchPath: "user.role",
    rules: [{
      group: "guest",
      permissions: [{
        resource: "auth/*",
        methods: ["GET", "POST"],
        action: "allow"
      }, {
        resource: "lang/*",
        methods: ["GET"],
        action: "allow"
      }, {
        resource: "browse/*",
        methods: ["GET"],
        action: "allow"
      }, {
        resource: "profile/*",
        methods: ["GET"],
        action: "allow"
      }]
    }, {
      group: "admin",
      permissions: [{
        resource: "auth/delete/*",
        methods: "*",
        action: "deny"
      }, {
        resource: "dashboard/settings/*",
        methods: "*",
        action: "allow",
        subRoutes: [{
          resource: "/profile-info",
          methods: "*",
          action: "deny"
        }]
      }, {
        resource: "*",
        methods: "*",
        action: "allow"
      }]
    }, {
      group: "employer",
      permissions: [{
        resource: "dashboard/",
        methods: "*",
        action: "allow"
      }, {
        resource: "dashboard/jobs/*",
        methods: "*",
        action: "allow"
      }, {
        resource: "dashboard/settings/*",
        methods: "*",
        action: "allow"
      }, {
        resource: "auth/logout",
        methods: "*",
        action: "allow"
      }]
    }, {
      group: "freelancer",
      permissions: [{
        resource: "dashboard/",
        methods: "*",
        action: "allow"
      } // { resource: "dashboard/settings/*" }
      ]
    }],
    denyCallback: function denyCallback(res) {
      return res.status(403).json({
        error: true,
        successCode: 403,
        errors: "Not Authorized to access this page."
      });
    }
  });
};

var _default = new Acl();

exports["default"] = _default;