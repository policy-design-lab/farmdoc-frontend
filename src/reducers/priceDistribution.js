import config from "../app.config";

const defaultState = {
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
