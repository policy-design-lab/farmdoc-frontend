export const datawolfURL = "https://fd-datawolf.ncsa.illinois.edu/datawolf";

const workflowId = "1ce73a96-c7cf-4a08-a88b-9f2650a7283b";

export const steps = {
	Farm_Model: "42315803-2613-4273-e5fb-93c402160029" //"f2c7c102-1e9d-4590-f3b8-4eafa5ed8250"
};

const inputDatasets = {
	Price_File: "454c0403-1481-4c34-89da-454b570dcc43" //commoditydata.mat
};

export function postExecutionRequest(personId, title, countyId, startYear, commodity, refPrice, paymentAcres, arcCoverage, arcRange, plcYield, program, sequesterPrice = 0 ){
	let pracCode = 3;
	return {
		"workflowId": workflowId,
		"creatorId": personId,
		"title": title,
		"description": "test",
		"parameters": {
			"6122e54b-c0cc-4e3c-95f7-0b97d489044e": arcRange, //ARC Range
			"b2be2b6d-698d-463e-d865-83e115af43c3": paymentAcres, // Payment Acres %
			"283d016c-c5e2-480e-83e6-23903d8c9752": commodity, //Commodity
			"1519192f-8cc1-41a3-eaf6-2c9902bfa851": arcCoverage, // ARC Coverage
			"18a158a3-687c-49f2-a5f4-c25dbc6bbe91": refPrice, //Reference Price
			"c445ad63-0ab0-41ca-a0ee-9faae6e1a3dd": countyId, //County Id
			"fea2cf2b-a682-4a47-a7ad-772c31f46bc9": plcYield, //PLC Payment Yield
			"c50ef6bf-4b52-40a9-fc32-7365ba27d06b": program, //Program - can be defunct
			"cb3e9b65-49f2-4123-9342-a3801d7b4d2e": sequesterPrice, //Sequester Price
			"eedcadf9-e028-4e50-9eb0-48876b23f61d": startYear, //Start year
			"9edf142f-001c-4681-a24e-e8abaf8de972": pracCode
		},

		"datasets": {
			// "82392893-8b9d-498d-acba-7219b00c0b6c": inputDatasets.Model_Data_File,
			"5d3749ca-4ce4-4902-ef8a-24767ac8f160": inputDatasets.Price_File
			//"d2a2f3d2-fd76-4868-befc-7087d5795049": inputDatasets.Price_File
		}
	};
}

export const resultDatasetId = "eb57225f-a64c-47c3-84e6-d641f4a30b3b"; //07ec54a8-46ec-47c1-ac3a-cf641a8a6652";

