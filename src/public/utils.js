import {datawolfURL} from "../datawolf.config";
import config from "../app.config";

export function clearKeycloakStorage(){
	localStorage.removeItem("dwPersonId");
	localStorage.removeItem("kcEmail");
	localStorage.removeItem("kcToken");
	localStorage.removeItem("kcRefreshToken");
	localStorage.removeItem("kcTokenExpiry");
	localStorage.setItem("isAuthenticated", "false");
}

export function checkForTokenExpiry(){
	let expUtcSeconds = 0;

	if (localStorage.getItem("kcTokenExpiry") != null){
		expUtcSeconds = localStorage.getItem("kcTokenExpiry");
	}

	let expDateTime = new Date(0);
	expDateTime.setUTCSeconds(expUtcSeconds);

	let curDate = new Date();

	// console.log(expDateTime);
	// console.log(curDate);
	// console.log(`Expiry in secs: ${ expUtcSeconds - Date.now() / 1000}`);

	if (curDate >= expDateTime){
		console.log("Keycloak Token Expired. Logging out in a few seconds..");
		return true;
	}

	return false;
}


export function checkIfDatawolfUserExists(email) {
	let token = localStorage.getItem("kcToken");
	let token_header = `Bearer ${token}`;

	return fetch(`${datawolfURL}/persons?email=${email}`, {
		method: "GET",
		headers: {
			"Authorization": token_header
		},
	}).then(function(response){
		return response;
	});
}

export function createDatawolfUser(email, fname, lname){
	let token = localStorage.getItem("kcToken");
	let token_header = `Bearer ${token}` ;

	return fetch(`${datawolfURL}/persons?email=${email}&firstname=${fname}&lastname=${lname}`, {
		method: "POST",
		headers: {
			"Authorization": token_header
		}
	}).then(function(response) {
		return response;
	});
}

export function getStates(){
	let token = localStorage.getItem("kcToken");
	let token_header = `Bearer ${token}` ;

	return fetch(`${config.apiUrl}/states`, {
		method: "GET",
		headers: {
			"Authorization": token_header
		}
	}).then(function(response){
		return response;
	}).catch(error => {
		console.log(error);
		console.log("Error in making the getStates Flask api call. Most likely due to network or service being down");
	});
}

export function getParams(){

	return fetch("http://localhost:5000/api/compute/params/1701341/0/0", {
		method: "GET",
	}).then(function(response){
		return response;
	}).catch(error => {
		console.log(error);
		console.log("Error in making the getParams Flask api call. Most likely due to network or service being down");
	});
}

export function getCounties(stateId){
	let token = localStorage.getItem("kcToken");
	let token_header = `Bearer ${token}` ;

	return fetch(`${config.apiUrl}/counties/${stateId}`, {
		method: "GET",
		headers: {
			"Authorization": token_header
		}
	}).then(function(response){
		return response;
	}).catch(error => {
		console.log(error);
		console.log("Error in making the getStates Flask api call. Most likely due to network or service being down");
	});
}

export function getCropParams(countyFips, commodity){
	let token = localStorage.getItem("kcToken");
	let token_header = `Bearer ${token}` ;

	return fetch(`${config.apiUrl}/commodities/${countyFips}/commodity/${commodity}`, {
		method: "GET",
		headers: {
			"Authorization": token_header
		}
	}).then(function(response){
		return response;
	}).catch(error => {
		console.log(error);
		console.log("Error in making the getStates Flask api call. Most likely due to network or service being down");
	});
}

export function groupBy(list, keyGetter) {
	const map = new Map(String, String);
	list.forEach((item) => {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		}
		else {
			collection.push(item);
		}
	});
	return map;
}

export function sortByDateInDescendingOrder(a, b) {
	return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export const ID = function () {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return `_${ Math.random().toString(36).substr(2, 9)}`;
};

// check if withCoverCropDatasetResultGUID & withoutCoverCropDatasetResultGUID is validate is outside of this
// function
export async function getOutputFileJson(datasetId, outputFileName = null) {

	let token = localStorage.getItem("kcToken");
	let token_header = `Bearer ${token}`;

	let kcHeaders = {
		"Content-Type": "application/json",
		"Authorization": token_header
	};

	// Get - Result Dataset
	const datasetResponse = await
	fetch(`${datawolfURL }/datasets/${ datasetId}`, {
		method: "GET",
		headers: kcHeaders,
	});

	const resultDataset = await datasetResponse.json();
	let fileId = -1;

	// If output filename is already provided as input, use that to figure out the exact file that needs to be downloaded
	if (outputFileName !== null) {
		for (let i = 0; i < resultDataset.fileDescriptors.length; i++) {
			if (resultDataset.fileDescriptors[i].filename === outputFileName) {
				fileId = resultDataset.fileDescriptors[i].id;
				break;
			}
		}
	}
	// If no output filename is provided, get the first file in the dataset
	else {

		if (resultDataset.fileDescriptors.length > 0) {
			fileId = resultDataset.fileDescriptors[0].id;
		}
	}

	if (fileId !== -1) {
		// Get - Result File Download
		const fileDownloadResponse = await fetch(`${datawolfURL }/datasets/${ datasetId }/${ fileId }/file`,
			{
				method: "GET",
				headers: kcHeaders,
			});

		return await fileDownloadResponse.json();
	}
	else {
		return null;
	}
}


/**
 * @return {string}
 */
export function ConvertDDToDMS(dd) {
	let deg = dd | 0; // truncate dd to get degrees
	let frac = Math.abs(dd - deg); // get fractional part
	let min = (frac * 60) | 0; // multiply fraction by 60 and truncate
	let sec = frac * 3600 - min * 60;
	sec = sec.toFixed(2);
	return `${deg }d ${ min }' ${ sec }"`;
}

export function calculateDayOfYear(date: Date) {
	let timeStamp = new Date().setFullYear(date.getFullYear(), 0, 1);
	let yearFirstDay = Math.floor(timeStamp / 86400000);
	let today = Math.ceil((date.getTime()) / 86400000);
	return today - yearFirstDay;
}


export async function wait(ms) {
	new Promise(resolve => setTimeout(resolve, ms));
}

export function getMarketPricesForForecastModel(modelId, commodity){
	let modelsList = config.forecastTypes;
	let retstr = "";
	for (let i = 0 ; i < modelsList.length ; i++) {
		if (modelsList[i]["id"] === modelId) {
			return retstr = modelsList[i]["prices"][commodity].join();
		}
	}

	return retstr;
}

export function getBinSizeForCrop(cropId){
	let cropsList = config.commodities;
	let binSize = 10;
	for (let i = 0 ; i < cropsList.length ; i++) {
		if (cropsList[i]["id"] === cropId) {
			return binSize = cropsList[i]["binSize"];
		}
	}

	return binSize;
}

export function roundResults(val, n){
	if (n === undefined || n === 0) {
		return Math.round(val);
	}
	else {
		return Number(val).toFixed(n);
	}
}

