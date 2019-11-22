
const defaultState = {
	premResults: null,
	countyProductsResults: null
};

const insPremiums = (state = defaultState, action) => {
	switch (action.type) {
		case "ADD_RESULT":
			return Object.assign({}, state, {
				premResults: action.premResults
			});

		case "ADD_COUNTY_RESULT":
			return Object.assign({}, state, {
				countyProductsResults: action.countyProductsResults
			});

		default:
			return state;

	}
};

export default insPremiums;

