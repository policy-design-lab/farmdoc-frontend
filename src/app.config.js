const crops = [
	{"id": "corn", "name": "Corn", "units": "bushels/acre", "refPrice": 3.7},
	{"id": "soybeans", "name": "Soybean", "units": "bushels/acre", "refPrice": 8.4},
	{"id": "wheat", "name": "Wheat", "units": "bushels/acre", "refPrice": 5.5}
];

const mpForecasts = [
	{
	  "id": "cbo",
		"name": "CBO 2018",
		"prices": {
			"corn": [4.2, 4.06, 3.55, 5.18, 6.22],
			"soybeans": [0, 0, 0, 0, 0],
			"wheat": [0, 0, 0, 0, 0],
		}
	},
	{
	  "id": "usda",
		"name": "USDA high/low",
		"prices": {
			"corn": [4.2, 4.06, 3.55, 5.18, 6.22],
			"soybeans": [0, 0, 0, 0, 0],
			"wheat": [0, 0, 0, 0, 0],
		}
	},
	{
		"id": "mixmatch",
		"name": "Mix and Match",
		"prices": {
			"corn": [4.2, 4.06, 3.55, 5.18, 6.22],
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
	} else {
		return devConfig;
	}
}

export default config;
