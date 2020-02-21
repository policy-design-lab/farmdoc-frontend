
export const handlePremiumResults = (premResults) => ({
	type: "ADD_RESULT",
	premResults
});

export const handleCountyProductsResults = (countyProductsResults) => ({
	type: "ADD_COUNTY_RESULT",
	countyProductsResults
});

export const changeCropCode = (cropCode) => ({
	type: "CHANGE_CROPCODE",
	cropCode
});

