import React, {Component, createRef} from "react";
import {connect} from "react-redux";
import {withStyles, ThemeProvider} from "@material-ui/core/styles";
import {Box, Typography, CircularProgress, Select, MenuItem, IconButton} from "@material-ui/core";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import InsurancePlanCard from "./InsurancePlanCard";
import YieldPriceInfo from "./YieldPriceInfo";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import {downloadAsPDF} from "../../utils/pdfDownload";
import {changeInsUnit} from "../../actions/insEvaluator";
import {getScenarioKey} from "../../utils/insuranceScenarios";
import "../../styles/new-evaluator.scss";

const styles = () => ({
	resultsContainer: {
		height: "100%",
		overflowY: "auto",
	},
	resultsContainerWithBorder: {
		height: "100%",
		overflowY: "auto",
		borderRadius: 12,
		border: "1px dashed #DADEE0",
	},

	emptyStateContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		minHeight: "calc(100vh - 300px)",
	},

	emptyState: {
		textAlign: "center",
	},

	emptyStateText: {
		color: "#586B74",
		textAlign: "center",
		fontSize: "1rem",
		fontStyle: "italic",
		fontWeight: 400,
		lineHeight: 24,
		letterSpacing: "0.1px",
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

class NewEvaluatorResults extends Component {
	constructor(props) {
		super(props);
		this.fullPageRef = createRef();
		this.state = {
			unitStructure: this.props.insUnit || "enterprise",
			scoEnabled: false,
			ecoLevel: "off"
		};
	}

	handleCompareClick = () => {
		if (this.props.onCompareModeChange) {
			this.props.onCompareModeChange(true, this.state.scoEnabled, this.state.ecoLevel);
		}
	};

	handleUnitChange = (e) => {
		const newUnit = e.target.value;
		this.setState({unitStructure: newUnit});
		if (this.props.changeInsUnit) {
			this.props.changeInsUnit(newUnit);
		}
	};

	handleDownloadPDF = () => {
		if (this.fullPageRef.current) {
			downloadAsPDF(this.fullPageRef.current, "results-full-page.pdf");
		}
	};

	render() {
		const {classes, evaluatorResults, insurancePlan, coverageLevel, cropStateCountyName} =
			this.props;

		if (this.props.loading) {
			return (
				<ThemeProvider theme={newEvaluatorTheme}>
					<div className={classes.resultsContainerWithBorder}>
						<div className={classes.loadingStateContainer}>
							<div className={classes.loadingState}>
								<CircularProgress size={60} style={{color: "#455A64"}} />
							</div>
						</div>
					</div>
				</ThemeProvider>
			);
		}

		if (evaluatorResults === null) {
			return (
				<ThemeProvider theme={newEvaluatorTheme}>
					<div className={classes.resultsContainerWithBorder}>
						<div className={classes.emptyStateContainer}>
							<div className={classes.emptyState}>
								<Typography className={classes.emptyStateText}>
									Please select farm information and insurance type on the left
									to run the evaluators.
								</Typography>
							</div>
						</div>
					</div>
				</ThemeProvider>
			);
		}

		if (evaluatorResults === "") {
			return (
				<ThemeProvider theme={newEvaluatorTheme}>
					<div className={classes.resultsContainerWithBorder}>
						<div className={classes.emptyStateContainer}>
							<div className={classes.emptyState}>
								<Typography className={classes.emptyStateText}>
									Please select farm information and insurance type on the left
									to run the evaluators.
								</Typography>
							</div>
						</div>
					</div>
				</ThemeProvider>
			);
		}

		const evalResult = JSON.parse(evaluatorResults);
		const farmInfo = evalResult["farm-info"];
		const policies = evalResult["policies"];

		const scenarioKey = getScenarioKey(this.state.scoEnabled, this.state.ecoLevel);
		const policyKey = `${insurancePlan}-${this.state.unitStructure}`;
		const mainPolicy =
			policies?.farm?.[scenarioKey]?.[coverageLevel.toString()]?.[policyKey] || {};

		return (
			<ThemeProvider theme={newEvaluatorTheme}>
				<div className={classes.resultsContainer} ref={this.fullPageRef}>
					<Box className="results-content">
						<YieldPriceInfo
							farmInfo={farmInfo}
							onCompareClick={this.handleCompareClick}
							showCompareButton={true}
							crop={cropStateCountyName?.[0] || ""}
						/>

						<Box className="summary-header">
							<Typography variant="h6" className="section-heading">
								Insurance Impact Summary
							</Typography>
							<Box style={{display: "flex", alignItems: "center", gap: "8px"}}>
								<Select
									value={this.state.unitStructure}
									onChange={this.handleUnitChange}
									className="unit-dropdown"
									disableUnderline
									IconComponent={ArrowDropDownIcon}
									MenuProps={{
										anchorOrigin: {
											vertical: "bottom",
											horizontal: "left"
										},
										transformOrigin: {
											vertical: "top",
											horizontal: "left"
										},
										getContentAnchorEl: null,
										classes: {
											paper: "unit-dropdown-menu"
										}
									}}
								>
									<MenuItem value="enterprise">Enterprise Unit</MenuItem>
									<MenuItem value="basic">Basic Unit</MenuItem>
								</Select>
								<IconButton size="small" onClick={this.handleDownloadPDF} className="download-btn">
									<SaveAltIcon />
								</IconButton>
							</Box>
						</Box>

						<InsurancePlanCard
							planName={insurancePlan}
							coverageLevel={coverageLevel}
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
							estimatedPremium={mainPolicy["est-premium"]}
							avgIndemnityPayment={mainPolicy["avg-payment"]}
							netCost={mainPolicy["net-cost"]}
							avgWorstScenario={mainPolicy["var-1"]}
							isEnterprise={this.state.unitStructure === "enterprise"}
							policies={policies}
							fullPageRef={this.fullPageRef}
							hideUnitDropdown={true}
							hideDownloadButton={true}
							initialScoEnabled={this.state.scoEnabled}
							initialEcoLevel={this.state.ecoLevel}
							onScoChange={(value) => this.setState({scoEnabled: value})}
							onEcoChange={(value) => this.setState({ecoLevel: value})}
						/>
					</Box>
				</div>
			</ThemeProvider>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		evaluatorResults: state.insEvaluator.evaluatorResults,
		loading: state.insEvaluator.loading || false,
		insurancePlan: state.insEvaluator.insurancePlan || "rp",
		coverageLevel: state.insEvaluator.coverageLevel || 80,
		insUnit: state.insEvaluator.insUnit || "enterprise",
		cropStateCountyName: state.insEvaluator.cropStateCountyName,
	};
};

const mapDispatchToProps = (dispatch) => ({
	changeInsUnit: (insUnit) => dispatch(changeInsUnit(insUnit)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(NewEvaluatorResults));
