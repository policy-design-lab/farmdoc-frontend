import config from "../app.config";

export const fetchEvaluatorResults = async (
	cropCountyCode,
	farmAcres,
	email = "test",
	aphYield = null,
	taYield = null,
	coverageLevel = null,
	insurancePlan = null
) => {
	const token = localStorage.getItem("kcToken");
	const token_header = token ? `Bearer ${token}` : undefined;
	const headers = token_header
		? {
			Authorization: token_header,
		  }
		: {};
	const apiUrlPath = `${config.apiUrl}/compute/simulator`;
	const evaluatorParams = [
		["code", cropCountyCode],
		["acres", farmAcres],
		["email", email],
	];
	if (aphYield) {
		evaluatorParams.push(["aphYield", aphYield]);
	}
	if (taYield) {
		evaluatorParams.push(["taYield", taYield]);
	}
	const queryString = new URLSearchParams(evaluatorParams).toString();
	const fullUrl = `${apiUrlPath}?${queryString}`;
	const evaluatorResponse = await fetch(fullUrl, {
		method: "GET",
		headers: headers,
	});
	if (evaluatorResponse instanceof Response) {
		try {
			const evaluatorResult = await evaluatorResponse.json();
			if (typeof evaluatorResult === "object") {
				return {
					success: true,
					data: evaluatorResult,
				};
			}
			else {
				console.error(
					"[API Response] Invalid response type:",
					typeof evaluatorResult
				);
				return {
					success: false,
					data: null,
				};
			}
		}
		catch (error) {
			console.error("[API Error] Error getting the response from API:", error);
			return {
				success: false,
				data: null,
				error: error,
			};
		}
	}
	return {
		success: false,
		data: null,
	};
};
