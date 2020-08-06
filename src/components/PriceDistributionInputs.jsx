import React, {Component} from "react";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import {FormControl} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {
	handlePriceDistributionResults
} from "../actions/priceDistribution";
import Spinner from "./Spinner";
import config from "../app.config";
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

class PriceDistributionInputs extends Component {
	state = {
		runStatus: "INIT",
		premResults: null,
	};

	constructor(props) {
		super(props);
		this.runPriceDistribution = this.runPriceDistribution.bind(this);
		this.handleReactSelectChange = this.handleReactSelectChange.bind(this);
		this.handlePriceDistributionResults = this.handlePriceDistributionResults.bind(this);

		//TODO: Cleanup states that are not needed
		this.state = {
			runStatus: "INIT",
			premResults: null,
		};
	}

	handleReactSelectChange = name => event => {
		this.setState({
			[name]: event.value}, function(){
		});
	};

	async runPriceDistribution() {
		//let status = "STARTED";
		// let personId = localStorage.getItem("dwPersonId");
		let email = localStorage.getItem("kcEmail");
		let token = localStorage.getItem("kcToken");
		let token_header = `Bearer ${token}`;

		let kcHeaders = {
			"Authorization": token_header
		};

		let pdResult = "";
		this.handlePriceDistributionResults(null);
		this.setState({runStatus: "FETCHING_RESULTS"});

		let priceDistributorUrl = new URL(`${config.apiUrl }/compute/simulator`);
		let priceDistributorParams = [
			["email", email]
			//		TODO: Remove grossTarget here when api is fixed to make this param optional
		];

		priceDistributorUrl.search = new URLSearchParams(priceDistributorParams).toString();

		const priceDistributorResponse = await fetch(priceDistributorUrl, {
			method: "GET",
			headers: kcHeaders,
		});

		if (priceDistributorResponse instanceof Response) {
			try {
				pdResult = await priceDistributorResponse.json();
				if (typeof(pdResult) === "object") {
					this.handlePriceDistributionResults(JSON.stringify(pdResult));
					this.setState({runStatus: "FETCHED_RESULTS"});
				}
				else {
					this.handlePriceDistributionResults("");
					this.setState({runStatus: "ERROR_RESULTS"});
				}
			}
			catch (error) {
				this.setState({runStatus: "ERROR_RESULTS"});
				console.log("error getting the response from flask api");
			}
		}
	}

	handlePriceDistributionResults(results) {
		this.props.handlePriceDistributionResults(results);
	}

	validateInputs() {
		return 1;
	}

	render() {
		const {classes} = this.props;

		let textFieldInputStyle = {style: {paddingLeft: 8}};
		let spinner;

		if (this.state.runStatus === "INIT"){
			this.handlePriceDistributionResults(null);
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
					<Grid container spacing={3} style={{display: "flex", alignItems: "center"}}>
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
	priceDistributionResults: state.priceDistributionResults
});

const mapDispatchToProps = dispatch => ({
	handlePriceDistributionResults: PriceDistributionResults => dispatch(handlePriceDistributionResults(PriceDistributionResults)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PriceDistributionInputs));
