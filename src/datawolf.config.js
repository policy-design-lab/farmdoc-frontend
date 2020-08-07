export const datawolfURL = "https://fd-api-dev.ncsa.illinois.edu/datawolf";

const workflowId = "43c512ee-606f-450b-aea4-ecfe8b880bd2";

export const steps = {
	Farm_Model: "7ebc89d3-d5a6-4df1-b75f-eeed11acf174"
};
const inputDatasets = {
	Price_File: "3d21a2f2-2bd0-4f6d-a3bb-563b3599f25a"
};
export function postExecutionRequest(personId, title, countyId, startYear, commodity, refPrice, paymentAcres, arcCoverage, arcRange,
																		 plcYield, program, sequesterPrice = 0, forecastPrices, binSize, pracCode ){
	return {
		"workflowId": workflowId,
		"creatorId": personId,
		"title": title,
		"description": "test",
		"parameters": {
			"04554766-6d02-4123-ae41-5802950620d1": arcRange, //ARC Range
			"b1cd6724-cc1f-45fc-b69d-9b60f5f65627": paymentAcres, // Payment Acres %
			"4744261b-d50e-4bf7-8cf2-a5274c01a2e7": commodity, //Commodity
			"8a4c5fad-9ec5-45d4-98fb-c03f192b31cd": arcCoverage, // ARC Coverage
			"652f8811-6560-4d4b-c293-9cf41fa7304e": refPrice, //Reference Price
			"72fe600b-3013-4229-d73f-213fd830860a": countyId, //County Id
			"e5a5f432-abbb-451d-dd10-1a3904b1b65d": plcYield, //PLC Payment Yield
			"097c166c-94ec-40e3-c46e-7d3c22d63f4c": program, //Program - can be defunct
			"23b2175d-992f-4b44-ea1f-f2611f9cd18d": sequesterPrice, //Sequester Price
			"727ed062-a252-4d71-bb50-34a0c3c66132": startYear, //Start year
			"cd4d71e9-98a6-4a8f-d821-ba3ee38a80ef": pracCode,
			"9603f52b-a88d-4cd3-e965-1dbb7c0c75da": forecastPrices,
			"7bf5e9f3-336b-4928-94cd-72e60bb5642f": binSize
		}
	};
}
export const resultDatasetId = "06f553c1-1098-4792-e395-62d26f6164fa";

// Price distribution tool
const workflowPdId = "b26006d1-c433-423e-921a-8c9e315361a0";
// const creatorPdId = "f6f7dc55-4337-4ff9-940c-afaa2911b9bb";
export function postExecutionPdRequest(personId, title, cropCode, monthCode, year){
	return {
		"workflowId": workflowPdId,
		"creatorId": personId,
		"title": title,
		"description": "test",
		"parameters": {
			"4f1c7e94-31a6-4093-c544-c6eb1858dfe7": cropCode, // Crop code
			"ba29e87f-2b82-4650-d4cc-e1650bc02e1e": monthCode, // Month code
			"b8702c09-d588-4a1e-f111-ea1fa1d5a379": year // Year
		}
	};
}
export const stepsPd = {
	Price_Distribution: "bca95adb-58e2-4054-85ec-f61cbb342e65"
};
export const resultDatasetPdId = "8b702a08-0681-4fe4-88eb-89abaf775793";

