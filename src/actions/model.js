
export function changeCounty(county){
	return {
		type: "CHANGE_COUNTY",
		county
	};
}

export function changeCommodity(commodity){
	return {
		type: "CHANGE_COMMODITY",
		commodity
	};
}

export function changeRefPrice(refPrice){
	return {
		type: "CHANGE_REFPRICE",
		refPrice: refPrice
	};
}
export function changePaymentYield(paymentYield){
	return {
		type: "CHANGE_PAYMENT_YIELD",
		paymentYield
	};
}
export function changeCoverage(coverage){
	return {
		type: "CHANGE_COVERAGE",
		coverage
	};
}
export function changeRange(range){
	return {
		type: "CHANGE_RANGE",
		range
	};
}
export function changeAcres(acres){
	return {
		type: "CHANGE_ACRES",
		acres
	};
}

export const handleResults = (countyResults) => ({
	type: "ADD_RESULT",
	countyResults
});
