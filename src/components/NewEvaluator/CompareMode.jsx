import {useState, useRef, useEffect} from "react";
import {connect} from "react-redux";
import {
	Box,
	Typography,
	Button,
	Select,
	MenuItem,
	ThemeProvider,
	IconButton,
	CircularProgress,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import EditIcon from "@material-ui/icons/Edit";
import AddPlanCard from "./AddPlanCard";
import AddPlanModal from "./AddPlanModal";
import EditFarmInfoModal from "./EditFarmInfoModal";
import EditBaseSelectionCard from "./EditBaseSelectionCard";
import EditPlanCard from "./EditPlanCard";
import InsurancePlanCard from "./InsurancePlanCard";
import YieldPriceInfo from "./YieldPriceInfo";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import {downloadAsPDF} from "../../utils/pdfDownload";
import {fetchEvaluatorResults} from "../../services/evaluatorApi";
import {getScenarioKey, generateCompareScenarios} from "../../utils/insuranceScenarios";
import {
	handleEvaluatorResults,
	changeAcres,
	changeCropCode,
	changeCropStateCountyName,
	changeInsurancePlan,
	changeCoverageLevel,
	changeAphYield,
	changeFarmTaYield,
	changeInsUnit,
} from "../../actions/insEvaluator";
import "../../styles/new-evaluator.scss";

const CompareMode = ({
	onBack,
	farmInfo,
	baseSelection,
	cropStateCountyName,
	acres,
	policies,
	bestBundles,
	insurancePlan,
	coverageLevel,
	cropCode,
	insUnit,
	dispatch,
	initialScoEnabled,
	initialEcoLevel,
}) => {
	const [plans, setPlans] = useState([]);
	const [showAddPlan, setShowAddPlan] = useState(false);
	const [showAddPlanModal, setShowAddPlanModal] = useState(false);
	const [addPlanAnchorEl, setAddPlanAnchorEl] = useState(null);
	const [editFarmInfoModalOpen, setEditFarmInfoModalOpen] = useState(false);
	const [editingPlanIndex, setEditingPlanIndex] = useState(null);
	const [editingBaseCard, setEditingBaseCard] = useState(false);
	const [unitStructure, setUnitStructure] = useState(insUnit || "enterprise");
	const [currentFarmInfo, setCurrentFarmInfo] = useState(farmInfo);
	const [currentPolicies, setCurrentPolicies] = useState(policies);
	const [baseScoEnabled, setBaseScoEnabled] = useState(initialScoEnabled || false);
	const [baseEcoLevel, setBaseEcoLevel] = useState(initialEcoLevel || "off");
	const [currentBaseMetrics, setCurrentBaseMetrics] = useState({
		"est-premium": baseSelection?.["est-premium"],
		"avg-payment": baseSelection?.["avg-payment"],
		"net-cost": baseSelection?.["net-cost"],
		"var-1": baseSelection?.["var-1"],
	});
	const [currentInsurancePlan, setCurrentInsurancePlan] =
		useState(insurancePlan);
	const [currentCoverageLevel, setCurrentCoverageLevel] =
		useState(coverageLevel);
	const [currentCropStateCountyName, setCurrentCropStateCountyName] =
		useState(cropStateCountyName);
	const [currentAcres, setCurrentAcres] = useState(acres);
	const [currentCropCode, setCurrentCropCode] = useState(cropCode);
	const [isRecalculating, setIsRecalculating] = useState(false);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const fullPageRef = useRef(null);

	useEffect(() => {
		if (policies && insurancePlan && coverageLevel) {
			const scenarioKey = getScenarioKey(baseScoEnabled, baseEcoLevel);
			const policyKey = `${insurancePlan}-${unitStructure}`;
			const policyData =
				policies?.farm?.[scenarioKey]?.[coverageLevel.toString()]?.[policyKey];

			if (policyData) {
				setCurrentBaseMetrics({
					"est-premium": policyData["est-premium"],
					"avg-payment": policyData["avg-payment"],
					"net-cost": policyData["net-cost"],
					"var-1": policyData["var-1"],
				});
			}
		}
	}, [unitStructure, policies, insurancePlan, coverageLevel, baseScoEnabled, baseEcoLevel]);

	useEffect(() => {
		if (!initialLoadComplete && policies && insurancePlan && coverageLevel) {
			const compareScenarios = generateCompareScenarios({
				scoEnabled: baseScoEnabled,
				ecoLevel: baseEcoLevel
			});
			const newPlans = compareScenarios.map((scenario, index) => {
				const scenarioKey = scenario.scenarioKey;
				const policyKey = `${insurancePlan}-${unitStructure}`;
				const policyData = policies?.farm?.[scenarioKey]?.[coverageLevel.toString()]?.[policyKey];
				return {
					planNumber: index + 2,
					planName: insurancePlan,
					coverageLevel: coverageLevel,
					scoEnabled: scenario.scoEnabled,
					ecoLevel: scenario.ecoLevel,
					estimatedPremium: policyData?.["est-premium"] || 0,
					avgIndemnityPayment: policyData?.["avg-payment"] || 0,
					netCost: policyData?.["net-cost"] || 0,
					netBenefit: policyData?.["var-1"] || 0,
				};
			});
			setPlans(newPlans);
			setInitialLoadComplete(true);
		}
	}, [policies, insurancePlan, coverageLevel, unitStructure, baseScoEnabled, baseEcoLevel, initialLoadComplete]);

	useEffect(() => {
		// console.log("[Yield & Price Render] Current farm info updated:", currentFarmInfo);
		// console.log("[Yield & Price Render] Avg Futures Price:", currentFarmInfo?.["avg-futures-price"]);
		// console.log("[Yield & Price Render] Projected Price:", currentFarmInfo?.["proj-price"]);
	}, [currentFarmInfo]);

	const handleUnitStructureChange = (e) => {
		const newUnit = e.target.value;
		setUnitStructure(newUnit);
		dispatch(changeInsUnit(newUnit));
	};

	const handleAddPlan = (event) => {
		setAddPlanAnchorEl(event.currentTarget);
		setShowAddPlanModal(true);
	};

	const handleClosePlan = () => {
		setShowAddPlan(false);
	};

	const parseAddon = (addonString) => {
		if (!addonString || addonString === "none") {
			return {scoEnabled: false, ecoLevel: "off"};
		}
		const hasSCO = addonString.includes("SCO");
		const hasECO = addonString.includes("ECO");
		let ecoLevel = "off";
		if (hasECO) {
			if (addonString.includes("90")) {
				ecoLevel = "90";
			}
			else if (addonString.includes("95")) {
				ecoLevel = "95";
			}
		}
		return {
			scoEnabled: hasSCO,
			ecoLevel: ecoLevel
		};
	};

	const updateSpecialCardFromBestBundle = (plan, newBestBundles, newPolicies) => {
		if (!plan.isSpecialCard || !plan.bundleType || !newBestBundles) {
			return null;
		}
		const bundleKey = plan.bundleType === "minimize-net-cost" ? "min_net_cost" : "max_var10";
		const bundleData = newBestBundles[bundleKey];
		if (!bundleData) {
			return null;
		}
		const {addon, coverage, policy} = bundleData;
		const {scoEnabled, ecoLevel} = parseAddon(addon);
		const scenarioKey = getScenarioKey(scoEnabled, ecoLevel);
		const policyKey = `${policy}`;
		const policyData = newPolicies?.farm?.[scenarioKey]?.[coverage]?.[policyKey];
		if (!policyData) {
			return null;
		}
		const planName = policy.replace("-enterprise", "").replace("-basic", "");
		return {
			...plan,
			planName: planName,
			coverageLevel: parseInt(coverage),
			scoEnabled: scoEnabled,
			ecoLevel: ecoLevel,
			estimatedPremium: policyData["est-premium"],
			avgIndemnityPayment: policyData["avg-payment"],
			netCost: policyData["net-cost"],
			netBenefit: policyData["var-1"]
		};
	};

	const handleRunEvaluatorWithBestBundle = (bundleType) => {
		if (!bestBundles) {
			return;
		}
		let bundleData;
		let bannerText;
		let bannerColor;
		let bannerTextColor;
		let bannerIcon;
		if (bundleType === "minimize-net-cost") {
			bundleData = bestBundles["min_net_cost"];
			bannerText = "Minimized Net Cost";
			bannerColor = "#88007F14";
			bannerTextColor = "#88007F";
			bannerIcon = "GraphTrendAlert";
		}
		else if (bundleType === "max-variance") {
			bundleData = bestBundles["max_var10"];
			bannerText = "Minimum rsk (one-in-ten years event) 10";
			bannerColor = "#00378514";
			bannerTextColor = "#003785";
			bannerIcon = "AutoGraph";
		}
		if (!bundleData) {
			return;
		}
		const {addon, coverage, policy} = bundleData;
		const {scoEnabled, ecoLevel} = parseAddon(addon);
		const scenarioKey = getScenarioKey(scoEnabled, ecoLevel);
		const policyKey = `${policy}`;
		const policyData = currentPolicies?.farm?.[scenarioKey]?.[coverage]?.[policyKey];
		if (!policyData) {
			return;
		}
		const planName = policy.replace("-enterprise", "").replace("-basic", "");
		const newPlan = {
			planNumber: plans.length + 2,
			planName: planName,
			coverageLevel: parseInt(coverage),
			scoEnabled: scoEnabled,
			ecoLevel: ecoLevel,
			estimatedPremium: policyData["est-premium"],
			avgIndemnityPayment: policyData["avg-payment"],
			netCost: policyData["net-cost"],
			netBenefit: policyData["var-1"],
			bannerText: bannerText,
			bannerColor: bannerColor,
			bannerTextColor: bannerTextColor,
			bannerIcon: bannerIcon,
			isSpecialCard: true,
			bundleType: bundleType
		};
		setPlans([...plans, newPlan]);
		setShowAddPlanModal(false);
		setAddPlanAnchorEl(null);
	};

	const handleModalOptionSelect = (optionType) => {
		if (optionType === "new") {
			setShowAddPlan(true);
		}
		else if (optionType === "minimize-net-cost" || optionType === "max-variance") {
			handleRunEvaluatorWithBestBundle(optionType);
		}
		else {
			handleRunEvaluatorWithPreset(optionType);
		}
	};

	const handleRunEvaluatorWithPreset = (presetType) => {
		const presetValues = {
			"reduce-risk": {
				planName: "rp",
				coverageLevel: 85,
				estimatedPremium: 22.5,
				avgIndemnityPayment: 32.0,
				netCost: -10.5,
				netBenefit: 750.0,
			},
			"minimize-premium": {
				planName: "yp",
				coverageLevel: 60,
				estimatedPremium: 12.0,
				avgIndemnityPayment: 18.0,
				netCost: -6.0,
				netBenefit: 550.0,
			},
			"maximize-indemnity": {
				planName: "rp",
				coverageLevel: 85,
				estimatedPremium: 25.0,
				avgIndemnityPayment: 40.0,
				netCost: -15.0,
				netBenefit: 850.0,
			},
		};

		const preset = presetValues[presetType];
		if (preset) {
			const newPlan = {
				planNumber: plans.length + 2,
				planName: preset.planName,
				coverageLevel: preset.coverageLevel,
				scoStatus: "Off",
				ecoStatus: "Off",
				estimatedPremium: preset.estimatedPremium,
				avgIndemnityPayment: preset.avgIndemnityPayment,
				netCost: preset.netCost,
				netBenefit: preset.netBenefit,
			};
			setPlans([...plans, newPlan]);
		}
	};

	const handleRunEvaluator = (planData) => {
		const newPlan = {
			planNumber: plans.length + 2,
			planName: planData.selectedPlan || "yp",
			coverageLevel: planData.coverageLevel || 60,
			scoStatus: "Off",
			ecoStatus: "Off",
			estimatedPremium: 18.25,
			avgIndemnityPayment: 24.5,
			netCost: -6.25,
			netBenefit: 650.0,
		};
		setPlans([...plans, newPlan]);
		setShowAddPlan(false);
	};

	const handleEditBaseInsurancePlan = () => {
		setEditingBaseCard(!editingBaseCard);
	};

	const handleEditPlan = (index) => {
		setEditingPlanIndex(index);
	};

	const handleFarmInfoSave = async (formData) => {
		setIsRecalculating(true);

		const updatedAcres = formData.acres;
		const aphYield =
			formData.aphYield &&
			formData.aphYield !== "xx.xx" &&
			formData.aphYield !== ""
				? parseFloat(formData.aphYield)
				: null;
		const farmTaYield =
			formData.farmTaYield &&
			formData.farmTaYield !== "xx.xx" &&
			formData.farmTaYield !== ""
				? parseFloat(formData.farmTaYield)
				: null;

		const updatedCropCode = formData.cropCode || currentCropCode;
		const response = await fetchEvaluatorResults(
			updatedCropCode,
			updatedAcres,
			"test",
			aphYield,
			farmTaYield
		);

		if (response.success && response.data) {
			const newFarmInfo = response.data["farm-info"];
			const newPolicies = response.data.policies;
			const newBestBundles = response.data["best-bundles"];
			setCurrentFarmInfo(newFarmInfo);
			setCurrentPolicies(newPolicies);
			setCurrentCropStateCountyName([
				formData.crop,
				formData.state,
				formData.county,
			]);
			setCurrentAcres(updatedAcres);
			if (updatedCropCode) {
				setCurrentCropCode(updatedCropCode);
			}
			dispatch(handleEvaluatorResults(JSON.stringify(response.data)));
			dispatch(changeAcres(updatedAcres));
			dispatch(
				changeCropStateCountyName([
					formData.crop,
					formData.state,
					formData.county,
				])
			);
			dispatch(changeAphYield(newFarmInfo?.["farm-aph"] || aphYield));
			dispatch(changeFarmTaYield(newFarmInfo?.["trend-adj-aph"] || farmTaYield));
			if (updatedCropCode) {
				dispatch(changeCropCode(updatedCropCode));
			}

			const baseScenarioKey = getScenarioKey(baseScoEnabled, baseEcoLevel);
			const policyKey = `${currentInsurancePlan}-${unitStructure}`;
			const policyData =
				response.data.policies?.farm?.[baseScenarioKey]?.[currentCoverageLevel.toString()]?.[
					policyKey
				];

			if (policyData) {
				setCurrentBaseMetrics({
					"est-premium": policyData["est-premium"],
					"avg-payment": policyData["avg-payment"],
					"net-cost": policyData["net-cost"],
					"var-1": policyData["var-1"],
				});
			}

			const updatedPlans = await Promise.all(
				plans.map(async (plan) => {
					if (plan.isSpecialCard) {
						const updatedSpecialCard = updateSpecialCardFromBestBundle(plan, newBestBundles, newPolicies);
						return updatedSpecialCard || plan;
					}
					const planScenarioKey = getScenarioKey(plan.scoEnabled, plan.ecoLevel);
					const planPolicyKey = `${plan.planName}-${unitStructure}`;
					const planPolicyData =
						response.data.policies?.farm?.[planScenarioKey]?.[plan.coverageLevel.toString()]?.[
							planPolicyKey
						];

					if (planPolicyData) {
						return {
							...plan,
							estimatedPremium: planPolicyData["est-premium"],
							avgIndemnityPayment: planPolicyData["avg-payment"],
							netCost: planPolicyData["net-cost"],
							netBenefit: planPolicyData["var-1"],
						};
					}
					return plan;
				})
			);

			setPlans(updatedPlans);
		}
		else {
			console.error("[Farm Info Edit] API request failed or no data received");
		}

		setIsRecalculating(false);
		setEditFarmInfoModalOpen(false);
	};

	const handleBaseInsurancePlanChange = (planData) => {
		const scenarioKey = getScenarioKey(baseScoEnabled, baseEcoLevel);
		const policyKey = `${planData.planName}-${unitStructure}`;
		const policyData =
			currentPolicies?.farm?.[scenarioKey]?.[planData.coverageLevel.toString()]?.[policyKey];

		if (policyData) {
			setCurrentInsurancePlan(planData.planName);
			setCurrentCoverageLevel(planData.coverageLevel);
			setCurrentBaseMetrics({
				"est-premium": policyData["est-premium"],
				"avg-payment": policyData["avg-payment"],
				"net-cost": policyData["net-cost"],
				"var-1": policyData["var-1"],
			});
			dispatch(changeInsurancePlan(planData.planName));

			dispatch(changeCoverageLevel(planData.coverageLevel));

			setEditingBaseCard(false);
		}
		else {
			console.error("[Base Card Edit] Policy data not found for:", policyKey);
		}
	};

	const handleInsurancePlanSave = async (planData) => {
		if (editingPlanIndex !== null) {
			const updatedPlans = [...plans];
			const planToUpdate = updatedPlans[editingPlanIndex];

			const scenarioKey = getScenarioKey(planToUpdate.scoEnabled, planToUpdate.ecoLevel);
			const policyKey = `${planData.planName}-${unitStructure}`;
			const policyData =
				currentPolicies?.farm?.[scenarioKey]?.[planData.coverageLevel.toString()]?.[policyKey];

			if (policyData) {
				updatedPlans[editingPlanIndex] = {
					...planToUpdate,
					planName: planData.planName,
					coverageLevel: planData.coverageLevel,
					estimatedPremium: policyData["est-premium"],
					avgIndemnityPayment: policyData["avg-payment"],
					netCost: policyData["net-cost"],
					netBenefit: policyData["var-1"],
				};
				setPlans(updatedPlans);
			}
		}

		setEditingPlanIndex(null);
	};

	const handleViewDifference = (index) => {
		//console.log("View difference to Base Selection for plan", index);
	};

	const handleDelete = (index) => {
		const updatedPlans = plans.filter((_, i) => i !== index);
		setPlans(
			updatedPlans.map((plan, i) => ({
				...plan,
				planNumber: i + 2,
			}))
		);
	};

	const handleDownloadPDF = () => {
		if (fullPageRef.current) {
			downloadAsPDF(fullPageRef.current, "compare-mode-full-page.pdf");
		}
	};

	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Box className="compare-mode-full-container" ref={fullPageRef}>
				<Box className="compare-mode-header-full">
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={onBack}
						className="back-button"
					>
						Back
					</Button>
				</Box>
				<Box className="compare-mode-title-row">
					<Typography className="compare-mode-title-center">
						Compare insurance plans
					</Typography>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						endIcon={<ArrowDropDownIcon />}
						onClick={handleAddPlan}
						className="add-insurance-plan-btn"
						disabled={plans.length >= 5}
					>
						Add insurance plan
					</Button>
				</Box>

				<Box className="compare-content-full">
					<Box className="farm-yield-row" style={{position: "relative"}}>
						{isRecalculating && (
							<Box
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: "rgba(255, 255, 255, 0.8)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									zIndex: 10,
									borderRadius: "8px",
								}}
							>
								<CircularProgress size={50} style={{color: "#455A64"}} />
							</Box>
						)}
						<Box className="farm-info-section-full">
							<Box className="farm-info-card">
								<Typography className="farm-info-title">
									Farm information
								</Typography>
								<IconButton
									className="edit-button-icon"
									onClick={() => setEditFarmInfoModalOpen(true)}
								>
									<EditIcon />
								</IconButton>
							</Box>
							<Box className="farm-info-grid">
								<Box className="farm-info-item">
									<Typography className="farm-info-label">STATE</Typography>
									<Typography className="farm-info-value">
										{currentCropStateCountyName && currentCropStateCountyName[1]
											? currentCropStateCountyName[1]
											: "Not available"}
									</Typography>
								</Box>
								<Box className="farm-info-item">
									<Typography className="farm-info-label">COUNTY</Typography>
									<Typography className="farm-info-value">
										{currentCropStateCountyName && currentCropStateCountyName[2]
											? currentCropStateCountyName[2]
											: "Not available"}
									</Typography>
								</Box>
								<Box className="farm-info-item">
									<Typography className="farm-info-label">CROP</Typography>
									<Typography className="farm-info-value">
										{currentCropStateCountyName && currentCropStateCountyName[0]
											? currentCropStateCountyName[0]
											: "Not available"}
									</Typography>
								</Box>
								<Box className="farm-info-item">
									<Typography className="farm-info-label">ACRES</Typography>
									<Typography className="farm-info-value">
										{currentAcres || "Not available"}
									</Typography>
								</Box>
								<Box className="farm-info-item">
									<Typography className="farm-info-label">APH YIELD</Typography>
									<Typography className="farm-info-value">
										{currentFarmInfo?.["farm-aph"]
											? `${currentFarmInfo["farm-aph"]} bu/acre`
											: "Not available"}
									</Typography>
								</Box>
								<Box className="farm-info-item">
									<Typography className="farm-info-label">
										FARM TA YIELD
									</Typography>
									<Typography className="farm-info-value">
										{currentFarmInfo?.["trend-adj-aph"]
											? `${currentFarmInfo["trend-adj-aph"]} bu/acre`
											: "Not available"}
									</Typography>
								</Box>
							</Box>
						</Box>

						<Box className="yield-price-section-compare">
							<YieldPriceInfo
								farmInfo={currentFarmInfo}
								showCompareButton={false}
								crop={currentCropStateCountyName?.[0] || ""}
							/>
						</Box>
					</Box>

					<Box
						className="insurance-summary-section-full"
						style={{position: "relative"}}
					>
						{isRecalculating && (
							<Box
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: "rgba(255, 255, 255, 0.8)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									zIndex: 10,
									borderRadius: "8px",
								}}
							>
								<CircularProgress size={50} style={{color: "#455A64"}} />
							</Box>
						)}
						<Box className="summary-header">
							<Typography className="summary-title">
								Insurance Impact Summary
							</Typography>
							<Box
								style={{display: "flex", alignItems: "center", gap: "8px"}}
							>
								<Select
									value={unitStructure}
									onChange={handleUnitStructureChange}
									className="unit-dropdown"
									disableUnderline
									IconComponent={ArrowDropDownIcon}
									MenuProps={{
										anchorOrigin: {
											vertical: "bottom",
											horizontal: "left",
										},
										transformOrigin: {
											vertical: "top",
											horizontal: "left",
										},
										getContentAnchorEl: null,
										classes: {
											paper: "unit-dropdown-menu",
										},
									}}
								>
									<MenuItem value="enterprise">Enterprise Unit</MenuItem>
									<MenuItem value="basic">Basic Unit</MenuItem>
								</Select>
								<IconButton
									size="small"
									onClick={handleDownloadPDF}
									className="download-btn"
								>
									<SaveAltIcon />
								</IconButton>
							</Box>
						</Box>

						<Box className="plans-grid-full">
							{editingBaseCard ? (
								<EditBaseSelectionCard
									planTitle="YOUR BASE SELECTION"
									onClose={() => setEditingBaseCard(false)}
									onSave={handleBaseInsurancePlanChange}
									initialPlan={currentInsurancePlan}
									initialCoverageLevel={currentCoverageLevel}
								/>
							) : (
								<InsurancePlanCard
									planName={currentInsurancePlan || "rp"}
									coverageLevel={currentCoverageLevel || 80}
									countyAddsOnOptions={[
										{
											label: "Supplemental Coverage Option (SCO)",
											values: [],
											status: "Off",
										},
										{
											label: "Enhanced Coverage Option (ECO)",
											values: ["90%", "95%"],
											status: "Off",
										},
									]}
									estimatedPremium={currentBaseMetrics?.["est-premium"]}
									avgIndemnityPayment={currentBaseMetrics?.["avg-payment"]}
									netCost={currentBaseMetrics?.["net-cost"]}
									avgWorstScenario={currentBaseMetrics?.["var-1"]}
									isEnterprise={unitStructure === "enterprise"}
									policies={currentPolicies}
									mode="compare"
									planTitle="YOUR BASE SELECTION"
									baseMetrics={{
										estimatedPremium: currentBaseMetrics?.["est-premium"],
										avgIndemnityPayment: currentBaseMetrics?.["avg-payment"],
										netCost: currentBaseMetrics?.["net-cost"],
										netBenefit: currentBaseMetrics?.["var-1"],
									}}
									onEdit={handleEditBaseInsurancePlan}
									initialScoEnabled={baseScoEnabled}
									initialEcoLevel={baseEcoLevel}
									onScoChange={setBaseScoEnabled}
									onEcoChange={setBaseEcoLevel}
								/>
							)}

							{plans.map((plan, index) =>
								editingPlanIndex === index ? (
									<EditPlanCard
										key={index}
										planTitle={`PLAN ${plan.planNumber}`}
										onClose={() => setEditingPlanIndex(null)}
										onSave={handleInsurancePlanSave}
										initialPlan={plan.planName}
										initialCoverageLevel={plan.coverageLevel}
									/>
								) : (
									<InsurancePlanCard
										key={index}
										planNumber={plan.planNumber}
										planName={plan.planName}
										coverageLevel={plan.coverageLevel}
										countyAddsOnOptions={[
											{
												label: "Supplemental Coverage Option (SCO)",
												values: [],
												status: plan.scoStatus || "Off",
											},
											{
												label: "Enhanced Coverage Option (ECO)",
												values: ["90%", "95%"],
												status: plan.ecoStatus || "Off",
											},
										]}
										estimatedPremium={plan.estimatedPremium}
										avgIndemnityPayment={plan.avgIndemnityPayment}
										netCost={plan.netCost}
										avgWorstScenario={plan.netBenefit}
										isEnterprise={unitStructure === "enterprise"}
										policies={currentPolicies}
										mode="compare"
										planTitle={`PLAN ${plan.planNumber}`}
										baseMetrics={{
											estimatedPremium: currentBaseMetrics?.["est-premium"],
											avgIndemnityPayment: currentBaseMetrics?.["avg-payment"],
											netCost: currentBaseMetrics?.["net-cost"],
											netBenefit: currentBaseMetrics?.["var-1"],
										}}
										onEdit={() => handleEditPlan(index)}
										onViewDifference={() => handleViewDifference(index)}
										onDelete={() => handleDelete(index)}
										initialScoEnabled={plan.scoEnabled}
										initialEcoLevel={plan.ecoLevel}
										bannerText={plan.bannerText}
										bannerColor={plan.bannerColor}
										bannerTextColor={plan.bannerTextColor}
										bannerIcon={plan.bannerIcon}
										isSpecialCard={plan.isSpecialCard}
									/>
								)
							)}

							{showAddPlan && (
								<AddPlanCard
									planTitle={`PLAN ${plans.length + 2}`}
									onClose={handleClosePlan}
									onRunEvaluator={handleRunEvaluator}
								/>
							)}
						</Box>
					</Box>
				</Box>

				<AddPlanModal
					open={showAddPlanModal}
					anchorEl={addPlanAnchorEl}
					onClose={() => {
						setShowAddPlanModal(false);
						setAddPlanAnchorEl(null);
					}}
					onSelectOption={handleModalOptionSelect}
				/>

				<EditFarmInfoModal
					open={editFarmInfoModalOpen}
					onClose={() => {
						setEditFarmInfoModalOpen(false);
					}}
					onSave={handleFarmInfoSave}
					initialData={{
						state: currentCropStateCountyName?.[1] || "Illinois",
						county: currentCropStateCountyName?.[2] || "Champaign",
						crop: currentCropStateCountyName?.[0] || "Corn",
						acres: currentAcres || "100",
						aphYield: currentFarmInfo?.["farm-aph"] || "xx.xx",
						farmTaYield: currentFarmInfo?.["trend-adj-aph"] || "xx.xx",
					}}
				/>
			</Box>
		</ThemeProvider>
	);
};

const mapStateToProps = (state) => {
	return {
		cropStateCountyName: state.insEvaluator.cropStateCountyName,
		acres: state.insEvaluator.acres,
		cropCode: state.insEvaluator.cropCode,
		insUnit: state.insEvaluator.insUnit,
	};
};

export default connect(mapStateToProps)(CompareMode);
