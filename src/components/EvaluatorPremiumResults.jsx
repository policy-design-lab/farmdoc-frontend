import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {
	FormControl,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@material-ui/core";
import {roundResults, roundResultsIfNotZero} from "../public/utils.js";
import "../styles/main.css";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
	changeInsUnit
} from "../actions/insEvaluator";
import config from "../app.config";
import {estPremTooltip, avgPaymentTooltip, freqTooltip, netCostTooltip, avgGrossRevTooltip} from "../app.messages";
import ToolTip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
	root: {
		width: "auto",
		marginTop: theme.spacing(3),
		overflowX: "auto",
		borderColor: "black"
	},

	table: {
		padding: 2,
		width: "auto",
		borderRadius: 15,
		borderStyle: "solid",
		borderColor: "rgb(144,144,144)",
		borderWidth: 1,
		borderCollapse: "separate"
	},

	tableCell: {},

	paper: {
		position: "absolute",
		paddingTop: "0px",
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(4),
		outline: "none"
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		// border: 1,
		width: 70,
	}
});

const ChartTableCell = withStyles({
	root: {
		borderRightStyle: "solid",
		borderRightWidth: 0,
		borderRightColor: "rgb(144,144,144)",
		paddingRight: 0,
		borderBottomWidth: 0,
		maxWidth: 340,
		paddingLeft: 10
	}
})(TableCell);

const TableCellWithTable = withStyles({
	root: {
		borderStyle: "none",
		borderWidth: 0,
		borderColor: "rgb(144,144,144)",
		padding: "0 0 0 0 !important"
	}
})(TableCell);

const TableCellDefaultStyles = withStyles({
	root: {
		borderStyle: "solid",
		borderTopWidth: 0,
		borderRightWidth: 1,
		borderLeftWidth: 0,
		borderBottomWidth: 1,
		borderColor: "rgb(144,144,144)",
		textAlign: "center",
		width: "90px",
		paddingLeft: "3px !important",
		paddingRight: "3px !important"
	}
})(TableCell);

const TableCellRightMostStyles = withStyles({
	root: {

		borderTopWidth: 0,
		borderRightWidth: 0,
		borderLeftWidth: 0,
		borderBottomWidth: 1
	}
})(TableCellDefaultStyles);

const TableCellBottomMostStyles = withStyles({
	root: {

		borderTopWidth: 0,
		borderRightWidth: 1,
		borderLeftWidth: 0,
		borderBottomWidth: 0
	}
})(TableCellDefaultStyles);


const TableCellHeader = withStyles({
	root: {
		color: "rgba(0, 0, 0, 0.54)",
		fontFamily: "Roboto",
		fontSize: "0.75rem",
		fontWeight: "500",
		borderTopWidth: 0,
		borderBottomWidth: 1,
		borderRightWidth: 1,
		width: "30px"

	}
})(TableCellDefaultStyles);


const CommonTableCell = withStyles({
	root: {
		fontSize: "1.15em"
	}
})(TableCellDefaultStyles);

const RightMostTableCell = withStyles({
	root: {
		fontSize: "1.15em"
	}
})(TableCellRightMostStyles);

const BottomMostTableCell = withStyles({
	root: {
		fontSize: "1.15em"
	}
})(TableCellBottomMostStyles);

const coloredBg = {backgroundColor: "WhiteSmoke"};

class EvaluatorPremiumResults extends Component {
	state = {
		insUnit: this.props["insUnit"]
	};

	constructor(props) {
		super(props);
		this.changeInsUnit = this.changeInsUnit.bind(this);

		this.state = {
			insUnit: this.props["insUnit"]
		};
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
		if (name === "insUnit"){
			this.changeInsUnit(event.target.value);
		}
	};

	validateMaxValue = value => event => {
		if (event.target.value !== "") {
			if (isNaN(event.target.value)) {
				event.target.value = event.target.value.toString().slice(0, -1);
			}
			else {
				if (event.target.value <= 0) {
					event.target.value = 1;
				}
				else if (event.target.value > value) {
					event.target.value = value;
				}
			}
		}
	};

	changeInsUnit(insUnit){
		this.props.changeInsUnit(insUnit);
	}

	componentWillUnmount() {
		// this.props.handlePremiumResults(null);
	}


	render() {
		const {classes} = this.props;
		//TODO: Fetch from config
		// let coverageLevels = ["50", "55", "60", "65", "70", "75", "80", "85"];

		let units = "bu/acre"; //TODO: Get from crop input of api
		let unit = this.state.insUnit.toLowerCase();

		let evalResult = null;

		if (this.props.hasOwnProperty("evalJson") && this.props.hasOwnProperty("evalJson") !== null) {
			evalResult = this.props["evalJson"];
		}

		let farmPolicyRows = [];
		let countyProductsRows = [];
		let expectedYield = 0;

		if (evalResult !== null) {
			let evalResultJson = evalResult;
			let premiums = evalResultJson.policies.farm;
			let farmInfo = evalResultJson["farm-info"];

			let futuresDate = "Dec. 22";
			if (this.props["CSCName"][0] === "Soybeans") {
				futuresDate = "Nov. 22";
			}

			let coverageLevels = Object.keys(premiums);

			let i = 1;
			let len = coverageLevels.length;
			coverageLevels.forEach(function(cov){
				if (i < len) {
					farmPolicyRows.push(
						<TableRow key={`childRowArc-${i}`}>
							<CommonTableCell style={{fontWeight: "bold"}}>{cov}%</CommonTableCell>

							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["est-premium"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["avg-payment"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{`${roundResults(premiums[cov][`rp-${unit}`]["freq-payment"] * 100, 1) }%`}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["net-cost"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["avg-gross-rev"])}</CommonTableCell>

							<CommonTableCell style={{}} >{roundResults(premiums[cov][`rphpe-${unit}`]["est-premium"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["avg-payment"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{`${roundResults(premiums[cov][`rphpe-${unit}`]["freq-payment"] * 100, 1) }%`}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["net-cost"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["avg-gross-rev"])}</CommonTableCell>

							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["est-premium"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["avg-payment"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{`${roundResults(premiums[cov][`yp-${unit}`]["freq-payment"] * 100, 1) }%`}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["net-cost"], 2)}</CommonTableCell>
							<RightMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["avg-gross-rev"])}</RightMostTableCell>

						</TableRow>
					);
				}
				else {
					farmPolicyRows.push(
						<TableRow key={`childRowArc-${i}`}>

							<BottomMostTableCell style={{fontWeight: "bold"}}>{cov}%</BottomMostTableCell>

							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["est-premium"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["avg-payment"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{`${roundResults(premiums[cov][`rp-${unit}`]["freq-payment"] * 100, 1) }%`}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["net-cost"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["avg-gross-rev"])}</BottomMostTableCell>

							<BottomMostTableCell style={{}} >{roundResults(premiums[cov][`rphpe-${unit}`]["est-premium"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["avg-payment"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{`${roundResults(premiums[cov][`rphpe-${unit}`]["freq-payment"] * 100, 1) }%`}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["net-cost"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["avg-gross-rev"])}</BottomMostTableCell>

							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["est-premium"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["avg-payment"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{`${roundResults(premiums[cov][`yp-${unit}`]["freq-payment"] * 100, 1) }%`}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["net-cost"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{borderRightWidth: 0, backgroundColor: "WhiteSmoke", borderBottomRightRadius: "15px"}}>
								{roundResults(premiums[cov][`yp-${unit}`]["avg-gross-rev"])}
							</BottomMostTableCell>
						</TableRow>
					);
				}
				i++;
			});


			let countyProductObjData = evalResultJson.policies.county;

			if (countyProductObjData) {
				let premiums = countyProductObjData;
				// let guarantees = countyProductObjData.guarantees;

				let coverageLevels = Object.keys(premiums);

				let i = 1;
				let len = coverageLevels.length;
				coverageLevels.forEach(function(cov){
					if (i < len) {
						countyProductsRows.push(

							<TableRow key={`childRowArc-${i}`}>
								<CommonTableCell style={{fontWeight: "bold"}}>{cov}%</CommonTableCell>

								<CommonTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["rp"]["est-premium"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["rp"]["avg-payment"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{
									roundResultsIfNotZero(premiums[cov]["rp"]["freq-payment"] * 100, 1) === "NA" ? "NA" :
										`${roundResultsIfNotZero(premiums[cov]["rp"]["freq-payment"] * 100, 1) }%`
								}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["rp"]["net-cost"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["rp"]["avg-gross-rev"])}</CommonTableCell>

								<CommonTableCell style={{}} >{roundResultsIfNotZero(premiums[cov]["rphpe"]["est-premium"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResultsIfNotZero(premiums[cov]["rphpe"]["avg-payment"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{
									roundResultsIfNotZero(premiums[cov]["rphpe"]["freq-payment"] * 100, 1) === "NA" ? "NA" :
										`${roundResultsIfNotZero(premiums[cov]["rphpe"]["freq-payment"] * 100, 1) }%`
								}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResultsIfNotZero(premiums[cov]["rphpe"]["net-cost"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResultsIfNotZero(premiums[cov]["rphpe"]["avg-gross-rev"])}</CommonTableCell>

								<CommonTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["yp"]["est-premium"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["yp"]["avg-payment"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{
									roundResultsIfNotZero(premiums[cov]["yp"]["freq-payment"] * 100, 1) === "NA" ? "NA" :
										`${roundResultsIfNotZero(premiums[cov]["yp"]["freq-payment"] * 100, 1) }%`
								}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["yp"]["net-cost"], 2)}</CommonTableCell>
								<RightMostTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["yp"]["avg-gross-rev"])}</RightMostTableCell>

							</TableRow>
						);
					}
					else {
						countyProductsRows.push(
							<TableRow key={`childRowArc-${i}`}>

								<BottomMostTableCell style={{fontWeight: "bold"}}>{cov}%</BottomMostTableCell>

								<BottomMostTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["rp"]["est-premium"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["rp"]["avg-payment"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{
									roundResultsIfNotZero(premiums[cov]["rp"]["freq-payment"] * 100, 1) === "NA" ? "NA" :
										`${roundResultsIfNotZero(premiums[cov]["rp"]["freq-payment"] * 100, 1) }%`
								}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["rp"]["net-cost"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["rp"]["avg-gross-rev"])}</BottomMostTableCell>

								<BottomMostTableCell style={{}} >{roundResultsIfNotZero(premiums[cov]["rphpe"]["est-premium"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResultsIfNotZero(premiums[cov]["rphpe"]["avg-payment"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{
									roundResultsIfNotZero(premiums[cov]["rphpe"]["freq-payment"] * 100, 1) === "NA" ? "NA" :
										`${roundResultsIfNotZero(premiums[cov]["rphpe"]["freq-payment"] * 100, 1) }%`
								}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResultsIfNotZero(premiums[cov]["rphpe"]["net-cost"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResultsIfNotZero(premiums[cov]["rphpe"]["avg-gross-rev"])}</BottomMostTableCell>

								<BottomMostTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["yp"]["est-premium"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["yp"]["avg-payment"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{
									roundResultsIfNotZero(premiums[cov]["yp"]["freq-payment"] * 100, 1) === "NA" ? "NA" :
										`${roundResultsIfNotZero(premiums[cov]["yp"]["freq-payment"] * 100, 1) }%`
								}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResultsIfNotZero(premiums[cov]["yp"]["net-cost"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{borderRightWidth: 0, backgroundColor: "WhiteSmoke", borderBottomRightRadius: "15px"}}>
									{roundResultsIfNotZero(premiums[cov]["yp"]["avg-gross-rev"])}
								</BottomMostTableCell>
							</TableRow>
						);
					}
					i++;
				});
			}


			return (
				<div style={{padding: 4, display: "inline-block"}}>

					<Grid container>
						<Grid item style={{width: "25%"}} />
						<Grid item style={{width: "50%", verticalAlign: "middle"}}>
							<div style={{padding: "15px"}}> <h2>Individual Farm Level Policies </h2></div>
						</Grid>
						<Grid item style={{width: "25%"}}>
							<div style={{margin: "8px", textAlign: "right", fontSize: "larger"}}>
								Farm TA Yield (bu/acre): <span style={{fontWeight: 700}}>{roundResults(farmInfo["trend-adj-aph"], 2)}</span><br />
								{futuresDate} Futures Price: <span style={{fontWeight: 700}}>${roundResults(farmInfo["avg-futures-price"], 2)}</span><br />
								Final Projected Price: <span style={{fontWeight: 700}}>${roundResults(farmInfo["proj-price"], 2)}</span>
							</div>
						</Grid>
					</Grid>


					{farmPolicyRows.length === -1 ? <div style={{padding: "15px", color: "red"}}> Not applicable for the selected inputs.
								Please make sure the selected "Type" and "Practice" are applicable for your farm </div> :

						<div>

							<div style={{display: "table", width: "100%"}}>
								<div style={{display: "inline-flex", alignItems: "center"}}>
									<span style={{fontSize: "1.10em", padding: "8px"}}> Unit: </span>
									<FormControl style={{marginBottom: "8px"}}>
										<Select id="useTaAdj" labelId="taId" value={this.state.insUnit} onChange={this.handleChange("insUnit")}>
											<MenuItem value="basic">Basic</MenuItem>
											<MenuItem value="enterprise">Enterprise</MenuItem>
										</Select>
									</FormControl>
								</div>
							</div>


							<Table className={classes.table}>
								<TableBody>
									<TableRow style={{height: "64px"}}>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={1} rowSpan={2}>
											Coverage Level
										</TableCellHeader>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1} style={coloredBg}>Revenue
											Protection (RP)</TableCellHeader>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1}>Revenue Protection
											With Harvest Price Exclusion (RP-HPE)</TableCellHeader>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1}
																	 style={{borderRightWidth: 0,
																		 backgroundColor: "WhiteSmoke", borderTopRightRadius: "15px"}}>
											Yield Protection (YP)</TableCellHeader>
									</TableRow>
									<TableRow style={{height: "64px"}}>
										<ToolTip title={estPremTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Est. <br/>Premium <br/>($/acre)</TableCellHeader>
										</ToolTip>
										<ToolTip title={avgPaymentTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Avg. <br/> Payment <br/>($/acre)</TableCellHeader>
										</ToolTip>
										<ToolTip title={freqTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Payment Frequency (%)</TableCellHeader>
										</ToolTip>
										<ToolTip title={netCostTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Net <br/> Cost <br/>($/acre)</TableCellHeader>
										</ToolTip>
										<ToolTip title={avgGrossRevTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Avg. Gross Rev <br/>($/acre)</TableCellHeader>
										</ToolTip>

										<ToolTip title={estPremTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip">
												Est. <br/>Premium <br/>($/acre)</TableCellHeader>
										</ToolTip>
										<ToolTip title={avgPaymentTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip">
												Avg. <br/> Payment <br/>($/acre)</TableCellHeader>
										</ToolTip>
										<ToolTip title={freqTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip">
												Payment Frequency (%)</TableCellHeader>
										</ToolTip>
										<ToolTip title={netCostTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip">
												Net <br/> Cost <br/>($/acre)</TableCellHeader>
										</ToolTip>
										<ToolTip title={avgGrossRevTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip">
												Avg. Gross Rev <br/>($/acre)</TableCellHeader>
										</ToolTip>

										<ToolTip title={estPremTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip"
																			 style={coloredBg}>Est. <br/>Premium <br/>($/acre)</TableCellHeader>
										</ToolTip>
										<ToolTip title={avgPaymentTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip"
																			 style={coloredBg}>Avg. <br/> Payment <br/>($/acre)</TableCellHeader>
										</ToolTip>
										<ToolTip title={freqTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip"
																			 style={coloredBg}>Payment Frequency (%)</TableCellHeader>
										</ToolTip>
										<ToolTip title={netCostTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip"
																			 style={coloredBg}>Net <br/> Cost <br/>($/acre)</TableCellHeader>
										</ToolTip>
										<ToolTip title={avgGrossRevTooltip} enterTouchDelay={config.tooltipTouchDelay}>
											<TableCellHeader className="table-header-tooltip" style={{
												borderRightWidth: 0,
												backgroundColor: "WhiteSmoke"
											}}>Avg. Gross Rev <br/>($/acre)</TableCellHeader>
										</ToolTip>
									</TableRow>

									{farmPolicyRows}
								</TableBody>
							</Table>
						</div>
					}

					<br/>

					<Divider/>

					<div style={{padding: "20px 15px 15px 15px"}}> <h2>County Level Products </h2></div>

					{countyProductsRows.length === -1 ? <div style={{padding: "15px", color: "red"}}> Not applicable for the selected inputs </div> :

						<Table className={classes.table}>
							<TableBody>
								<TableRow style={{height: "64px"}}>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={1} rowSpan={2}>
									Coverage Level
									</TableCellHeader>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1} style={coloredBg}>Area
											Revenue Protection (ARP)</TableCellHeader>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1}>Area Revenue
											Protection With Harvest Price Exclusion (ARP-HPE)</TableCellHeader>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1}
																	 style={{borderRightWidth: 0,	backgroundColor: "WhiteSmoke",
																		 borderTopRightRadius: "15px"
																		 }}>
											Area Yield Protection (AYP)</TableCellHeader>
								</TableRow>

								<TableRow style={{height: "64px"}}>
									<ToolTip title={estPremTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Est. <br/>Premium <br/>($/acre)</TableCellHeader>
									</ToolTip>
									<ToolTip title={avgPaymentTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Avg. <br/> Payment <br/>($/acre)</TableCellHeader>
									</ToolTip>
									<ToolTip title={freqTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Payment Frequency (%)</TableCellHeader>
									</ToolTip>
									<ToolTip title={netCostTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Net <br/> Cost <br/>($/acre)</TableCellHeader>
									</ToolTip>
									<ToolTip title={avgGrossRevTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Avg. Gross Rev <br/>($/acre)</TableCellHeader>
									</ToolTip>

									<ToolTip title={estPremTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip">
											Est. <br/>Premium <br/>($/acre)</TableCellHeader>
									</ToolTip>
									<ToolTip title={avgPaymentTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip">
											Avg. <br/> Payment <br/>($/acre)</TableCellHeader>
									</ToolTip>
									<ToolTip title={freqTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip">
											Payment Frequency (%)</TableCellHeader>
									</ToolTip>
									<ToolTip title={netCostTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip">
											Net <br/> Cost <br/>($/acre)</TableCellHeader>
									</ToolTip>
									<ToolTip title={avgGrossRevTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip">
											Avg. Gross Rev <br/>($/acre)</TableCellHeader>
									</ToolTip>

									<ToolTip title={estPremTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Est. <br/>Premium <br/>($/acre)</TableCellHeader>
									</ToolTip>
									<ToolTip title={avgPaymentTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Avg. <br/> Payment <br/>($/acre)</TableCellHeader>
									</ToolTip>
									<ToolTip title={freqTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Payment Frequency (%)</TableCellHeader>
									</ToolTip>
									<ToolTip title={netCostTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Net <br/> Cost <br/>($/acre)</TableCellHeader>
									</ToolTip>
									<ToolTip title={avgGrossRevTooltip} enterTouchDelay={config.tooltipTouchDelay}>
										<TableCellHeader className="table-header-tooltip" style={{
											borderRightWidth: 0,
											backgroundColor: "WhiteSmoke"
										}}> Avg. Gross Rev <br/>($/acre)</TableCellHeader>
									</ToolTip>
								</TableRow>

								{countyProductsRows}
							</TableBody>
						</Table>
					}
					<br/>

					<Divider/>
				</div>
			);
		}
		else {
			return (
				<div />
			);
		}
	}
}

const mapStateToProps = (state) => {
	return {
		insUnit: state.insEvaluator.insUnit,
		CSCName: state.insEvaluator.cropStateCountyName
	};
};

const mapDispatchToProps = dispatch => ({
	changeInsUnit: insUnit => dispatch(changeInsUnit(insUnit))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EvaluatorPremiumResults));
