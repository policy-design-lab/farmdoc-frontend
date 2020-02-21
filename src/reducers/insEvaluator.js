
const defaultState = {
	evaluatorResults: null
};

const insEvaluator = (state = defaultState, action) => {
	switch (action.type) {
		case "ADD_EVAL_RESULT":
			return Object.assign({}, state, {
				evaluatorResults: action.evaluatorResults
			});
		default:
			return state;

	}
};

export default insEvaluator;

