import React, {Component} from "react";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/styles";
import {
	FormControl,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@material-ui/core";
import {roundResults} from "../public/utils.js";
import "../styles/main.css";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {changeInsUnit, handleEvaluatorResults} from "../actions/insEvaluator";

import FDTooltip from "./Tooltip";
import config from "../app.config";
import Spinner from "./Spinner";

const styles = theme => ({
	root: {
		width: "auto",
		marginTop: theme.spacing.unit * 3,
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
		padding: theme.spacing.unit * 4,
		outline: "none"
	},
	textField: {
		marginTop: 4,
		marginBottom: 4,
		marginLeft: theme.spacing.unit * 1,
		marginRight: theme.spacing.unit * 1,
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
		fontSize: "1.00em"
	}
})(TableCellDefaultStyles);

const RightMostTableCell = withStyles({
	root: {
		fontSize: "1.00em"
	}
})(TableCellRightMostStyles);

const BottomMostTableCell = withStyles({
	root: {
		fontSize: "1.00em"
	}
})(TableCellBottomMostStyles);

const coloredBg = {backgroundColor: "WhiteSmoke"};

class EvaluatorRiskResults extends Component {
	state = {
		insUnit: this.props["insUnit"],
		grossTarget: this.props.evalJson.policies["gross-target"],
		runStatus: "INIT"
	};

	constructor(props) {
		super(props);
		this.changeInsUnit = this.changeInsUnit.bind(this);
		this.handleEvaluatorResults = this.handleEvaluatorResults.bind(this);
		this.keyPress = this.keyPress.bind(this);

		this.state = {
			insUnit: this.props["insUnit"],
			grossTarget: props.evalJson.policies["gross-target"],
			runStatus: "INIT"
		};
	}

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

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
		if (name === "insUnit"){
			this.changeInsUnit(event.target.value);
		}

		if (name === "grossTarget"){
			// this.runEvaluator();
		}
	};

	keyPress(e) {
		if (e.keyCode === 13){
			this.setState({runStatus: "FETCHING_RESULTS"});
			this.runEvaluator();
		}
	}

	handleEvaluatorResults(results) {
		this.props.handleEvaluatorResults(results);
	}

	changeInsUnit(insUnit){
		this.props.changeInsUnit(insUnit);
	}

	componentWillUnmount() {
		// this.props.handlePremiumResults(null);
	}

	async runEvaluator() {
		//let status = "STARTED";
		// let personId = localStorage.getItem("dwPersonId");
		let email = localStorage.getItem("kcEmail");
		let token = localStorage.getItem("kcToken");
		let token_header = `Bearer ${token}`;

		let kcHeaders = {
			"Authorization": token_header
		};

		let evaluatorResult = "";

		this.setState({runStatus: "FETCHING_RESULTS"});

		let evaluatorUrl = new URL(`${config.apiUrl }/compute/simulator`);
		let evaluatorParams = [
			["code", this.props["cropCode"]],
			["acres", this.props["cropCode"]],
			["grossTarget", this.state.grossTarget]
		];

		evaluatorUrl.search = new URLSearchParams(evaluatorParams).toString();

		const evaluatorResponse = await fetch(evaluatorUrl, {
			method: "GET",
			headers: kcHeaders,
		});

		if (evaluatorResponse instanceof Response) {
			try {
				evaluatorResult = await evaluatorResponse.json();
				if (typeof(evaluatorResult) === "object") {
					this.handleEvaluatorResults(JSON.stringify(evaluatorResult));
					// this.handleEvaluatorResults(null);
					this.setState({runStatus: "FETCHED_RESULTS"});
				}
				else {
					this.handleEvaluatorResults(null);
					this.setState({runStatus: "ERROR_RESULTS"});
				}
			}
			catch (error) {
				this.setState({runStatus: "ERROR_RESULTS"});
				console.log("error getting the response from flask api");
			}
		}
	}

	render() {
		const {classes} = this.props;
		//TODO: Fetch from config
		// let coverageLevels = ["50", "55", "60", "65", "70", "75", "80", "85"];

		let units = "bu/acre"; //TODO: Get from crop input of api

		let evalResult = null;

		let spinner;

		if (this.state.runStatus === "FETCHING_RESULTS") {
			spinner = <Spinner/>;
		}
		else {
			spinner = null;
		}

		if (this.props.hasOwnProperty("evalJson") && this.props.hasOwnProperty("evalJson") !== null) {
			evalResult = this.props["evalJson"];
		}

		let unit = this.state.insUnit.toLowerCase();

		let farmPolicyRows = [];
		let countyProductsRows = [];
		let expectedYield = 0;

		if (evalResult !== null) {
			let evalResultJson = evalResult;
			let premiums = evalResultJson.policies.farm;

			let coverageLevels = Object.keys(premiums);

			let i = 1;
			let len = coverageLevels.length;
			coverageLevels.forEach(function(cov){
				if (i < len) {
					farmPolicyRows.push(
						<TableRow key={`childRowArc-${i}`}>
							<CommonTableCell style={{fontWeight: "bold"}}>{cov}%</CommonTableCell>

							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["target-prob"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-1"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-5"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-10"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-25"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-1"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-5"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-10"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-25"], 2)}</CommonTableCell>


							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["target-prob"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-1"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-5"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-10"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-25"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-1"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-5"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-10"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-25"], 2)}</CommonTableCell>

							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["target-prob"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-1"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-5"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-10"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-25"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-1"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-5"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-10"], 2)}</CommonTableCell>
							<RightMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-25"], 2)}</RightMostTableCell>

						</TableRow>
					);
				}
				else {
					farmPolicyRows.push(
						<TableRow key={`childRowArc-${i}`}>

							<BottomMostTableCell style={{fontWeight: "bold"}}>{cov}%</BottomMostTableCell>

							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["target-prob"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-1"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-5"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-10"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-25"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-1"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-5"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-10"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-25"], 2)}</BottomMostTableCell>


							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["target-prob"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-1"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-5"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-10"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-25"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-1"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-5"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-10"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-25"], 2)}</BottomMostTableCell>

							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["target-prob"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-1"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-5"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-10"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-25"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-1"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-5"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-10"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{borderRightWidth: 0, backgroundColor: "WhiteSmoke", borderBottomRightRadius: "15px"}}>
								{roundResults(premiums[cov][`rp-${unit}`]["var-change-25"], 2)}
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

								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["target-prob"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-1"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-5"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-10"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-25"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-change-1"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-change-5"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-change-10"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-change-25"], 2)}</CommonTableCell>


								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["target-prob"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-1"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-5"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-10"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-25"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-change-1"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-change-5"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-change-10"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-change-25"], 2)}</CommonTableCell>

								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["target-prob"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-1"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-5"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-10"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-25"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-change-1"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-change-5"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-change-10"], 2)}</CommonTableCell>
								<RightMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-change-25"], 2)}</RightMostTableCell>

							</TableRow>
						);
					}
					else {
						countyProductsRows.push(
							<TableRow key={`childRowArc-${i}`}>

								<BottomMostTableCell style={{fontWeight: "bold"}}>{cov}%</BottomMostTableCell>

								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["target-prob"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-1"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-5"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-10"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-25"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-change-1"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-change-5"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-change-10"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-change-25"], 2)}</BottomMostTableCell>


								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["target-prob"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-1"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-5"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-10"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-25"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-change-1"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-change-5"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-change-10"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-change-25"], 2)}</BottomMostTableCell>

								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["target-prob"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-1"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-5"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-10"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-25"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-change-1"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-change-5"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-change-10"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{borderRightWidth: 0, backgroundColor: "WhiteSmoke", borderBottomRightRadius: "15px"}}>
									{roundResults(premiums[cov]["yp"]["var-change-25"], 2)}
								</BottomMostTableCell>
							</TableRow>
						);
					}
					i++;
				});
			}


			return (
				<div style={{padding: 4, display: "inline-block"}}>

					{/*<div style={{fontSize: "1.10em", paddingLeft: "28px", paddingRight: "8px", paddingTop: "8px"}}> Gross Target Used for Current Simulation: $536.56 / acre*/}
					{/*</div>*/}

					<div>
						<span style={{fontSize: "1.10em", paddingLeft: "28px", paddingRight: "8px"}}> Change Gross Target($) To Run Again: </span>
						<FormControl >
							<TextField
									id="grossTarget"
									value={this.state.grossTarget}
									margin="normal"
									onChange={this.handleChange("grossTarget")}
									onKeyDown={this.keyPress}
									className={classes.textField}
									required
									InputLabelProps={{shrink: true}}
									onInput={this.validateMaxValue(10000)}
									// InputProps={{
									// 	inputProps: textFieldInputStyle
									// }}
									inputProps={{padding: 10}}
							/>
						</FormControl> /acre
						{/*TODO: Enter key might not work on mobiles */}
						<FDTooltip title="Click ENTER key to run the simulation again"/>
					</div>


					<div style={{fontSize: "1.10em", paddingLeft: "28px", paddingRight: "8px", paddingTop: "8px"}}>
						<div style={{paddingBottom: "8px"}}>Probability of not reaching above target with no insurance: {evalResultJson.policies["no-ins-prob"]} </div>
						<div style={{paddingBottom: "8px"}}>1% Value at risk with no insurance: {evalResultJson.policies["no-ins-var-1"]} </div>
						<div style={{paddingBottom: "8px"}}>5% Value at risk with no insurance: {evalResultJson.policies["no-ins-var-5"]} </div>
						<div style={{paddingBottom: "8px"}}>10% Value at risk with no insurance: {evalResultJson.policies["no-ins-var-10"]} </div>
						<div style={{paddingBottom: "8px"}}>25% Value at risk with no insurance: {evalResultJson.policies["no-ins-var-25"]} </div>

					</div>

					<div style={{padding: "15px"}}> <h2>Individual Farm Level Policies - Risk </h2></div>

					{farmPolicyRows.length === -1 ? <div style={{padding: "15px", color: "red"}}> Not applicable for the selected inputs.
								Please make sure the selected "Type" and "Practice" are applicable for your farm </div> :

						<div>
							<span style={{fontSize: "1.10em", padding: "8px"}}> Unit: </span>
							<FormControl style={{marginBottom: "8px"}}>
								<Select id="useTaAdj" labelId="taId" value={this.state.insUnit} onChange={this.handleChange("insUnit")}>
									<MenuItem value="basic">Basic</MenuItem>
									<MenuItem value="enterprise">Enterprise</MenuItem>
								</Select>
							</FormControl>
							<br/>

							<Table className={classes.table}>
								<TableBody>
									<TableRow style={{height: "64px"}}>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={1} rowSpan={3}
																		 style={{width: "120px"}}>Cov.
											Level</TableCellHeader>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={9} rowSpan={1} style={coloredBg}>Revenue
											Protection</TableCellHeader>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={9} rowSpan={1}>Revenue Protection
											With Harvest Price Exclusion</TableCellHeader>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={9} rowSpan={1}
																	 style={{borderRightWidth: 0,
																		 backgroundColor: "WhiteSmoke", borderTopRightRadius: "15px"}}>
											Yield Protection</TableCellHeader>
									</TableRow>

									<TableRow style={{height: "32px"}}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg} colSpan={1} rowSpan={2}>Target Prob (%)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg} colSpan={4}> VAR </TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg} colSpan={4}>VAR Change</TableCellHeader>

										<TableCellHeader className="table-header-tooltip"
																		 style={{}} colSpan={1} rowSpan={2}>Target Prob (%)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}} colSpan={4}> VAR </TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}} colSpan={4}>VAR Change</TableCellHeader>

										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg} colSpan={1} rowSpan={2}>Target Prob (%)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg} colSpan={4}> VAR </TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={Object.assign({}, coloredBg,
																				 {borderRightWidth: 0})} colSpan={4}>VAR Change</TableCellHeader>

									</TableRow>
									<TableRow style={{height: "64px"}}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>1%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>5%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>10%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>25%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>1%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>5%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>10%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>25%</TableCellHeader>

										<TableCellHeader className="table-header-tooltip"
																		 style={{}}>1%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}}>5%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}}>10%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}}>25%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}}>1%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}}>5%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}}>10%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}}>25%</TableCellHeader>

										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>1%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>5%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>10%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>25%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>1%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>5%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>10%</TableCellHeader>
										<TableCellHeader className="table-header-tooltip" style={{
											borderRightWidth: 0,
											backgroundColor: "WhiteSmoke"
										}}>  25%</TableCellHeader>
									</TableRow>

									{farmPolicyRows}
								</TableBody>
							</Table>
						</div>
					}

					<br/>

					<Divider/>

					<div style={{padding: "20px 15px 15px 15px"}}> <h2>County Level Products - Risk </h2></div>

					{countyProductsRows.length === -1 ? <div style={{padding: "15px", color: "red"}}> Not applicable for the selected inputs </div> :

						<Table className={classes.table}>
							<TableBody>
								<TableRow style={{height: "64px"}}>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={1} rowSpan={3}
																		 style={{width: "150px"}}>Cov.
											Level</TableCellHeader>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={9} rowSpan={1} style={coloredBg}>Area
											Revenue Protection</TableCellHeader>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={9} rowSpan={1}>Area Revenue
											Protection With Harvest Price Exclusion</TableCellHeader>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={9} rowSpan={1}
																	 style={{borderRightWidth: 0,	backgroundColor: "WhiteSmoke",
																		 borderTopRightRadius: "15px"
																		 }}>
											Area Yield Protection</TableCellHeader>
								</TableRow>

								<TableRow style={{height: "32px"}}>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg} colSpan={1} rowSpan={2}>Target Prob (%) </TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg} colSpan={4}> VAR </TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg} colSpan={4}>VAR Change</TableCellHeader>

									<TableCellHeader className="table-header-tooltip"
																	 style={{}} colSpan={1} rowSpan={2}>Target Prob (%) </TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}} colSpan={4}> VAR </TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}} colSpan={4}>VAR Change</TableCellHeader>

									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg} colSpan={1} rowSpan={2}>Target Prob (%)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg} colSpan={4}> VAR </TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={Object.assign({}, coloredBg,
																			 {borderRightWidth: 0})} colSpan={4}>Without VAR</TableCellHeader>

								</TableRow>
								<TableRow style={{height: "64px"}}>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>1%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>5%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>10%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>25%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>1%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>5%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>10%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>25%</TableCellHeader>

									<TableCellHeader className="table-header-tooltip"
																	 style={{}}>1%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}}>5%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}}>10%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}}>25%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}}>1%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}}>5%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}}>10%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}}>25%</TableCellHeader>

									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>1%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>5%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>10%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>25%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>1%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>5%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>10%</TableCellHeader>
									<TableCellHeader className="table-header-tooltip" style={{
										borderRightWidth: 0,
										backgroundColor: "WhiteSmoke"
									}}>  25%</TableCellHeader>
								</TableRow>

								{countyProductsRows}
							</TableBody>
						</Table>
					}
					<br/>

					<Divider/>
					<br/>
					{spinner}
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
		cropCode: state.insEvaluator.cropCode,
		acres: state.insEvaluator.acres
	};
};

const mapDispatchToProps = dispatch => ({
	handleEvaluatorResults: evaluatorResults => dispatch(handleEvaluatorResults(evaluatorResults)),
	changeInsUnit: insUnit => dispatch(changeInsUnit(insUnit))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EvaluatorRiskResults));
