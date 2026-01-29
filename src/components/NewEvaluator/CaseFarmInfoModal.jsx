import React from "react";
import {Dialog, DialogContent, Box, Typography, IconButton, ThemeProvider} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {ReactComponent as GiteIcon} from "../../images/gite-icon.svg";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import "../../styles/new-evaluator.scss";

const CaseFarmInfoModal = ({open, onClose, farmInfo}) => {
	if (!farmInfo) {
		return null;
	}
	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Dialog
				open={open}
				onClose={onClose}
				maxWidth="lg"
				fullWidth
				PaperProps={{
					style: {
						borderRadius: "12px",
						padding: "24px",
					},
				}}
			>
				<DialogContent style={{padding: 0}}>
					<Box className="case-farm-info-modal">
						<Box className="modal-header">
							<Box className="header-left">
								<GiteIcon className="header-icon" />
								<Box className="header-text">
									<Typography className="modal-title case-farm-info-title">Case farm info</Typography>
									<Typography className="modal-subtitle">
										Additional yield and price information for simulated values
									</Typography>
								</Box>
							</Box>
							<IconButton onClick={onClose} className="close-button">
								<CloseIcon />
							</IconButton>
						</Box>

						<Box className="modal-body">
							<Box className="info-section">
								<Typography className="section-title">Yield Benchmark</Typography>
								<Box className="info-table">
									<Box className="table-header">
										<Typography className="header-cell metric-col">METRIC</Typography>
										<Typography className="header-cell">FARM YIELD (BU/ACRE)</Typography>
										<Typography className="header-cell">COUNTY YIELD (BU/ACRE)</Typography>
									</Box>
									<Box className="table-row">
										<Typography className="row-label">Average Yield</Typography>
										<Typography className="row-value">{farmInfo["avg-yield"] ? farmInfo["avg-yield"].toFixed(2) : "N/A"}</Typography>
										<Typography className="row-value">{farmInfo["county-avg-yield"] ? farmInfo["county-avg-yield"].toFixed(2) : "N/A"}</Typography>
									</Box>
									<Box className="table-row">
										<Typography className="row-label">Std Dev of Yield</Typography>
										<Typography className="row-value">{farmInfo["std-yield"] ? farmInfo["std-yield"].toFixed(2) : "N/A"}</Typography>
										<Typography className="row-value">{farmInfo["county-std-yield"] ? farmInfo["county-std-yield"].toFixed(2) : "N/A"}</Typography>
									</Box>
									<Box className="table-row">
										<Typography className="row-label">30% of years yields below</Typography>
										<Typography className="row-value">{farmInfo["farm-yield-below-30"] ? farmInfo["farm-yield-below-30"].toFixed(2) : "N/A"}</Typography>
										<Typography className="row-value">{farmInfo["county-yield-below-30"] ? farmInfo["county-yield-below-30"].toFixed(2) : "N/A"}</Typography>
									</Box>
									<Box className="table-row">
										<Typography className="row-label">20% of years yields below</Typography>
										<Typography className="row-value">{farmInfo["farm-yield-below-20"] ? farmInfo["farm-yield-below-20"].toFixed(2) : "N/A"}</Typography>
										<Typography className="row-value">{farmInfo["county-yield-below-20"] ? farmInfo["county-yield-below-20"].toFixed(2) : "N/A"}</Typography>
									</Box>
									<Box className="table-row">
										<Typography className="row-label">10% of years yields below</Typography>
										<Typography className="row-value">{farmInfo["farm-yield-below-10"] ? farmInfo["farm-yield-below-10"].toFixed(2) : "N/A"}</Typography>
										<Typography className="row-value">{farmInfo["county-yield-below-10"] ? farmInfo["county-yield-below-10"].toFixed(2) : "N/A"}</Typography>
									</Box>
									<Box className="table-row">
										<Typography className="row-label">5% of years yields below</Typography>
										<Typography className="row-value">{farmInfo["farm-yield-below-5"] ? farmInfo["farm-yield-below-5"].toFixed(2) : "N/A"}</Typography>
										<Typography className="row-value">{farmInfo["county-yield-below-5"] ? farmInfo["county-yield-below-5"].toFixed(2) : "N/A"}</Typography>
									</Box>
								</Box>
							</Box>

							<Box className="info-grid">
								<Box className="info-section">
									<Typography className="section-title">Reference & Revenue</Typography>
									<Box className="info-table compact">
										<Box className="table-row">
											<Typography className="row-label">Average Gross Crop Rev ($/acre)</Typography>
											<Typography className="row-value">${farmInfo["avg-gross-crop-rev"] ? farmInfo["avg-gross-crop-rev"].toFixed(0) : "N/A"}</Typography>
										</Box>
										<Box className="table-row">
											<Typography className="row-label">Farm Trend-Adjusted APH (bu/acre)</Typography>
											<Typography className="row-value">{farmInfo["trend-adj-aph"] ? farmInfo["trend-adj-aph"].toFixed(2) : "N/A"}</Typography>
										</Box>
										<Box className="table-row">
											<Typography className="row-label">County TA Rate (bu/acre/year)</Typography>
											<Typography className="row-value">{farmInfo["county-ta-rate"] ? farmInfo["county-ta-rate"].toFixed(2) : "N/A"}</Typography>
										</Box>
										<Box className="table-row">
											<Typography className="row-label">Farm APH (ref) (bu/acre)</Typography>
											<Typography className="row-value">{farmInfo["farm-aph"] ? farmInfo["farm-aph"].toFixed(2) : "N/A"}</Typography>
										</Box>
									</Box>
								</Box>

								<Box className="info-section">
									<Typography className="section-title">Price Info</Typography>
									<Box className="info-table compact">
										<Box className="table-row">
											<Typography className="row-label">Current Futures Price ($/acre)</Typography>
											<Typography className="row-value">${farmInfo["avg-futures-price"] ? farmInfo["avg-futures-price"].toFixed(2) : "N/A"}</Typography>
										</Box>
										<Box className="table-row">
											<Typography className="row-label">Std Dev of Price ($/acre)</Typography>
											<Typography className="row-value">${farmInfo["std-price"] ? farmInfo["std-price"].toFixed(2) : "N/A"}</Typography>
										</Box>
										<Box className="table-row">
											<Typography className="row-label">Average Harvest Cash Basis ($/acre)</Typography>
											<Typography className="row-value">${farmInfo["avg-harvest-cash-basis"] ? farmInfo["avg-harvest-cash-basis"].toFixed(2) : "N/A"}</Typography>
										</Box>
									</Box>
								</Box>
							</Box>

							<Box className="rma-info">
								<Typography className="rma-text">
									Estimated Projected Price is ${farmInfo["proj-price"] ? farmInfo["proj-price"].toFixed(2) : "N/A"} with Volatility Factor of {farmInfo["volatility-factor"] ? farmInfo["volatility-factor"].toFixed(2) : "N/A"}. Last Updated on {farmInfo["rma-last-updated"] || "N/A"}.
								</Typography>
							</Box>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</ThemeProvider>
	);
};

export default CaseFarmInfoModal;
