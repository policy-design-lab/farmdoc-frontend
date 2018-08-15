import React, {Component} from "react";
import { connect } from "react-redux";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {ID, getOutputFileJson} from "../public/utils";
import {datawolfURL, postExecutionRequest, steps, resultDatasetId} from "../datawolf.config";
import { changeAcres, changeCommodity, changeCoverage, changePaymentYield,
	handleResults, changeRefPrice, changeRange} from "../actions/model";
import {
	handleCardChange,
	handleEndDateChange,
	handleFlexibleDatesChange,
	handleStartDateChange,
	handleWeatherPatternChange
} from "../actions/analysis";
//import connect from "react-redux/es/connect/connect";

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const styles = theme => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
	},

	invisbleField: {
		display: "none"
	},

	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 150,
	},
	menu: {
		width: 150,
	},
	button: {
		margin: theme.spacing.unit,
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	}
});

class FDRunModel extends Component {

	constructor(props){
		super(props);
		this.runModel =this.runModel.bind(this);
		//this.handleRefPriceChange = this.handleRefPriceChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		//this.handleCoverageChange = this.handleCoverageChange.bind(this);
		//this.handleCommodityChange = this.handleCommodityChange.bind(this);
		//this.handlePaymentYieldChange = this.handlePaymentYieldChange.bind(this);
		//this.handleRangeChange = this.handleRangeChange.bind(this);
		//this.handleRefPriceChange = this.handleRefPriceChange.bind(this);
		this.handleResultsChange = this.handleResultsChange.bind(this);


		this.state = {
			program:"both",
			commodity: "Corn",
			refprice: 3.7,
			acres: .85,
			seqprice: 0.0,
			coverage: .85,
			paymentYield: 120,
			range: .1,
			runName:"",
			runStatus: "",
			modelResult: null
		};
	}

	state = {
		program:"both",
		commodity: "Corn",
		refprice: 3.7,
		acres: .85,
		seqprice: 0.0,
		coverage: .85,
		paymentYield: 120,
		range: .1,
		runName:"",
		runStatus: "",
		modelResult: null
	};


	async runModel(){
		//let status = "STARTED";
		let personId = sessionStorage.getItem("personId");
		this.setState({
			runStatus: status
		});

		let curTime = new Date();
		curTime = curTime.toUTCString();
		let title = `Run at ${curTime}`;

		let headers = {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": datawolfURL
		};

		let dwUrl = datawolfURL;

		let countyId, startYear, commodity, refPrice, paymentAcres, arcCoverage, arcRange, plcYield, program, sequesterPrice;
		countyId = 571;
		startYear = 2019;
		commodity = this.state.commodity.toLowerCase();
		refPrice = this.state.refprice;
		paymentAcres = this.state.acres;
		arcCoverage = this.state.coverage;
		arcRange = this.state.range;
		plcYield = this.state.paymentYield;
		program = "ARC";
		sequesterPrice = this.state.seqprice;


		let postRequest = postExecutionRequest(personId, title, countyId, startYear, commodity, refPrice,
			paymentAcres, arcCoverage, arcRange, plcYield, program, sequesterPrice);

		let body =  JSON.stringify(postRequest);

		let modelResponse = await fetch(`${dwUrl}/executions`, {
			method: "POST",
			//mode: "no-cors",
			headers: headers,
			credentials: "include",
			body: body
		});

		const modelExecutionGUID = await modelResponse.text();
		console.log(`With execution id = ${modelExecutionGUID}`);

		let modelResult;

		while(this.state.runStatus === "" || this.state.runStatus === "WAITING" || this.state.runStatus === "RUNNING") {
			await wait(300); // is this necessary?
			const executionResponse = await fetch(`${dwUrl}/executions/${modelExecutionGUID}`, {
				method: "GET",
				headers: headers,
				credentials: "include"
			});

			if (executionResponse instanceof Response) {
				modelResult = await executionResponse.json();
				this.setState({runStatus: modelResult.stepState[steps.Farm_Model]});
			}
		}

		const resultDatasetGuid = modelResult.datasets[resultDatasetId];
		const outputFilename = "output.json";
		if ((resultDatasetGuid !== "ERROR" && resultDatasetGuid !== undefined)){


			getOutputFileJson(resultDatasetGuid, outputFilename).then(
				res => {
					this.handleResultsChange(JSON.stringify(res));
				});

			window.location = "/#/charts";

		}

	}


	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});

		switch(name){
		case "commodity":
			this.props.handleCommodityChange(event.target.value);
			break;

		case "refprice":
			this.props.handleRefPriceChange(event.target.value);
			break;

		case "paymentYield":
			this.props.handlePaymentYieldChange(event.target.value);
			break;

		case "coverage":
			this.props.handleCoverageChange(event.target.value);
			break;

		case "range":
			this.props.handleRangeChange(event.target.value);
			break;

		case "acres":
			this.props.handleAcresChange(event.target.value);
			break;
		}
	};

	handleResultsChange(results){
		this.props.handleResultsChange(results);
	}


	handleChanger = event => {
		this.setState({ program: event.target.value });
	};

	render(){
		const { classes } = this.props;

		return(
			<div style={{margin:"50px"}}>
				<FormLabel component="legend">Program</FormLabel>
				<RadioGroup style={{ display: "flex",  flexDirection:"row" }}
							name="program"
							//className={classes.group}
							value={this.state.program}
							onChange={this.handleChange("program")}>

					<FormControlLabel value="arc" control={<Radio />} label="ARC" />
					<FormControlLabel value="plc" control={<Radio />} label="PLC" />
					<FormControlLabel value="both" control={<Radio />} label="Both" />

				</RadioGroup>

				<TextField
					required
					id="runName"
					label="Simulation Name"
					value={this.state.runName}
					margin="normal"
					onChange={this.handleChange("runName")}
					style={{width:"350px"}}
					className={classes.invisbleField}
					helperText="Identifier for the Simulation Results "
					visi
				/>
				{/*<br/>*/}
				<TextField
					id="Commodity"
					label="Commodity"
					value={this.state.commodity}
					margin="normal"
					disabled="true"
				/>

				<TextField
					id="refPrice"
					label="Reference Price"
					defaultValue={this.state.refprice}
					//value={this.state.refprice}
					//className={classes.textField}
					disabled="true"
					margin="normal"
					onChange={this.handleChange("refprice")}
					//onChange = {this.handleRefPriceChange}
					InputProps={{
						startAdornment: <InputAdornment position="start">$</InputAdornment>,
					}}

				/> <br/>

				<TextField
					id="paymentYield"
					label="PLC Payment Yield"

					value={this.state.paymentYield}
					margin="normal"
					style={{width:"200px"}}
					onChange={this.handleChange("paymentYield")}

					InputProps={{
						endAdornment: <InputAdornment position="end">bushels/acre</InputAdornment>
					}}
					// endAdornment={<InputAdornment position="end">bushels/acre</InputAdornment>}
				/><br/>

				<TextField
					id="acres"
					label="Payment Acres"
					value={this.state.acres}
					margin="normal"
					style={{width:"160px"}}
					onChange={this.handleChange("acres")}
					disabled="true"
					InputProps={{
						endAdornment: <InputAdornment position="end">%</InputAdornment>,
					}}

				/><br/>

				<TextField
					id="coverage"
					label="ARC Coverage Level"
					value={this.state.coverage}
					margin="normal"
					style={{width:"160px"}}
					onChange={this.handleChange("coverage")}
					InputProps={{
						endAdornment: <InputAdornment position="end">%</InputAdornment>,
					}}
					// helperText="ARC-CO Coverage"
				/><br/>

				<TextField
					id="range"
					label="ARC Coverage Range"
					value={this.state.range}
					margin="normal"
					style={{width:"160px"}}

					onChange={this.handleChange("range")}
					InputProps={{
						endAdornment: <InputAdornment position="end">%</InputAdornment>,
					}}
				/>
				<br/><br/>
				<Button variant="contained" color="primary" onClick={this.runModel}>

					<Icon className={classes.leftIcon}> send </Icon>
					Run Model
				</Button>
			</div>
		);
	}

}

const mapStateToProps = state => ({
	commodity: state.commodity,
	refPrice: state.refPrice,
	paymentYield: state.paymentYield,
	coverage: state.coverage,
	range: state.range,
	acres: state.acres,
	countyResults: state.modelResult
});

const mapDispatchToProps = dispatch => ({
	handleCommodityChange: commodity => dispatch(changeCommodity(commodity)),
	handleRefPriceChange: refprice => dispatch(changeRefPrice(refprice)),
	handlePaymentYieldChange: paymentYield => dispatch(changePaymentYield(paymentYield)),
	handleCoverageChange: coverage => dispatch(changeCoverage(coverage)),
	handleRangeChange: range => dispatch(changeRange(range)),
	handleAcresChange: acres => dispatch(changeAcres(acres)),
	handleResultsChange: results => dispatch(handleResults(results))
});



export default connect(mapStateToProps, mapDispatchToProps) (withStyles(styles)(FDRunModel));
