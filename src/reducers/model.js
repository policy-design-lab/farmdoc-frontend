import config from "../app.config";

const defaultState = {
	county: null,
	commodity: config.defaultsJson.commodity,
	forecastType: config.defaultsJson.forecastType,
	refPrice: "",
	paymentYield: config.defaultsJson.paymentYield,
	coverage: config.defaultsJson.coverage,
	range: config.defaultsJson.range,
	acres: config.defaultsJson.acres,
	countyResults: null
};

const model = (state = defaultState, action) => {
	switch (action.type) {
		case "CHANGE_COUNTY":
			return Object.assign({}, state, {
				county: action.county
			});
		case "CHANGE_COMMODITY":
			return Object.assign({}, state, {
				commodity: action.commodity
			});
		case "CHANGE_FORECAST_TYPE":
			return Object.assign({}, state, {
				forecastType: action.forecastType
			});
		case "CHANGE_REFPRICE":
			return Object.assign({}, state, {
				refPrice: action.refPrice
			});
		case "CHANGE_PAYMENT_YIELD":
			return Object.assign({}, state, {
				paymentYield: action.paymentYield
			});
		case "CHANGE_COVERAGE":
			return Object.assign({}, state, {
				coverage: action.coverage
			});
		case "CHANGE_RANGE":
			return Object.assign({}, state, {
				range: action.range
			});
		case "CHANGE_ACRES":
			return Object.assign({}, state, {
				acres: action.acres
			});
		case "ADD_RESULT":
			return Object.assign({}, state, {
				countyResults: action.countyResults
			});

		default:
			return state;

	}
};

export default model;

