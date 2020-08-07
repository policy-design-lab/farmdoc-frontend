import config from "../app.config";

const defaultState = {
	cropCode: "C",
	monthCode: "Z",
	year: 2020,
	pdResults: null
};

const priceDistribution = (state = defaultState, action) => {
	switch (action.type) {
		case "ADD_PD_RESULT":
			return Object.assign({}, state, {
				pdResults: action.pdResults
			});

		default:
			return state;
	}
};

export default priceDistribution;

