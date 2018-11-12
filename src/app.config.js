const crops = [
	{"id": "corn", "name": "Corn", "units": "bushels/acre", "refPrice": 3.7},
	{"id": "soybeans", "name": "Soybean", "units": "bushels/acre", "refPrice": 3.8},
	{"id": "wheat", "name": "Wheat", "units": "lbs/acre", "refPrice": 3.9}
];
const devConfig = {
	basePath: "/",
	apiUrl: "http://localhost:5000/api",
	commodities: crops
};

const prodConfig = {
	basePath: "/",
	apiUrl: "https://fd-postgres.ncsa.illinois.edu/farmdoc/api",
	commodities: crops
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
