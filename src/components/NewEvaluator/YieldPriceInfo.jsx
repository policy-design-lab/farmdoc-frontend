import React, {useState} from "react";
import {
	Box,
	Typography,
	ThemeProvider,
	Tooltip,
	Button,
} from "@material-ui/core";
import GridOnIcon from "@material-ui/icons/GridOn";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import {ReactComponent as GiteIcon} from "../../images/gite-icon.svg";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import CaseFarmInfoModal from "./CaseFarmInfoModal";
import "../../styles/new-evaluator.scss";

const YieldPriceInfo = ({
	farmInfo,
	onCompareClick,
	showCompareButton = false,
	crop = "",
}) => {
	const [caseFarmInfoOpen, setCaseFarmInfoOpen] = useState(false);

	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1;
	const currentYear = currentDate.getFullYear();

	const getHarvestPriceLabel = () => {
		const cropLower = crop.toLowerCase();
		if (cropLower === "corn") {
			return "Dec 26 Future Price";
		}
		else if (cropLower === "soybean" || cropLower === "soybeans") {
			return "Nov 26 Future Price";
		}
		return "Harvest Price";
	};
	const harvestPriceLabel = getHarvestPriceLabel();

	const getFuturePriceTooltip = () => {
		const cropLower = crop.toLowerCase();
		let monthLabel = "Dec";
		if (cropLower === "soybean" || cropLower === "soybeans") {
			monthLabel = "Nov";
		}

		if (currentYear === 2026 && currentMonth > 10) {
			return `${monthLabel} 26 Future Price (average of October 2026)`;
		}
		return `${monthLabel} 26 Future Price (as of Jan 2026)`;
	};

	const getProjectedPriceValue = () => {
		if (farmInfo?.["proj-price"]) {
			return `$${farmInfo["proj-price"].toFixed(2)}`;
		}
		return "Not available";
	};

	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			{showCompareButton ? (
				<Box className="yield-price-compare-wrapper col-sm-8">
					<Box className="yield-price-info-card">
						<Box className="info-card-header">
							<Typography className="info-card-title not-in-compare">
								Yield & Price info
							</Typography>
							<Button
								variant="text"
								onClick={() => setCaseFarmInfoOpen(true)}
								startIcon={<GiteIcon />}
								style={{
									fontSize: "0.8125rem",
									fontWeight: 500,
									color: "#455A64",
									textTransform: "none",
									padding: "4px 8px",
								}}
							>
								View case farm info
							</Button>
						</Box>
						<Box className="yield-price-rows">
							<Box className="yield-price-row">
								<Tooltip
									title="RMA estimated projected price 2026"
									placement="top"
									arrow
								>
									<Typography className="yield-price-label not-in-compare">
										Estimated Projected Price
									</Typography>
								</Tooltip>
								<Typography className="yield-price-value">
									{getProjectedPriceValue()}
								</Typography>
							</Box>
							<Box className="yield-price-row">
								<Tooltip
									title={getFuturePriceTooltip()}
									placement="top"
									arrow
								>
									<Typography className="yield-price-label not-in-compare">
										{harvestPriceLabel}
									</Typography>
								</Tooltip>
								<Typography className="yield-price-value">
									{farmInfo?.["avg-futures-price"]
										? `$${farmInfo["avg-futures-price"].toFixed(2)}`
										: "Not available"}
								</Typography>
							</Box>
						</Box>
					</Box>
					<Box className="compare-mode-card col-sm-4" onClick={onCompareClick}>
						<Box className="compare-mode-content">
							<GridOnIcon className="compare-mode-icon" />
							<Typography className="compare-mode-title">
								Compare Mode
							</Typography>
							<Typography className="compare-mode-subtitle">
								Compare multiple insurance plans to determine the best fit for
								your farm
							</Typography>
						</Box>
						<ArrowForwardIcon className="compare-mode-arrow" />
					</Box>
				</Box>
			) : (
				<Box>
					<Box className="info-card-header">
						<Typography className="info-card-title">
							Yield & Price info
						</Typography>
						<Button
							variant="text"
							onClick={() => setCaseFarmInfoOpen(true)}
							startIcon={<GiteIcon />}
							style={{
								fontSize: "14px",
								fontWeight: 600,
								color: "#455A64",
								textTransform: "none",
								padding: "4px 8px",
							}}
						>
							View case farm info
						</Button>
					</Box>
					<Box className="yield-price-rows">
						<Box className="yield-price-row">
							<Tooltip
								title="RMA estimated projected price 2026"
								placement="top"
								arrow
							>
								<Typography className="yield-price-label">
									Estimated Projected Price
								</Typography>
							</Tooltip>
							<Typography className="yield-price-value">
								{getProjectedPriceValue()}
							</Typography>
						</Box>
						<Box className="yield-price-row">
							<Tooltip
								title={getFuturePriceTooltip()}
								placement="top"
								arrow
							>
								<Typography className="yield-price-label">
									{harvestPriceLabel}
								</Typography>
							</Tooltip>
							<Typography className="yield-price-value">
								{farmInfo?.["avg-futures-price"]
									? `$${farmInfo["avg-futures-price"].toFixed(2)}`
									: "Not available"}
							</Typography>
						</Box>
					</Box>
				</Box>
			)}
			<CaseFarmInfoModal
				open={caseFarmInfoOpen}
				onClose={() => setCaseFarmInfoOpen(false)}
				farmInfo={farmInfo}
			/>
		</ThemeProvider>
	);
};

export default YieldPriceInfo;
