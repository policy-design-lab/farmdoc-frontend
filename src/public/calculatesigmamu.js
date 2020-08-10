/*eslint-env es6*/

import {uncmin} from "numeric";

//let apiresults = jsonfile.results;
let apiresults = null;

let optimizationFunction = function (x) {
	return computeScenario(x[0], x[1], apiresults.futuresData);
};

let solution = uncmin(optimizationFunction, [apiresults.previousSolution.mu, apiresults.previousSolution.sigma]).solution;
let mu = solution[0];
let sigma = solution[1];

console.log(mu);
console.log(sigma);

export function computeScenario(mu, sig, futuresData) {
	const BELOW = 6;
	const ABOVE = 6;
	const STEP = 10;

	let cErrors = 0;
	let pErrors = 0;

	let nearest = Math.round((parseFloat(futuresData["price"])) / STEP) * STEP;

	let lower = nearest - (BELOW * STEP);
	let upper = nearest + (ABOVE * STEP);
	let strike = lower;

	console.log(`price: ${futuresData["price"]}\n`);
	console.log(`nearest: ${nearest}\n`);
	console.log(`lower: ${lower}\n`);
	console.log(`upper: ${upper}\n`);

	while (strike <= upper) {
		console.log(` strike: ${strike}\n`);

		let rf = 0.03;
		let dte = futuresData["dte"];

		//******** Call *********
		let key = `${strike}-0C`;
		let callPrem = futuresData.data[key];
		console.log(`callPrem: ${callPrem}\n`);
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
			console.log(`callDevSquared: ${callDevSquared}\n`);
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

	let totalErrors = cErrors + pErrors;
	console.log(`errors: ${totalErrors}\n`);

	return totalErrors;
}

export function normalDistribution(z) {

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

export function normsInv(p) {
	if (typeof p == "string" || p instanceof String) {
		p = parseFloat(p);
	}
	let a1 = -39.6968;
	let a2 = 220.9461;
	let a3 = -275.92851;
	let a4 = 138.3578;
	let a5 = -30.6648;
	let a6 = 2.5066;
	let b1 = -54.47610;
	let b2 = 161.5858;
	let b3 = -155.6990;
	let b4 = 66.8013;
	let b5 = -13.28068;
	let c1 = -.00778;
	let c2 = -0.3224;
	let c3 = -2.4008;
	let c4 = -2.5497;
	let c5 = 4.37466;
	let c6 = 2.93816;
	let d1 = .0077847;
	let d2 = 0.3225;
	let d3 = 2.4451;
	let d4 = 3.7544;
	let p_low = 0.02425;
	let p_high = 1 - p_low;
	let q = 0.0;
	let r = 0.0;
	let NormSInv = 0;
	if (p < 0 || p > 1) {
		return null;
	}
	else if (p < p_low) {
		q = Math.sqrt(-2 * Math.log(p));
		NormSInv = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) *
			q + d4) * q + 1);
	}
	else if (p <= p_high) {
		q = p - 0.5;
		r = q * q;
		NormSInv = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) *
			r + b3) * r + b4) * r + b5) * r + 1);
	}
	else {
		q = Math.sqrt(-2 * Math.log(1 - p));
		NormSInv = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) *
			q + d4) * q + 1);
	}
	return NormSInv;
}
