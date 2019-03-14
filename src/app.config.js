const crops = [
	{"id": "corn", "name": "Corn", "units": "bushels/acre", "refPrice": 3.7, "binSize": 10},
	{"id": "soybeans", "name": "Soybean", "units": "bushels/acre", "refPrice": 8.4, "binSize": 8},
	{"id": "wheat", "name": "Wheat", "units": "bushels/acre", "refPrice": 5.5, "binSize": 8}
];

const mpForecasts = [
	{
	  "id": "cbo",
		"name": "CBO 2018",
		"description": "This is the CBO 2018 forecast model that forecasts market prices for the next five years",
		"prices": {
			"corn": [3.7, 3.61, 3.36, 3.3, 3.5],
			"soybeans": [10.1, 8.95, 9.47, 9.3, 8.6],
			"wheat": [5.99, 4.89, 3.89, 4.6, 5.1],
		}
	},
	{
	  "id": "usda",
		"name": "USDA high/low",
		"description": "This is the USDA High/Low forecast model that forecasts market prices for the next five years",
		"prices": {
			"corn": [2, 2.1, 2.2, 2.3, 2.4],
			"soybeans": [0.1, 0.1, 0.1, 0.1, 0.1],
			"wheat": [1, 1, 1, 1, 1],
		}
	},
	{
		"id": "mixmatch",
		"name": "Mix and Match",
		"description": "This is the Mix and Match forecast model that forecasts market prices for the next five years",
		"prices": {
			"corn": [0, 0, 0, 0, 0],
			"soybeans": [0, 0, 0, 0, 0],
			"wheat": [0, 0, 0, 0, 0],
		}
	}
];

const defaultsJson = {
	commodity: "",
	forecastType: "cbo",
	forecastName: "CBO 2018",
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
	defaultsJson: defaultsJson
};

const prodConfig = {
	basePath: "/",
	apiUrl: "https://fd-postgres.ncsa.illinois.edu/farmdoc/api",
	commodities: crops,
	forecastTypes: mpForecasts,
	domain: "fd-tools.ncsa.illinois.edu",
	defaultsJson: defaultsJson
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
