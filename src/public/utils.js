import {datawolfURL} from "../datawolf.config";
import config from "../app.config";

/***
 * Checks if user
 * @returns {Promise.<*>}
 */
export async function checkAuthentication() {

	let personId = sessionStorage.getItem("personId");

	return await fetch(`${datawolfURL  }/persons/${  personId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Origin": "http://localhost:3000"
		},
		credentials: "include"
	});
}


export function isUserAuthenticated() {

	// Return true if the user is authenticated, else return false.
	checkAuthentication().then(function (checkAuthResponse) {
		return checkAuthResponse.status === 200;
	});
}

export function groupBy(list, keyGetter) {
	const map = new Map();
	list.forEach((item) => {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
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
	return `_${  Math.random().toString(36).substr(2, 9)}`;
};

// check if withCoverCropDatasetResultGUID & withoutCoverCropDatasetResultGUID is validate is outside of this
// function
export async function getOutputFileJson(datasetId, outputFileName = null) {
	let headers = {
		"Content-Type": "application/json",
		"Access-Control-Origin": "http://localhost:3000"
	};

	// Get - Result Dataset
	const datasetResponse = await
		fetch(`${datawolfURL  }/datasets/${  datasetId}`, {
			method: "GET",
			headers: headers,
			credentials: "include"
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
		const fileDownloadResponse = await fetch(`${datawolfURL  }/datasets/${  datasetId  }/${  fileId  }/file`,
			{
				method: "GET",
				headers: headers,
				credentials: "include"
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
export function ConvertDDToDMS(dd)
{
	let deg = dd | 0; // truncate dd to get degrees
	let frac = Math.abs(dd - deg); // get fractional part
	let min = (frac * 60) | 0; // multiply fraction by 60 and truncate
	let sec = frac * 3600 - min * 60;
	sec = sec.toFixed(2);
	return `${deg  }d ${  min  }' ${  sec  }"`;
}

export function calculateDayOfYear(date) {
	let timeStamp = new Date().setFullYear(date.getFullYear(), 0, 1);
	let yearFirstDay = Math.floor(timeStamp / 86400000);
	let today = Math.ceil((date.getTime()) / 86400000);
	return today - yearFirstDay;
}



export async function wait(ms) {
	new Promise(resolve => setTimeout(resolve, ms));
}

