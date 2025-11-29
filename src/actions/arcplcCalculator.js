export function changeCounty(county){
	return {
		type: "ARCPLC_CHANGE_COUNTY",
		county
	};
}

export function changeCommodity(commodity){
	return {
		type: "ARCPLC_CHANGE_COMMODITY",
		commodity
	};
}

export function changeForecastType(forecastType){
	return {
		type: "ARCPLC_CHANGE_FORECAST_TYPE",
		forecastType
	};
}

export function changeRefPrice(refPrice){
	return {
		type: "ARCPLC_CHANGE_REFPRICE",
		refPrice: refPrice
	};
}

export function changePaymentYield(paymentYield){
	return {
		type: "ARCPLC_CHANGE_PAYMENT_YIELD",
		paymentYield
	};
}

export function changeArcYield(arcYield){
	return {
		type: "ARCPLC_CHANGE_ARC_YIELD",
		arcYield
	};
}

export function changePracCode(pracCode){
	return {
		type: "ARCPLC_CHANGE_PRACCODE",
		pracCode
	};
}

export function changeStateName(stateName){
	return {
		type: "ARCPLC_CHANGE_STATE_NAME",
		stateName
	};
}

export function changeCountyName(countyName){
	return {
		type: "ARCPLC_CHANGE_COUNTY_NAME",
		countyName
	};
}

export const handleResults = (countyResults) => ({
	type: "ARCPLC_ADD_RESULT",
	countyResults
});

export const setLoading = (loading) => ({
	type: "ARCPLC_SET_LOADING",
	loading
});
