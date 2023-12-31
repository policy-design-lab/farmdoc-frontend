import React, {Component} from "react";
import {connect} from "react-redux";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import {FormControl, Modal} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {
	getOutputFileJson,
	getStates,
	getCounties,
	getCropParams,
	getCrops,
	covertToLegacyCropFormat,
	getForecastPrices, getCropDbKeyFromName,
} from "../public/utils";
import {
	datawolfURL,
	postExecutionRequest,
	resultDatasetId,
	steps,
} from "../datawolf.config";
import {
	changeCommodity,
	changeForecastType,
	changeCounty,
	changePaymentYield,
	changeArcYield,
	changeRefPrice,
	handleResults,
} from "../actions/model";
import Spinner from "./Spinner";
import config from "../app.config";
import {
	dataNotAvailable,
	practiceTypeToolTip,
	arcTrendYieldToolTip,
	plcPayYieldInputToolTip,
	stateCountySelectToolTip
} from "../app.messages";
import ReactSelect from "react-select";
import IconButton from "@material-ui/core/IconButton";
import HelpOutline from "@material-ui/icons/HelpOutline";
import CloseIcon from "@material-ui/icons/Close";
import Info from "@material-ui/icons/Info";
import ForecastModels from "./ForecastModels";
import ToolTip from "@material-ui/core/Tooltip";
import ProgramParams from "./ProgramParams";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {roundResults} from "../public/utils.js";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const styles = theme => ({
	input: {
		display: "flex",
		padding: 0,
		height: 36
	},
	container: {
		display: "flex",
		flexWrap: "wrap",
	},

	textField: {
		marginTop: "8px",
		marginRight: "8px",
		width: 200,
	},
	menu: {
		width: 150,
	},
	button: {
		margin: theme.spacing(1),
	},
	leftIcon: {
		marginRight: theme.spacing(1),
	},
	rightIcon: {
		marginLeft: theme.spacing(1),
	},

	formControl: {
		margin: theme.spacing(1),
		minWidth: 200,
		marginLeft: 0,
	},
	helpIcon: {
		fontSize: 24
	},
	popupButton: {
		width: 48
	},
	paper: {
		position: "absolute",
		//width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(4),
		outline: "none"
	}

});

const ReactSelectStyles = {
	option: (provided) => ({
		...provided,
		fontSize: 16
	}),
	control: (provided) => ({
		...provided,
		width: 200,
		height: 50,
		fontSize: 16
	})
	// singleValue: (provided, state) => {
	// 	const opacity = state.isDisabled ? 0.5 : 1;
	// 	const transition = "opacity 300ms";
	//
	// 	return { ...provided, opacity, transition };
	// }
};

function inputComponent({inputRef, ...props}) {
	return <div ref={inputRef} {...props} />;
}

function Control(props) {
	return (
		<TextField
					fullWidth
					InputProps={{
						inputComponent,
						inputProps: {
							className: props.selectProps.classes.input,
							inputRef: props.innerRef,
							children: props.children,
							...props.innerProps
						}
					}}
					{...props.selectProps.textFieldProps}
		/>
	);
}

function getModalStyle() {
	const top = 50; //+ rand();
	const left = 50;// + rand();

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
		display: "inline-block",
		borderRadius: 12
	};
}

const components = {
	Control
};

class FDRunModel extends Component {

	state = {
		states: [],
		stateSel: "",
		counties: [],
		county: "",
		program: "both",
		crops: [],
		forecastPrices: [],
		commodity: config.defaultsJson.commodity,
		units: config.defaultsJson.units,
		forecastType: 1,
		forecastName: "",
		refPrice: "",
		pracCode: "",
		acres: config.defaultsJson.acres,
		seqprice: 0,
		coverage: config.defaultsJson.coverage,
		paymentYield: "",
		arcYield: "",
		countyYield: "",
		range: config.defaultsJson.range,
		runName: "",
		runStatus: "",
		modelResult: null,
		countySelValue: null,
		forecastPopupOpen: false,
		customPopupOpen: false,
		customforecastPrice: "",
		customSubmitEnabled: false,
		fetchYields: false,
		showError: false,
		errorMsg: dataNotAvailable,
		disablePraccode: true,
		hidePraccode: true,
		cropYields: []
	};

	constructor(props) {
		super(props);
		this.runModel = this.runModel.bind(this);
		this.handleReactSelectChange = this.handleReactSelectChange.bind(this);
		this.handleMuiChange = this.handleMuiChange.bind(this);
		this.handleResultsChange = this.handleResultsChange.bind(this);


		this.state = {
			states: [],
			stateSel: "",
			counties: [],
			county: "",
			program: "both",
			crops: [],
			forecastPrices: [],
			commodity: config.defaultsJson.commodity,
			units: config.defaultsJson.units,
			forecastType: 1,
			forecastName: "",
			refPrice: "",
			pracCode: "",
			acres: config.defaultsJson.acres,
			seqprice: config.defaultsJson.seqprice,
			coverage: config.defaultsJson.coverage,
			paymentYield: "",
			arcYield: "",
			countyYield: "",
			range: config.defaultsJson.range,
			runName: "",
			runStatus: "",
			modelResult: null,
			countySelValue: null,
			forecastPopupOpen: false,
			customPopupOpen: false,
			customforecastPrice: "",
			customSubmitEnabled: false,
			fetchYields: false,
			showError: false,
			errorMsg: dataNotAvailable,
			disablePraccode: true,
			hidePraccode: true,
			cropYields: []
		};
	}

	handlePracCodeChange = event => {
		let selPrac = event.target.value;
		this.setState({pracCode: selPrac});

		let intSelPrac = parseInt(selPrac);

		this.state.cropYields.forEach((item) => {
			if (item.practice_id === intSelPrac) {
				this.setState({arcYield: item.yield_trend});
				this.setState({countyYield: item.yield_avg});
			}
		});
	};

	handleForecastOpen = () => {
		this.setState({forecastPopupOpen: true});
	};

	handleForecastClose = () => {
		this.setState({forecastPopupOpen: false});
	};

	handleCustomSubmit = () => {
		if (this.state.customforecastPrice.trim() !== "") {
			this.setState({customPopupOpen: false});
		}
	};

	handleCustomClose = () => {
		this.setState({customPopupOpen: false});
	};

	handleCustomCancel = () => {
		this.setState({customforecastPrice: ""});
		this.setState({forecastType: config.defaultsJson.forecastType});
		this.setState({forecastName: config.defaultsJson.forecastName});
		this.setState({customPopupOpen: false});
	};

	handleReactSelectChange = name => event => {
		this.setState({
			[name]: event.value}, function(){
			if (this.state.commodity !== "" && this.state.county !== ""){
				this.setState({fetchYields: true});
				this.populateYields(this.state.county, this.state.commodity);
			}
		});


		switch (name) {
			case "county":
				this.setState({countySelValue: {value: event.value, label: event.label}});
				this.props.handleCountyChange(event.value);
				break;

			case "stateSel":
				if (event.value !== "") {
					this.setState({countySelValue: null});
					this.setState({county: ""});
					this.populateCounties(event.value);
				}
				break;
			case "commodity":
				this.props.handleCommodityChange(event.value);
				if (event.value !== "") {
					this.populateRefPriceAndUnits(event.value);
				}
				break;
			case "forecastType":
				this.props.handleForecastTypeChange(event.value);
				this.setState({"forecastName": event.label});
				if (event.value === "custom"){
					this.setState({customPopupOpen: true});
				}
				break;
		}
	};

	handleMuiChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});

		switch (name) {
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

			case "arcYield":
				this.props.handleArcYieldChange(event.target.value);
				break;

			case "customforecastPrice":
				if (event.target.value.trim() !== "") {
					this.setState({customSubmitEnabled: true});
				}
				else {
					this.setState({customSubmitEnabled: false});
				}

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


	async runModel() {
		//let status = "STARTED";
		let personId = localStorage.getItem("dwPersonId");
		this.setState({
			runStatus: status
		});

		let curTime = new Date();
		curTime = curTime.toUTCString();
		let title = `Run at ${curTime}`;

		let token = localStorage.getItem("kcToken");
		let token_header = `Bearer ${token}`;

		let kcHeaders = {
			"Content-Type": "application/json",
			"Authorization": token_header
		};

		let dwUrl = datawolfURL;

		let countyId, startYear, commodity, refPrice, paymentAcres, arcCoverage, arcRange, plcYield,
			arcYield, program, sequesterPrice, pracCode;
		countyId = this.state.county;
		startYear = config.defaultsJson.startYear;
		commodity = this.state.commodity.toLowerCase();
		refPrice = this.state.refPrice;
		paymentAcres = this.state.acres;
		arcCoverage = this.state.coverage;
		arcRange = this.state.range;
		arcYield = this.state.arcYield;
		plcYield = this.state.paymentYield;
		program = "ARC";
		sequesterPrice = this.state.seqprice;
		pracCode = this.state.pracCode;


		let forecastPrices = null;
		if (this.state.forecastType !== "custom") {
			forecastPrices = this.getMarketPricesForForecastModel(this.state.forecastType, getCropDbKeyFromName(this.state.commodity));
		}
		else {
			forecastPrices = this.state.customforecastPrice;
		}

		let binSize = this.getBinSizeForCrop(this.state.crops, this.state.commodity);

		//TODO: Add arcYield
		let postRequest = postExecutionRequest(personId, title, countyId, startYear, commodity, refPrice,
			paymentAcres, arcCoverage, arcRange, plcYield, program, sequesterPrice, forecastPrices, binSize, pracCode);

		let body = JSON.stringify(postRequest);

		let modelResponse = await fetch(`${dwUrl}/executions`, {
			method: "POST",
			headers: kcHeaders,
			body: body
		});

		const modelExecutionGUID = await modelResponse.text();
		console.log(`With execution id = ${modelExecutionGUID}`);

		let modelResult = null;

		this.handleResultsChange(null);

		const waitingStatuses = ["QUEUED", "WAITING", "RUNNING"];

		while (this.state.runStatus === "" || waitingStatuses.indexOf(this.state.runStatus) >= 0) {
			await wait(300);
			const executionResponse = await fetch(`${dwUrl}/executions/${modelExecutionGUID}`, {
				method: "GET",
				headers: kcHeaders,
			});

			if (executionResponse instanceof Response) {
				try {
					modelResult = await executionResponse.json();
					this.setState({runStatus: modelResult.stepState[steps.Farm_Model]});
				}
				catch (error) {
					this.setState({runStatus: "PARSE_ERROR"});
					this.setState({showError: true});
					this.setState({errorMsg: dataNotAvailable});
				}
			}
		}

		const resultDatasetGuid = modelResult.datasets[resultDatasetId];
		const outputFilename = "output.json";
		if ((resultDatasetGuid !== "ERROR" && resultDatasetGuid !== undefined)) {


			getOutputFileJson(resultDatasetGuid, outputFilename).then(
				res => {
					this.handleResultsChange(JSON.stringify(res));
					if (config.browserLog) {
						console.log(JSON.stringify(res));
					}
					this.setState({showError: false});
				});
			// TODO: Dynamically change it when switching between 1 page and 2 page model
			//window.location = "/#charts";

		}
		else {
			this.setState({runStatus: "PARSE_ERROR"});
			this.setState({showError: true});
			this.setState({errorMsg: dataNotAvailable});
		}
	}

	handleResultsChange(results) {
		this.props.handleResultsChange(results);
	}

	componentDidMount() {
		let statesJson = [];
		getStates().then(function(response){
			if (response.status === 200){
				return response.json();
			}
			else {
				console.log("Flask Service API call failed. Most likely the token expired");
				// TODO: how to handle? Force logout?
			}
		}).then(data => {
			statesJson = data.map((st) => {
				return st;
			});
			this.setState({
				states: statesJson,
			});
		});

		let cropsJson = [];
		getCrops("arcplc").then(function(response){
			if (response.status === 200){
				return response.json();
			}
			else {
				console.log("Flask Service API call failed. Most likely the token expired");
				// TODO: how to handle? Force logout?
			}
		}).then(data => {
			cropsJson = data.map((st) => {
				return covertToLegacyCropFormat(st);
			});
			this.setState({
				crops: cropsJson
			});
		});

		let forecastsJson = [];
		getForecastPrices().then(function(response){
			if (response.status === 200){
				return response.json();
			}
			else {
				console.log("Flask Service API call failed. Most likely the token expired");
				// TODO: how to handle? Force logout?
			}
		}).then(data => {
			forecastsJson = data.map((st) => {
				return st;
			});
			this.setState({
				forecastPrices: forecastsJson
			});

			if (forecastsJson.length > 0) {
				this.setState({
					forecastType: forecastsJson[0].id,
					forecastName: forecastsJson[0].name,
				});
			}
		});
	}

	populateCounties(stateId) {
		let countiesJson = [];

		getCounties(stateId).then(function(response){
			if (response.status === 200){
				return response.json();
			}
			else {
				console.log("Flask Service API call failed. Most likely the token expired");
				// TODO: how to handle? Force logout?
			}
		}).then(data => {
			countiesJson = data.map((st) => {
				return st;
			});
			this.setState({
				counties: countiesJson,
			});
		});
	}

	getBinSizeForCrop(cropId){
		let cropsList = this.state.crops;
		let binSize = 10;
		for (let i = 0 ; i < cropsList.length ; i++) {
			if (cropsList[i]["id"] === cropId) {
				return binSize = cropsList[i]["binSize"];
			}
		}
		return binSize;
	}

	getMarketPricesForForecastModel(modelId, commodity){
		let modelsList = this.state.forecastPrices;
		let retstr = "";
		for (let i = 0 ; i < modelsList.length ; i++) {
			if (modelsList[i]["id"] === modelId) {
				return retstr = modelsList[i]["prices"][commodity].join();
			}
		}

		return retstr;
	}

	populateYields(countyFips, commodity){
		let cropParams = "";
		let commodityDbId = 0;

		let cropsList = this.state.crops;
		let binSize = 10;
		for (let i = 0 ; i < cropsList.length ; i++) {
			if (cropsList[i]["id"] === commodity) {
				commodityDbId = cropsList[i]["cropDbKey"];
			}
		}


		getCropParams(countyFips, commodityDbId).then(function(response){
			if (response.status === 200){
				return response.json();
			}
			else {
				console.log("Flask Service API call failed. Most likely the token expired");
				// TODO: how to handle? Force logout?
			}
		}).then(data => {
			cropParams = data.map((row) => {
				return row;
			});

			if (cropParams.length > 0) {
				this.setState({cropYields: cropParams});
				if (cropParams.length === 1 && cropParams[0]["practice_id"] != null) {
					if (cropParams[0]["practice_id"] === 3) {
						this.setState({arcYield: roundResults(cropParams[0]["yield_trend"], 2)});
						this.setState({countyYield: roundResults(cropParams[0]["yield_avg"], 2)});
						this.setState({disablePraccode: true});
						this.setState({hidePraccode: true});
					}
					else {
						this.setState({arcYield: roundResults(cropParams[0]["yield_trend"], 2)});
						this.setState({countyYield: roundResults(cropParams[0]["yield_avg"], 2)});
						this.setState({hidePraccode: false});
						this.setState({disablePraccode: true});
					}

					this.setState({pracCode: cropParams[0]["practice_id"].toString()});
				}
				else { //more than one pracCode Present
					let selPrac = cropParams[0]; //default to first and change to non-irrigated if present
					cropParams.forEach((item) => {
						if (item.practice_id === 2) {
							selPrac = item;
						}
					});

					this.setState({arcYield: roundResults(selPrac["yield_trend"], 2)});
					this.setState({countyYield: roundResults(selPrac["yield_avg"], 2)});
					this.setState({pracCode: selPrac["practice_id"].toString()});
					this.setState({hidePraccode: false});
					this.setState({disablePraccode: false});
				}
				this.setState({showError: false});
			}
			else { // No crop data is available
				this.setState({cropYields: []});
				this.setState({arcYield: ""});
				this.setState({countyYield: ""});
				this.setState({pracCode: ""});
				this.setState({hidePraccode: true});
				this.setState({disablePraccode: true});
				this.setState({showError: true});
				this.setState({errorMsg: dataNotAvailable});

			}

		});
	}

	populateRefPriceAndUnits(commodity) {
		this.state.crops.forEach((item) => {
			if (item.id === commodity) {
				this.setState({
					refPrice: item.refPrice,
				});
				this.setState({

					units: item.units,
				});
			}
		});
	}

	validateInputs() {
		return this.state.county > 0 && this.state.commodity !== "" &&
				this.state.paymentYield !== "" && this.state.forecastType !== "" &&
				this.state.arcYield !== "" && this.state.pracCode !== "";
	}

	render() {
		const {classes} = this.props;

		let textFieldInputStyle = {style: {paddingLeft: 8}};
		let tooltipTouchDelay = config.tooltipTouchDelay;
		let spinner;
		let countyYieldTip = "Please select the county and crop to see the average yield of the county here.";

		if (this.state.countyYield) {
			countyYieldTip = "";
			if (this.state.countyYield > 0) {
				countyYieldTip = `The average yield of the county is ${this.state.countyYield} ${this.state.units}`;
			}
		}

		if (this.state.runStatus !== "" && this.state.runStatus !== "FINISHED" && this.state.runStatus !== "PARSE_ERROR") {
			spinner = <Spinner/>;
		}

		let stateOptions = [];

		this.state.states.forEach((item) => {
			stateOptions.push({value: item.id, label: item.name});
		});

		let countyOptions = [];

		this.state.counties.forEach((item) => {
			countyOptions.push({value: item.id, label: item.name});
		});

		let cropOptions = [];
		this.state.crops.forEach((item) => {
			cropOptions.push({value: item.id, label: item.name});
		});

		let forecastTypeOptions = [];
		this.state.forecastPrices.forEach((item) => {
			forecastTypeOptions.push({value: item.id, label: item.name});
		});
		if (config.showCustomForecast) {
			forecastTypeOptions.push({value: "custom", label: "Custom"});
		}


		let forecastToolTip = "Click to see the applicable forecast prices for the selected crop";
		if (this.state.commodity == null || this.state.commodity === "") {
			forecastToolTip = "Please select a crop first and click here to see forecast prices";
		}
		else {
			forecastToolTip = `Click here to see the forecast prices for ${ this.state.commodity}`;
		}


		return (
			<div style={{
				 maxWidth: "370px",
				borderRadius: "15px", borderStyle: "solid", boxShadow: " 0 2px 4px 0px", borderWidth: "1px",
				marginLeft: "50px", marginRight: "5px", marginTop: "15px", marginBottom: "15px", paddingBottom: "12px"
			}}>
				<div style={{
					paddingTop: "2px", paddingRight: "8px", paddingLeft: "18px", paddingBottom: "8px"
				}}>

					<Modal open={this.state.forecastPopupOpen} onClose={this.handleForecastClose}>
						<div style={getModalStyle()} className={classes.paper}>
							<IconButton className="closeImg" onClick={this.handleForecastClose}>
								<CloseIcon />
							</IconButton>
							<ForecastModels forecastPrices={this.state.forecastPrices}/>
						</div>
					</Modal>

					<Dialog
							open={this.state.customPopupOpen}
							onClose={this.handleCustomClose}
							aria-labelledby="form-dialog-title"
							disableBackdropClick={true}
							disableEscapeKeyDown={true}

					>
						<DialogTitle id="form-dialog-title">
							<span style={{fontWeight: "bolder"}}>Custom Forecast Prices </span>
						</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Enter your own forecast prices for the next 5 years. <br/> Sample format: 3.78, 3.8, 4.12, 4.23, 4.4
							</DialogContentText>
							<TextField
									autoFocus
									margin="dense"
									id="customforecastPrice"
									label="Forecast Price"
									type="text"
									value={this.state.customforecastPrice}
									onChange={this.handleMuiChange("customforecastPrice")}
									required={true}
									fullWidth
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleCustomCancel} color="primary">
								Clear
							</Button>
							<Button onClick={this.handleCustomSubmit} disabled={!this.state.customSubmitEnabled} color="primary">
								Submit
							</Button>
						</DialogActions>
					</Dialog>

					<div style={{display: this.state.showError ? "block" : "none", paddingTop: 4, textAlign: "center"}}>
						<FormLabel component="legend" error={true}> {this.state.errorMsg}</FormLabel>
					</div>
					<FormControl className={classes.formControl} required style={{marginTop: "16px"}}>
						<ReactSelect styles={ReactSelectStyles}
									 classes={classes}
									 textFieldProps={{
										 label: "State",
										 InputLabelProps: {
											 shrink: true
										 }
									 }}
									 components={components}
									 options={stateOptions}
									 placeholder = "Select"
									 onChange={this.handleReactSelectChange("stateSel")}
									 inputProps={{
										 name: "state",
										 id: "state-simple",
									 }}	/>

					</FormControl>

					<ToolTip title={stateCountySelectToolTip} enterTouchDelay={tooltipTouchDelay}>
						<span className="iconSpan">
							<IconButton >
								<Info color="inherit" className={classes.helpIcon}/>
							</IconButton>
						</span>
					</ToolTip>


					<br/>

					<FormControl className={classes.formControl} required>
						<ReactSelect styles={ReactSelectStyles}
											 classes={classes}
											 textFieldProps={{
												 label: "County",
												 InputLabelProps: {
													 shrink: true,
												 },
											 }}
											 components={components}
											 value={this.state.countySelValue}
											 placeholder="Select"
											 options={countyOptions}
											 onChange={this.handleReactSelectChange("county")}
											 inputProps={{
												 name: "county",
												 id: "county-simple",
											 }}/>

					</FormControl>
					<br/>

					<FormControl className={classes.formControl} required>
						<ReactSelect styles={ReactSelectStyles}
									 classes={classes}
									 textFieldProps={{
										 label: "Crop",
										 InputLabelProps: {
											 shrink: true,
										 },
									 }}
									 components={components}
									 placeholder="Select"
									 options={cropOptions}
									 onChange={this.handleReactSelectChange("commodity")}
									 inputProps={{
										 name: "crop",
										 id: "crop-simple",
									 }}/>
					</FormControl>

					<ToolTip title="The reference price is the statutory reference price fixed by Congress in the bill">

						<TextField
						id="refPrice"
						label="Reference Price"
						value={this.state.refPrice}
						disabled={true}
						margin="normal"
						onChange={this.handleMuiChange("refPrice")}
						style={{width: "115px", marginTop: "12px"}}
						InputProps={{
							startAdornment: <InputAdornment position="start">$</InputAdornment>,
						}}

						/>
					</ToolTip>

					<br/>

					<FormControl className={classes.formControl} required
											 disabled={this.state.disablePraccode}
											 style={{display: this.state.hidePraccode ? "none" : "", marginBottom: "0px"}}
					 >
						<FormLabel style={{fontSize: "12px"}}>Practice Type</FormLabel>
						<RadioGroup aria-label="pracCode" name="pracCode" row={true}
												value={this.state.pracCode} onChange={this.handlePracCodeChange}>
							<FormControlLabel value="1" control={<Radio color="primary"/>} label="Irrigated" />
							<FormControlLabel value="2" control={<Radio color="primary"/>} label="Non-Irrigated" />
							<ToolTip title={practiceTypeToolTip} enterTouchDelay={tooltipTouchDelay}>
								<span className="iconSpan">
									<IconButton >
										<Info color="inherit" className={classes.helpIcon}/>
									</IconButton>
								</span>
							</ToolTip>
						</RadioGroup>
					</FormControl>


					<FormControl className={classes.formControl} required>
						<ReactSelect styles={ReactSelectStyles}
											 value = {{value: this.state.forecastType, label: this.state.forecastName}}
											 classes={classes}
											 textFieldProps={{
												 label: "Forecast Model",
												 InputLabelProps: {
													 shrink: true,
												 },
											 }}
											 components={components}
											 //placeholder="Select"
											 options={forecastTypeOptions}
											 onChange={this.handleReactSelectChange("forecastType")}
											 inputProps={{
												 name: "forecast",
												 id: "forecast-simple",
											 }}/>


					</FormControl>

					<ToolTip title={forecastToolTip} disableFocusListener={true}>
						<span className="iconSpan">
							<IconButton aria-label="Open Forecast Models" className={classes.popupButton} onClick={this.handleForecastOpen}
							                                disabled={(this.state.commodity === "")}>
								<HelpOutline color="inherit" className={classes.helpIcon}/>
							</IconButton>
						</span>

					</ToolTip>

					<TextField
						id="paymentYield"
						label="PLC Payment Yield"
						value={this.state.paymentYield}
						margin="normal"
						onChange={this.handleMuiChange("paymentYield")}
						className={classes.textField}
						// style={{marginLeft: 20}}
						required
						InputLabelProps={{shrink: true}}
						InputProps={{
							endAdornment: <InputAdornment position="end">{this.state.units}</InputAdornment>,
							inputProps: textFieldInputStyle
						}}
						inputProps={{padding: 10}}
						onInput={this.validateMaxValue(300)}
					/>

					<ToolTip title={`${plcPayYieldInputToolTip }. ${ countyYieldTip}`} enterTouchDelay={tooltipTouchDelay}>
						<span className="iconSpan">
							<IconButton >
								<Info color="inherit" className={classes.helpIcon}/>
							</IconButton>
						</span>
					</ToolTip>


					<br/>

					<TextField
							id="paymentYield"
							label="ARC Trend Yield"
							// style={{display: "none"}}
							value={this.state.arcYield}
							disabled={true}
							margin="normal"
							onChange={this.handleMuiChange("arcYield")}
							className={classes.textField}
							required
							InputLabelProps={{shrink: true}}
							InputProps={{
								endAdornment: <InputAdornment position="end">{this.state.units}</InputAdornment>,
								inputProps: textFieldInputStyle
							}}
							inputProps={{padding: 10}}
							onInput={this.validateMaxValue(300)}
					/>

					<ToolTip title={arcTrendYieldToolTip} enterTouchDelay={tooltipTouchDelay}>
						<span className="iconSpan">
							<IconButton >
								<Info color="inherit" className={classes.helpIcon}/>
							</IconButton>
						</span>
					</ToolTip>

					<br/>

				</div>

				<div >
					<ProgramParams/>
				</div>
				<br/>

				<div style={{textAlign: "center"}}>
					<Button variant="contained" color="primary" onClick={this.runModel}
									disabled={!this.validateInputs()}
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
	forecastType: state.forecastType,
	refPrice: state.refPrice,
	arcYield: state.arcYield,
	paymentYield: state.paymentYield,
	coverage: state.coverage,
	range: state.range,
	acres: state.acres,
	countyResults: state.modelResult
});

const mapDispatchToProps = dispatch => ({
	handleCountyChange: county => dispatch(changeCounty(county)),
	handleCommodityChange: commodity => dispatch(changeCommodity(commodity)),
	handleForecastTypeChange: forecastType => dispatch(changeForecastType(forecastType)),
	handleRefPriceChange: refPrice => dispatch(changeRefPrice(refPrice)),
	handlePaymentYieldChange: paymentYield => dispatch(changePaymentYield(paymentYield)),
	handleArcYieldChange: arcYield => dispatch(changeArcYield(arcYield)),
	handleResultsChange: results => dispatch(handleResults(results))
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FDRunModel));
