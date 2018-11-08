

const defaultState = {
	county: null,
	commodity: "Corn",
	refPrice: 3.70,
	paymentYield: 120,
	coverage: 85,
	range: 10,
	acres: 85,
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


