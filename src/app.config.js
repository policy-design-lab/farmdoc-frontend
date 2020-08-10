import Keycloak from "keycloak-js";

const farmdocApps = {
	"arcplc": {
		appName: "ARC/PLC Calculator",
		appDesc: "The Gardner ARC/PLC Calculator shows the likelihood of ARC-CO and" +
				" PLC making payments in each year from 2019 to 2023. Expected payment " +
				"levels also are given for user-selected counties and crops.",
		lastUpdated: "Jun 15, 2020"
	},
	"premiums": {
		appName: "Insurance Premiums",
		appDesc: "The Insurance Premiums tool shows per acre insurance premiums that farmers " +
				"will pay for Federally-subsidized crop Insurance products. These per " +
				"acre premiums are given for customized entries made by users that reflect individual farm cases.",
		lastUpdated: "Mar 01, 2020"
	},
	"evaluator": {
		appName: "Insurance Evaluator",
		appDesc: "The Insurance Payment Evaluator tool provides helpful information to producers comparing costs and " +
			"risk reductions across their available crop insurance alternatives. ",
		lastUpdated: "Daily"
	},
	"pricedistribution": {
		appName: "Price Distribution",
		appDesc: "This is the price distribution tool that does ....... ",
		lastUpdated: "Every 15 mins"
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

const demoUser = "farmdoc";
const demoUserPw = "farmdoc1234";
const faqUrl = "https://opensource.ncsa.illinois.edu/confluence/display/FD/Frequently+Asked+Questions";

const prodDomain = "fd-tools.ncsa.illinois.edu";
const devDomain = "fd-tools-dev.ncsa.illinois.edu";

const localConfig = {
	basePath: "/",
	apiUrl: "https://fd-api.ncsa.illinois.edu/farmdoc/api",
	apps: farmdocApps,
	domain: "localhost",
	defaultsJson: defaultsJson,
	showCustomForecast: true,
	browserLog: true,
	tooltipTouchDelay: tooltipTouchDelay,
	demoUser: demoUser,
	demoUserPw: demoUserPw,
	keycloak: Keycloak("keycloak.json"),
	faqUrl: faqUrl
};

const devConfig = {
	basePath: "/",
	apiUrl: "https://fd-api-dev.ncsa.illinois.edu/farmdoc/api",
	apps: farmdocApps,
	domain: devDomain,
	defaultsJson: defaultsJson,
	showCustomForecast: true,
	browserLog: true,
	tooltipTouchDelay: tooltipTouchDelay,
	demoUser: demoUser,
	demoUserPw: demoUserPw,
	keycloak: Keycloak("keycloak.json"),
	faqUrl: faqUrl
};

const prodConfig = {
	basePath: "/",
	apiUrl: "https://fd-api.ncsa.illinois.edu/farmdoc/api",
	apps: farmdocApps,
	domain: prodDomain,
	defaultsJson: defaultsJson,
	showCustomForecast: false,
	browserLog: false,
	tooltipTouchDelay: tooltipTouchDelay,
	demoUser: demoUser,
	demoUserPw: demoUserPw,
	keycloak: Keycloak("keycloak.json"),
	faqUrl: faqUrl
};

const config = getConfig();


function getConfig() {
	if (process.env.DEPLOY_ENV === "production") {
		return prodConfig;
	}
	else if (process.env.DEPLOY_ENV === "development"){
		return devConfig;
	}
	else {
		return localConfig;
	}
}

export default config;
