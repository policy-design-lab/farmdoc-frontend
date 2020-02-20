import Keycloak from "keycloak-js";

const farmdocApps = {
	"arcplc": {
		appName: "ARC/PLC Calculator",
		appDesc: "The Gardner ARC/PLC Calculator shows the likelihood of ARC-CO and" +
				" PLC making payments in each year from 2019 to 2023. Expected payment " +
				"levels also are given for user-selected counties and crops.",
		lastUpdated: "Jan 12, 2020"
	},
	"premiums": {
		appName: "Insurance Premiums",
		appDesc: "The Insurance Premiums tool shows per acre insurance premiums that farmers " +
				"will pay for Federally-subsidized crop Insurance products. These per " +
				"acre premiums are given for customized entries made by users that reflect individual farm cases.",
		lastUpdated: "Jan 22, 2020"
	},
	"eval": {
		appName: "Payment Evaluator",
		appDesc: "The Insurance Payment Evaluator tool provides helpful information to producers comparing costs and " +
			"risk reductions across their available crop insurance alternatives. ",
		lastUpdated: "Feb 20, 2020"
	},
};

const crops = [
	{"id": "corn", "cropId": 41, "name": "Corn", "units": "bushels/acre", "refPrice": 3.7, "binSize": 10},
	{"id": "soybeans", "cropId": 81, "name": "Soybean", "units": "bushels/acre", "refPrice": 8.4, "binSize": 10},
	{"id": "wheat", "cropId": 999, "name": "Wheat", "units": "bushels/acre", "refPrice": 5.5, "binSize": 10}
];

const mpForecasts = [
	{
		"id": "forecast",
		"name": "Forecast",
		"description": "This is the  forecast model that forecasts market prices for the next five years",
		"prices": {
			"corn": [3.85, 3.71, 3.65, 3.62, 3.60],
			"soybeans": [9.00, 9.00, 9.00, 9.00, 9.00],
			"wheat": [4.55, 4.87, 5.00,	5.05, 5.08],
		}
	},
	{
		"id": "high",
		"name": "High",
		"description": "This is the USDA High forecast model that forecasts market prices for the next five years",
		"prices": {
			"corn": [4.0, 4.0, 4.0, 4.0, 4.0],
			"soybeans": [9.5, 9.5, 9.5, 9.5, 9.5],
			"wheat": [5.4, 5.4, 5.4, 5.4, 5.4],
		}
	},
	{
		"id": "low",
		"name": "Low",
		"description": "This is the USDA Low forecast model that forecasts market prices for the next five years",
		"prices": {
			"corn": [3.4, 3.4, 3.4, 3.4, 3.4],
			"soybeans": [8.5, 8.5, 8.5, 8.5, 8.5],
			"wheat": [4.8, 4.8, 4.8, 4.8, 4.8],
		}
	},
	{
		"id": "cbo",
		"name": "CBO",
		"description": "The CBO price scenario uses the Marketing Year Average prices as forecast by the " +
			"Congressional Budget Office (CBO) in its May 2019 Baseline estimates, available from CBO",
		"prices": {
			"corn": [3.65, 3.86, 3.73, 3.72, 3.75],
			"soybeans": [8.63, 9.04, 9.12, 9.17, 9.22],
			"wheat": [5.05, 5.08, 5.09, 5.09, 5.08],
		}
	}
];

const defaultsJson = {
	commodity: "",
	cropId: 41, //corn for premium calculator
	forecastType: "forecast",
	forecastName: "Forecast",
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

const devConfig = {
	basePath: "/",
	apiUrl: "http://localhost:5000/api",
	apps: farmdocApps,
	commodities: crops,
	forecastTypes: mpForecasts,
	domain: "localhost",
	defaultsJson: defaultsJson,
	showCustomForecast: true,
	browserLog: true,
	tooltipTouchDelay: tooltipTouchDelay,
	demoUser: demoUser,
	demoUserPw: demoUserPw,
	keycloak: Keycloak("http://localhost:3000/keycloak.json"),
	faqUrl: faqUrl
};

const prodConfig = {
	basePath: "/dev/",
	apiUrl: "https://fd-api.ncsa.illinois.edu/farmdoc/api",
	apps: farmdocApps,
	commodities: crops,
	forecastTypes: mpForecasts,
	domain: prodDomain,
	defaultsJson: defaultsJson,
	showCustomForecast: false,
	browserLog: false,
	tooltipTouchDelay: tooltipTouchDelay,
	demoUser: demoUser,
	demoUserPw: demoUserPw,
	keycloak: Keycloak(`https://${ prodDomain }/keycloak.json`),
	faqUrl: faqUrl
};

const config = getConfig();

function getConfig() {
	if (process.env.NODE_ENV === "production") {
		return prodConfig;
	}
	else {
		return devConfig;
	}
}

export default config;
