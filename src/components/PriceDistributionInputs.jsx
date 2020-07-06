import React, {Component} from "react";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import {FormControl} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {
	getStates,
	getCounties,
	getCrops, covertToLegacyCropFormat
} from "../public/utils";
import {
	handleEvaluatorResults
} from "../actions/insEvaluator";
import Spinner from "./Spinner";
import config from "../app.config";
import ReactSelect from "react-select";
import Grid from "@material-ui/core/Grid";

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

class PriceDistributionInputs extends Component {

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
		cropCountyCode: null
	};

	constructor(props) {
		super(props);
		this.runEvaluator = this.runEvaluator.bind(this);
		this.handleReactSelectChange = this.handleReactSelectChange.bind(this);
		this.handleEvaluatorResults = this.handleEvaluatorResults.bind(this);

		//TODO: Cleanup states that are not needed
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
			cropCountyCode: null
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
					this.changeCropCode(cropCountyCode);
				}
				break;

			case "stateSel":
				if (event.value !== "") {
					this.setState({stateSelValue: {value: event.value, label: event.label}});
					this.setState({countySelValue: null});
					this.setState({county: ""});
					this.setState({cropCountyCode: ""});
					this.populateCounties(event.value);
				}
				break;
			case "cropId":
				if (event.value !== "") {
					this.setState({cropSelValue: {value: event.value, label: event.label}});
					let cropCountyCode = `${this.state.county }${ event.value}`;
					this.setState({cropCountyCode: cropCountyCode});
					this.changeCropCode(cropCountyCode);
				}
				break;
		}
	};


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
		this.handleEvaluatorResults(null);
		this.changeInsUnit("basic");
		this.setState({runStatus: "FETCHING_RESULTS"});

		let evaluatorUrl = new URL(`${config.apiUrl }/compute/simulator`);
		let evaluatorParams = [
			["code", this.state.cropCountyCode],
			["acres", this.state.farmAcres],
			["email", email]
		//		TODO: Remove grossTarget here when api is fixed to make this param optional
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

	handleEvaluatorResults(results) {
		this.props.handleEvaluatorResults(results);
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
			this.changeCropCode(defaultCropCountyCode);
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
		return this.state.cropCountyCode >= 1;
	}

	render() {
		const {classes} = this.props;
		let spinner;

		if (this.state.runStatus === "INIT"){
			this.handleEvaluatorResults(null);
		}

		if (this.state.runStatus === "FETCHING_RESULTS" || this.state.runStatus === "FETCHING_PARAMS") {
			spinner = <Spinner/>;
		}
		else {
			spinner = null;
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


		return (
			<div style={{textAlign: "center"}}>

				<div style={{fontSize: "1.125em", fontWeight: 600, maxWidth: "1080px", margin: "0 auto", padding: "6px 4px 0px 4px"}}>
					Price Distribution - Enter your farm information to evaluate market prices......
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
						<ReactSelect styles={ReactSelectStyles}
												 classes={classes}
												 textFieldProps={{
													 label: "Month",
													 InputLabelProps: {
														 shrink: true,
													 },
												 }}
												 components={components}
												 placeholder="Select"
												 value={this.state.cropSelValue}
												 options={cropOptions}
												 onChange={this.handleReactSelectChange("month")}
												 inputProps={{
													 name: "month",
													 id: "month-simple",
												 }}/>
					</FormControl>

					<br/>
					<Grid container spacing={3} style={{display: "flex", alignItems: "center"}}>
						<Grid item xs />
						<Grid item xs={6} >
							<Button variant="contained" color="primary" onClick={this.runEvaluator}
											disabled={!this.validateInputs()}
											style={{fontSize: "large", backgroundColor: "#455A64"}}>
								<Icon className={classes.leftIcon}> send </Icon>
								Run
							</Button>
						</Grid>
						<Grid item xs />
					</Grid>

					{spinner}

				</div>
				<br/>
				<div style={{fontSize: "1.0em", fontWeight: 600, maxWidth: "1085px", margin: "0 auto", padding: "6px 0px 0px 0px"}}>
					This tool does ........
				</div>

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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PriceDistributionInputs));
