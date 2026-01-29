export const getScenarioKey = (scoEnabled, ecoLevel) => {
	const scoOn = scoEnabled === true || scoEnabled === "on";
	const eco =
		typeof ecoLevel === "string"
			? ecoLevel.toLowerCase()
			: String(ecoLevel).toLowerCase();

	if (scoOn && (eco === "90" || eco === "90%")) {
		return "SCOECO90";
	}
	if (scoOn && (eco === "95" || eco === "95%")) {
		return "SCOECO95";
	}
	if (scoOn && (eco === "off" || eco === "")) {
		return "SCO";
	}
	if (!scoOn && (eco === "90" || eco === "90%")) {
		return "ECO90";
	}
	if (!scoOn && (eco === "95" || eco === "95%")) {
		return "ECO95";
	}
	return "noadd";
};

export const parseEcoValue = (ecoLevel) => {
	if (!ecoLevel) {
		return "off";
	}
	const str = String(ecoLevel).toLowerCase();
	if (str.includes("90")) {
		return "90";
	}
	if (str.includes("95")) {
		return "95";
	}
	return "off";
};

export const generateCompareScenarios = (baseScenario) => {
	const scoOn =
		baseScenario.scoEnabled === true || baseScenario.scoEnabled === "on";
	const ecoValue = parseEcoValue(baseScenario.ecoLevel);

	const scenarios = [];

	if (ecoValue === "90") {
		scenarios.push(
			{scoEnabled: false, ecoLevel: "off", scenarioKey: "noadd"},
			{scoEnabled: true, ecoLevel: "90", scenarioKey: "SCOECO90"},
			{scoEnabled: false, ecoLevel: "90", scenarioKey: "ECO90"}
		);
	}
	else if (ecoValue === "95") {
		scenarios.push(
			{scoEnabled: false, ecoLevel: "off", scenarioKey: "noadd"},
			{scoEnabled: true, ecoLevel: "95", scenarioKey: "SCOECO95"},
			{scoEnabled: false, ecoLevel: "95", scenarioKey: "ECO95"}
		);
	}
	else {
		scenarios.push(
			{scoEnabled: false, ecoLevel: "off", scenarioKey: "noadd"},
			{scoEnabled: true, ecoLevel: "90", scenarioKey: "SCOECO90"},
			{scoEnabled: false, ecoLevel: "90", scenarioKey: "ECO90"}
		);
	}

	return scenarios.filter(
		(s) =>
			s.scenarioKey !==
			getScenarioKey(baseScenario.scoEnabled, baseScenario.ecoLevel)
	);
};
