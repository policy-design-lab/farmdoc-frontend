import Keycloak from "keycloak-js";

const farmdocApps = {
	"arcplc": {
		appName: "ARC/PLC Calculator (Legacy)",
		appDesc: "The legacy Gardner ARC/PLC Calculator shows the likelihood of ARC-CO and" +
				" PLC making payments in each year from 2020 to 2024. Expected payment " +
				"levels also are given for user-selected counties and crops.",
		lastUpdated: "Feb. 26, 2024",
		urlPath: "/arcplc-legacy",
		needsAuthentication: false
	},
	"premiums": {
		appName: "Insurance Premiums",
		appDesc: "The Insurance Premiums tool shows per acre insurance premiums that farmers " +
				"will pay for Federally-subsidized crop Insurance products. These per " +
				"acre premiums are given for customized entries made by users that reflect individual farm cases.",
		lastUpdated: "Mar. 2, 2026",
		urlPath: "/premiums",
		needsAuthentication: false
	},
	"evaluator": {
		appName: "Insurance Evaluator (Legacy)",
		appDesc: "The legacy Insurance Payment Evaluator tool provides helpful information to producers comparing costs and " +
			"risk reductions across their available crop insurance alternatives.",
		lastUpdated: "Daily",
		urlPath: "/evaluator-legacy",
		needsAuthentication: false
	},
	"pricedistribution": {
		appName: "Price Distribution",
		appDesc: "The Price Distribution Tool uses current option market prices to derive estimates of the probability " +
			"distribution of prices at the expiration of an underlying corn and soybean futures contracts.",
		lastUpdated: "Every 15 mins",
		urlPath: "/pricedistribution",
		needsAuthentication: false
	},
	"newevaluator": {
		appName: "Insurance Evaluator",
		appDesc: "The Insurance Payment Evaluator tool provides helpful information to producers comparing costs and " +
			"risk reductions across their available crop insurance alternatives.",
		lastUpdated: "Daily",
		urlPath: "/evaluator",
		needsAuthentication: false
	},
	"newarcplc": {
		appName: "ARC/PLC Calculator",
		appDesc: "The Gardner ARC/PLC Calculator provides an annual estimate of payments beginning with the 2026 crop year," +
			" as well as estimates of the likelihood for payments.",
		lastUpdated: "Jan. 23, 2026",
		urlPath: "/arcplc",
		needsAuthentication: false
	},
};

const defaultsJson = {
	commodity: "",
	cropId: 41, //corn for premium calculator
	paymentYield: "",
	arcYield: "",
	coverage: .90,
	range: .12,
	acres: .85,
	units: "",
	startYear: 2020
};

const tooltipTouchDelay = 50; //milli seconds

const prodDomain = "fd-tools.ncsa.illinois.edu";
const devDomain = "fd-tools-dev.ncsa.illinois.edu";

let demoUser = process.env.REACT_APP_DEMO_USER || "";
let demoPassword = process.env.REACT_APP_DEMO_PASSWORD || "";
let dwUserId = process.env.REACT_APP_DW_USER_ID || "";
// TODO - check if this can come from keycloak.json
let keycloakUrl = process.env.REACT_APP_KEYCLOAK_URL || "https://fd-auth.ncsa.illinois.edu/auth";

const baseConfig = {
	proxyUser: `${demoUser}`,
	proxyPw: `${demoPassword}`,
	proxyDwPersonId: `${dwUserId}`,
	keyCloakUrl: `${keycloakUrl}`,
	keyCloakClient: "farmdoc",
	faqUrl: "https://opensource.ncsa.illinois.edu/confluence/display/FD/Frequently+Asked+Questions"
};

const localConfig = Object.assign({}, {
	basePath: "/",
	apiUrl: "/farmdoc/api",
	datawolfUrl: "/datawolf",
	apps: farmdocApps,
	domain: "localhost",
	defaultsJson: defaultsJson,
	showCustomForecast: true,
	browserLog: true,
	tooltipTouchDelay: tooltipTouchDelay,
	keycloak: Keycloak("keycloak.json")
}, baseConfig);

const devConfig = Object.assign({}, {
	basePath: "/",
	apiUrl: "https://fd-api-dev.ncsa.illinois.edu/farmdoc/api",
	datawolfUrl: "https://fd-api-dev.ncsa.illinois.edu/datawolf",
	apps: farmdocApps,
	domain: devDomain,
	defaultsJson: defaultsJson,
	showCustomForecast: true,
	browserLog: true,
	tooltipTouchDelay: tooltipTouchDelay,
	keycloak: Keycloak("keycloak.json")
}, baseConfig);

const prodConfig = Object.assign({}, {
	basePath: "/",
	apiUrl: "https://fd-api.ncsa.illinois.edu/farmdoc/api",
	datawolfUrl: "https://fd-api.ncsa.illinois.edu/datawolf",
	apps: farmdocApps,
	domain: prodDomain,
	defaultsJson: defaultsJson,
	showCustomForecast: false,
	browserLog: false,
	tooltipTouchDelay: tooltipTouchDelay,
	keycloak: Keycloak("keycloak.json")
}, baseConfig);

const config = getConfig();

function getConfig() {
	let selectedConfig;

	if (process.env.REACT_APP_ENV === "production") {
		selectedConfig = prodConfig;
	}
	else if (process.env.REACT_APP_ENV === "development"){
		selectedConfig = devConfig;
	}
	else {
		selectedConfig = localConfig;
	}

	return selectedConfig;
}

export default config;
