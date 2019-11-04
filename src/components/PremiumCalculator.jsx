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
	getMarketPricesForForecastModel,
	getBinSizeForCrop,
	getStates,
	getCounties,
	getCropParams
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
		width: 200,
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
		marginTop: 15,
		marginLeft: 20,
		marginRight: 20,
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

class PremiumCalculator extends Component {

	state = {
		states: [],
		stateSel: "",
		counties: [],
		county: "",
		program: "both",
		commodity: config.defaultsJson.commodity,
		units: config.defaultsJson.units,

	  runStatus: "",
		modelResult: null,
		countySelValue: null,

		aphYield: "160",
		taYield: "160",
		rateYield: "160",
		useTaAdj: "yes", //TODO: Change to true/false
		riskClass: "none",
		farmAcres: "100",
		grainType: "grain",
		practiceType: "3",
		preventedPlanting: "0"
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

			runStatus: "",
			modelResult: null,
			countySelValue: null,

			aphYield: "160",
			taYield: "160",
			rateYield: "160",
			useTaAdj: "yes", //TODO: Change to true/false
			riskClass: "none",
			farmAcres: "100",
			grainType: "grain",
			practiceType: "3",
			preventedPlanting: "0"
		};
	}

	handleReactSelectChange = name => event => {
		this.setState({
			[name]: event.value}, function(){
			if (this.state.commodity !== "" && this.state.county !== ""){
				//TODO: Remove if not needed. Use to get params from flask endpoints
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

	populateRefPriceAndUnits(commodity) {
		config.commodities.forEach((item) => {
			if (item.id === commodity) {
				this.setState({

					units: item.units,
				});
			}
		});
	}

	validateInputs() {
		return this.state.county > 0 && this.state.commodity !== "";
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
			cropOptions.push({value: item.id, label: item.name});
		});
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
												 options={cropOptions}
												 onChange={this.handleReactSelectChange("commodity")}
												 inputProps={{
													 name: "crop",
													 id: "crop-simple",
												 }}/>
					</FormControl>

				</div>
				<br/>
				<div style={{
					maxWidth: "1000px",
					borderRadius: "15px", borderStyle: "solid", boxShadow: " 0 2px 4px 0px", borderWidth: "1px",
					marginLeft: "50px", marginRight: "5px", marginTop: "15px", marginBottom: "15px",
					paddingBottom: "12px",
					display: "inline-block"
				}}>
					<FormControl className={classes.formControlHorizontal}>
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
							// onInput={this.validateMaxValue(300)}
						/>
					</FormControl>

					<FormControl required className={classes.formControlHorizontal}>
						<InputLabel id="taId">
							Use TA Adjustment
						</InputLabel>
						<Select id="useTaAdj" labelId="taId" value={this.state.useTaAdj} onChange={this.handleMuiSelectChange("useTaAdj")}>
							<MenuItem value="yes">Yes</MenuItem>
							<MenuItem value="no">No</MenuItem>
						</Select>
					</FormControl>

					<FormControl className={classes.formControlHorizontal}>
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
							// onInput={this.validateMaxValue(300)}
						/>
					</FormControl>

					<FormControl className={classes.formControlHorizontal}>
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
							// onInput={this.validateMaxValue(300)}
						/>
					</FormControl>

					<br/>

					<FormControl className={classes.formControlHorizontal}>
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
								//endAdornment: <InputAdornment position="end">{this.state.units}</InputAdornment>,
								inputProps: textFieldInputStyle
							}}
							inputProps={{padding: 10}}
							// onInput={this.validateMaxValue(300)}
						/>
					</FormControl>

					<FormControl required className={classes.formControlHorizontal}>
						<InputLabel id="riskId">
							Risk Class
						</InputLabel>
						<Select id="riskClass" labelId="riskId" value={this.state.riskClass} onChange={this.handleMuiSelectChange("riskClass")}>
							<MenuItem value="none">None</MenuItem>
							<MenuItem value="na">NA</MenuItem>
						</Select>
					</FormControl>

					<FormControl required className={classes.formControlHorizontal}>
						<InputLabel id="grainTypeId">
							Type
						</InputLabel>
						<Select id="grainType" labelId="grainTypeId" value={this.state.grainType} onChange={this.handleMuiSelectChange("grainType")}>
							<MenuItem value="grain">Grain</MenuItem>
							<MenuItem value="na">NA</MenuItem>
						</Select>
					</FormControl>

					<FormControl required className={classes.formControlHorizontal}>
						<InputLabel id="practiceTypeId">
							Practice
						</InputLabel>
						<Select id="practiceType" labelId="practiceTypeId" value={this.state.practiceType} onChange={this.handleMuiSelectChange("practiceType")}>
							<MenuItem value="3">Non-Irrigated</MenuItem>
							<MenuItem value="2">Irrigated</MenuItem>
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

					<br/> <br/>

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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PremiumCalculator));
