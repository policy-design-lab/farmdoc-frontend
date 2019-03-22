
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

export function changeForecastType(forecastType){
	return {
		type: "CHANGE_FORECAST_TYPE",
		forecastType
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

export function changeArcYield(arcYield){
	return {
		type: "CHANGE_ARC_YIELD",
		arcYield
	};
}

export const handleResults = (countyResults) => ({
	type: "ADD_RESULT",
	countyResults
});
