const {createProxyMiddleware} = require("http-proxy-middleware");

const isLocal = process.env.REACT_APP_ENV !== "development" && process.env.REACT_APP_ENV !== "production";

const targets = isLocal
	? {
		api: "https://policydesignlab-dev.ncsa.illinois.edu",
		auth: "https://policydesignlab-dev.ncsa.illinois.edu",
		datawolf: "https://policydesignlab-dev.ncsa.illinois.edu",
	}
	: {
		api: "https://fd-api-dev.ncsa.illinois.edu",
		auth: "https://fd-auth-dev.ncsa.illinois.edu",
		datawolf: "https://fd-api-dev.ncsa.illinois.edu",
	};

module.exports = function(app) {
	app.use(
		"/farmdoc/api",
		createProxyMiddleware({
			target: targets.api,
			changeOrigin: true,
			secure: false,
			logLevel: "debug",
			pathRewrite: {
				"^/farmdoc/api": "/farmdoc/api"
			},
		})
	);

	app.use(
		"/auth",
		createProxyMiddleware({
			target: targets.auth,
			changeOrigin: true,
			secure: false,
			logLevel: "debug",
		})
	);

	app.use(
		"/datawolf",
		createProxyMiddleware({
			target: targets.datawolf,
			changeOrigin: true,
			secure: false,
			logLevel: "debug",
			pathRewrite: {
				"^/datawolf": "/datawolf"
			},
		})
	);
};
