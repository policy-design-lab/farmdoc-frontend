export const handleEvaluatorResults = (evaluatorResults) => ({
	type: "ADD_EVAL_RESULT",
	evaluatorResults
});

export const changeCropCode = (cropCode) => ({
	type: "CHANGE_CROPCODE",
	cropCode
});

export const changeAcres = (acres) => ({
	type: "CHANGE_ACRES",
	acres
});

export const changeInsUnit = (insUnit) => ({
	type: "CHANGE_INS_UNIT",
	insUnit
});

export const changeCropStateCountyName = (cropStateCountyName) => ({
	type: "CHANGE_CROP_STATE_COUNTY_NAME",
	cropStateCountyName
});

export const changeInsurancePlan = (insurancePlan) => ({
	type: "CHANGE_INSURANCE_PLAN",
	insurancePlan
});

export const changeCoverageLevel = (coverageLevel) => ({
	type: "CHANGE_COVERAGE_LEVEL",
	coverageLevel
});

export const setLoading = (loading) => ({
	type: "SET_LOADING",
	loading
});

export const changeAphYield = (aphYield) => ({
	type: "CHANGE_APH_YIELD",
	aphYield
});

export const changeFarmTaYield = (farmTaYield) => ({
	type: "CHANGE_FARM_TA_YIELD",
	farmTaYield
});
