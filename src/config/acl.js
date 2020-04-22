import acl from "express-acl";

class Acl {
	constructor() {
		acl.config({
			decodedObjectName: "user",
			roleSearchPath: "user.role",
			rules: [
				{
					group: "guest",
					permissions: [
						{ resource: "auth/*", methods: ["GET", "POST"], action: "allow" },
						{ resource: "lang/*", methods: ["GET"], action: "allow" },
						{ resource: "browse/*", methods: ["GET"], action: "allow" },
						{ resource: "profile/*", methods: ["GET"], action: "allow" }
					]
				}, {
					group: "admin",
					permissions: [
						{ resource: "auth/delete/*", methods: "*", action: "deny" },
						{
							resource: "dashboard/settings/*",
							methods: "*",
							action: "allow",
							subRoutes: [
								{ resource: "/profile-info", methods: "*", action: "deny" },
							]
						},
						{ resource: "*", methods: "*", action: "allow" },
					]
				},
				{
					group: "employer",
					permissions: [
						{ resource: "dashboard/", methods: "*", action: "allow" },
						{ resource: "dashboard/jobs/*", methods: "*", action: "allow" },
						{ resource: "dashboard/settings/*", methods: "*", action: "allow" },
						{ resource: "auth/logout", methods: "*", action: "allow" },
					]
				},
				{
					group: "freelancer",
					permissions: [
						{ resource: "dashboard/", methods: "*", action: "allow" },
						// { resource: "dashboard/settings/*" }
					]
				}
			],
			denyCallback: (res) => res.status(403).json({
				error: true,
				successCode: 403,
				errors: "Not Authorized to access this page."
			})
		});
	}
}

export default new Acl();
