export const datawolfURL = "https://fd-datawolf.ncsa.illinois.edu/datawolf";

const workflowId = "71bcf219-6219-4caf-97c9-b4b7cc8f7531";

export const steps = {
	Farm_Model: "1837d87b-04b3-4902-bdf7-ea53c71467b0"
};

const inputDatasets = {
	Price_File: "3d21a2f2-2bd0-4f6d-a3bb-563b3599f25a"
};

export function postExecutionRequest(personId, title, countyId, startYear, commodity, refPrice, paymentAcres, arcCoverage, arcRange,
																		 plcYield, program, sequesterPrice = 0, forecastPrices, binSize ){
	let pracCode = 3;
	return {
		"workflowId": workflowId,
		"creatorId": personId,
		"title": title,
		"description": "test",
		"parameters": {
			"be1aeac8-781e-49f1-b8be-533580377bd7": arcRange, //ARC Range
			"8c97da97-624b-4a1c-f826-2663fb23e365": paymentAcres, // Payment Acres %
			"d5ab0594-d234-4e86-ef88-0021c12990a2": commodity, //Commodity
			"bc5f25cb-75b5-4441-b088-14590e6f32a1": arcCoverage, // ARC Coverage
			"4fc6629c-16d2-48c8-ad6c-b952c8a59713": refPrice, //Reference Price
			"b144b8d7-1839-4af3-ec54-565efb39da64": countyId, //County Id
			"24d75c6c-f115-418c-9d93-e9996659a3ff": plcYield, //PLC Payment Yield
			"1ff27e78-94c4-461b-c658-4dbf216a1eea": program, //Program - can be defunct
			"371c485f-1793-4fa4-ea4c-7c40b41f53a7": sequesterPrice, //Sequester Price
			"5b1074be-c4b8-480d-efd6-37bdf28ed848": startYear, //Start year
			"9ab51a09-ab06-4b41-bca8-e60a53e2e2b1": pracCode,
			"b3d7d841-a15b-47d7-92ff-0c093bc10add": forecastPrices,
			"37c9520e-7d7b-4a5b-8aca-77e038f3702c": binSize
		},

		"datasets": {
			// "82392893-8b9d-498d-acba-7219b00c0b6c": inputDatasets.Model_Data_File,
			"f8583dca-3056-4452-9c5d-a67e7251f11b": inputDatasets.Price_File
		}
	};
}

export const resultDatasetId = "eb2eaad5-389b-421d-bc3d-378730d6ffd2";

