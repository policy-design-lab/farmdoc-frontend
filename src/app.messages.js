
// List of messages
export const genericRegistrationErrorMessage = "An error occurred while trying to register your account. Please try again later.";
export const userNotActiveMessage = "Registration is successful, but your account is not active yet. " +
	"Please contact an administrator.";
export const invalidLoginCredentials = "We do not recognize your username and/or password. Please try again.";
export const dataWolfGetTokenCallFailed = "An internal error occurred while logging in. Please try again later.";

export const welcometext = ["The Gardner Program Payment Calculator provides farmers, researchers and policymakers " +
"with a web-based analysis tool for farm program payments. The Payment Calculator will help improve the " +
"understanding of farm programs authorized by Congress in the Agricultural Improvement Act of 2018 (the farm bill), " +
"as well assist farmers with program decisions. The initial version of this tool will generate estimated program " +
"payments for individual farms from the Agriculture Risk Coverage, County (ARC-CO) and the Price Loss Coverage (PLC) " +
"farm programs in a web-based dashboard using county level historical data and modeled price and yield forecasts",
"  ",
"Funding for this project has been provided by the Gardner Agriculture Policy Program and by a cooperative agreement " +
"with the Office of the Chief Economist at the U.S. Department of Agriculture; it is operated in conjunction with " +
"the farmdoc project in the Dept. of Agricultural & Consumer Economics (ACE) and powered by the National Center for " +
"Supercomputing Applications (NCSA) at the University of Illinois at Urbana-Champaign."
];
export const register = "Creating an account allows you to save the simulation data" +
	" and information about your farm and fields.";
export const unauthorized = ["We are glad you want to check out Farmdoc Simulator ",
	"For the best experience, login or register for a free account."];
export const browserWarning = ["Your browser does not support all features of Farmdoc. " +
"You will not be able to login or run the application. Please use Google Chrome, Edge, Firefox or Safari"];
export const tryItOutWarning = ["By clicking ‘Login’ you are using an alpha release version of this tool which remains under development. " +
"The alpha release operates as a demonstration of the tool using a temporary account and FSA data current as of the alpha release. " +
"Additional developments and data will be incorporated into the final release version of the tool." +
"The temporary account will cease being active upon final release requiring everyone to establish an account to use the full features of the tool. "];
export const dataNotAvailable = ["Error: Data not available for the selected crop in the county. " +
"Choose a different crop or county."];
export const pracCodeNotSupported = ["Note: We are not supporting selecting irrigated and non-irrigated fields, yet. " +
"We will default to non-irrigated if available, otherwise irrigated."];
export const plcPayYieldToolTip = "The PLC Payment Yield is the payment yield for your FSA farm based on historic " +
	"average yields and available from the Farm Service Agency (FSA). The 2018 Farm Bill provided a one-time " +
	"opportunity for the landlord to elect to update the payment yield for the FSA farm";
export const arcTrendYieldToolTip = "The ARC Trend Yield is used to increase yields in previous years when calculating the ARC guarantee";
export const plcPayYieldInputToolTip = "Enter the PLC program yield for your FSA farm as provided by FSA; default is " +
	"the county average payment yield for PLC";
export const stateCountySelectToolTip = "Select the state and county for the FSA farm’s location";
export const cropSelectToolTip = "Select the crop for program payment estimate";
export const expectedPayoutTooltip = "This is the average expected payments including those cases that are $0 and those that are larger";
export const likelihoodTableToolTip = "Represents the chance of payments during a given year. A value of 14% means that " +
		"there is a 14% chance of payment";
export const simulationGraphToolTip = "Click on the graph images below to see information about the distribution of payments in the 1,000 " +
	"model runs";
export const simulatedPriceTableToolTip = "The expected price given the forecast model selected";
export const simulatedYieldTableToolTip = "The average of the yields in the given year";
export const arcCoverageRangeToolTip = "The ARC-CO payment is capped at a maximum of 10% of the benchmark revenue " +
	"for the crop";
export const arcCoverageToolTip = "ARC provides payments when actual revenue (price multiplied by yield) in a crop year" +
		" is below 86% of the benchmark (5 year Olympic moving average of prices and county average yields)";
export const paymentAcresToolTip = "Both ARC and PLC pay on 85% of the base acres for the FSA farm, not the actual acres " +
		"planted to the crop receiving payment";
export const forecastYearsToolTip = "Crop years covered by the farm bill; note that payments will be made after " +
	"October 1 st of the year following the crop year";

export const termDefinitions = [
	{
		"term": "PLC Payment Yield",
		"definition": "The PLC Payment Yield is the payment yield for your FSA farm based on historic average yields and available " +
			"from the Farm Service Agency (FSA).  The 2018 Farm Bill provided a one-time opportunity for the landlord to elect to " +
			"update the payment yield for the FSA farm.",
		 "links": [{"name": "Farm Bill PLC Yield Update", "href": "https://farmdocdaily.illinois.edu/2019/02/understanding-the-2018-farm-bill-plc-yield-update.html"}]
	},
	{
		"term": "ARC Trend-Adjusted Yield",
		"definition": "The Agriculture Risk Coverage (ARC) program calculates a revenue-based (prices times yields) payment, " +
			"including the average of the yields from the 5 most recent crop years (dropping the highest and lowest) at either the county" +
			" (ARC-CO) or individual (ARC-IC) farm levels.  The 2018 Farm Bill included a provision to permit the use of a trend-adjusted " +
			"yield factor to adjust the yields used in the ARC program calculations by replacing the yield with the trend-adjusted yield in " +
			"a manner similar to the yield factor that is used to increase yield history under the endorsement under the Federal Crop Insurance Act.",
		"links": [
			{"name": "Exceptional 2018 Corn and Soybean Yields and Budgeting for 2019",
				"href": "https://farmdocdaily.illinois.edu/2018/09/exceptional-2018-corn-and-soybean-yields-and-budgeting-for-2019.html"},
			{"name": "Trend-Adjusted APH Yield Endorsement",
				"href": "https://farmdocdaily.illinois.edu/2011/12/trend-adjusted-aph-yield-endor.html"}
		]
	},
	{
		"term": "Payment Acres",
		"definition": "Both ARC-CO and PLC make payments on 85% of the base acres for the farm.  Base acres are a record of" +
			" historic planting on the FSA farm available from the Farm Service Agency (FSA).  Payments are made using the base " +
			"acres in place of actual planted acres on the FSA farm.  The 2014 Farm Bill provided land owners a one-time " +
			"opportunity to revise the allocation of base acres for the FSA farm.",
		"links": [{"name": "Farm Bill Reallocating Base Acreage", "href": "https://farmdocdaily.illinois.edu/2014/03/2014-farm-bill-reallocating-base-acreage.html"}]
	},
	{
		"term": "ARC Coverage Level",
		"definition": "ARC provides coverage at 86% of the benchmark revenue (price multiplied by yield) for the crop " +
			"on the farm. The benchmark revenue is calculated using the average of the national Marketing Year Average (MYA) " +
			"prices for the crop for the most recent five years, excluding both the highest and lowest price years (Olympic moving" +
			" average), multiplied by the Olympic moving average of the county average yields for the most recent five years.  " +
			"The farm bill provides for the reference price to replace any price below it in the five most recent years.  " +
			"It also requires use of the trend-adjusted yield used by crop insurance in place of the county average yields and a plug " +
			"yield at 80% of the transitional yield for the county used by crop insurance.  The ARC-CO payment is capped at a maximum of " +
			"10% of the benchmark revenue for the crop.",
	},
	{
		"term": "ARC Coverage Range",
		"definition": "The ARC program calculates a revenue-based (prices times yields) payment that begins when actual revenue is " +
			"below 86% of the benchmark revenue, but payments are capped at no more than 10% of the benchmark revenue.  This creates" +
			" an effective coverage range of 86% to 76% of the benchmark revenue for payments."
	},
	{
		"term": "Reference Price",
		"definition": "The reference price was created by the 2014 Farm Bill to replace the target price created in the 2002 Farm " +
			"Bill. It is a commodity-specific fixed price in statute used to determine whether Price Loss Coverage (PLC) program payments" +
			" are triggered.  For a crop year, if the national Marketing Year Average (MYA) price is below the reference price, a payment is triggered" +
			" for the base acres of that commodity.  It is also known as the statutory reference price and is also used as a plug for the prices used " +
			"in the ARC program benchmark calculation, such that any crop year where the MYA is below the reference price the reference price " +
			"replaces that price for that year."
	},
	{
		"term": "Price Forecast Models",
		"definition": "The tool estimates ARC-CO and PLC payments for the 5 years of program operation under the 2018 Farm Bill " +
			"(2019 to 2023 crop years).  Because MYA prices are used in the program and payment calculations but are unknown for the " +
			"future, the models used in the tool incorporate MYA crop price forecasts to help farmers in their program decision."
	},
	{
		"term": "\"Forecast\" Price Scenario",
		"definition": "This is the base price forecast for each of the 2019 through 2023 crop years determined by crop price forecast " +
			"modeling.  Each year of the price scenario will be used in the program payment estimate model to run 1,000 estimates and average " +
			"them to estimate the ARC-CO and PLC payments and likelihood of payments under the MYA price forecast for each crop year.  It provides an" +
			" estimate of the potential payment if MYA prices were at the price forecast level for that crop year."
	},
	{
		"term": "\"High\" Price Scenario",
		"definition": "This scenario increases the MYA price used in the model runs to estimate payments and likelihood of payments if the MYA price in each " +
			"crop year was at a level higher than the forecast scenario.  This is not a forecast of prices but an increase in forecast prices to provide the" +
			" farmer with a comparison scenario where prices are above forecast levels and how that would change payments and the likelihood of payments from ARC-CO and PLC."
	},
	{
		"term": "\"Low\" Price Scenario",
		"definition": "Similar to the high price scenario, the low price scenario alters the price forecast to account for prices lower than the forecast scenario" +
			" to give the farmer a comparison of payments and likelihood of payments if MYA prices in each crop year are lower than the forecast."
	},
	{
		"term": "\"CBO\" Price Scenario",
		"definition": "The Congressional Budget Office (CBO) forecasts crop prices for future years using modeling and information from USDA.  These price" +
			" forecasts are used by CBO to estimate the payments and total costs of the farm programs for future years.  The tool permits a farmer " +
			"to select the CBO price forecasts as an alternative scenario for estimating ARC-CO and PLC payments and their likelihood.  The CBO forecast" +
			" of MYA prices are used for the 1,000 model runs of the tool in each of the crop years 2019 through 2023 as if those forecasts were the MYA price" +
			" for the crop year.  CBO updates its price forecasts each year and the tool will incorporate the latest CBO price forecasts in the scenario.",
		"links": [{"name": "January 2019 Estimates", "href": "https://www.cbo.gov/system/files?file=2019-01/51317-2019-01-usda.pdf"}]
	},
];
