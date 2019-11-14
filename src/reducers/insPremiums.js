
const defaultState = {
	premResults: null
};

const insPremiums = (state = defaultState, action) => {
	switch (action.type) {
		case "ADD_RESULT":
			return Object.assign({}, state, {
				premResults: action.premResults
			});

		default:
			return state;

	}
};

export default insPremiums;

