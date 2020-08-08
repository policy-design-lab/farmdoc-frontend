import React, {Component} from "react";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import {FormControl} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {
	getOutputFileJson,
} from "../public/utils";
import {
	datawolfURL,
	postExecutionPdRequest,
	resultDatasetPdId,
	stepsPd,
} from "../datawolf.config";
import {
	handlePDResults
} from "../actions/priceDistribution";
import Spinner from "./Spinner";
import config from "../app.config";
import {
	dataNotAvailable
} from "../app.messages";
import ReactSelect from "react-select";

import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";

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

class PriceDistributionModel extends Component {
	state = {
		cropCode: "",
		monthCode: "",
		year: "",
		runName: "",
		runStatus: "INIT",
		pdResults: null,
		showError: false,
		errorMsg: dataNotAvailable
	};

	constructor(props) {
		super(props);
		this.runPriceDistribution = this.runPriceDistribution.bind(this);
		this.handleReactSelectChange = this.handleReactSelectChange.bind(this);
		this.handlePDResults = this.handlePDResults.bind(this);

		this.state = {
			cropCode: "C",
			monthCode: "Z",
			year: "2021",
			runName: "",
			runStatus: "INIT",
			pdResults: null,
			showError: false,
			errorMsg: dataNotAvailable
		};
	}

	handleReactSelectChange = name => event => {
		this.setState({
			[name]: event.value}, function(){
		});
	};

	async runPriceDistribution() {
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

		let cropCode, monthCode, year;
		cropCode = this.state.cropCode;
		monthCode = this.state.monthCode;
		year = this.state.year;

		let postRequest = postExecutionPdRequest(personId, title, cropCode, monthCode, year);
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

		const waitingStatus = ["QUEUED", "WAITING", "RUNNING"];

		while (this.state.runStatus === "" || waitingStatus.indexOf(this.state.runStatus) >= 0) {
			await wait(300);
			const executionResponse = await fetch(`${dwUrl}/executions/${pdExecutionGUID}`, {
				method: "GET",
				headers: kcHeaders,
			});

			if (executionResponse instanceof Response) {
				try {
					pdResult = await executionResponse.json();
					if (typeof(pdResult) === "object") {
						this.handlePDResults(JSON.stringify(pdResult));
						this.setState({runStatus: pdResult.stepState[stepsPd.Price_Distribution]});
					}
					else {
						this.handlePDResults("");
						this.setState({runStatus: "ERROR_RESULTS"});
					}
				}
				catch (error) {
					this.setState({runStatus: "ERROR_RESULTS"});
					this.setState({showError: true});
					this.setState({errorMsg: dataNotAvailable});
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
				this.setState({errorMsg: dataNotAvailable});
			}
		}
		else {
			console.log("no results from api");
			this.setState({errorMsg: dataNotAvailable});
		}
	}

	handlePDResults(results) {
		this.props.handlePDResults(results);
	}

	validateInputs() {
		return 0;
	}

	render() {
		const {classes} = this.props;

		let textFieldInputStyle = {style: {paddingLeft: 8}};
		let spinner;

		if (this.state.runStatus === "INIT"){
			this.handlePDResults(null);
		}

		if (this.state.runStatus === "FETCHING_RESULTS") {
			spinner = <Spinner/>;
		}
		else {
			spinner = null;
		}

		return (
			<div style={{textAlign: "center"}}>
				<div style={{textAlign: "center"}}>
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
						<Grid item xs />
					</Grid>
					{spinner}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	pdResults: state.pdResults
});

const mapDispatchToProps = dispatch => ({
	handlePDResults: pdResults => dispatch(handlePDResults(pdResults)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PriceDistributionModel));
