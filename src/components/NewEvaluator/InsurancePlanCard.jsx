import React, {useState, useEffect, useRef} from "react";
import {
	Box,
	Typography,
	IconButton,
	Select,
	MenuItem,
	ThemeProvider,
	Menu,
	Tooltip,
} from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import DeleteIcon from "@material-ui/icons/Delete";
import CountyAddOnSlider from "./CountyAddOnSlider";
import MiniBarChart from "./MiniBarChart";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import {downloadAsPDF} from "../../utils/pdfDownload";
import {ReactComponent as UpIcon} from "../../images/up-icon.svg";
import {ReactComponent as DownIcon} from "../../images/down-icon.svg";
import {ReactComponent as AutoGraphIcon} from "../../images/autograph-icon.svg";
import {ReactComponent as GraphTrendAlertIcon} from "../../images/graphtrendalert-icon.svg";
import {getScenarioKey} from "../../utils/insuranceScenarios";
import "../../styles/new-evaluator.scss";

const InsurancePlanCard = ({
	planName,
	coverageLevel,
	countyAddsOnOptions,
	estimatedPremium,
	avgIndemnityPayment,
	netCost,
	avgWorstScenario,
	isEnterprise = false,
	policies,
	fullPageRef,
	hideUnitDropdown = false,
	hideDownloadButton = false,
	mode = "result",
	planTitle,
	baseMetrics,
	onEdit,
	planNumber,
	onViewDifference,
	onDelete,
	initialScoEnabled,
	initialEcoLevel,
	onScoChange,
	onEcoChange,
	bannerText,
	bannerColor,
	bannerTextColor,
	bannerIcon,
	isSpecialCard,
}) => {
	const [unitStructure, setUnitStructure] = useState(
		isEnterprise ? "enterprise" : "basic"
	);
	const [scoEnabled, setScoEnabled] = useState(
		initialScoEnabled !== undefined ? initialScoEnabled : false
	);
	const [ecoLevel, setEcoLevel] = useState(
		initialEcoLevel !== undefined ? initialEcoLevel : "off"
	);
	const [currentData, setCurrentData] = useState({
		premium: estimatedPremium,
		payment: avgIndemnityPayment,
		netCost: netCost,
		worst: avgWorstScenario,
	});
	const [anchorEl, setAnchorEl] = useState(null);
	const [showDifference, setShowDifference] = useState(false);
	const cardRef = useRef(null);

	useEffect(() => {
		setUnitStructure(isEnterprise ? "enterprise" : "basic");
	}, [isEnterprise]);

	useEffect(() => {
		if (policies && policies.farm && coverageLevel && planName) {
			const scenarioKey = getScenarioKey(scoEnabled, ecoLevel);
			const policyKey = `${planName}-${unitStructure}`;
			const policyData =
				policies.farm[scenarioKey]?.[coverageLevel.toString()]?.[policyKey];

			if (policyData) {
				setCurrentData({
					premium: policyData["est-premium"],
					payment: policyData["avg-payment"],
					netCost: policyData["net-cost"],
					worst: policyData["var-1"],
				});
			}
		}
	}, [unitStructure, policies, coverageLevel, planName, scoEnabled, ecoLevel]);

	const formatCurrency = (value) => {
		if (value === null || value === undefined) {
			return "xx.xx";
		}
		return `$${parseFloat(value).toFixed(2)}`;
	};

	const getPlanFullName = (plan) => {
		const plans = {
			rp: "Revenue Protection (RP)",
			rphpe: "Revenue Protection With Harvest Price Exclusion (RP-HPE)",
			yp: "Yield Protection (YP)",
		};
		return plans[plan] || plan;
	};

	const handleDownloadPDF = () => {
		const refToUse = fullPageRef || cardRef;
		if (refToUse.current) {
			downloadAsPDF(
				refToUse.current,
				fullPageRef ? "results-full-page.pdf" : "insurance-plan-card.pdf"
			);
		}
	};

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleEditClick = () => {
		handleMenuClose();
		if (onEdit) {
			onEdit();
		}
	};

	const handleViewDifference = () => {
		handleMenuClose();
		setShowDifference(!showDifference);
		if (onViewDifference) {
			onViewDifference();
		}
	};

	const handleDelete = () => {
		handleMenuClose();
		if (onDelete) {
			onDelete();
		}
	};

	const calculateDifference = (current, base) => {
		if (!current || !base) {
			return 0;
		}
		return parseFloat(current) - parseFloat(base);
	};

	const getMetricTooltip = (label) => {
		const tooltips = {
			"Farm Paid Premium ($/acre)":
				"Farm paid premium – Cost of insurance policy after subsidized portion",
			"Est. Premium ($/acre)":
				"Estimated premium (est-premium) - The projected cost per acre for crop insurance coverage",
			"Avg. Indemnity Payment ($/acre)":
				"Average indemnity payment – The simulated expected insurance payout per acre.",
			"Net Insurance Benefit ($/acre)":
				"Net insurance benefit equals the indemnities minus the farmer paid portion of the premium",
			"Net Cost ($/acre)":
				"Net cost (net-cost) - The estimated premium minus average indemnity payment per acre",
			"Net Revenue (worst case) ($/acre)":
				"Net Revenue (worst case) – Value-at-risk 1%. A one-in-hundred bad scenario revenue after insurance benefits.",
		};
		return tooltips[label] || "";
	};

	const renderMetricWithArrow = (label, value, baseValue) => {
		const difference = calculateDifference(value, baseValue);
		const isPositive = difference > 0;
		const isNegative = difference < 0;

		return (
			<Box className={isCompareMode ? "base-metric-row" : "metric-row"}>
				<Box className={isCompareMode ? "" : "metric-label-container"}>
					<Tooltip title={getMetricTooltip(label)} placement="top" arrow>
						<Typography
							className={isCompareMode ? "base-metric-label" : "metric-label"}
						>
							{label}
						</Typography>
					</Tooltip>
				</Box>
				<Box
					className="metric-value-with-arrow"
					style={{display: "flex", alignItems: "center", gap: "8px"}}
				>
					<Typography
						className={isCompareMode ? "base-metric-value" : "metric-value"}
					>
						{formatCurrency(value)}
					</Typography>
					{(isPositive || isNegative) && (
						<Box style={{display: "flex", alignItems: "center", gap: "4px"}}>
							{showDifference ? (
								<Typography
									style={{
										fontSize: "0.75rem",
										fontWeight: 400,
										color: newEvaluatorTheme.palette.text.secondary,
									}}
								>
									({isPositive ? "+" : ""}
									{formatCurrency(difference)})
								</Typography>
							) : (
								<>
									{isPositive ? (
										<UpIcon
											className="arrow-up"
											style={{width: "14px", height: "14px"}}
										/>
									) : (
										<DownIcon
											className="arrow-down"
											style={{width: "14px", height: "14px"}}
										/>
									)}
								</>
							)}
						</Box>
					)}
				</Box>
			</Box>
		);
	};

	const isCompareMode = mode === "compare";
	const isPlanCard = planNumber !== undefined;

	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Box
				className={
					isCompareMode ? "base-selection-card" : "insurance-plan-card"
				}
				ref={cardRef}
			>
				{bannerText && bannerColor && bannerTextColor && (
					<Box
						className="plan-banner-container"
						style={{
							backgroundColor: bannerColor
						}}
					>
						<Box className="plan-banner-badge">
							{bannerIcon === "AutoGraph" && (
								<AutoGraphIcon className="plan-banner-icon" style={{fill: bannerTextColor}} />
							)}
							{bannerIcon === "GraphTrendAlert" && (
								<GraphTrendAlertIcon className="plan-banner-icon" style={{fill: bannerTextColor}} />
							)}
							<Typography
								className="plan-banner-text"
								style={{
									color: bannerTextColor
								}}
							>
								{bannerText}
							</Typography>
						</Box>
					</Box>
				)}
				{isCompareMode ? (
					<>
						<Box className="compare-card-top-row">
							{planTitle && (
								<Typography className="compare-plan-title">
									{planTitle}
								</Typography>
							)}
							{isPlanCard ? (
								<IconButton
									size="small"
									onClick={handleMenuClick}
									className="compare-menu-icon-btn"
								>
									<MoreVertIcon />
								</IconButton>
							) : (
								onEdit && (
									<IconButton
										size="small"
										onClick={onEdit}
										className="compare-edit-icon-btn"
									>
										<EditIcon />
									</IconButton>
								)
							)}
						</Box>
						{isPlanCard && (
							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
								className="plan-menu"
							>
								{!isSpecialCard && (
									<MenuItem onClick={handleEditClick}>
										<EditIcon fontSize="small" style={{marginRight: 8}} />
										Edit
									</MenuItem>
								)}
								<MenuItem onClick={handleViewDifference}>
									{showDifference ? (
										<>
											<VisibilityOffIcon
												fontSize="small"
												style={{marginRight: 8}}
											/>
											Hide difference
										</>
									) : (
										<>
											<CompareArrowsIcon
												fontSize="small"
												style={{marginRight: 8}}
											/>
											View difference to Base Selection
										</>
									)}
								</MenuItem>
								<MenuItem onClick={handleDelete}>
									<DeleteIcon fontSize="small" style={{marginRight: 8}} />
									Delete
								</MenuItem>
							</Menu>
						)}
						<Box className="base-plan-header">
							<Box className="base-plan-header-content">
								<Typography className="base-plan-name">
									{getPlanFullName(planName)}
								</Typography>
								<Box className="coverage-badge">
									<span className="coverage-dot" />
									<Typography className="coverage-text">
										COVERAGE LEVEL: {coverageLevel}%
									</Typography>
								</Box>
							</Box>
							{baseMetrics && (
								<Box className="base-plan-header-right">
									<MiniBarChart
										metrics={{
											estimatedPremium: currentData.premium,
											avgIndemnityPayment: currentData.payment,
											netCost: currentData.payment - currentData.premium,
											netBenefit: currentData.worst,
										}}
										baseMetrics={baseMetrics}
									/>
								</Box>
							)}
						</Box>
					</>
				) : (
					<Box className="card-header">
						<Box>
							<Typography className="plan-name">
								{getPlanFullName(planName)}
							</Typography>
							<Box className="coverage-badge">
								<span className="coverage-dot" />
								<Typography className="coverage-text">
									COVERAGE LEVEL: {coverageLevel}%
								</Typography>
							</Box>
						</Box>
						{!hideUnitDropdown && !hideDownloadButton && (
							<Box className="card-header-actions">
								<Select
									value={unitStructure}
									onChange={(e) => setUnitStructure(e.target.value)}
									className="unit-structure-dropdown"
									disableUnderline
									IconComponent={ArrowDropDownIcon}
									style={{
										fontSize: "14px",
										fontWeight: 600,
										letterSpacing: "0.15px",
										color: newEvaluatorTheme.palette.text.secondary,
										marginRight: "8px",
										border: "1px dotted #DADEE0",
										borderRadius: "4px",
										padding: "4px 8px",
										background: "transparent",
									}}
								>
									<MenuItem value="enterprise">Enterprise Unit</MenuItem>
									<MenuItem value="basic">Basic Unit</MenuItem>
								</Select>
								<IconButton
									size="small"
									style={{color: newEvaluatorTheme.palette.text.secondary}}
									onClick={handleDownloadPDF}
								>
									<GetAppIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				)}

				<Box className={isCompareMode ? "base-plan-section" : "card-section"}>
					<Box className={isCompareMode ? "" : "county-addons-section"}>
						<Typography className="section-label">
							COUNTY ADD-ON OPTION
						</Typography>
						{isSpecialCard ? (
							<>
								<Box style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem"}}>
									<Typography className={isCompareMode ? "base-metric-label" : "metric-label"} style={{textTransform: "none", fontSize: "0.875rem"}}>
										Supplemental Coverage Option (SCO)
									</Typography>
									<Typography className={isCompareMode ? "base-metric-value" : "metric-value"} style={{fontSize: "0.875rem"}}>
										{scoEnabled ? "On" : "Off"}
									</Typography>
								</Box>
								<Box style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
									<Typography className={isCompareMode ? "base-metric-label" : "metric-label"} style={{textTransform: "none", fontSize: "0.875rem"}}>
										Enhanced Coverage Option (ECO)
									</Typography>
									<Typography className={isCompareMode ? "base-metric-value" : "metric-value"} style={{fontSize: "0.875rem"}}>
										{ecoLevel === "off" ? "Off" : `${ecoLevel}%`}
									</Typography>
								</Box>
							</>
						) : (
							countyAddsOnOptions?.map((option, index) => {
								const isSco = index === 0;
								const handleChange = (newValue) => {
									if (isSco) {
										setScoEnabled(newValue);
										if (onScoChange) {
											onScoChange(newValue);
										}
									}
									else {
										setEcoLevel(newValue);
										if (onEcoChange) {
											onEcoChange(newValue);
										}
									}
								};
								return (
									<CountyAddOnSlider
										key={index}
										label={option.label}
										options={option.values || []}
										value={isSco ? scoEnabled : ecoLevel}
										onChange={handleChange}
										mode={mode}
									/>
								);
							})
						)}
					</Box>
				</Box>

				<Box
					className={
						isCompareMode ? "base-plan-metrics" : "card-section metrics-section"
					}
				>
					{isPlanCard && baseMetrics ? (
						<>
							{renderMetricWithArrow(
								"Farm Paid Premium ($/acre)",
								currentData.premium,
								baseMetrics.estimatedPremium
							)}
							{renderMetricWithArrow(
								"Avg. Indemnity Payment ($/acre)",
								currentData.payment,
								baseMetrics.avgIndemnityPayment
							)}
							{renderMetricWithArrow(
								"Net Insurance Benefit ($/acre)",
								currentData.payment - currentData.premium,
								baseMetrics.avgIndemnityPayment - baseMetrics.estimatedPremium
							)}
							{renderMetricWithArrow(
								"Net Revenue (worst case) ($/acre)",
								currentData.worst,
								baseMetrics.netBenefit
							)}
						</>
					) : (
						<>
							<Box className={isCompareMode ? "base-metric-row" : "metric-row"}>
								<Box className={isCompareMode ? "" : "metric-label-container"}>
									<Tooltip
										title={getMetricTooltip("Farm Paid Premium ($/acre)")}
										placement="top"
										arrow
									>
										<Typography
											className={
												isCompareMode ? "base-metric-label" : "metric-label"
											}
										>
											{"Farm Paid Premium ($/acre)"}
										</Typography>
									</Tooltip>
								</Box>
								<Typography
									className={
										isCompareMode ? "base-metric-value" : "metric-value"
									}
								>
									{formatCurrency(currentData.premium)}
								</Typography>
							</Box>
							<Box className={isCompareMode ? "base-metric-row" : "metric-row"}>
								<Box className={isCompareMode ? "" : "metric-label-container"}>
									<Tooltip
										title={getMetricTooltip(
											"Avg. Indemnity Payment ($/acre)"
										)}
										placement="top"
										arrow
									>
										<Typography
											className={
												isCompareMode ? "base-metric-label" : "metric-label"
											}
										>
											Avg. Indemnity Payment ($/acre)
										</Typography>
									</Tooltip>
								</Box>
								<Typography
									className={
										isCompareMode ? "base-metric-value" : "metric-value"
									}
								>
									{formatCurrency(currentData.payment)}
								</Typography>
							</Box>
							<Box className={isCompareMode ? "base-metric-row" : "metric-row"}>
								<Box className={isCompareMode ? "" : "metric-label-container"}>
									<Tooltip
										title={getMetricTooltip(
											"Net Insurance Benefit ($/acre)"
										)}
										placement="top"
										arrow
									>
										<Typography
											className={
												isCompareMode ? "base-metric-label" : "metric-label"
											}
										>
											{"Net Insurance Benefit ($/acre)"}
										</Typography>
									</Tooltip>
								</Box>
								<Typography
									className={
										isCompareMode ? "base-metric-value" : "metric-value"
									}
								>
									{formatCurrency(currentData.payment - currentData.premium)}
								</Typography>
							</Box>
							<Box className={isCompareMode ? "base-metric-row" : "metric-row"}>
								<Box className={isCompareMode ? "" : "metric-label-container"}>
									<Tooltip
										title={getMetricTooltip(
											"Net Revenue (worst case) ($/acre)"
										)}
										placement="top"
										arrow
									>
										<Typography
											className={
												isCompareMode ? "base-metric-label" : "metric-label"
											}
										>
											Net Revenue (worst case) ($/acre)
										</Typography>
									</Tooltip>
								</Box>
								<Typography
									className={
										isCompareMode ? "base-metric-value" : "metric-value"
									}
								>
									{formatCurrency(currentData.worst)}
								</Typography>
							</Box>
						</>
					)}
				</Box>
			</Box>
		</ThemeProvider>
	);
};

export default InsurancePlanCard;
