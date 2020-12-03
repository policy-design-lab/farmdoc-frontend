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

export function getStates(appName = null){
	let token = localStorage.getItem("kcToken");
	let token_header = `Bearer ${token}` ;
	let apiUrl = `${config.apiUrl}/states`;
	if (appName){
		apiUrl = `${apiUrl }?tool=${ appName}`;
	}

	return fetch(apiUrl, {
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

export function getCrops(appName = null){
	let token = localStorage.getItem("kcToken");
	let token_header = `Bearer ${token}` ;
	let apiUrl = `${config.apiUrl}/crops`;
	if (appName){
		apiUrl = `${apiUrl }?tool=${ appName}`;
	}

	return fetch(apiUrl, {
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

//TODO: This should be deprecated and the format returned from the api should be used directly.
// This is a temporary hack until datawolf is ready to accept crop id instead of crop name
export function covertToLegacyCropFormat(cropJson){
	return {
		"id": cropJson.name,
		"cropId": cropJson.crop_code,
		"cropDbKey": cropJson.id,
		"name": cropJson.long_name.charAt(0).toUpperCase() + cropJson.long_name.slice(1),
		"units": cropJson.unit,
		"refPrice": cropJson.ref_price,
		"binSize": cropJson.bin_size
	};
}

// This is a temporary hack until datawolf is ready to accept crop id instead of crop name
export function getCropDbKeyFromName(name){
	if (name === "corn"){
		return 1;
	}
	else if (name === "soybeans"){
		return 2;
	}
	else if (name === "wheat"){
		return 3;
	}
}

export function getForecastPrices(){
	let token = localStorage.getItem("kcToken");
	let token_header = `Bearer ${token}` ;
	let apiUrl = `${config.apiUrl}/forecastprices`;

	return fetch(apiUrl, {
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

export function getParams(cropCode){
	let token = localStorage.getItem("kcToken");
	let token_header = `Bearer ${token}` ;
	return fetch( `${config.apiUrl}/compute/params/${cropCode}/0/0`, {
		method: "GET",
		headers: {
			"Authorization": token_header
		}
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

	return fetch(`${config.apiUrl}/cropinfo/${countyFips}/crop/${commodity}`, {
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

export function getCropCodes(){
	return [
		{value: "C", label: "Corn"},
		{value: "S", label: "Soybeans"}];
}


export function getMonthCodes(crop_code){
	return assmbMonthYearCode(crop_code);
}


export function getYearCodes(crop_code){
	const month_menu = assmbMonthYearCode(crop_code);
	let years = Object.keys(month_menu);
	let year_codes = [];
	let i;
	for (i = 0; i < years.length; i++) {
		year_codes.push({value: years[i], label: years[i].toString()});
	}
	return year_codes;
}

export function getMonthYearCodes(crop_code){
	const month_menu = assmbMonthYearCode(crop_code);
	let years = Object.keys(month_menu);
	let month_year_codes = [];
	let i;
	let j;
	for (i = 0; i < years.length; i++) {
		for (j = 0; j < month_menu[years[i]].length; j++) {
			month_year_codes.push({
				value: `${month_menu[years[i]][j].value}-${years[i]}`,
				label: `${month_menu[years[i]][j].label} ${years[i].toString()}`});
		}
	}
	return month_year_codes;
}

function assmbMonthYearCode(crop_code) {
	const CORN_CODES = [
		{value: "", label: "Jan"},
		{value: "", label: "Feb"},
		{value: "H", label: "Mar"},
		{value: "", label: "Apr"},
		{value: "K", label: "May"},
		{value: "", label: "Jun"},
		{value: "N", label: "Jul"},
		{value: "", label: "Aug"},
		{value: "U", label: "Sep"},
		{value: "", label: "Oct"},
		{value: "", label: "Nov"},
		{value: "Z", label: "Dec"}
	];
	const SOYBEANS_CODES = [
		{value: "F", label: "Jan"},
		{value: "", label: "Feb"},
		{value: "H", label: "Mar"},
		{value: "", label: "Apr"},
		{value: "K", label: "May"},
		{value: "", label: "Jun"},
		{value: "N", label: "Jul"},
		{value: "Q", label: "Aug"},
		{value: "U", label: "Sep"},
		{value: "", label: "Oct"},
		{value: "X", label: "Nov"},
		{value: "", label: "Dec"}
	];

	let cdate = new Date();
	// cdate = new Date(cdate.getFullYear(), 10, 10);
	let fdate = new Date(cdate.getFullYear(), cdate.getMonth() + 1, 1);
	console.log(cdate, fdate);
	// second Friday of the month, expiration day for the next month futures
	let friday_full = nthDayOfMonth(5, 2, cdate);
	if (cdate.getDate() > friday_full.getDate()) {
		fdate.setMonth(fdate.getMonth() + 1);
	}
	console.log(cdate, fdate);

	let month_code = "";
	let month_year_code = [];
	let month_menu = {};
	let fyear = fdate.getFullYear();
	// e.g. 18 months rolling forward
	const month_roll = 18;
	let i = 0;
	while (i <= month_roll) {
		let year = fdate.getFullYear();
		let month = fdate.getMonth();
		if (year !== fyear) {
			fyear = year;
			month_year_code = [];
			month_menu[year] = month_year_code;
		}
		if ((crop_code === "C") && CORN_CODES[month].value) {
			month_code = CORN_CODES[month];
			month_year_code.push(month_code);
			month_menu[year] = month_year_code;
		}
		if ((crop_code === "S") && SOYBEANS_CODES[month].value) {
			month_code = SOYBEANS_CODES[month];
			month_year_code.push(month_code);
			month_menu[year] = month_year_code;
		}
		fdate.setMonth(fdate.getMonth() + 1);
		i += 1;
	}
	const keys = Object.keys(month_menu);
	// remove last year if empty
	const last = month_menu[keys[keys.length - 1]];
	if (!last.length) {
		delete month_menu[keys[keys.length - 1]];
	}
	return month_menu;
}

function nthDayOfMonth(day, n, date) {
	// https://stackoverflow.com/questions/32192982/get-a-given-weekday-in-a-given-month-with-javascript

	let count = 0;
	let idate = new Date(date);
	idate.setDate(1);

	while (count < n) {
		idate.setDate(idate.getDate() + 1);
		if (idate.getDay() === day) {
			count++;
		}
	}

	return idate;
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

export function roundResults(val, n){
	if (n === undefined || n === 0) {
		return Math.round(val);
	}
	else {
		return Number(val).toFixed(n);
	}
}

export function roundResultsIfNotZero(val, n){
	return (val === 0) ? "NA" : roundResults(val, n);
}

export function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
