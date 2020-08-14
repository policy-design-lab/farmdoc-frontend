import React, {Component} from "react";
import ReactSelect from "react-select";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {FormControl} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Spinner from "./Spinner";
import {
	getCropCodes,
	getMonthCodes,
	getYearCodes,
	getOutputFileJson
} from "../public/utils";
import {
	datawolfURL,
	postExecutionPdRequest,
	resultDatasetPdId,
	stepsPd,
} from "../datawolf.config";
import {
	//handleFuturesCode,
	handlePDResults
} from "../actions/priceDistribution";
import config from "../app.config";
import {
	apiresult
} from "../app.messages";
import FormLabel from "@material-ui/core/FormLabel";

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

class PriceDistributionInputsRun extends Component {
	state = {
		cropCode: null,
		monthCode: null,
		yearCode: null,
		futuresCode: "",
		runName: "",
		runStatus: "INIT",
		pdResults: null,
		showError: false,
		errorMsg: apiresult
	};

	constructor(props) {
		super(props);
		this.runPriceDistribution = this.runPriceDistribution.bind(this);
		this.handleReactSelectChange = this.handleReactSelectChange.bind(this);
		this.handlePDResults = this.handlePDResults.bind(this);
		//this.handleFuturesCode = this.handleFuturesCode.bind(this);

		this.state = {
			cropCode: {value: "C", label: "Corn"},
			monthCode: {value: "Z", label: "December"},
			yearCode: {value: "20", label: "2020"},
			futuresCode: "ZCZ20",
			runName: "",
			runStatus: "INIT",
			pdResults: null,
			showError: false,
			errorMsg: apiresult
		};
	}

	handleReactSelectChange = name => event => {
		this.setState({
			[name]: event.value}, function(){
			//TODO: Remove if not needed.
		});
		switch (name) {
			case "cropCode":
				if (event.value !== "") {
					this.setState({cropCode: {value: event.value, label: event.label}});

					let futuresCode = "Z" + `${event.value}${this.state.monthCode.value}${this.state.yearCode.value.slice(-2)}`;
					this.setState({futuresCode: futuresCode});
					console.log(futuresCode);
				}
				break;
			case "monthCode":
				if (event.value !== ""){
					this.setState({monthCode: {value: event.value, label: event.label}});

					let futuresCode = "Z" + `${this.state.cropCode.value}${event.value}${this.state.yearCode.value.slice(-2)}`;
					this.setState({futuresCode: futuresCode});
					console.log(futuresCode);
				}
				break;
			case "yearCode":
				if (event.value !== ""){
					this.setState({yearCode: {value: event.value, label: event.label}});

					let futuresCode = "Z" + `${this.state.cropCode.value}${this.state.monthCode.value}${event.value.slice(-2)}`;
					this.setState({futuresCode: futuresCode});
					console.log(futuresCode);
				}
				break;
		}
	};

	async runPriceDistribution() {
		let status = "INIT";
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

		let postRequest = postExecutionPdRequest(personId, title,
			this.state.cropCode.value,
			this.state.monthCode.value,
			"20".concat(this.state.yearCode.value));
		let body = JSON.stringify(postRequest);

		let pdResponse = await fetch(`${dwUrl}/executions`, {
			method: "POST",
			headers: kcHeaders,
			body: body
		});

		const pdExecutionGUID = await pdResponse.text();
		console.log(`With execution id = ${pdExecutionGUID}`);

		let pdResult = null;
		this.handlePDResults(null);
		// this.handleFuturesCode(this.state.futuresCode);

		const waitingStatus = ["QUEUED", "WAITING", "RUNNING"];

		while (this.state.runStatus === "INIT" || waitingStatus.indexOf(this.state.runStatus) >= 0) {
			await wait(300);
			const executionResponse = await fetch(`${dwUrl}/executions/${pdExecutionGUID}`, {
				method: "GET",
				headers: kcHeaders,
			});

			if (executionResponse instanceof Response) {
				try {
					pdResult = await executionResponse.json();
					if (typeof(pdResult) === "object") {
						this.setState({runStatus: pdResult.stepState[stepsPd.Price_Distribution]});
					}
					else {
						this.handlePDResults("");
						this.setState({runStatus: "ERROR_RESULTS"});
						this.setState({showError: true});
						this.setState({errorMsg: apiresult});
					}
				}
				catch (error) {
					this.setState({runStatus: "ERROR_RESULTS"});
					this.setState({showError: true});
					this.setState({errorMsg: apiresult});
					console.log("error getting the response from api");
				}
			}
		}
		// get json from result file
		if (pdResult) {
			const resultDatasetGuid = pdResult.datasets[resultDatasetPdId];
			const outputFilename = "output.json";
			if ((resultDatasetGuid !== "ERROR" && resultDatasetGuid !== undefined)) {
				getOutputFileJson(resultDatasetGuid, outputFilename).then(
					res => {
						this.handlePDResults(JSON.stringify(res));
						if (config.browserLog) {
							//console.log(JSON.stringify(res));
						}
						this.setState({showError: false});
					});
			}
			else {
				this.setState({runStatus: "PARSE_ERROR"});
				this.setState({showError: true});
				this.setState({errorMsg: apiresult});
			}
		}
		else {
			this.setState({runStatus: "API_ERROR"});
			console.log("no results from api");
			this.setState({errorMsg: apiresult});
		}
	}

	handlePDResults(results) {
		this.props.handlePDResults(results);
	}

	// handleFuturesCode(futurescode) {
	// 	this.props.handleFuturesCode(futurescode);
	// }

	validateInputs() {
		return this.state.cropCode !== "" && this.state.monthCode !== "" &&
			this.state.yearCode !== "";
	}

	render() {
		const {classes} = this.props;

		let spinner;

		if (this.state.runStatus === "INIT"){
			this.handlePDResults(null);
		}

		if (this.state.runStatus !== "INIT" && this.state.runStatus !== "FINISHED"
			&& this.state.runStatus !== "PARSE_ERROR" && this.state.runStatus !== "API_ERROR"
			&& this.state.runStatus !== "ERROR_RESULTS") {
			spinner = <Spinner/>;
		}

		return (
			<div style={{textAlign: "center"}}>
				<div style={{textAlign: "center"}}>
					<div style={{fontSize: "1.125em", fontWeight: 600, maxWidth: "1080px", margin: "0 auto", padding: "6px 4px 0px 4px"}}>
						Select crop, month and year of futures date.
					</div>
					<div style={{maxWidth: "1080px",
						borderRadius: "15px", borderStyle: "solid", boxShadow: " 0 2px 4px 0px", borderWidth: "1px",
						marginTop: "10px", marginRight: "15px", marginBottom: "15px", marginLeft: "15px",
						paddingBottom: "8px", paddingRight: "20px", paddingTop: "2px", paddingLeft: "10px",
						display: "inline-block"}}>
						<div style={{display: this.state.showError ? "block" : "none", paddingTop: 4, textAlign: "center"}}>
							<FormLabel component="legend" error={true}> {this.state.errorMsg}</FormLabel>
						</div>
						<FormControl className={classes.formControlXSmall} required>
							<ReactSelect styles={ReactSelectStyles}
										 classes={classes}
										 textFieldProps={{
											 label: "Crop",
											 InputLabelProps: {shrink: true},
										 }}
										 components={components}
										 placeholder="Select"
										 value={this.state.cropCode}
										 options={getCropCodes()}
										 onChange={this.handleReactSelectChange("cropCode")}
										 inputProps={{
											 name: "cropCode",
											 id: "crop-simple",
										 }}/>
						</FormControl>
						<FormControl className={classes.formControlSmall}>
							<ReactSelect styles={ReactSelectStyles}
										 classes={classes}
										 textFieldProps={{
											 label: "Month",
											 InputLabelProps: {shrink: true},
										 }}
										 components={components}
										 placeholder="Select"
										 value={this.state.monthCode}
										 options={getMonthCodes()}
										 onChange={this.handleReactSelectChange("monthCode")}
										 inputProps={{
											 name: "monthCode",
											 id: "month-simple",
										 }}/>
						</FormControl>
						<FormControl className={classes.formControlXSmall}>
							<ReactSelect styles={ReactSelectStyles}
										 classes={classes}
										 textFieldProps={{
											 label: "Year",
											 InputLabelProps: {shrink: true},
										 }}
										 components={components}
										 placeholder="Select"
										 value={this.state.yearCode}
										 options={getYearCodes()}
										 onChange={this.handleReactSelectChange("yearCode")}
										 inputProps={{
											 name: "yearCode",
											 id: "year-simple",
										 }}/>
						</FormControl>
						<br/>
						<Grid container spacing={0} style={{display: "flex", alignItems: "center"}}>
							<Grid item xs />
							<Grid item xs={6} >
								<Button variant="contained" color="primary" onClick={this.runPriceDistribution}
										disabled={!this.validateInputs()}
										style={{fontSize: "large", backgroundColor: "#455A64"}}>
									<Icon className={classes.leftIcon}> send </Icon>
									Run
								</Button>
							</Grid>
							{spinner}
							<Grid item xs />
						</Grid>
					</div>
				</div>
			</div>
		);
	}
}

// You should declare that a prop is a specific JS type.
// See https://reactjs.org/docs/typechecking-with-proptypes.html for details
PriceDistributionInputsRun.propTypes = {
	//handleFuturesCode: PropTypes.func.isRequired,
	handlePDResults: PropTypes.func.isRequired,
	classes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object
	]),
};

inputComponent.propTypes = {
	inputRef: PropTypes.oneOfType([
		// Either a function
		PropTypes.func,
		// Or the instance of a DOM native element
		PropTypes.shape({current: PropTypes.instanceOf(Element)})
	]),
};

Control.propTypes = {
	inputRef: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({current: PropTypes.instanceOf(Element)})
	]),
	innerRef: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({current: PropTypes.instanceOf(Element)})
	]),
	children: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.array
	]),
	innerProps: PropTypes.object,
	classes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object
	]),
	textFieldProps: PropTypes.object,
	selectProps: PropTypes.object
};

const mapStateToProps = state => ({
	//futuresCode: state.futuresCode,
	pdResults: state.pdResults
});

const mapDispatchToProps = dispatch => ({
	//handleFuturesCode: futuresCode => dispatch(handleFuturesCode(futuresCode)),
	handlePDResults: pdResults => dispatch(handlePDResults(pdResults))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PriceDistributionInputsRun));
