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
import EvaluatorRiskGraph from "./EvaluatorRiskGraph";

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
		width: 90,
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
		grossTarget: roundResults(this.props.evalJson.policies["gross-target"]),
		runStatus: "INIT"
	};

	constructor(props) {
		super(props);
		this.changeInsUnit = this.changeInsUnit.bind(this);
		this.handleEvaluatorResults = this.handleEvaluatorResults.bind(this);
		this.keyPress = this.keyPress.bind(this);

		this.state = {
			insUnit: this.props["insUnit"],
			grossTarget: roundResults(this.props.evalJson.policies["gross-target"]),
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
			["acres", this.props["acres"]],
			["grossTarget", this.state.grossTarget],
			["email", email]
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
					this.handleEvaluatorResults("");
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
		let graphInfo = null;

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

		if (this.props.hasOwnProperty("graphJson") && this.props.hasOwnProperty("graphJson") !== null) {
			graphInfo = this.props["graphJson"];
		}

		let unit = this.state.insUnit.toLowerCase();

		let farmPolicyRows = [];
		let countyProductsRows = [];
		let expectedYield = 0;
		let display = {display: "none"};

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

							<CommonTableCell style={coloredBg}>{`${roundResults(premiums[cov][`rp-${unit}`]["target-prob"] * 100, 1) }%`}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-1"])}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-5"])}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-10"])}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-25"])}</CommonTableCell>
							<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-1"])}</CommonTableCell>
							<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-5"])}</CommonTableCell>
							<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-10"])}</CommonTableCell>
							<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`rp-${unit}`]["var-change-25"])}</CommonTableCell>


							<CommonTableCell style={{}}>{`${roundResults(premiums[cov][`rphpe-${unit}`]["target-prob"] * 100, 1) }%`}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-1"])}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-5"])}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-10"])}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-25"])}</CommonTableCell>
							<CommonTableCell style={display}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-1"])}</CommonTableCell>
							<CommonTableCell style={display}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-5"])}</CommonTableCell>
							<CommonTableCell style={display}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-10"])}</CommonTableCell>
							<CommonTableCell style={display}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-25"])}</CommonTableCell>

							<CommonTableCell style={coloredBg}>{`${roundResults(premiums[cov][`yp-${unit}`]["target-prob"] * 100, 1) }%`}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-1"])}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-5"])}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-10"])}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-25"])}</CommonTableCell>
							<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-1"])}</CommonTableCell>
							<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-5"])}</CommonTableCell>
							<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-10"])}</CommonTableCell>
							<RightMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-25"])}</RightMostTableCell>

						</TableRow>
					);
				}
				else {
					farmPolicyRows.push(
						<TableRow key={`childRowArc-${i}`}>

							<BottomMostTableCell style={{fontWeight: "bold"}}>{cov}%</BottomMostTableCell>

							<BottomMostTableCell style={coloredBg}>{`${roundResults(premiums[cov][`rp-${unit}`]["target-prob"] * 100, 1) }%`}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-1"])}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-5"])}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-10"])}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`rp-${unit}`]["var-25"])}</BottomMostTableCell>
							<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>
								{roundResults(premiums[cov][`rp-${unit}`]["var-change-1"])}</BottomMostTableCell>
							<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>
								{roundResults(premiums[cov][`rp-${unit}`]["var-change-5"])}</BottomMostTableCell>
							<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>
								{roundResults(premiums[cov][`rp-${unit}`]["var-change-10"])}</BottomMostTableCell>
							<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>
								{roundResults(premiums[cov][`rp-${unit}`]["var-change-25"])}</BottomMostTableCell>


							<BottomMostTableCell style={{}}>{`${roundResults(premiums[cov][`rphpe-${unit}`]["target-prob"] * 100, 1) }%`}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-1"])}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-5"])}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-10"])}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-25"])}</BottomMostTableCell>
							<BottomMostTableCell style={display}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-1"])}</BottomMostTableCell>
							<BottomMostTableCell style={display}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-5"])}</BottomMostTableCell>
							<BottomMostTableCell style={display}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-10"])}</BottomMostTableCell>
							<BottomMostTableCell style={display}>{roundResults(premiums[cov][`rphpe-${unit}`]["var-change-25"])}</BottomMostTableCell>

							<BottomMostTableCell style={coloredBg}>{`${roundResults(premiums[cov][`yp-${unit}`]["target-prob"] * 100, 1) }%`}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-1"])}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-5"])}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-10"])}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov][`yp-${unit}`]["var-25"])}</BottomMostTableCell>
							<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-1"])}</BottomMostTableCell>
							<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-5"])}</BottomMostTableCell>
							<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov][`yp-${unit}`]["var-change-10"])}</BottomMostTableCell>
							<BottomMostTableCell style={Object.assign({}, {borderRightWidth: 0, backgroundColor: "WhiteSmoke", borderBottomRightRadius: "15px"}, display)}>
								{roundResults(premiums[cov][`rp-${unit}`]["var-change-25"])}
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

								<CommonTableCell style={coloredBg}>{`${roundResults(premiums[cov]["rp"]["target-prob"] * 100, 1) }%`}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-1"])}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-5"])}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-10"])}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-25"])}</CommonTableCell>
								<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["rp"]["var-change-1"])}</CommonTableCell>
								<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["rp"]["var-change-5"])}</CommonTableCell>
								<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["rp"]["var-change-10"])}</CommonTableCell>
								<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["rp"]["var-change-25"])}</CommonTableCell>


								<CommonTableCell style={{}}>{`${roundResults(premiums[cov]["rphpe"]["target-prob"] * 100, 1) }%`}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-1"])}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-5"])}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-10"])}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-25"])}</CommonTableCell>
								<CommonTableCell style={display}>{roundResults(premiums[cov]["rphpe"]["var-change-1"])}</CommonTableCell>
								<CommonTableCell style={display}>{roundResults(premiums[cov]["rphpe"]["var-change-5"])}</CommonTableCell>
								<CommonTableCell style={display}>{roundResults(premiums[cov]["rphpe"]["var-change-10"])}</CommonTableCell>
								<CommonTableCell style={display}>{roundResults(premiums[cov]["rphpe"]["var-change-25"])}</CommonTableCell>

								<CommonTableCell style={coloredBg}>{`${roundResults(premiums[cov]["yp"]["target-prob"] * 100, 1) }%`}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-1"])}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-5"])}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-10"])}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-25"])}</CommonTableCell>
								<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["yp"]["var-change-1"])}</CommonTableCell>
								<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["yp"]["var-change-5"])}</CommonTableCell>
								<CommonTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["yp"]["var-change-10"])}</CommonTableCell>
								<RightMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["yp"]["var-change-25"])}</RightMostTableCell>

							</TableRow>
						);
					}
					else {
						countyProductsRows.push(
							<TableRow key={`childRowArc-${i}`}>

								<BottomMostTableCell style={{fontWeight: "bold"}}>{cov}%</BottomMostTableCell>

								<BottomMostTableCell style={coloredBg}>{`${roundResults(premiums[cov]["rp"]["target-prob"] * 100, 1) }%`}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-1"])}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-5"])}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-10"])}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["var-25"])}</BottomMostTableCell>
								<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["rp"]["var-change-1"])}</BottomMostTableCell>
								<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["rp"]["var-change-5"])}</BottomMostTableCell>
								<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["rp"]["var-change-10"])}</BottomMostTableCell>
								<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["rp"]["var-change-25"])}</BottomMostTableCell>


								<BottomMostTableCell style={{}}>{`${roundResults(premiums[cov]["rphpe"]["target-prob"] * 100, 1) }%`}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-1"])}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-5"])}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-10"])}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["var-25"])}</BottomMostTableCell>
								<BottomMostTableCell style={display}>{roundResults(premiums[cov]["rphpe"]["var-change-1"])}</BottomMostTableCell>
								<BottomMostTableCell style={display}>{roundResults(premiums[cov]["rphpe"]["var-change-5"])}</BottomMostTableCell>
								<BottomMostTableCell style={display}>{roundResults(premiums[cov]["rphpe"]["var-change-10"])}</BottomMostTableCell>
								<BottomMostTableCell style={display}>{roundResults(premiums[cov]["rphpe"]["var-change-25"])}</BottomMostTableCell>

								<BottomMostTableCell style={coloredBg}>{`${roundResults(premiums[cov]["yp"]["target-prob"] * 100, 1) }%`}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-1"])}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-5"])}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-10"])}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["var-25"])}</BottomMostTableCell>
								<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["yp"]["var-change-1"])}</BottomMostTableCell>
								<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["yp"]["var-change-5"])}</BottomMostTableCell>
								<BottomMostTableCell style={Object.assign({}, coloredBg, display)}>{roundResults(premiums[cov]["yp"]["var-change-10"])}</BottomMostTableCell>
								<BottomMostTableCell style={Object.assign({}, {borderRightWidth: 0, backgroundColor: "WhiteSmoke", borderBottomRightRadius: "15px"}, display)}>
									{roundResults(premiums[cov]["yp"]["var-change-25"])}
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

						<span style={{fontSize: "1.10em", paddingLeft: "28px", paddingRight: "8px"}}> Change Gross Target Revenue To Run Again: </span>
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
									onInput={this.validateMaxValue(9999)}
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>, padding: 5
									}}
							/>
						</FormControl> /acre
						{/*TODO: Enter key might not work on mobiles */}
						<FDTooltip title="Click ENTER key to run the simulation again"/>
					</div>


					<div style={{fontSize: "1.10em", paddingLeft: "28px", paddingRight: "8px", paddingTop: "8px"}}>
						<div style={{paddingBottom: "8px"}}>Probability of not reaching above target with no insurance:
							&nbsp;{`${roundResults(evalResultJson.policies["no-ins-prob"] * 100, 1) }%`} </div>
						<div style={{paddingBottom: "8px"}}>1% Value at risk with no insurance:
							&nbsp;{`$${ roundResults(evalResultJson.policies["no-ins-var-1"])}`} </div>
						<div style={{paddingBottom: "8px"}}>5% Value at risk with no insurance:
							&nbsp;{`$${ roundResults(evalResultJson.policies["no-ins-var-5"])}`} </div>
						<div style={{paddingBottom: "8px"}}>10% Value at risk with no insurance:
							&nbsp;{`$${ roundResults(evalResultJson.policies["no-ins-var-10"])}`} </div>
						<div style={{paddingBottom: "8px"}}>25% Value at risk with no insurance:
							&nbsp;{ `$${ roundResults(evalResultJson.policies["no-ins-var-25"])}`} </div>
					</div>

					<EvaluatorRiskGraph graphInfo={graphInfo}/>

					<div style={{padding: "15px"}}> <h2>Individual Farm Level Policies</h2></div>

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
																		 style={{width: "120px"}}>Coverage
											Level</TableCellHeader>
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

									<TableRow style={{height: "32px"}}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg} colSpan={1} rowSpan={2}>Prob. of Revenue<br/>(%)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg} colSpan={4}> Value At Risk (VAR) </TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={Object.assign({}, coloredBg, display)} colSpan={4}>VAR Change</TableCellHeader>

										<TableCellHeader className="table-header-tooltip"
																		 style={{}} colSpan={1} rowSpan={2}>Prob. of Revenue<br/>(%)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}} colSpan={4}> Value At Risk (VAR)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={display} colSpan={4}>VAR Change</TableCellHeader>

										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg} colSpan={1} rowSpan={2}>Prob. of Revenue<br/>(%)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg} colSpan={4}> Value At Risk (VAR)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={Object.assign({}, coloredBg,
																				 {borderRightWidth: 0}, display)} colSpan={4}>VAR Change</TableCellHeader>

									</TableRow>
									<TableRow style={{height: "64px"}}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}> 1% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}> 5% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}> 10% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}> 25% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={Object.assign({}, coloredBg, display)}> 1% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={Object.assign({}, coloredBg, display)}> 5% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={Object.assign({}, coloredBg, display)}> 10% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={Object.assign({}, coloredBg, display)}> 25% <br/> ($/acre)</TableCellHeader>

										<TableCellHeader className="table-header-tooltip"
																		 style={{}}> 1% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}}> 5% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}}> 10% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={{}}> 25% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={display}> 1% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={display}> 5% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={display}> 10% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={display}> 25% <br/> ($/acre)</TableCellHeader>

										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>1% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}> 5% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}> 10% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}> 25% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={Object.assign({}, coloredBg, display)}> 1% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={Object.assign({}, coloredBg, display)}> 5% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={Object.assign({}, coloredBg, display)}> 10% <br/> ($/acre)</TableCellHeader>
										<TableCellHeader className="table-header-tooltip" style={Object.assign({}, {
											borderRightWidth: 0,
											backgroundColor: "WhiteSmoke"
										}, display)}>   25% <br/> ($/acre)</TableCellHeader>
									</TableRow>

									{farmPolicyRows}
								</TableBody>
							</Table>
						</div>
					}

					<br/>

					<Divider/>

					<div style={{padding: "20px 15px 15px 15px"}}> <h2>County Level Products</h2></div>

					{countyProductsRows.length === -1 ? <div style={{padding: "15px", color: "red"}}> Not applicable for the selected inputs </div> :

						<Table className={classes.table}>
							<TableBody>
								<TableRow style={{height: "64px"}}>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={1} rowSpan={3}
																		 style={{width: "150px"}}>Coverage
											Level</TableCellHeader>
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

								<TableRow style={{height: "32px"}}>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg} colSpan={1} rowSpan={2}>Prob. of Revenue<br/>(%)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg} colSpan={4}> Value At Risk (VAR)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={Object.assign({}, coloredBg, display)} colSpan={4}>VAR Change</TableCellHeader>

									<TableCellHeader className="table-header-tooltip"
																	 style={{}} colSpan={1} rowSpan={2}>Prob. of Revenue<br/>(%)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}} colSpan={4}> Value At Risk (VAR)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={display} colSpan={4}>VAR Change</TableCellHeader>

									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg} colSpan={1} rowSpan={2}>Prob. of Revenue<br/>(%)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg} colSpan={4}> Value At Risk (VAR)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={Object.assign({}, coloredBg,
																			 {borderRightWidth: 0}, display)} colSpan={4}>VAR Change</TableCellHeader>

								</TableRow>
								<TableRow style={{height: "64px"}}>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}> 1% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}> 5% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}> 10% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}> 25% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={Object.assign({}, coloredBg, display)}> 1% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={Object.assign({}, coloredBg, display)}> 5% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={Object.assign({}, coloredBg, display)}> 10% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={Object.assign({}, coloredBg, display)}> 25% <br/> ($/acre)</TableCellHeader>

									<TableCellHeader className="table-header-tooltip"
																	 style={{}}> 1% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}}> 5% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}}> 10% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={{}}> 25% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={display}> 1% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={display}> 5% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={display}> 10% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={display}> 25% <br/> ($/acre)</TableCellHeader>

									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}> 1% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}> 5% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}> 10% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}> 25% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={Object.assign({}, coloredBg, display)}> 1% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={Object.assign({}, coloredBg, display)}> 5% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={Object.assign({}, coloredBg, display)}> 10% <br/> ($/acre)</TableCellHeader>
									<TableCellHeader className="table-header-tooltip" style={Object.assign({}, {
										borderRightWidth: 0,
										backgroundColor: "WhiteSmoke"
									}, display)}>   25% <br/> ($/acre)</TableCellHeader>
								</TableRow>

								{countyProductsRows}
							</TableBody>
						</Table>
					}
					<br/>

					<Divider/>
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
