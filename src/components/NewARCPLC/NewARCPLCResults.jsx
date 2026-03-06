import React, {Component} from "react";
import {connect} from "react-redux";
import {withStyles, ThemeProvider} from "@material-ui/core/styles";
import {Box, Typography, CircularProgress} from "@material-ui/core";
import ARCPLCBarChartD3 from "./ARCPLCBarChartD3";
import ARCPLCPayoutCard from "./ARCPLCPayoutCard";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import {roundResults} from "../../public/utils.js";
import "../../styles/new-evaluator.scss";

const styles = () => ({
	resultsContainer: {
		maxHeight: "calc(100vh - 12.5rem - 24px - 48px)",
		overflowY: "auto",
	},
	resultsContainerWithBorder: {
		maxHeight: "calc(100vh - 12.5rem - 24px - 48px)",
		overflowY: "auto",
		borderRadius: 12,
		border: "1px dashed #DADEE0",
	},
	emptyStateContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		minHeight: "calc(100vh - 12.5rem - 24px - 48px)",
	},
	emptyState: {
		textAlign: "justify",
		padding: "auto 9rem"
	},
	emptyStateText: {
		color: "#586B74",
		textAlign: "justify",
		fontSize: "1rem",
		fontWeight: 600,
		lineHeight: "1.5rem",
		letterSpacing: "0.1px",
	},
	barChartContainer: {
		borderRadius: 12,
		border: "1px dashed #DADEE0",
		padding: "1rem",
	},
	loadingStateContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		minHeight: "calc(100vh - 300px)",
	},
	loadingState: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
});

class NewARCPLCResults extends Component {
	constructor(props) {
		super(props);
	}

	componentDidUpdate(prevProps) {
		if (this.props.countyResults !== prevProps.countyResults && this.props.countyResults && this.props.onYearUpdate) {
			try {
				const objData = JSON.parse(this.props.countyResults);
				if (objData.county_average_arc_and_plc_payments && objData.county_average_arc_and_plc_payments !== null) {
					let arcplcData = objData.county_average_arc_and_plc_payments.datasets.data;
					if (arcplcData.length > 0) {
						const lastYear = arcplcData[arcplcData.length - 1].point;
						this.props.onYearUpdate(lastYear);
					}
				}
			}
			catch (error) {
				console.error("Error parsing results:", error);
			}
		}
	}

	getStatRefPrice(commodity) {
		if (!commodity) {
			return null;
		}
		const commodityLower = commodity.toLowerCase();
		if (commodityLower === "corn") {
			return 4.10;
		}
		if (commodityLower === "soybeans") {
			return 10.00;
		}
		if (commodityLower === "wheat") {
			return 6.35;
		}
		return null;
	}

	render() {
		const {classes, countyResults} = this.props;

		if (this.props.loading) {
			return (
				<ThemeProvider theme={newEvaluatorTheme}>
					<div className={classes.resultsContainerWithBorder}>
						<div className={classes.loadingStateContainer}>
							<div className={classes.loadingState}>
								<CircularProgress size={60} style={{color: "#455A64"}}/>
							</div>
						</div>
					</div>
				</ThemeProvider>
			);
		}

		if (countyResults === null) {
			return (
				<ThemeProvider theme={newEvaluatorTheme}>
					<div className={classes.resultsContainerWithBorder}>
						<div className={classes.emptyStateContainer}>
							<div className={classes.emptyState}>
								<Typography className={classes.emptyStateText}>
									Please enter the registered information of your farm
									with FSA on the left to run the calculators.
								</Typography>
							</div>
						</div>
					</div>
				</ThemeProvider>
			);
		}

		if (countyResults === "") {
			return (
				<ThemeProvider theme={newEvaluatorTheme}>
					<div className={classes.resultsContainerWithBorder}>
						<div style={{padding: "15px", color: "red"}}>
							No data available for the selected crop or county
						</div>
					</div>
				</ThemeProvider>
			);
		}

		let years = [];
		let arcPayments = [];
		let plcPayments = [];
		let yieldUnits = "";
		let plcData = {
			effectiveReferencePrice: null,
			forecastPrice: null,
			plcYield: null,
			marketLoanRate: null,
			meanPaymentRateInDollarsPerAcre: null,
			likelihoodOfPayment: null,
		};
		let arcData = {
			benchmarkRevenue: null,
			benchmarkPrice: null,
			benchmarkYield: null,
			expectedRevenue: null,
			forecastPrice: null,
			forecastYield: null,
			meanPaymentRateInDollarsPerAcre: null,
			likelihoodOfPayment: null,
			maxPaymentRate: null,
		};

		try {
			const objData = JSON.parse(countyResults);
			if (objData.programs && objData.programs.length > 0) {
				const arcProgram = objData.programs.find((p) => p.programName === "ARC-CO");
				const plcProgram = objData.programs.find((p) => p.programName === "PLC");
				if (arcProgram) {
					arcData.meanPaymentRateInDollarsPerAcre = arcProgram.meanPaymentRateInDollarsPerAcre;
					arcData.likelihoodOfPayment = arcProgram.likelihoodOfPayment;
					arcData.benchmarkRevenue = arcProgram.benchmarkRevenue;
					arcData.benchmarkPrice = arcProgram.benchmarkPrice;
					arcData.benchmarkYield = arcProgram.benchmarkYield;
					arcData.expectedRevenue = arcProgram.expectedRevenue;
					arcData.forecastPrice = arcProgram.forecastPrice;
					arcData.forecastYield = arcProgram.forecastYield;
					if (arcProgram.benchmarkRevenue !== null && arcProgram.benchmarkRevenue !== undefined) {
						arcData.maxPaymentRate = arcProgram.benchmarkRevenue * 0.85 * 0.12;
					}
					else {
						arcData.maxPaymentRate = null;
					}
				}

				if (plcProgram) {
					plcData.meanPaymentRateInDollarsPerAcre = plcProgram.meanPaymentRateInDollarsPerAcre;
					plcData.likelihoodOfPayment = plcProgram.likelihoodOfPayment;
					plcData.effectiveReferencePrice = plcProgram.effectiveReferencePrice;
					plcData.marketLoanRate = plcProgram.marketLoanRate;
					plcData.forecastPrice = plcProgram.forecastPrice;
					plcData.plcYield = plcProgram.plcYield;
				}

				const statRefPrice = this.getStatRefPrice(this.props.commodity);
				if (statRefPrice !== null) {
					plcData.statRefPrice = statRefPrice;
				}

				yieldUnits = objData.yieldUnit || "bu./acre";

				const startYear = 2020;
				for (let i = 0; i < 5; i++) {
					years.push(startYear + i);
					arcPayments.push(roundResults(arcProgram?.meanPaymentRateInDollarsPerAcre || 0, 2));
					plcPayments.push(roundResults(plcProgram?.meanPaymentRateInDollarsPerAcre || 0, 2));
				}
			}
		}
		catch (error) {
			console.error("Error parsing results:", error);
			return (
				<ThemeProvider theme={newEvaluatorTheme}>
					<div className={classes.resultsContainerWithBorder}>
						<div style={{padding: "15px", color: "red"}}>
							Error parsing results data
						</div>
					</div>
				</ThemeProvider>
			);
		}

		
		const arcExpandedData = [
			{
				label: "Benchmark revenue ($/acre)",
				value: arcData.benchmarkRevenue,
				isCurrency: true,
				tooltip: "Equals the 5-year Olympic (drop the highest and lowest) average revenue per acre"
			},
			{
				label: "Benchmark price ($/bu.)",
				value: arcData.benchmarkPrice,
				isCurrency: true,
				tooltip: "Equals the 5-year Olympic (drop the highest and lowest) average of national average prices received in the marketing year"
			},
			{
				label: `Benchmark yield (${yieldUnits})`,
				value: arcData.benchmarkYield,
				isCurrency: false,
				tooltip: "Equals the 5-year Olympic (drop the highest and lowest) average of county average crop yields"
			},
			{
				label: "Expected Revenue ($/acre)",
				value: arcData.expectedRevenue,
				isCurrency: true,
				tooltip: "Projected revenue in the crop year, equals county average yield and national marketing year average price"
			},
			{
				label: "Projected MYA Price ($/bu.)",
				value: arcData.forecastPrice,
				isCurrency: true,
				tooltip: "Projected national average price received by farmers in the marketing year"
			},
			{
				label: `Projected County Yield (${yieldUnits})`,
				value: arcData.forecastYield,
				isCurrency: false,
				tooltip: "Projected county average yield"
			},
		];

		const plcExpandedData = [
			{
				label: "Eff. Ref Price ($/bu.)",
				value: plcData.effectiveReferencePrice,
				isCurrency: true,
				tooltip: "Equals the higher of the statutory reference price or 85% of the 5-year Olympic (drop the highest and lowest) national average prices received in the marketing year"
			},
			{
				label: "Projected MYA Price ($/bu.)",
				value: plcData.forecastPrice,
				isCurrency: true,
				tooltip: "Projected national average price received by farmers in the marketing year"
			},
			{
				label: "Market Loan Rate ($/bu.)",
				value: plcData.marketLoanRate,
				isCurrency: true,
				tooltip: "Loan rate for the Marketing Assistance Loans program, establishes the floor for the PLC payment rate as the lowest possible MYA compared to the effective reference price"
			},
			{
				label: "Stat Ref Price ($/bu.)",
				value: plcData.statRefPrice,
				isCurrency: true,
				tooltip: "Fixed reference price established by Congress and included in the statute; determines PLC payments when it is above the effective reference price"
			},
		];

		return (
			<ThemeProvider theme={newEvaluatorTheme}>
				<div className={classes.resultsContainer}>
					<Box className="results-content">
						<Box className={classes.barChartContainer}>
							<ARCPLCBarChartD3
								arcPayments={arcPayments}
								plcPayments={plcPayments}
								years={years}
							/>
						</Box>

						<Box className="arcplc-cards-container">
							<ARCPLCPayoutCard
								program="ARC"
								title="ARC Payment Estimates"
								description="Payments based on 5-year Olympic moving average of county average yields and national average prices."
								expectedPaymentRate={arcData.meanPaymentRateInDollarsPerAcre}
								likelihoodOfPayment={arcData.likelihoodOfPayment * 100}
								maxPaymentRate={arcData.maxPaymentRate}
								expandedData={arcExpandedData}
								color="#FD8945"
							/>

							<ARCPLCPayoutCard
								program="PLC"
								title="PLC Payment Estimates"
								description="Payments based on national average prices compared to fixed-price thresholds."
								expectedPaymentRate={plcData.meanPaymentRateInDollarsPerAcre}
								likelihoodOfPayment={plcData.likelihoodOfPayment * 100}
								expandedData={plcExpandedData}
								color="#60ABD0"
							/>
						</Box>
					</Box>
				</div>
			</ThemeProvider>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		countyResults: state.arcplcCalculator.countyResults,
		loading: state.arcplcCalculator.loading || false,
		commodity: state.arcplcCalculator.commodity,
	};
};

export default connect(
	mapStateToProps,
	null
)(withStyles(styles)(NewARCPLCResults));
