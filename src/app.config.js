const crops = [
	{"id": "corn", "name": "Corn", "units": "bushels/acre", "refPrice": 3.7},
	{"id": "soybeans", "name": "Soybean", "units": "bushels/acre", "refPrice": 8.4},
	{"id": "wheat", "name": "Wheat", "units": "bushels/acre", "refPrice": 5.5}
];
const devConfig = {
	basePath: "/",
	apiUrl: "https://fd-postgres.ncsa.illinois.edu/farmdoc/api", //http://localhost:5000/api
	commodities: crops,
	domain: "localhost"
};

const prodConfig = {
	basePath: "/",
	apiUrl: "https://fd-postgres.ncsa.illinois.edu/farmdoc/api",
	commodities: crops,
	domain: "fd-tools.ncsa.illinois.edu"
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
