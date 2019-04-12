const crops = [
	{"id": "corn", "name": "Corn", "units": "bushels/acre", "refPrice": 3.7, "binSize": 10},
	{"id": "soybeans", "name": "Soybean", "units": "bushels/acre", "refPrice": 8.4, "binSize": 10},
	{"id": "wheat", "name": "Wheat", "units": "bushels/acre", "refPrice": 5.5, "binSize": 10}
];

const mpForecasts = [
	{
	  "id": "forecast",
		"name": "Forecast",
		"description": "This is the  forecast model that forecasts market prices for the next five years",
		"prices": {
			"corn": [3.64, 3.67, 3.69, 3.69, 3.70],
			"soybeans": [9.29, 9.29, 9.29, 9.29, 9.29],
			"wheat": [5.04, 5.07, 5.09, 5.09, 5.10],
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
		"description": "This is the CBO 2018 forecast model that forecasts market prices for the next five years",
		"prices": {
			"corn": [3.53, 3.66, 3.76, 3.72, 3.72],
			"soybeans": [9.67, 9.81, 9.67, 9.69, 9.7],
			"wheat": [5.11, 5.11, 5.11, 5.11, 5.11],
		}
	}
];

const defaultsJson = {
	commodity: "",
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


const devConfig = {
	basePath: "/",
	apiUrl: "https://fd-postgres.ncsa.illinois.edu/farmdoc/api", //http://localhost:5000/api
	commodities: crops,
	forecastTypes: mpForecasts,
	domain: "localhost",
	defaultsJson: defaultsJson,
	showCustomForecast: true,
	browserLog: true
};

const prodConfig = {
	basePath: "/dev/",
	apiUrl: "https://fd-postgres.ncsa.illinois.edu/farmdoc/api",
	commodities: crops,
	forecastTypes: mpForecasts,
	domain: "fd-tools.ncsa.illinois.edu",
	defaultsJson: defaultsJson,
	showCustomForecast: false,
	browserLog: false
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
