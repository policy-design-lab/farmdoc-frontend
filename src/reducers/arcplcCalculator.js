import config from "../app.config";

const defaultState = {
	county: null,
	commodity: config.defaultsJson.commodity,
	forecastType: config.defaultsJson.forecastType,
	refPrice: "",
	paymentYield: config.defaultsJson.paymentYield,
	arcYield: config.defaultsJson.arcYield,
	pracCode: "",
	stateName: "",
	countyName: "",
	countyResults: null,
	loading: false
};

const arcplcCalculator = (state = defaultState, action) => {
	switch (action.type) {
		case "ARCPLC_CHANGE_COUNTY":
			return Object.assign({}, state, {
				county: action.county
			});
		case "ARCPLC_CHANGE_COMMODITY":
			return Object.assign({}, state, {
				commodity: action.commodity
			});
		case "ARCPLC_CHANGE_FORECAST_TYPE":
			return Object.assign({}, state, {
				forecastType: action.forecastType
			});
		case "ARCPLC_CHANGE_REFPRICE":
			return Object.assign({}, state, {
				refPrice: action.refPrice
			});
		case "ARCPLC_CHANGE_PAYMENT_YIELD":
			return Object.assign({}, state, {
				paymentYield: action.paymentYield
			});
		case "ARCPLC_CHANGE_ARC_YIELD":
			return Object.assign({}, state, {
				arcYield: action.arcYield
			});
		case "ARCPLC_CHANGE_PRACCODE":
			return Object.assign({}, state, {
				pracCode: action.pracCode
			});
		case "ARCPLC_CHANGE_STATE_NAME":
			return Object.assign({}, state, {
				stateName: action.stateName
			});
		case "ARCPLC_CHANGE_COUNTY_NAME":
			return Object.assign({}, state, {
				countyName: action.countyName
			});
		case "ARCPLC_ADD_RESULT":
			return Object.assign({}, state, {
				countyResults: action.countyResults
			});
		case "ARCPLC_SET_LOADING":
			return Object.assign({}, state, {
				loading: action.loading
			});
		default:
			return state;
	}
};

export default arcplcCalculator;
