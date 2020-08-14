import config from "../app.config";

const defaultState = {
	//futuresCode: "",
	pdResults: null
};

const priceDistribution = (state = defaultState, action) => {
	switch (action.type) {
		case "ADD_PD_RESULT":
			return Object.assign({}, state, {
				pdResults: action.pdResults
			});
		// case "FUTURES_CODE":
		// 	return Object.assign({}, state, {
		// 		futuresCode: action.futuresCode
		// 	});
		default:
			return state;
	}
};

export default priceDistribution;
