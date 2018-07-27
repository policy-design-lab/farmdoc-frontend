import React, {Component} from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {ID, getOutputFileJson} from "../public/utils";
import {datawolfURL, postExecutionRequest, steps, resultDatasetId} from "../datawolf.config";
import { handleResults} from "../actions/analysis";

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const styles = theme => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
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
	}
});

class FDRunModel extends Component {

	constructor(props){
		super(props);
		this.runModel =this.runModel.bind(this);

		this.state = {
			program:"both",
			commodity: "Corn",
			refprice: 3.7,
			acres: .85,
			seqprice: 0.0,
			coverage: .85,
			paymentYield: 120,
			range: .1,
			runName:"",
			runStatus: ""
		};
	}

	state = {
		program:"both",
		commodity: "Corn",
		refprice: 3.7,
		acres: .85,
		seqprice: 0.0,
		coverage: .85,
		paymentYield: 120,
		range: .1,
		runName:"",
		runStatus: ""
	};


	async runModel(){
		//let status = "STARTED";
		//let personId = sessionStorage.getItem("personId");
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

		let postRequest = postExecutionRequest("", title);

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

		let modelResult;

		while(this.state.runStatus === "" || this.state.runStatus === "WAITING" || this.state.runStatus === "RUNNING") {
			await wait(300); // is this necessary?
			const executionResponse = await fetch(`${dwUrl}/executions/${modelExecutionGUID}`, {
				method: "GET",
				headers: headers,
				credentials: "include"
			});

			if (executionResponse instanceof Response) {
				modelResult = await executionResponse.json();
				this.setState({runStatus: modelResult.stepState[steps.Farm_Model]});
			}
		}

		const resultDatasetGuid = modelResult.datasets[resultDatasetId];
		const outputFilename = "output.json";
		if ((resultDatasetGuid !== "ERROR" && resultDatasetGuid !== undefined)){
			//let json = getOutputFileJson(resultDatasetGuid, outputFilename);

			getOutputFileJson(resultDatasetGuid, outputFilename).then(res => {console.log(JSON.stringify(res.json()));});
			// getOutputFileJson(resultDatasetGuid, outputFilename).then(function(result){
			// 	//this.props.handleResults(result);
			// });


			let pqr = 1;
			//console.log(`Response Json ${json}`);
		}

	}


	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleChanger = event => {
		this.setState({ program: event.target.value });
	};

	render(){
		const { classes } = this.props;

		return(
			<div style={{margin:"50px"}}>
				<FormLabel component="legend">Program</FormLabel>
				<RadioGroup style={{ display: "flex",  flexDirection:"row" }}
							name="program"
							//className={classes.group}
							value={this.state.program}
							onChange={this.handleChange("program")}>

					<FormControlLabel value="arc" control={<Radio />} label="ARC" />
					<FormControlLabel value="plc" control={<Radio />} label="PLC" />
					<FormControlLabel value="both" control={<Radio />} label="Both" />

				</RadioGroup>

				<TextField
					required
					id="runName"
					label="Simulation Name"
					value={this.state.runName}
					margin="normal"
					onChange={this.handleChange("runName")}
					style={{width:"350px"}}
					helperText="Identifier for the Simulation Results "
				/>
				<br/>
				<TextField
					id="Commodity"
					label="Commodity"
					value={this.state.commodity}
					margin="normal"
					disabled="true"
				/>

				<TextField
					id="refPrice"
					label="Reference Price"
					value={this.state.refprice}
					className={classes.textField}
					margin="normal"
					onChange={this.handleChange("refprice")}
					InputProps={{
						startAdornment: <InputAdornment position="start">$</InputAdornment>,
					}}

				/> <br/>

				<TextField
					id="paymentYield"
					label="PLC Payment Yield"

					value={this.state.paymentYield}
					margin="normal"
					style={{width:"200px"}}
					onChange={this.handleChange("paymentYield")}

					InputProps={{
						endAdornment: <InputAdornment position="end">bushels/acre</InputAdornment>
					}}
					// endAdornment={<InputAdornment position="end">bushels/acre</InputAdornment>}
				/><br/>

				<TextField
					id="acres"
					label="Payment Acres"
					value={this.state.acres}
					margin="normal"
					style={{width:"160px"}}
					onChange={this.handleChange("acres")}
					disabled="true"
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
					onChange={this.handleChange("coverage")}
					disabled="true"
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

					onChange={this.handleChange("range")}
					InputProps={{
						endAdornment: <InputAdornment position="end">%</InputAdornment>,
					}}
				/>
				<br/><br/>
				<Button variant="contained" color="primary" onClick={this.runModel}>

					<Icon className={classes.leftIcon}> send </Icon>
					Run Model
				</Button>
			</div>
		);
	}

}

export default withStyles(styles)(FDRunModel);
