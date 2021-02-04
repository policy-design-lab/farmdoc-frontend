import React, {Component} from "react";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import {FormControl, Modal} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {
	getStates,
	getCounties,
	getParams,
	roundResults, getCrops, covertToLegacyCropFormat,
} from "../public/utils";
import {
	handlePremiumResults,
	handleCountyProductsResults
} from "../actions/insPremiums";
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
		height: 36
	},
	container: {
		display: "flex",
		flexWrap: "wrap",
	},

	textField: {
		marginTop: "8px !important",
		// marginRight: "8px",
		width: 140,
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
		minWidth: 140,
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
		padding: theme.spacing(4),
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

class PremiumCalculator extends Component {

	state = {
		states: [],
		stateSel: "",
		counties: [],
		county: "",
		program: "both",
		crops: [],
		cropId: null, //TODO: use 41 instead? config.defaultsJson.cropId,
		units: config.defaultsJson.units,

	  runStatus: "INIT",
		premResults: null,
		countySelValue: null,
		stateSelValue: null,
		cropSelValue: null,
		cropCountyCode: null,

		aphYield: null,
		taYield: null,
		rateYield: null,
		useTaAdj: true,
		riskClass: 0, //TODO: should this be null instead?
		farmAcres: null,
		grainType: 16, //TODO: should this be null instead?
		practiceType: 3, // TODO: Also, use the other types such as organic etc.?
		preventedPlanting: "0",
		projectedPrice: null,
		volFactor: null,
		futuresUpdated: "",

		practiceTypes: [],
		riskClasses: [],
		grainTypes: []
	};

	constructor(props) {
		super(props);
		this.calcPremiums = this.calcPremiums.bind(this);
		this.handleReactSelectChange = this.handleReactSelectChange.bind(this);
		this.handleMuiChange = this.handleMuiChange.bind(this);
		this.handlePremiumResults = this.handlePremiumResults.bind(this);
		this.handleCountyProductsResults = this.handleCountyProductsResults.bind(this);


		this.state = {
			states: [],
			stateSel: "",
			counties: [],
			county: "",
			program: "both",
			crops: [],
			cropId: null, //TODO: use 41 instead? config.defaultsJson.cropId,
			units: config.defaultsJson.units,

			runStatus: "INIT",
			premResults: null,
			countySelValue: null,
			stateSelValue: null,
			cropCountyCode: null,

			aphYield: null,
			taYield: null,
			rateYield: null,
			useTaAdj: true,
			farmAcres: null,

			riskClass: 0,
			grainType: 16,
			practiceType: 3,
			preventedPlanting: "0",
			projectedPrice: null,
			volFactor: null,
			futuresUpdated: "",

			practiceTypes: [],
			riskClasses: [],
			grainTypes: []
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
				this.setState({futuresUpdated: `RMA 2021 Projected Price is $${ roundResults(data.comboProjPrice, 2)} with Volatility Factor of
				 ${ roundResults(data.comboVol, 2)}. Last Updated on ${ data.dateUpdated}.`});

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
					that.handleCountyProductsResults(null);
					that.handlePremiumResults(null);
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
		let personId = localStorage.getItem("dwPersonId");
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

		let countyFips, crop, aphYield, useTaAdj, taYield, rateYield, riskClass, farmAcres,
			grainType, practiceType, preventePlanting;
		let premiumsResult = "";
		let countyProductsResult = "";

		let cropFullCode = `${ this.state.cropCountyCode.toString() }${this.state.grainType.toString().padStart(3, "0") }${this.state.practiceType.toString().padStart(3, "0")}`;

		let premiumsApiUrl = new URL(`${config.apiUrl }/compute/premiums`);

		let premiumParams = [
			["code", cropFullCode],
			["aphYield", this.state.aphYield],
			["TAYield", this.state.taYield],
			["rateYield", this.state.rateYield],
			["useTaAdjustment", this.state.useTaAdj ? "1" : "0"],
			["acres", this.state.farmAcres],
			["riskVal", this.state.riskClass],
			["preventedPlanting", this.state.preventedPlanting],
			["projPrice", this.state.projectedPrice],
			["volFactor", this.state.volFactor],
			["email", email]
		];

		premiumsApiUrl.search = new URLSearchParams(premiumParams).toString();

		this.setState({runStatus: "FETCHING_RESULTS"});
		const premiumsResponse = await fetch(premiumsApiUrl, {
			method: "GET",
			headers: kcHeaders,
		});

		if (premiumsResponse instanceof Response) {
			try {
				premiumsResult = await premiumsResponse.json();
				if (typeof(premiumsResult) === "object") {
					this.handlePremiumResults(JSON.stringify(premiumsResult));
				}
				else {
					this.handlePremiumResults("");
				}
				this.setState({runStatus: "FETCHED_RESULTS"});
			}
			catch (error) {
				this.setState({runStatus: "ERROR_RESULTS"});
				console.log("error getting the response from flask api");
			}
		}

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

		if (countyProductsResponse instanceof Response) {
			try {
				countyProductsResult = await countyProductsResponse.json();
				if (typeof(countyProductsResult) === "object") {
					this.handleCountyProductsResults(JSON.stringify(countyProductsResult));
				}
				else {
					this.handleCountyProductsResults("");
				}
			}
			catch (error) {
				this.setState({runStatus: "ERROR_RESULTS"});
				console.log("error getting the response from flask api");
			}
		}

	}

	handlePremiumResults(results) {
		this.props.handlePremiumResults(results);
	}

	handleCountyProductsResults(results) {
		this.props.handleCountyProductsResults(results);
	}

	componentDidMount() {
		let statesJson = [];

		getStates("insurance").then(function(response){
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
			this.setParams(defaultCropCountyCode, true);
		});

		let cropsJson = [];
		getCrops("insurance").then(function(response){
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
		this.state.crops.forEach((item) => {
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
			this.handlePremiumResults(null);
			this.handleCountyProductsResults(null);
		}

		if (this.state.runStatus === "FETCHING_RESULTS" || this.state.runStatus === "FETCHING_PARAMS") {
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
			cropOptions.push({value: item.cropId, label: item.name});
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
					Enter your farm information to generate crop insurance quotes for 2021
				</div>

				<div style={{
					maxWidth: "730px",
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

				</div>
				<br/>
				<div style={{
					maxWidth: "1080px",
					borderRadius: "15px", borderStyle: "solid", boxShadow: " 0 2px 4px 0px", borderWidth: "1px",
					margin: "15px",	paddingBottom: "4px", paddingRight: "20px", paddingTop: "2px", paddingLeft: "10px",
					display: "inline-block"
				}}>

					<FormControl required className={classes.formControlMedium} style={{marginTop: "10px"}}>
						<InputLabel id="taId">
							Use TA/YE Adjustment
						</InputLabel>
						<Select id="useTaAdj" labelId="taId" value={this.state.useTaAdj} onChange={this.handleMuiSelectChange("useTaAdj")}>
							<MenuItem value={true}>Yes</MenuItem>
							<MenuItem value={false}>No</MenuItem>
						</Select>
					</FormControl>

					<FDTooltip title={taAdjTooltip} />
					{/*TODO: Make sure the tooltips are always together with the input fields. Currently on smaller screens they sometimes go to the next line of the input control*/}

					<FormControl className={classes.formControlSmall}>
						<TextField
								id="taYield"
								label="TA Yield"
								value={this.state.taYield}
								margin="normal"
								onChange={this.handleMuiChange("taYield")}
								className={classes.textField}
								required
								InputLabelProps={{shrink: true}}
								InputProps={{
									endAdornment: <InputAdornment position="end">{this.state.units}</InputAdornment>,
									inputProps: textFieldInputStyle
								}}
								inputProps={{padding: 10}}
						/>
					</FormControl>

					<FDTooltip title={taYieldTooltip} />

					<FormControl className={classes.formControlSmall}>
						<TextField
								id="aphYield"
								label="APH Yield"
								value={this.state.aphYield}
								margin="normal"
								onChange={this.handleMuiChange("aphYield")}
								className={classes.textField}
								required
								InputLabelProps={{shrink: true}}
								InputProps={{
									endAdornment: <InputAdornment position="end">{this.state.units}</InputAdornment>,
									inputProps: textFieldInputStyle
								}}
								inputProps={{padding: 10}}
						/>
					</FormControl>

					<FDTooltip title={aphYieldTooltip} />

					<FormControl className={classes.formControlSmall}>
						<TextField
								id="rateYield"
								label="Rate Yield"
								value={this.state.rateYield}
								margin="normal"
								onChange={this.handleMuiChange("rateYield")}
								className={classes.textField}
								required
								InputLabelProps={{shrink: true}}
								InputProps={{
									endAdornment: <InputAdornment position="end">{this.state.units}</InputAdornment>,
									inputProps: textFieldInputStyle
								}}
								inputProps={{padding: 10}}
						/>
					</FormControl>

					<FDTooltip title={rateYieldTooltip} />

					<br/>

					<FormControl required className={classes.formControlXSmall}>
						<InputLabel id="grainTypeId">
							Type
						</InputLabel>
						<Select id="grainType" style={{width: "120px"}} labelId="grainTypeId" value={this.state.grainType} onChange={this.handleMuiSelectChange("grainType")}>
							{grainTypeOptions}
						</Select>
					</FormControl>

					<FDTooltip title={typeTooltip} />

					<FormControl required className={classes.formControlLarge}>
						<InputLabel id="practiceTypeId">
							Practice
						</InputLabel>
						<Select id="practiceType" labelId="practiceTypeId" value={this.state.practiceType} onChange={this.handleMuiSelectChange("practiceType")}>
							{practiceTypeOptions}
						</Select>
					</FormControl>

					<FDTooltip title={practiceTooltip} />

					<FormControl required className={classes.formControlXSmall}>
						<InputLabel id="riskId">
							Risk Class
						</InputLabel>
						<Select id="riskClass" style={{width: "120px"}} labelId="riskId" value={this.state.riskClass} onChange={this.handleMuiSelectChange("riskClass")}>
							{riskClassOptions}
						</Select>
					</FormControl>

					<FDTooltip title={riskClassTooltip} />

					<FormControl required className={classes.formControlSmall}>
						<InputLabel id="preventedPlantingId">
							Prevented Planting
						</InputLabel>
						<Select id="preventedPlanting" labelId="preventedPlantingId" value={this.state.preventedPlanting} onChange={this.handleMuiSelectChange("preventedPlanting")}>
							<MenuItem value="0">None</MenuItem>
							<MenuItem value="1">Plus 5%</MenuItem>
							<MenuItem value="2">Plus 10%</MenuItem>
						</Select>
					</FormControl>

					<FDTooltip title={prevPlantingTooltip} />

					<br/>

					<FormControl className={classes.formControlSmall}>
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

					<FDTooltip title={acresTooltip} />

					<FormControl className={classes.formControlSmall}>
						<TextField
								id="projectedPrice"
								label="Projected Price"
								value={this.state.projectedPrice}
								margin="normal"
								onChange={this.handleMuiChange("projectedPrice")}
								className={classes.textField}
								required
								InputLabelProps={{shrink: true}}
								InputProps={{
									inputProps: textFieldInputStyle,
									startAdornment: <InputAdornment position="start">$</InputAdornment>,
								}}
								inputProps={{padding: 10}}
						/>
					</FormControl>

					<FDTooltip title={projPriceTooltip} />

					<FormControl className={classes.formControlSmall}>
						<TextField
								id="volFactor"
								label="Volatility Factor"
								value={this.state.volFactor}
								margin="normal"
								onChange={this.handleMuiChange("volFactor")}
								className={classes.textField}
								required
								InputLabelProps={{shrink: true}}
								InputProps={{
									//endAdornment: <InputAdornment position="end">{this.state.units}</InputAdornment>,
									inputProps: textFieldInputStyle
								}}
								inputProps={{padding: 10}}
						/>
					</FormControl>

					<FDTooltip title={volFactorTooltip} />

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
						<Grid item xs />
					</Grid>
					<div style={{textAlign: "center", fontSize: "0.875em", paddingTop: "4px"}}>
						{this.state.futuresUpdated}
					</div>

					{spinner}

				</div>
			</div>
		);
	}

}

const mapStateToProps = state => ({
	premResults: state.premResults,
	countyProductsResults: state.countyProductsResults
});

const mapDispatchToProps = dispatch => ({

	handlePremiumResults: premResults => dispatch(handlePremiumResults(premResults)),
	handleCountyProductsResults: countyProductsResults => dispatch(handleCountyProductsResults(countyProductsResults))
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PremiumCalculator));
