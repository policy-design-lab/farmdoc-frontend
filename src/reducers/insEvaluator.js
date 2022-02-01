
const defaultState = {
	evaluatorResults: null,
	cropCode: 1700141,
	acres: 100,
	insUnit: "basic"
};

const insEvaluator = (state = defaultState, action) => {
	switch (action.type) {
		case "ADD_EVAL_RESULT":
			return Object.assign({}, state, {
				evaluatorResults: action.evaluatorResults
			});
		case "CHANGE_CROPCODE":
			return Object.assign({}, state, {
				cropCode: action.cropCode
			});
		case "CHANGE_ACRES":
			return Object.assign({}, state, {
				acres: action.acres
			});
		case "CHANGE_INS_UNIT":
			return Object.assign({}, state, {
				insUnit: action.insUnit
			});
		case "CHANGE_CROP_STATE_COUNTY_NAME":
			return Object.assign({}, state, {
				cropStateCountyName: action.cropStateCountyName
			});
		default:
			return state;

	}
};

export default insEvaluator;

