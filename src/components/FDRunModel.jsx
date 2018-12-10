import React, {Component} from "react";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import {Select, FormControl, InputLabel, MenuItem} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {ID, getOutputFileJson} from "../public/utils";
import {datawolfURL, postExecutionRequest, steps, resultDatasetId} from "../datawolf.config";
import {
	changeAcres, changeCommodity, changeCoverage, changePaymentYield,
	handleResults, changeRefPrice, changeRange, changeCounty
} from "../actions/model";
import Spinner from "../components/Spinner";
import config from "../app.config";



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
	},

	formControl: {
		margin: theme.spacing.unit,
		minWidth: 200,
		marginLeft: 0
	},
	geoSelectors: {
		PaperProps: {
			style: {
				maxHeight: 400,
				minWidth: 400
			}
		}
	}

});


class FDRunModel extends Component {

	constructor(props){
		super(props);
		this.runModel =this.runModel.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleResultsChange = this.handleResultsChange.bind(this);


		this.state = {
			states: [],
			stateSel: "",
			counties: [],
			county:"",
			program:"both",
			commodity: "",
			units: "bushel/acre",
			refPrice: 3.7,
			acres: .85,
			seqprice: 0.0,
			coverage: .86,
			paymentYield: "",
			range: .1,
			runName:"",
			runStatus: "",
			modelResult: null
		};
	}

	state = {
		states: [],
		stateSel: "",
		counties: [],
		county: "",
		program:"both",
		commodity: "",
		units: "bushel/acre",
		refPrice: 3.7,
		acres: .85,
		seqprice: 0.0,
		coverage: .86,
		paymentYield: "",
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
		countyId = this.state.county; //571;
		startYear = 2019;
		commodity = this.state.commodity.toLowerCase();
		refPrice = this.state.refPrice;
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

		let modelResult = null;

		this.handleResultsChange(null);

		const waitingStatuses = ["QUEUED", "WAITING", "RUNNING"];

		while(this.state.runStatus === "" || waitingStatuses.indexOf(this.state.runStatus) >= 0 ) {
			await wait(300);
			const executionResponse = await fetch(`${dwUrl}/executions/${modelExecutionGUID}`, {
				method: "GET",
				headers: headers,
				credentials: "include"
			});

			if (executionResponse instanceof Response) {
				try {
					modelResult = await executionResponse.json();
					this.setState({runStatus: modelResult.stepState[steps.Farm_Model]});
				}
				catch(error){
					this.setState({runStatus: "PARSE_ERROR"});
				}
			}
		}

		const resultDatasetGuid = modelResult.datasets[resultDatasetId];
		const outputFilename = "output.json";
		if ((resultDatasetGuid !== "ERROR" && resultDatasetGuid !== undefined)) {


			getOutputFileJson(resultDatasetGuid, outputFilename).then(
				res => {
					this.handleResultsChange(JSON.stringify(res));
				});
			// TODO: Dynamically change it when switching between 1 page and 2 page model
			//window.location = "/#charts";

		}
		else{
			this.setState({runStatus: "PARSE_ERROR"});
		}
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});

		switch(name){
		case "county":
			this.props.handleCountyChange(event.target.value);
			break;
		case "commodity":
			this.props.handleCommodityChange(event.target.value);
			if(event.target.value !== "") {
				this.populateRefPriceAndUnits(event.target.value);
			}
			break;

		case "refPrice":
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

		case "stateSel":
			if(event.target.value !== "") {
				this.populateCounties(event.target.value);
			}
			break;
		}


	};

	handleResultsChange(results){
		this.props.handleResultsChange(results);
	}


	handleChanger = event => {
		this.setState({ program: event.target.value });
	};


	componentDidMount(){
		let statesJson = [];
		
		fetch(`${config.apiUrl}/states`)
			.then(response => {
				return response.json();
			}).then(data => {
				statesJson = data.map((st) => {
					return st;
				});
				this.setState({
					states: statesJson,
				});
			});
	}

	populateCounties(stateId){
		let countiesJson = [];

		fetch(`${config.apiUrl}/counties/${stateId}`)
			.then(response => {
				return response.json();
			}).then(data => {
				countiesJson = data.map((st) => {
					return st;
				});
				this.setState({
					counties: countiesJson,
				});
			});
	}

	populateRefPriceAndUnits(commodity){
		config.commodities.forEach((item) => {
			if(item.id === commodity){
				this.setState({
					refPrice: item.refPrice,
				});
				this.setState({
					units: item.units,
				});
			}
		});
	}

	validateInputs(){
		if(this.state.county > 0 && this.state.commodity !== "" && this.state.paymentYield !== ""){
			return true;
		}
		else {
			return false;
		}
	}

	render(){
		const { classes } = this.props;
		const MenuProps = {
			PaperProps: {
				style: {
					maxHeight: 500
				},
			},
		};

		let spinner;

		if(this.state.runStatus !== "" && this.state.runStatus !== "FINISHED" && this.state.runStatus !== "PARSE_ERROR"){
			spinner = <Spinner/>;
		}

		let emptyMenuItem;// = <MenuItem value="" key="ad"> <em>--Select--</em> </MenuItem>;

		let statesMenuItems = [emptyMenuItem];

		this.state.states.forEach((item) => {
			statesMenuItems.push(<MenuItem key={`state-${item.id}`}  value={item.id}>{item.name}</MenuItem>);
		});

		let countiesMenuItems = [emptyMenuItem];

		this.state.counties.forEach((item) => {
			countiesMenuItems.push(<MenuItem key={`county-${item.id}`} value={item.id}>{item.name}</MenuItem>);
		});

		let commodityMenuItems = [emptyMenuItem];
		config.commodities.forEach((item) => {
			commodityMenuItems.push(<MenuItem key={`commodity-${item.id}`} value={item.id}>{item.name}</MenuItem>);
		});

		let errorMsg;
		// This error will never be shown when we get the applicable crops for a county from API
		if(this.state.runStatus === "PARSE_ERROR"){
			errorMsg = (<div>
				<FormLabel component="legend" error={true}>Error: Data not available for the selected crop in the county. Choose a different crop or county</FormLabel>
			</div>);
		}

		return(
			<div style={{marginLeft:"50px", marginRight:"30px", marginTop:"15px", marginBottom:"15px", maxWidth: "400px",
				// outlineStyle: "solid", outlineWidth: "1px",
				borderRadius: "15px", borderStyle: "solid", boxShadow: " 0 2px 4px 0px", borderWidth: "1px",
				paddingTop: "2px", paddingRight: "8px", paddingLeft: "18px", paddingBottom: "12px"}}>

				{errorMsg}

				<FormControl className={classes.formControl} required>
					<InputLabel htmlFor="state-simple">State</InputLabel>
					<Select
						value={this.state.stateSel}
						onChange={this.handleChange("stateSel")}
						inputProps={{
							name: "state",
							id: "state-simple",
						}}
						displayEmpty

						MenuProps={MenuProps}
					>
						{statesMenuItems}
					</Select>
				</FormControl>
				<br/>

				<FormControl className={classes.formControl} required>
					<InputLabel htmlFor="county-simple">County</InputLabel>
					<Select
						value={this.state.county}
						onChange={this.handleChange("county")}
						inputProps={{
							name: "county",
							id: "county-simple",
						}}
						MenuProps={MenuProps}
					>
						{countiesMenuItems}

					</Select>
				</FormControl>


				<br/>


				<FormControl className={classes.formControl} required>
					<InputLabel htmlFor="crop-simple">Crop</InputLabel>
					<Select
						value={this.state.commodity}
						onChange={this.handleChange("commodity")}
						inputProps={{
							name: "crop",
							id: "crop-simple",
						}}
						MenuProps={MenuProps}
					>
						{commodityMenuItems}
					</Select>
				</FormControl>


				<TextField
					id="refPrice"
					label="Reference Price"
					value={this.state.refPrice}
					disabled={true}
					margin="normal"
					onChange={this.handleChange("refPrice")}
					style={{width:"125px"}}
					InputProps={{
						startAdornment: <InputAdornment position="start">$</InputAdornment>,
					}}

				/> <br/>

				<FormControl className={classes.formControl} required>
					<TextField
					id="paymentYield"
					label="PLC Payment Yield"
					//error ={this.state.paymentYield === "" || this.state.paymentYield.length === 0 ? true : false}
					value={this.state.paymentYield}
					margin="normal"
					style={{width:"230px"}}
					onChange={this.handleChange("paymentYield")}
					required

					InputLabelProps={{shrink:true}}

					InputProps={{
						endAdornment: <InputAdornment position="end">{this.state.units}</InputAdornment>
					}}
					onInput={(e) => {
						if(e.target.value !== "") {
							if(isNaN(e.target.value)){
								e.target.value = e.target.value.toString().slice(0,-1);
							}
							else {
								//e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3);

								if (e.target.value <= 0) {
									e.target.value = 1;
								}
								else if (e.target.value > 300) {
									e.target.value = 300;
								}
							}
						}
					}}

				/>
				</FormControl><br/>

				<TextField
					id="acres"
					label="Payment Acres"
					value={this.state.acres}
					margin="normal"
					style={{width:"160px"}}
					onChange={this.handleChange("acres")}
					disabled={true}
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
					disabled={true}
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
					disabled={true}
					onChange={this.handleChange("range")}
					InputProps={{
						endAdornment: <InputAdornment position="end">%</InputAdornment>,
					}}
				/>
				<br/><br/>
				<div style={{textAlign: "center"}}>
				<Button variant="contained" color="primary" onClick={this.runModel} disabled={!this.validateInputs()}
						style={{fontSize: "large", backgroundColor: "#455A64"}}>
					<Icon className={classes.leftIcon}> send </Icon>
					Run Model
				</Button>
				</div>
				{spinner}
			</div>
		);
	}

}

const mapStateToProps = state => ({
	county: state.county,
	commodity: state.commodity,
	refPrice: state.refPrice,
	paymentYield: state.paymentYield,
	coverage: state.coverage,
	range: state.range,
	acres: state.acres,
	countyResults: state.modelResult
});

const mapDispatchToProps = dispatch => ({
	handleCountyChange: county => dispatch(changeCounty(county)),
	handleCommodityChange: commodity => dispatch(changeCommodity(commodity)),
	handleRefPriceChange: refPrice => dispatch(changeRefPrice(refPrice)),
	handlePaymentYieldChange: paymentYield => dispatch(changePaymentYield(paymentYield)),
	handleCoverageChange: coverage => dispatch(changeCoverage(coverage)),
	handleRangeChange: range => dispatch(changeRange(range)),
	handleAcresChange: acres => dispatch(changeAcres(acres)),
	handleResultsChange: results => dispatch(handleResults(results))
});



export default connect(mapStateToProps, mapDispatchToProps) (withStyles(styles)(FDRunModel));
