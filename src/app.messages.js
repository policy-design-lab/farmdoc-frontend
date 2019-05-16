
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
export const dataNotAvailable = ["Error: Data not available for the selected crop in the county. " +
"Choose a different crop or county."];
export const pracCodeNotSupported = ["Note: We are not supporting selecting irrigated and non-irrigated fields, yet. " +
"We will default to non-irrigated if available, otherwise irrigated."];
export const plcPayYieldToolTip = "The PLC Payment Yield is the payment yield for your FSA farm based on historic " +
	"average yields and available from the Farm Service Agency (FSA). The 2018 Farm Bill provided a one-time " +
	"opportunity for the landlord to elect to update the payment yield for the FSA farm.";
export const arcTrendYieldToolTip = "The Arc Trend Yield is...";
export const plcPayYieldInputToolTip = "Enter the PLC program yield for your FSA farm as provided by FSA; default is " +
	"the county average payment yield for PLC";
export const stateCountySelectToolTip = "Select the state and county for the FSA farm’s location";
export const cropSelectToolTip = "Select the crop for program payment estimate";

export const likelihoodTableToolTip = "Likelihood of payment represents the average of payments in the model over " +
	"1,000 model runs in the price and yield scenarios";
export const simulationGraphToolTip = "Click on the graph images below to see information about the distribution of payments in the 1,000 " +
	"model runs.";
export const simulatedPriceTableToolTip = "The simulated price is the Marketing Year Average price based on...";
export const simulatedYieldTableToolTip = "The simulated yield is the trend-adjusted yield for the county";
export const arcCoverageRangeToolTip = "The ARC-CO payment is capped at a maximum of 10% of the benchmark revenue " +
	"for the crop";
export const arcCoverageToolTip = "ARC provides coverage at 86% of the benchmark revenue (price multiplied by yield) " +
	"for the crop on the farm. The benchmark revenue is calculated using the average of the national Marketing Year " +
	"Average (MYA) prices for the crop for the most recent five years, excluding both the highest and lowest price " +
	"years (Olympic moving average), multiplied by the Olympic moving average of the county average yields for the " +
	"most recent five years. The farm bill provides for the reference price to replace any price below it in the " +
	"five most recent years. It also requires use of the trend-adjusted yield used by crop insurance in place of the " +
	"county average yields and a plug yield at 80% of the transitional yield for the county used by crop insurance.";
export const paymentAcresToolTip = "Both ARC-CO and PLC make payments on 85% of the base acres for the farm. Base " +
	"acres are a record of historic planting on the FSA farm available from the Farm Service Agency (FSA). Payments " +
	"are made using the base acres in place of actual planted acres on the FSA farm. The 2014 Farm Bill provided " +
	"land owners a one-time opportunity to revise the allocation of base acres for the FSA farm.";
export const forecastYearsToolTip = "Crop years covered by the farm bill; note that payments will be made after " +
	"October 1 st of the year following the crop year.";
