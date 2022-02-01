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
