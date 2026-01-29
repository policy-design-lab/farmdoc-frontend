import {roundFarmTaYield} from "../public/utils";

const defaultState = {
	evaluatorResults: null,
	cropCode: null,
	acres: null,
	insUnit: "basic",
	insurancePlan: "rp",
	coverageLevel: 80,
	loading: false,
	aphYield: null,
	farmTaYield: null,
	cropStateCountyName: null,
};

const insEvaluator = (state = defaultState, action) => {
	switch (action.type) {
		case "ADD_EVAL_RESULT":
			return Object.assign({}, state, {
				evaluatorResults: action.evaluatorResults,
				loading: false,
			});
		case "SET_LOADING":
			return Object.assign({}, state, {
				loading: action.loading,
			});
		case "CHANGE_CROPCODE":
			return Object.assign({}, state, {
				cropCode: action.cropCode,
			});
		case "CHANGE_ACRES":
			return Object.assign({}, state, {
				acres: action.acres,
			});
		case "CHANGE_INS_UNIT":
			return Object.assign({}, state, {
				insUnit: action.insUnit,
			});
		case "CHANGE_CROP_STATE_COUNTY_NAME":
			return Object.assign({}, state, {
				cropStateCountyName: action.cropStateCountyName,
			});
		case "CHANGE_INSURANCE_PLAN":
			return Object.assign({}, state, {
				insurancePlan: action.insurancePlan,
			});
		case "CHANGE_COVERAGE_LEVEL":
			return Object.assign({}, state, {
				coverageLevel: action.coverageLevel,
			});
		case "CHANGE_APH_YIELD":
			return Object.assign({}, state, {
				aphYield: action.aphYield,
			});
		case "CHANGE_FARM_TA_YIELD": {
			let val = action.farmTaYield;
			if (val !== null && val !== undefined) {
				val = roundFarmTaYield(val);
			}
			return Object.assign({}, state, {
				farmTaYield: val,
			});
		}
		default:
			return state;
	}
};

export default insEvaluator;
