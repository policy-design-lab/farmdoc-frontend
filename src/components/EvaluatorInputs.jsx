import React, {Component} from "react";
import {connect} from "react-redux";
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
	getParams,
	getCropParams,
	roundResults
} from "../public/utils";
import {
	handleEvaluatorResults
} from "../actions/insEvaluator";
import Spinner from "./Spinner";
import config from "../app.config";

import ReactSelect from "react-select";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";

import {
	taAdjTooltip, rateYieldTooltip, taYieldTooltip, aphYieldTooltip,
	typeTooltip, practiceTooltip, riskClassTooltip, prevPlantingTooltip,
	acresTooltip, projPriceTooltip, volFactorTooltip
} from "../app.messages";
import FDTooltip from "./Tooltip";

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
		// marginTop: "8px",
		// marginRight: "8px",
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

	formControlTopPanel: {
		minWidth: 200,
		marginLeft: 20,
		marginRight: 4,
		marginTop: 4,
		marginBottom: 4,
		textAlign: "left"
	},

	formControlXSmall: {
		minWidth: 120,
		marginLeft: 20,
		marginRight: 4,
		marginTop: 4,
		marginBottom: 4,
		textAlign: "left"
	},

	formControlSmall: {
		minWidth: 150,
		marginLeft: 20,
		marginRight: 4,
		marginTop: 4,
		marginBottom: 4,
		textAlign: "left"
	},

	formControlMedium: {
		minWidth: 180,
		marginLeft: 20,
		marginRight: 4,
		marginTop: 4,
		marginBottom: 4,
		textAlign: "left"
	},

	formControlLarge: {
		minWidth: 220,
		marginLeft: 20,
		marginRight: 4,
		marginTop: 4,
		marginBottom: 4,
		textAlign: "left"
	},

	helpIcon: {
		fontSize: 24
	},

	iconButton: {
		height: 24,
		width: 24
	},

	popupButton: {
		width: 48
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
		fontSize: 16,
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

const components = {
	Control
};

class EvaluatorInputs extends Component {

	state = {
		states: [],
		stateSel: "",
		counties: [],
		county: "",
		program: "both",
		cropId: null, //TODO: use 41 instead? config.defaultsJson.cropId,
		units: config.defaultsJson.units,

	  runStatus: "INIT",
		premResults: null,
		countySelValue: null,
		stateSelValue: null,
		cropSelValue: null,
		cropCountyCode: null,

		farmAcres: null,

		projectedPrice: null,
		volFactor: null,
		futuresUpdated: "",


	};

	constructor(props) {
		super(props);
		this.calcPremiums = this.calcPremiums.bind(this);
		this.handleReactSelectChange = this.handleReactSelectChange.bind(this);
		this.handleMuiChange = this.handleMuiChange.bind(this);
		this.handleEvaluatorResults = this.handleEvaluatorResults.bind(this);

		//TODO: Cleanup states that are not needed
		this.state = {
			states: [],
			stateSel: "",
			counties: [],
			county: "",
			program: "both",
			cropId: null, //TODO: use 41 instead? config.defaultsJson.cropId,
			units: config.defaultsJson.units,

			runStatus: "INIT",
			premResults: null,
			countySelValue: null,
			stateSelValue: null,
			cropCountyCode: null,


			farmAcres: null,
			projectedPrice: null,
			volFactor: null,
			futuresUpdated: "",
		};
	}

	handleReactSelectChange = name => event => {
		this.setState({
			[name]: event.value}, function(){
			if (this.state.cropId !== "" && this.state.county !== ""){
				//TODO: Remove if not needed. Use to get params from flask endpoints
			}
		});

		switch (name) {
			case "county":
				this.setState({countySelValue: {value: event.value, label: event.label}});
				this.clearParams();
				if (this.state.cropId !== null){
					let cropCountyCode = `${event.value }${ this.state.cropId}`;
					this.setState({cropCountyCode: cropCountyCode});
					this.setState({runStatus: "FETCHING_PARAMS"});
					this.setParams(cropCountyCode);
				}
				break;

			case "stateSel":
				if (event.value !== "") {
					this.clearParams();
					this.setState({stateSelValue: {value: event.value, label: event.label}});
					this.setState({countySelValue: null});
					this.setState({county: ""});
					this.populateCounties(event.value);
				}
				break;
			case "cropId":
				if (event.value !== "") {
					this.clearParams();
					this.setState({cropSelValue: {value: event.value, label: event.label}});
					this.populateCropUnits(event.value);
					let cropCountyCode = `${this.state.county }${ event.value}`;
					this.setState({cropCountyCode: cropCountyCode});
					this.setState({runStatus: "FETCHING_PARAMS"});
					this.setParams(cropCountyCode);
				}
				break;
		}
	};

	handleMuiChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleMuiSelectChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	clearParams(){
		//TODO: Cleanup states that are not needed
		this.setState({
			aphYield: "",
			taYield: "",
			rateYield: "",
			useTaAdj: true,
			riskClass: 0,
			farmAcres: "",
			grainType: 16,
			practiceType: 3,
			preventedPlanting: "0",
			projectedPrice: "",
			volFactor: "",

			practiceTypes: [],
			riskClasses: [],
			grainTypes: []
		});
	}

	setParams(cropCountyCode, runCalc = false) {
		let that = this;
		getParams(cropCountyCode).then(function(response) {
			if (response.status === 200) {
				return response.json();
			}
			else {
				console.log(
					"Flask Service API call failed. Most likely the token expired");
				this.setState({runStatus: "ERROR_PARAMS"});
			// TODO: how to handle? Force logout?
			}
		}).then(data => {
			if (typeof(data) !== "object"){
				this.clearParams();
			}
			else {
				this.setState({aphYield: roundResults(data.aphYield)});
				this.setState({rateYield: roundResults(data.rateYield)});
				this.setState({taYield: roundResults(data.TAYield)});
				// this.setState({useTaAdj: data.useTaAdjustment});
				this.setState({farmAcres: data.acres});
				this.setState({practiceTypes: data.practices});
				this.setState({riskClasses: data.riskClasses});
				this.setState({projectedPrice: roundResults(data.comboProjPrice, 2)});
				this.setState({volFactor: roundResults(data.comboVol, 2)});
				this.setState({futuresUpdated: ` Projected Price & Volatility as of ${ data.dateUpdated}`});

				//TODO: Confirm with PIs if these defaults will be good for all counties
				if (this.state.cropId === 41){
					this.setState({practiceType: this.getDefaultType(data.practices, "practiceCode", 3)});

					// if (this.doesArrContain(data.types, "typeCode", 16) <= 0){
					// 	data.types.push({typeCode: 16, typeLabel: "Grain"});
					// }
					this.setState({grainTypes: data.types});
					this.setState({grainType: this.getDefaultType(data.types, "typeCode", 16)});
				}
				else if (this.state.cropId === 81){
					//Use Nfac as default, if not available use non-irrigated
					let soyPracDefault = this.getDefaultType(data.practices, "practiceCode", 53);
					if (soyPracDefault <= 0){
						soyPracDefault = this.getDefaultType(data.practices, "practiceCode", 3);
					}
					this.setState({practiceType: soyPracDefault});

					// if (this.doesArrContain(data.types, "typeCode", 91) <= 0){
					// 	data.types.push({typeCode: 91, typeLabel: "Commodity"});
					// }
					this.setState({grainTypes: data.types});
					this.setState({grainType: this.getDefaultType(data.types, "typeCode", 997)});
				}

			}
			this.setState({runStatus: "FETCHED_PARAMS"}, function(){
				if (runCalc){
					that.calcPremiums();
				}
				else {
					that.handleEvaluatorResults(null);
				}
			});
		}, function(){
			that.setState({runStatus: "ERROR_PARAMS"});
		});
	}

	 getDefaultType(arr, fieldName, fieldVal){
		if (arr.length === 1){
			return arr[0][fieldName];
		}

		for (let i = 0; i < arr.length; i++){
			let obj = arr[i];

			if (obj[fieldName] === fieldVal){
				return fieldVal;
			}
		}
		return 0;
	}

	doesArrContain(arr, fieldName, fieldVal){
		for (let i = 0; i < arr.length; i++){
			let obj = arr[i];

			if (obj[fieldName] === fieldVal){
				return fieldVal;
			}
		}
		return 0;
	}

	async calcPremiums() {
		//let status = "STARTED";
		// let personId = localStorage.getItem("dwPersonId");
		let email = localStorage.getItem("kcEmail");
		let token = localStorage.getItem("kcToken");
		let token_header = `Bearer ${token}`;

		let kcHeaders = {
			"Authorization": token_header
		};

		// let countyId, startYear, commodity, refPrice, paymentAcres, arcCoverage, arcRange, plcYield,
		// 	arcYield, program, sequesterPrice, pracCode;
		// countyId = this.state.county;
		// startYear = config.defaultsJson.startYear;
		// commodity = this.state.commodity.toLowerCase();
		// refPrice = this.state.refPrice;
		// paymentAcres = this.state.acres;
		// arcCoverage = this.state.coverage;
		// arcRange = this.state.range;
		// arcYield = this.state.arcYield;
		// plcYield = this.state.paymentYield;
		// program = "ARC";
		// sequesterPrice = this.state.seqprice;
		// pracCode = this.state.pracCode;

		// let countyFips, crop, aphYield, useTaAdj, taYield, rateYield, riskClass, farmAcres,
		// 	grainType, practiceType, preventePlanting;

		let evaluatorResult = "";

		let cropFullCode = `${ this.state.cropCountyCode.toString() }${this.state.grainType.toString().padStart(3, "0") }${this.state.practiceType.toString().padStart(3, "0")}`;

		this.setState({runStatus: "FETCHING_RESULTS"});

		let countyProductsUrl = new URL(`${config.apiUrl }/compute/premGrip`);
		let countyProductsParams = [
			["code", cropFullCode],
			["projPrice", this.state.projectedPrice],
			["volFactor", this.state.volFactor],
			["email", email]
		];

		countyProductsUrl.search = new URLSearchParams(countyProductsParams).toString();

		const countyProductsResponse = await fetch(countyProductsUrl, {
			method: "GET",
			headers: kcHeaders,
		});

		//TODO: Use a different prop for evaluator
		if (countyProductsResponse instanceof Response) {
			try {
				evaluatorResult = await countyProductsResponse.json();
				if (typeof(evaluatorResult) === "object") {
					this.handleEvaluatorResults(JSON.stringify(evaluatorResult));
					this.setState({runStatus: "FETCHED_RESULTS"});
				}
				else {
					this.handleEvaluatorResults("");
				}
			}
			catch (error) {
				this.setState({runStatus: "ERROR_RESULTS"});
				console.log("error getting the response from flask api");
			}
		}

	}

	handleEvaluatorResults(results) {
		this.props.handleEvaluatorResults(results);
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
			this.setState({
				stateSel: 17,
			});
			this.setState({stateSelValue: {value: 17, label: "Illinois"}});
			this.populateCounties(17);

			this.setState({county: 17001});
			this.setState({countySelValue: {value: 17001, label: "Adams"}});

			this.setState({cropId: 41});
			this.setState({cropSelValue: {value: 41, label: "Corn"}});

			let defaultCropCountyCode = "1700141";
			this.setState({cropCountyCode: defaultCropCountyCode});
			this.setState({runStatus: "FETCHING_PARAMS"});
			this.setParams(defaultCropCountyCode, false);
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

	populateCropUnits(cropId) {
		config.commodities.forEach((item) => {
			if (item.cropId === cropId) {
				this.setState({

					units: item.units,
				});
			}
		});
	}

	validateInputs() {
		//TODO: Add projected price validation back. Disabled as a quick patch to access 2019 data if negative
		return this.state.county > 0 && this.state.cropId !== "" && this.state.aphYield > 0
				&& this.state.rateYield > 0 && this.state.taYield > 0 && this.state.volFactor > 0
				&& this.state.projectedPrice >= -999 && this.state.farmAcres >= 1 &&
				this.state.grainType > 0 && this.state.practiceType > 0;
	}

	render() {
		const {classes} = this.props;

		let textFieldInputStyle = {style: {paddingLeft: 8}};
		let spinner;

		if (this.state.runStatus === "INIT"){
			this.handleEvaluatorResults(null);
		}

		if (this.state.runStatus === "FETCHING_RESULTS" || this.state.runStatus === "FETCHING_PARAMS") {
			spinner = <Spinner/>;
		}

		let stateOptions = [];
		//TODO: Hack - fetch from DB
		let activeStates = [17, 18, 19, 24, 26, 27, 29, 38, 39, 46, 55];

		this.state.states.forEach((item) => {
			if (activeStates.indexOf(item.id) >= 0) {
				stateOptions.push({value: item.id, label: item.name});
			}
		});

		let countyOptions = [];

		this.state.counties.forEach((item) => {
			countyOptions.push({value: item.id, label: item.name});
		});

		let cropOptions = [];
		//TODO: Hack - fetch from DB
		let activeCrops = [41, 81];

		config.commodities.forEach((item) => {
			if (activeCrops.indexOf(item.cropId) >= 0) {
				cropOptions.push({value: item.cropId, label: item.name});
			}
		});

		let practiceTypeOptions = [];

		if (this.state.practiceTypes != null) {

			this.state.practiceTypes.forEach((item) => {
				practiceTypeOptions.push(<MenuItem
						value={item.practiceCode}>{item.practiceLabel}</MenuItem>);
			});
		}

		let riskClassOptions = [];

		if (this.state.riskClasses != null) {

			this.state.riskClasses.forEach((item) => {
				riskClassOptions.push(<MenuItem
						value={item.riskCode}>{item.riskRate}</MenuItem>);
			});
		}

		let grainTypeOptions = [];

		if (this.state.grainTypes != null) {

			this.state.grainTypes.forEach((item) => {
				grainTypeOptions.push(<MenuItem
						value={item.typeCode}>{item.typeLabel}</MenuItem>);
			});
		}


		return (
			<div style={{textAlign: "center"}}>

				<div style={{marginTop: "12px", fontSize: "1.125em", fontWeight: 600}}>
					Evaluator - Enter your farm information to generate crop insurance quotes for 2020
				</div>

				<div style={{
					maxWidth: "1080px",
					borderRadius: "15px", borderStyle: "solid", boxShadow: " 0 2px 4px 0px", borderWidth: "1px",
					marginTop: "10px", marginRight: "15px", marginBottom: "15px", marginLeft: "15px",
					paddingBottom: "8px", paddingRight: "20px", paddingTop: "2px", paddingLeft: "10px",
					display: "inline-block"
				}}>

					<FormControl className={classes.formControlMedium} required >
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
												 value={this.state.stateSelValue}
												 placeholder = "Select"
												 onChange={this.handleReactSelectChange("stateSel")}
												 inputProps={{
													 name: "state",
													 id: "state-simple",
												 }}	/>

					</FormControl>

					<FormControl className={classes.formControlMedium} required>
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

					<FormControl className={classes.formControlMedium} required>
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
												 value={this.state.cropSelValue}
												 options={cropOptions}
												 onChange={this.handleReactSelectChange("cropId")}
												 inputProps={{
													 name: "crop",
													 id: "crop-simple",
												 }}/>
					</FormControl>

					<FormControl className={classes.formControlXSmall}>
						<TextField
								id="farmAcres"
								label="Acres"
								value={this.state.farmAcres}
								margin="normal"
								onChange={this.handleMuiChange("farmAcres")}
								className={classes.textField}
								required
								InputLabelProps={{shrink: true}}
								InputProps={{
									inputProps: textFieldInputStyle
								}}
								inputProps={{padding: 10}}
						/>
					</FormControl>

					{/*<FormControl className={classes.formControlXSmall}>*/}
					{/*	<TextField*/}
					{/*			id="farmAcres"*/}
					{/*			label="Gross Revenue"*/}
					{/*			value={548.17}*/}
					{/*			margin="normal"*/}
					{/*			onChange={this.handleMuiChange("farmAcres")}*/}
					{/*			className={classes.textField}*/}
					{/*			required*/}
					{/*			InputLabelProps={{shrink: true}}*/}
					{/*			InputProps={{*/}
					{/*				inputProps: textFieldInputStyle*/}
					{/*			}}*/}
					{/*			inputProps={{padding: 10}}*/}
					{/*	/>*/}
					{/*</FormControl>*/}

					{/*<FDTooltip title="Change Gross Target and run a new simulation" />*/}

					<br/>
					<Grid container spacing={3} style={{display: "flex", alignItems: "center"}}>
						<Grid item xs />
						<Grid item xs={4} >
							<Button variant="contained" color="primary" onClick={this.calcPremiums}
											disabled={!this.validateInputs()}
											style={{fontSize: "large", backgroundColor: "#455A64"}}>
								<Icon className={classes.leftIcon}> send </Icon>
								Calculate Premiums
							</Button>
						</Grid>
						<Grid item xs >
							<div style={{textAlign: "right", fontSize: "0.875em"}}>
								{this.state.futuresUpdated}
							</div>
						</Grid>
					</Grid>

					{spinner}

				</div>
				<br/>

			</div>
		);
	}

}

const mapStateToProps = state => ({
	evaluatorResults: state.evaluatorResults
});

const mapDispatchToProps = dispatch => ({
	handleEvaluatorResults: evaluatorResults => dispatch(handleEvaluatorResults(evaluatorResults))
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EvaluatorInputs));
