/*eslint-env es6*/
import {uncmin} from "numeric";

export const calculateMuSigmaEff = (apiresults) => {
	let optimizationFunction = function (x) {
		return computeScenario(x[0], x[1], apiresults.futuresData);
	};

	// debug
	//let solution = [apiresults.previousSolution.mu, apiresults.previousSolution.sigma];
	let solution = uncmin(optimizationFunction, [apiresults.previousSolution.mu, apiresults.previousSolution.sigma]).solution;

	return {mu: solution[0], sigma: solution[1]};
};

function computeScenario(mu, sig, futuresData) {
	const BELOW = 6;
	const ABOVE = 6;
	const STEP = 10;

	let cErrors = 0;
	let pErrors = 0;

	let nearest = Math.round((parseFloat(futuresData["price"])) / STEP) * STEP;

	let lower = nearest - (BELOW * STEP);
	let upper = nearest + (ABOVE * STEP);
	let strike = lower;

	// console.log(`price: ${futuresData["price"]}\n`);
	// console.log(`nearest: ${nearest}\n`);
	// console.log(`lower: ${lower}\n`);
	// console.log(`upper: ${upper}\n`);

	while (strike <= upper) {
		// console.log(` strike: ${strike}\n`);

		let rf = 0.03;
		let dte = futuresData["dte"];

		//******** Call *********
		let key = `${strike}-0C`;
		let callPrem = futuresData.data[key];
		// console.log(`callPrem: ${callPrem}\n`);
		let callDevSquared = 0;
		let fk = 0;
		let iexk = 0;
		let btCalc = 0;

		if (callPrem != null) {
			let btCalc = 1 / Math.exp(rf * dte / 360);
			let optionBasedEx = Math.exp(mu + (sig * sig / 2));

			let fk = normalDistribution((Math.log(strike / 100) - mu) / sig);
			let iexk = optionBasedEx * normalDistribution((Math.log(strike / 100) - mu - sig * sig) / sig);
			let callImpliedPrice = (optionBasedEx - iexk - strike / 100 * (1 - fk)) * btCalc;

			callDevSquared = Math.pow(callPrem / 100 - callImpliedPrice, 2);
			// console.log(`callDevSquared: ${callDevSquared}\n`);
		}

		//******** Put *********
		let putDevSquared = 0;
		let putKey = `${strike}-0P`;
		let putPrem = futuresData.data[putKey];

		if (putPrem != null) {
			let putPrice = ((strike / 100) * fk - iexk) * btCalc;

			putDevSquared = Math.pow(putPrem / 100 - putPrice, 2);
		}

		strike += STEP;

		cErrors += callDevSquared;
		pErrors += putDevSquared;
	}
	// totalErrors = cErrors + pErrors;
	// console.log(`errors: ${totalErrors}\n`);
	return cErrors + pErrors;
}

function normalDistribution(z) {

	let c1 = 2.506628;
	let c2 = 0.3193815;
	let c3 = -0.3565638;
	let c4 = 1.7814779;
	let c5 = -1.821256;
	let c6 = 1.3302744;
	let w = 0;
	if (z > 0 || z === 0) {
		w = 1;
	}
	else {
		w = -1;
	}
	let y = 1 / (1 + 0.2316419 * w * z);
	return 0.5 + w * (0.5 - (Math.exp(-z * z / 2) / c1) *
		(y * (c2 + y * (c3 + y * (c4 + y * (c5 + y * c6))))));
}
