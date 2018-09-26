export const datawolfURL = "https://fd-datawolf.ncsa.illinois.edu/datawolf";

const workflowId = "6e540fa0-740a-4de8-9746-d4ea66fd6883";

export const steps = {
	Farm_Model: "f2c7c102-1e9d-4590-f3b8-4eafa5ed8250"
};

const inputDatasets =  {
	Price_File: "7b1d0825-5eb2-4923-bb21-0efdadc0de01", //cornDev.mat
	Model_Data_File: "de004f6e-7347-460b-82cd-94e333755dcb" //finalcornData.mat
};

const outputDatasets = {
	Std_Out: "7bd67eee-93a2-4c47-8e9b-7610389afd1f",
	Out_Json: "9c48cc03-21af-457e-871c-6c100da68955"
};

export function postExecutionRequest(personId, title, countyId, startYear, commodity, refPrice, paymentAcres, arcCoverage, arcRange, plcYield, program, sequesterPrice = 0 ){
	return{
		"workflowId": workflowId,
		"creatorId": personId,
		"title": title,
		"description":"test",
		"parameters": {
			"9df9afb2-b195-426e-e7d1-88f67812201a": arcRange, //ARC Range
			"7fb2f1f3-7f83-44ec-dea7-8c5c4f754afd": paymentAcres, // Payment Acres %
			"eca927f5-209d-4c93-ad4a-6244f0470d22": commodity, //Commodity
			"acb95d7c-893b-48fd-f714-f67ae838c624": arcCoverage, // ARC Coverage
			"50e4d615-8275-42e8-fafb-1c4054d12c2f": refPrice, //Reference Price
			"92e576a6-d2cb-4990-feaa-ab41187489e3": countyId, //County Id
			"cdaadad1-23d9-4089-c428-744fe0ceb239": plcYield, //PLC Payment Yield
			"e5821e9d-2254-4b3e-825f-d67f0c203caa": program, //Program - can be defunct
			"43944d3b-3b5d-41c6-8996-c89fe8d6b46c": sequesterPrice, //Sequester Price
			"97d653bf-fec1-41ba-8b8d-fffb2b3a3d5e": startYear   //Start year

		},


		"datasets": {
			"82392893-8b9d-498d-acba-7219b00c0b6c": inputDatasets.Model_Data_File,
			"d2a2f3d2-fd76-4868-befc-7087d5795049": inputDatasets.Price_File
		}

	};

}

export const resultDatasetId = "07ec54a8-46ec-47c1-ac3a-cf641a8a6652";


