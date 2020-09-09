export const generateChartData = (sigma, mu) => {
	let lowerl = 0.0001;
	let upperl = 0.999;

	let abLow = Math.exp(normsInv(lowerl) * sigma + mu);
	let abHigh = Math.exp(normsInv(upperl) * sigma + mu);
	let inc = (abHigh - abLow) / 49;

	let prices = [];
	let bigPyts = [];
	let litPyts = [];
	let curPrice = abLow;
	for (let i = 0; i < 50; i++) {
		let bigPyt = normalDistribution((Math.log(curPrice) - mu) / sigma);

		let lpt1 = Math.exp(-0.5 * Math.pow((Math.log(curPrice) - mu) / sigma, 2));
		let lpt2 = curPrice * sigma * Math.pow(2 * Math.PI, 0.5);
		let litPyt = lpt1 / lpt2;

		prices.push(curPrice);
		bigPyts.push(bigPyt);
		litPyts.push(litPyt);

		curPrice += inc;
	}
	return {"price": prices, "bigPyt": bigPyts, "litPyt": litPyts};
};

export const regeneratePriceTableData = (price, sigma, mu) => {
	let roundedToQuarter = (Math.round(price * 4) / 4).toFixed(2);
	let curPrice = roundedToQuarter - 1;

	let priceTableData = [];
	for (let i = 0; i < 9; i++) {
		priceTableData.push({
			id: i + 1,
			price: curPrice,
			probability: (getProbabilityForPrice(curPrice, sigma, mu) * 100).toFixed(2)
		});
		curPrice += .25;
	}
	return priceTableData;
};

function getProbabilityForPrice(price, sigma, mu) {
	return normalDistribution((Math.log(price) - mu) / sigma);
}

export const generateProbPoints = (sigma, mu) => {
	let percentiles = [5, 15, 25, 35, 45, 50, 55, 65, 75, 85, 95];

	let probTableData = [];
	for (let i = 0; i < percentiles.length; i++) {
		let percentile = percentiles[i] / 100;

		probTableData.push({
			id: i + 1,
			percentile: percentiles[i],
			price: Math.exp((normsInv(percentile) * sigma + mu)).toFixed(2)
		});
	}
	return probTableData;
};

function normalDistribution(z) {
	let c1 = 2.5066;
	let c2 = 0.3194;
	let c3 = -0.3566;
	let c4 = 1.7815;
	let c5 = -1.8213;
	let c6 = 1.3303;
	let w = 0;
	if (z > 0 || z === 0) {
		w = 1;
	}
	else {
		w = -1;
	}
	let y = 1 / (1 + 0.23164 * w * z);

	let yy = y * (c2 + y * (c3 + y * (c4 + y * (c5 + y * c6))));
	let zz = Math.exp(-z * z / 2) / c1;

	return 0.5 + w * (0.5 - zz * yy);
}

function normsInv(p) {
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
