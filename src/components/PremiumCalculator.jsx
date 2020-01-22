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
	getParams,
	getCropParams,
	roundResults
} from "../public/utils";
import {
	datawolfURL,
	postExecutionRequest,
	resultDatasetId,
	steps,
} from "../datawolf.config";
import {
	handlePremiumResults,
	handleCountyProductsResults
} from "../actions/insPremiums";
import Spinner from "../components/Spinner";
import config from "../app.config";
import {
	dataNotAvailable,
	practiceTypeToolTip,
	arcTrendYieldToolTip,
	plcPayYieldInputToolTip,
	stateCountySelectToolTip
} from "../app.messages";
import ReactSelect from "react-select";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

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
	formControlHorizontal: {
		margin: theme.spacing.unit,
		minWidth: 200,
		marginLeft: 20,
		marginRight: 20,
		textAlign: "left"
	},

	formControlHorizontalTextBox: {
		margin: theme.spacing.unit,
		minWidth: 150,
		marginLeft: 20,
		marginRight: 20,
		textAlign: "left"
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

class PremiumCalculator extends Component {

	state = {
		states: [],
		stateSel: "",
		counties: [],
		county: "",
		program: "both",
		cropId: null, //TODO: use 41 instead? config.defaultsJson.cropId,
		units: config.defaultsJson.units,

	  runStatus: "",
		premResults: null,
		countySelValue: null,
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
			cropId: null, //TODO: use 41 instead? config.defaultsJson.cropId,
			units: config.defaultsJson.units,

			runStatus: "",
			premResults: null,
			countySelValue: null,
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
				if (this.state.cropId !== null){
					let cropCountyCode = `${event.value }${ this.state.cropId}`;
					this.setState({cropCountyCode: cropCountyCode});
					this.setParams(cropCountyCode);
				}
				break;

			case "stateSel":
				if (event.value !== "") {
					this.setState({countySelValue: null});
					this.setState({county: ""});
					this.populateCounties(event.value);
				}
				break;
			case "cropId":
				if (event.value !== "") {
					this.populateCropUnits(event.value);

					//TODO: Confirm with PIs if these defaults will be good for all counties
					if (event.value === 41){
						this.setState({practiceType: 3});
						this.setState({grainType: 16});
					}
					else if (event.value === 81){
						this.setState({practiceType: 53});
						this.setState({grainType: 997});
					}

					let cropCountyCode = `${this.state.county }${ event.value}`;
					this.setState({cropCountyCode: cropCountyCode});
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


	setParams(cropCountyCode) {
		getParams(cropCountyCode).then(function(response) {
			if (response.status === 200) {
				return response.json();
			}
			else {
				console.log(
					"Flask Service API call failed. Most likely the token expired");
			// TODO: how to handle? Force logout?
			}
		}).then(data => {
			// console.log(data);
			this.setState({aphYield: roundResults(data.aphYield)});
			this.setState({taYield: roundResults(data.TAYield)});
			this.setState({rateYield: roundResults(data.rateYield)});
			this.setState({useTaAdj: data.useTaAdjustment});
			this.setState({farmAcres: data.acres});
			this.setState({practiceTypes: data.practices});
			this.setState({riskClasses: data.riskClasses});
			this.setState({grainTypes: data.types});
			this.setState({projectedPrice: roundResults(data.comboProjPrice, 2)});
			this.setState({volFactor: roundResults(data.comboVol, 2)});
		});
	}


	async calcPremiums() {
		//let status = "STARTED";
		let personId = localStorage.getItem("dwPersonId");
		this.setState({
			runStatus: status
		});

		let curTime = new Date();
		curTime = curTime.toUTCString();
		let title = `Run at ${curTime}`;


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
			["volFactor", this.state.volFactor]
		];

		premiumsApiUrl.search = new URLSearchParams(premiumParams).toString();

		const premiumsResponse = await fetch(premiumsApiUrl, {
			method: "GET",
			//headers: kcHeaders,
		});

		if (premiumsResponse instanceof Response) {
			try {
				premiumsResult = await premiumsResponse.json();
				this.handlePremiumResults(JSON.stringify(premiumsResult));
				//this.setState({runStatus: premiumResult.stepState[steps.Farm_Model]});
			}
			catch (error) {
				console.log("error getting the response from flask api");
			}
		}

		let countyProductsUrl = new URL(`${config.apiUrl }/compute/premGrip`);
		let countyProductsParams = [
			["code", cropFullCode],
			["projPrice", this.state.projectedPrice],
			["volFactor", this.state.volFactor]
		];

		countyProductsUrl.search = new URLSearchParams(countyProductsParams).toString();

		const countyProductsResponse = await fetch(countyProductsUrl, {
			method: "GET",
			//headers: kcHeaders,
		});

		if (countyProductsResponse instanceof Response) {
			try {
				countyProductsResult = await countyProductsResponse.json();
				console.log(countyProductsResult);
				this.handleCountyProductsResults(JSON.stringify(countyProductsResult));
			}
			catch (error) {
				console.log(error);
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
		return this.state.county > 0 && this.state.cropId !== "" && this.state.aphYield > 0
				&& this.state.rateYield > 0 && this.state.taYield > 0 && this.state.volFactor > 0
				&& this.state.projectedPrice > 0 && this.state.farmAcres >= 1;
	}

	render() {
		const {classes} = this.props;

		let textFieldInputStyle = {style: {paddingLeft: 8}};
		let tooltipTouchDelay = config.tooltipTouchDelay;
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

				<div style={{
					maxWidth: "730px",
					borderRadius: "15px", borderStyle: "solid", boxShadow: " 0 2px 4px 0px", borderWidth: "1px",
					marginLeft: "50px", marginRight: "5px", marginTop: "15px", marginBottom: "15px",
					paddingBottom: "12px",
					display: "inline-block"
				}}>
					<FormControl className={classes.formControlHorizontal} required >
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

					<FormControl className={classes.formControlHorizontal} required>
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

					<FormControl className={classes.formControlHorizontal} required>
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
												 //value={this.state.cropId}
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
					maxWidth: "1050px",
					borderRadius: "15px", borderStyle: "solid", boxShadow: " 0 2px 4px 0px", borderWidth: "1px",
					marginLeft: "50px", marginRight: "5px", marginTop: "15px", marginBottom: "15px",
					paddingBottom: "12px",
					display: "inline-block"
				}}>

					<FormControl required className={classes.formControlHorizontal}>
						<InputLabel id="taId">
							Use TA/YE Adjustment
						</InputLabel>
						<Select id="useTaAdj" labelId="taId" value={this.state.useTaAdj} onChange={this.handleMuiSelectChange("useTaAdj")}>
							<MenuItem value={true}>Yes</MenuItem>
							<MenuItem value={false}>No</MenuItem>
						</Select>
					</FormControl>

					<FormControl className={classes.formControlHorizontalTextBox}>
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

					<FormControl className={classes.formControlHorizontalTextBox}>
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

					<FormControl className={classes.formControlHorizontalTextBox}>
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

					<br/>

					<FormControl required className={classes.formControlHorizontal}>
						<InputLabel id="grainTypeId">
							Type
						</InputLabel>
						<Select id="grainType" labelId="grainTypeId" value={this.state.grainType} onChange={this.handleMuiSelectChange("grainType")}>
							{grainTypeOptions}
						</Select>
					</FormControl>

					<FormControl required className={classes.formControlHorizontal}>
						<InputLabel id="practiceTypeId">
							Practice
						</InputLabel>
						<Select id="practiceType" labelId="practiceTypeId" value={this.state.practiceType} onChange={this.handleMuiSelectChange("practiceType")}>
							{practiceTypeOptions}
						</Select>
					</FormControl>

					<FormControl required className={classes.formControlHorizontal}>
						<InputLabel id="riskId">
							Risk Class
						</InputLabel>
						<Select id="riskClass" labelId="riskId" value={this.state.riskClass} onChange={this.handleMuiSelectChange("riskClass")}>
							{riskClassOptions}
						</Select>
					</FormControl>

					<FormControl required className={classes.formControlHorizontal}>
						<InputLabel id="preventedPlantingId">
							Prevented Planting
						</InputLabel>
						<Select id="preventedPlanting" labelId="preventedPlantingId" value={this.state.preventedPlanting} onChange={this.handleMuiSelectChange("preventedPlanting")}>
							<MenuItem value="0">None</MenuItem>
							<MenuItem value="1">Plus 5%</MenuItem>
							<MenuItem value="2">Plus 10%</MenuItem>
						</Select>
					</FormControl>
					<br/>

					<FormControl className={classes.formControlHorizontalTextBox}>
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

					<FormControl className={classes.formControlHorizontalTextBox}>
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

					<FormControl className={classes.formControlHorizontalTextBox}>
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

					<br/>
					<div style={{textAlign: "center"}}>
						<Button variant="contained" color="primary" onClick={this.calcPremiums}
										disabled={!this.validateInputs()}
										style={{fontSize: "large", backgroundColor: "#455A64"}}>
							<Icon className={classes.leftIcon}> send </Icon>
							Run Model
						</Button>
					</div>

					{spinner}

				</div>

				{spinner}
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
