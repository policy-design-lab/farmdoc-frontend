
const defaultState = {
	yearRowIndex: 0
};

const results = (state = defaultState, action) => {
	switch (action.type) {

		case "CHANGE_YEAR_ROW":
			return Object.assign({}, state, {
				yearRowIndex: action.yearRowIndex
			});
		default:
			return state;
	}
};

export default results;

