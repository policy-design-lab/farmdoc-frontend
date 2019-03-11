import React, {Component} from "react";
import {connect} from "react-redux";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import {FormControl, Modal} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {getOutputFileJson,
	getMarketPricesForForecastModel,
	getBinSizeForCrop,
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
	changeRefPrice,
	handleResults,
} from "../actions/model";
import Spinner from "../components/Spinner";
import config from "../app.config";
import ReactSelect from "react-select";
import IconButton from "@material-ui/core/IconButton";
import HelpOutline from "@material-ui/icons/HelpOutline";
import ForecastModels from "./ForecastModels";
import ToolTip from "@material-ui/core/Tooltip";

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const styles = theme => ({
	input: {
		display: "flex",
		padding: 0,
	},
	container: {
		display: "flex",
		flexWrap: "wrap",
	},

	textField: {
		marginTop: "8px",
		width: 160,
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
		marginLeft: 0,
	},
	helpIcon: {
		fontSize: 32
	},
	paper: {
		position: "absolute",
		//width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
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
		commodity: config.defaultsJson.commodity,
		units: config.defaultsJson.units,
		forecastType: config.defaultsJson.forecastType,
		forecastName: config.defaultsJson.forecastName,
		refPrice: "",
		acres: config.defaultsJson.acres,
		seqprice: 0,
		coverage: config.defaultsJson.coverage,
		paymentYield: "",
		range: config.defaultsJson.range,
		runName: "",
		runStatus: "",
		modelResult: null,
		countySelValue: null,
		forecastPopupOpen: false
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
			commodity: config.defaultsJson.commodity,
			units: config.defaultsJson.units,
			forecastType: config.defaultsJson.forecastType,
			forecastName: config.defaultsJson.forecastName,
			refPrice: "",
			acres: config.defaultsJson.acres,
			seqprice: config.defaultsJson.seqprice,
			coverage: config.defaultsJson.coverage,
			paymentYield: "",
			range: config.defaultsJson.range,
			runName: "",
			runStatus: "",
			modelResult: null,
			countySelValue: null,
			forecastPopupOpen: false
		};
	}

	handleForecastOpen = () => {
		this.setState({forecastPopupOpen: true});
	};

	handleForecastClose = () => {
		this.setState({forecastPopupOpen: false});
	};

	handleReactSelectChange = name => event => {
		this.setState({
			[name]: event.value,
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
		}
	};

	async runModel() {
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

		let countyId, startYear, commodity, refPrice, paymentAcres, arcCoverage, arcRange, plcYield, program,
			sequesterPrice;
		countyId = this.state.county;
		startYear = config.defaultsJson.startYear;
		commodity = this.state.commodity.toLowerCase();
		refPrice = this.state.refPrice;
		paymentAcres = this.state.acres;
		arcCoverage = this.state.coverage;
		arcRange = this.state.range;
		plcYield = this.state.paymentYield;
		program = "ARC";
		sequesterPrice = this.state.seqprice;

		let forecastPrices = getMarketPricesForForecastModel(this.state.forecastType, this.state.commodity);

		let binSize = getBinSizeForCrop(this.state.commodity);


		//TODO: Add forecast
		let postRequest = postExecutionRequest(personId, title, countyId, startYear, commodity, refPrice,
			paymentAcres, arcCoverage, arcRange, plcYield, program, sequesterPrice, forecastPrices, binSize);

		let body = JSON.stringify(postRequest);

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

		while (this.state.runStatus === "" || waitingStatuses.indexOf(this.state.runStatus) >= 0) {
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
				catch (error) {
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
		else {
			this.setState({runStatus: "PARSE_ERROR"});
		}
	}

	handleResultsChange(results) {
		this.props.handleResultsChange(results);
	}

	componentDidMount() {
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

	populateCounties(stateId) {
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

	populateRefPriceAndUnits(commodity) {
		config.commodities.forEach((item) => {
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
		if (this.state.county > 0 && this.state.commodity !== "" && this.state.paymentYield !== "" && this.state.forecastType !== "") {
			return true;
		}
		else {
			return false;
		}
	}

	render() {
		const {classes} = this.props;

		let textFieldInputStyle = {};
		let spinner;

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
		config.commodities.forEach((item) => {
			cropOptions.push({value: item.id, label: item.name});
		});

		let forecastTypeOptions = [];
		config.forecastTypes.forEach((item) => {
			forecastTypeOptions.push({value: item.id, label: item.name});
		});

		let errorMsg;
		// This error will never be shown when we get the applicable crops for a county from API
		if (this.state.runStatus === "PARSE_ERROR") {
			errorMsg = (<div>
				<FormLabel component="legend" error={true}>Error: Data not available for the selected crop in the
					county. Choose a different crop or county</FormLabel>
			</div>);
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
				marginLeft: "50px", marginRight: "30px", marginTop: "15px", marginBottom: "15px", maxWidth: "400px",
				borderRadius: "15px", borderStyle: "solid", boxShadow: " 0 2px 4px 0px", borderWidth: "1px",
				paddingTop: "2px", paddingRight: "8px", paddingLeft: "18px", paddingBottom: "12px"
			}}>

				<Modal open={this.state.forecastPopupOpen} onClose={this.handleForecastClose}>
					<div style={getModalStyle()} className={classes.paper}>
						<ForecastModels/>
					</div>
				</Modal>

				{errorMsg}

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


				<TextField
					id="refPrice"
					label="Reference Price"
					value={this.state.refPrice}
					disabled={true}
					margin="normal"
					onChange={this.handleMuiChange("refPrice")}
					style={{width: "125px", marginTop: "8px"}}
					InputProps={{
						startAdornment: <InputAdornment position="start">$</InputAdornment>,
					}}

				/> <br/>

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
					<span>
						<IconButton aria-label="Open Forecast Models" onClick={this.handleForecastOpen}
											disabled={(this.state.commodity === "")}>
							<HelpOutline color="inherit" className={classes.helpIcon}/>
						</IconButton>
					</span>

				</ToolTip>

				<TextField
					id="paymentYield"
					label="ARC Trend Yield"
					//error ={this.state.paymentYield === "" || this.state.paymentYield.length === 0 ? true : false}
					value={this.state.paymentYield}
					margin="normal"
					onChange={this.handleMuiChange("paymentYield")}
					className={classes.textField}
					required

					InputLabelProps={{shrink: true}}

					InputProps={{
						endAdornment: <InputAdornment position="end">{this.state.units}</InputAdornment>, inputProps: textFieldInputStyle
					}}

					inputProps={{padding: 10}}

					onInput={(e) => {
						if (e.target.value !== "") {
							if (isNaN(e.target.value)) {
								e.target.value = e.target.value.toString().slice(0, -1);
							}
							else {
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

				<TextField
						id="paymentYield"
						label="PLC Payment Yield"
						//error ={this.state.paymentYield === "" || this.state.paymentYield.length === 0 ? true : false}
						value={this.state.paymentYield}
						margin="normal"
						onChange={this.handleMuiChange("paymentYield")}
						className={classes.textField}
						style={{marginLeft: 20}}
						required

						InputLabelProps={{shrink: true}}

						InputProps={{
							endAdornment: <InputAdornment position="end">{this.state.units}</InputAdornment>, inputProps: textFieldInputStyle
						}}

						inputProps={{padding: 10}}

						onInput={(e) => {
							if (e.target.value !== "") {
								if (isNaN(e.target.value)) {
									e.target.value = e.target.value.toString().slice(0, -1);
								}
								else {
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
				<br/>

				<TextField
					id="coverage"
					label="ARC Coverage Level"
					value={this.state.coverage}
					margin="normal"
					className={classes.textField}
					disabled={true}
					onChange={this.handleMuiChange("coverage")}
					InputProps={{
						endAdornment: <InputAdornment position="end">%</InputAdornment>, inputProps: textFieldInputStyle
					}}
					// helperText="ARC-CO Coverage"
				/>

				<TextField
					id="range"
					label="ARC Coverage Range"
					value={this.state.range}
					margin="normal"
					className={classes.textField}
					disabled={true}
					onChange={this.handleMuiChange("range")}
					style={{marginLeft: 20}}
					InputProps={{
						endAdornment: <InputAdornment position="end">%</InputAdornment>, inputProps: textFieldInputStyle
					}}
				/>
				<br/>
				<TextField
						id="acres"
						label="Payment Acres"
						value={this.state.acres}
						margin="normal"
						className={classes.textField}
						onChange={this.handleMuiChange("acres")}
						disabled={true}
						InputProps={{
							endAdornment: <InputAdornment position="end">%</InputAdornment>, inputProps: textFieldInputStyle, className:"model-input-subscript"
						}}

				/>
				<br/><br/>
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
	handleResultsChange: results => dispatch(handleResults(results))
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FDRunModel));
