import Keycloak from "keycloak-js";

const farmdocApps = {
	"arcplc": {
		appName: "ARC/PLC Calculator",
		appDesc: "The Gardner ARC/PLC Calculator shows the likelihood of ARC-CO and" +
				" PLC making payments in each year from 2019 to 2023. Expected payment " +
				"levels also are given for user-selected counties and crops.",
		lastUpdated: "Jan 18, 2022",
		urlPath: "/arcplc",
		needsAuthentication: true
	},
	"premiums": {
		appName: "Insurance Premiums",
		appDesc: "The Insurance Premiums tool shows per acre insurance premiums that farmers " +
				"will pay for Federally-subsidized crop Insurance products. These per " +
				"acre premiums are given for customized entries made by users that reflect individual farm cases.",
		lastUpdated: "March 01, 2022",
		urlPath: "/premiums",
		needsAuthentication: false
	},
	"evaluator": {
		appName: "Insurance Evaluator",
		appDesc: "The Insurance Payment Evaluator tool provides helpful information to producers comparing costs and " +
			"risk reductions across their available crop insurance alternatives. ",
		lastUpdated: "Daily",
		urlPath: "/evaluator",
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
};

const defaultsJson = {
	commodity: "",
	cropId: 41, //corn for premium calculator
	paymentYield: "",
	arcYield: "",
	coverage: .86,
	range: .1,
	acres: .85,
	units: "",
	startYear: 2019
};

const tooltipTouchDelay = 50; //milli seconds

const prodDomain = "fd-tools.ncsa.illinois.edu";
const devDomain = "fd-tools-dev.ncsa.illinois.edu";

let demoUser = process.env.REACT_APP_DEMO_USER || "";
let demoPassword = process.env.REACT_APP_DEMO_PASSWORD || "";
let dwUserId = process.env.REACT_APP_DW_USER_ID || "";

const baseConfig = {
	proxyUser: `${demoUser}`,
	proxyPw: `${demoPassword}`,
	proxyDwPersonId: `${dwUserId}`,
	keyCloakUrl: "https://fd-auth.ncsa.illinois.edu/auth",
	keyCloakClient: "farmdoc",
	faqUrl: "https://opensource.ncsa.illinois.edu/confluence/display/FD/Frequently+Asked+Questions"
};

const localConfig = Object.assign({}, {
	basePath: "/",
	apiUrl: "http://localhost:5000/api",
	datawolfUrl: "http://localhost:8888/datawolf",
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
	if (process.env.REACT_APP_ENV === "production") {
		return prodConfig;
	}
	else if (process.env.REACT_APP_ENV === "development"){
		return devConfig;
	}
	else {
		return localConfig;
	}
}

export default config;
