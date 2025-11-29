import React, {useState} from "react";
import {
	Box,
	Typography,
	ThemeProvider,
	Tooltip,
	Collapse,
	IconButton,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import "../../styles/new-evaluator.scss";

const ARCPLCPayoutCard = ({
	program,
	title,
	description,
	expectedPaymentRate,
	likelihoodOfPayment,
	maxPaymentRate,
	expandedData,
	color,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isBenchmarkExpanded, setIsBenchmarkExpanded] = useState(false);
	const [isExpectedRevenueExpanded, setIsExpectedRevenueExpanded] =
		useState(false);
	const formatCurrency = (value) => {
		if (value === null || value === undefined || isNaN(value)) {
			return "$xx.xx";
		}
		const num = parseFloat(value);
		return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
	};
	const formatPercentage = (value) => {
		if (value === null || value === undefined || isNaN(value)) {
			return "XX%";
		}
		return `${parseFloat(value).toFixed(0)}%`;
	};
	const formatNumber = (value) => {
		if (value === null || value === undefined || isNaN(value)) {
			return "xx.xx";
		}
		const num = parseFloat(value);
		return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
	};
	const iconColor = color || "#FD8945";
	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Box className="arcplc-payout-card">
				<Box className="payout-card-header">
					<Box className="payout-icon" style={{backgroundColor: iconColor}} />
					<Box style={{flex: 1}}>
						<Typography className="payout-card-title">
							{/* replace ARC to ARC-CO in title */}
							{program === "ARC" ? title.replace("ARC", "ARC-CO") : title}
						</Typography>
						<Typography className="payout-card-description">
							{description}
						</Typography>
					</Box>
				</Box>

				<Box className="payout-card-metrics">
					<Box className="payout-metric-row">
						<Tooltip
							title={`${
								program === "ARC" ? "Expected ARC-CO payment per base adjusted to reflect that payments are made on 85% of total base acres on the farm" : "Expected PLC payment per base acre, adjusted to reflect that payments are made on 85% of the total base acres on the farm"
							}`}
							placement="top"
							arrow
						>
							<Typography className="payout-metric-label">
								Expected payment rate ($/base acre)
							</Typography>
						</Tooltip>
						<Typography className="payout-metric-value">
							{formatCurrency(expectedPaymentRate)}
						</Typography>
					</Box>

					<Box className="payout-metric-row">
						<Tooltip
							title={`${
								program === "ARC" ? "Model projections of the likelihood that the estimated payment will occur" : "Model projections of the likelihood that the estimated payment will occur"
							}`}
							placement="top"
							arrow
						>
							<Typography className="payout-metric-label">
								Likelihood of payment (avg.)
							</Typography>
						</Tooltip>
						<Typography className="payout-metric-value">
							{formatPercentage(likelihoodOfPayment)}
						</Typography>
					</Box>
				</Box>

				{expandedData && expandedData.length > 0 && (
					<>
						<Collapse in={isExpanded} timeout="auto" unmountOnExit>
							<Box className="payout-card-expanded-section">
								{program === "ARC" ? (
									<>
										<Box
											className="payout-metric-row payout-expandable-row"
											onClick={() =>
												setIsBenchmarkExpanded(!isBenchmarkExpanded)
											}
										>
											<Box
												style={{
													display: "flex",
													alignItems: "center",
													gap: "4px",
												}}
											>
												<IconButton
													size="small"
													style={{
														color: "#8F9CA2",
														padding: "0",
														marginRight: "4px",
													}}
												>
													{isBenchmarkExpanded ? (
														<ArrowDropUpIcon style={{fontSize: "20px"}} />
													) : (
														<ArrowDropDownIcon style={{fontSize: "20px"}} />
													)}
												</IconButton>
												<Tooltip
													title={
														expandedData[0].tooltip || expandedData[0].label
													}
													placement="top"
													arrow
												>
													<Typography className="payout-metric-label payout-nested-label">
														{expandedData[0].label}
													</Typography>
												</Tooltip>
											</Box>
											<Typography className="payout-metric-value">
												{expandedData[0].isCurrency
													? formatCurrency(expandedData[0].value)
													: formatNumber(expandedData[0].value)}
											</Typography>
										</Box>

										<Collapse
											in={isBenchmarkExpanded}
											timeout="auto"
											unmountOnExit
										>
											<Box className="payout-nested-items">
												<Box className="payout-metric-row">
													<Tooltip
														title={
															expandedData[1].tooltip || expandedData[1].label
														}
														placement="top"
														arrow
													>
														<Typography className="payout-metric-label payout-nested-label">
															{expandedData[1].label}
														</Typography>
													</Tooltip>
													<Typography className="payout-metric-value">
														{expandedData[1].isCurrency
															? formatCurrency(expandedData[1].value)
															: formatNumber(expandedData[1].value)}
													</Typography>
												</Box>
												<Box className="payout-metric-row">
													<Tooltip
														title={
															expandedData[2].tooltip || expandedData[2].label
														}
														placement="top"
														arrow
													>
														<Typography className="payout-metric-label payout-nested-label">
															{expandedData[2].label}
														</Typography>
													</Tooltip>
													<Typography className="payout-metric-value">
														{expandedData[2].isCurrency
															? formatCurrency(expandedData[2].value)
															: formatNumber(expandedData[2].value)}
													</Typography>
												</Box>
											</Box>
										</Collapse>

										<Box
											className="payout-metric-row payout-expandable-row"
											onClick={() =>
												setIsExpectedRevenueExpanded(!isExpectedRevenueExpanded)
											}
										>
											<Box
												style={{
													display: "flex",
													alignItems: "center",
													gap: "4px",
												}}
											>
												<IconButton
													size="small"
													style={{
														color: "#8F9CA2",
														padding: "0",
														marginRight: "4px",
													}}
												>
													{isExpectedRevenueExpanded ? (
														<ArrowDropUpIcon style={{fontSize: "20px"}} />
													) : (
														<ArrowDropDownIcon style={{fontSize: "20px"}} />
													)}
												</IconButton>
												<Tooltip
													title={
														expandedData[3].tooltip || expandedData[3].label
													}
													placement="top"
													arrow
												>
													<Typography className="payout-metric-label payout-nested-label">
														{expandedData[3].label}
													</Typography>
												</Tooltip>
											</Box>
											<Typography className="payout-metric-value">
												{expandedData[3].isCurrency
													? formatCurrency(expandedData[3].value)
													: formatNumber(expandedData[3].value)}
											</Typography>
										</Box>

										<Collapse
											in={isExpectedRevenueExpanded}
											timeout="auto"
											unmountOnExit
										>
											<Box className="payout-nested-items">
												<Box className="payout-metric-row">
													<Tooltip
														title={
															expandedData[4].tooltip || expandedData[4].label
														}
														placement="top"
														arrow
													>
														<Typography className="payout-metric-label payout-nested-label">
															{expandedData[4].label}
														</Typography>
													</Tooltip>
													<Typography className="payout-metric-value">
														{expandedData[4].isCurrency
															? formatCurrency(expandedData[4].value)
															: formatNumber(expandedData[4].value)}
													</Typography>
												</Box>
												<Box className="payout-metric-row">
													<Tooltip
														title={
															expandedData[5].tooltip || expandedData[5].label
														}
														placement="top"
														arrow
													>
														<Typography className="payout-metric-label payout-nested-label">
															{expandedData[5].label}
														</Typography>
													</Tooltip>
													<Typography className="payout-metric-value">
														{expandedData[5].isCurrency
															? formatCurrency(expandedData[5].value)
															: formatNumber(expandedData[5].value)}
													</Typography>
												</Box>
											</Box>
										</Collapse>
										{maxPaymentRate !== null && maxPaymentRate !== undefined && (
											<Box className="payout-metric-row">
												<Tooltip
													title="Equals 12% of the Benchmark revenue per acre; statutory maximum payment rate"
													placement="top"
													arrow
												>
													<Typography className="payout-metric-label payout-nested-label">
														Maximum payment rate ($/base acre)
													</Typography>
												</Tooltip>
												<Typography className="payout-metric-value">
													{formatCurrency(maxPaymentRate)}
												</Typography>
											</Box>
										)}
									</>
								) : (
									<Box className="payout-nested-items">
										{expandedData.map((item, index) => (
											<Box key={index} className="payout-metric-row">
												<Tooltip
													title={item.tooltip || item.label}
													placement="top"
													arrow
												>
													<Typography className="payout-metric-label payout-nested-label">
														{item.label}
													</Typography>
												</Tooltip>
												<Typography className="payout-metric-value">
													{item.isCurrency
														? formatCurrency(item.value)
														: formatNumber(item.value)}
												</Typography>
											</Box>
										))}
									</Box>
								)}
							</Box>
						</Collapse>

						<Box
							className="payout-card-collapse-btn"
							onClick={() => setIsExpanded(!isExpanded)}
						>
							<Box
								style={{display: "flex", alignItems: "center", gap: "4px"}}
							>
								<Typography className="payout-collapse-text">
									{isExpanded ? "Collapse" : "View other data details"}
								</Typography>
								<IconButton
									size="small"
									style={{
										color: "#29363C",
										padding: "0",
										pointerEvents: "none",
									}}
								>
									{isExpanded ? (
										<ArrowDropUpIcon style={{fontSize: "20px"}} />
									) : (
										<ArrowDropDownIcon style={{fontSize: "20px"}} />
									)}
								</IconButton>
							</Box>
						</Box>
					</>
				)}
			</Box>
		</ThemeProvider>
	);
};

export default ARCPLCPayoutCard;
