const devConfig = {
	basePath: "/",
	apiUrl: "http://localhost:5000/api"
};

const prodConfig = {
	basePath: "/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	apiUrl: "https://fd-postgres.ncsa.illinois.edu/farmdoc/api"
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
