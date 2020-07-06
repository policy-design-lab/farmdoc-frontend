import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import "../styles/main.css";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = theme => ({
	root: {
		width: "auto",
		marginTop: theme.spacing.unit * 3,
		overflowX: "auto",
		borderColor: "black"
	},

	table: {
		padding: 2,
		width: "auto",
		borderRadius: 15,
		borderStyle: "solid",
		borderColor: "rgb(144,144,144)",
		borderWidth: 1,
		borderCollapse: "separate"
	},

	tableCell: {},

	paper: {
		position: "absolute",
		paddingTop: "0px",
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		outline: "none"
	},
	textField: {
		marginLeft: theme.spacing.unit * 1,
		marginRight: theme.spacing.unit * 1,
		// border: 1,
		width: 70,
	}
});

class PriceDistributionResults extends Component {

	constructor(props) {
		super(props);
	}


	render() {
		const {classes} = this.props;

		let policyJsonData, countyJsonData;

		if (this.props["premResults"] || this.props["countyProductsResults"] ) {
			policyJsonData = this.props["premResults"];
			countyJsonData = this.props["countyProductsResults"];
		}
		else { //Uncomment to test with static response
			policyJsonData = "{\"premiums\": {\"50\": {\"rp-opt\": 8.7, \"rp-basic\": 2.44, \"rp-enterprise\": 1.48, \"rphpe-opt\": 2.74, \"rphpe-basic\": 1.71, \"rphpe-enterprise\": 1.04, \"yp-opt\": 3.16, \"yp-basic\": 2.06, \"yp-enterprise\": 1.25}, \"55\": {\"rp-opt\": 5.43, \"rp-basic\": 3.66, \"rp-enterprise\": 2.03, \"rphpe-opt\": 3.96, \"rphpe-basic\": 2.52, \"rphpe-enterprise\": 1.4, \"yp-opt\": 4.59, \"yp-basic\": 3.06, \"yp-enterprise\": 1.7}, " +
				"\"60\": {\"rp-opt\": 7.01, \"rp-basic\": 4.85, \"rp-enterprise\": 2.63, \"rphpe-opt\": 5.01, \"rphpe-basic\": 3.32, \"rphpe-enterprise\": 1.77, \"yp-opt\": 5.9, \"yp-basic\": 4.01, \"yp-enterprise\": 2.23}, \"65\": {\"rp-opt\": 10.36, \"rp-basic\": 7.25, \"rp-enterprise\": 3.4, \"rphpe-opt\": 7.31, \"rphpe-basic\": 4.81, \"rphpe-enterprise\": 2.21, \"yp-opt\": 8.57, \"yp-basic\": 5.91, \"yp-enterprise\": 2.88}, " +
				"\"70\": {\"rp-opt\": 13.83, \"rp-basic\": 10.04, \"rp-enterprise\": 4.75, \"rphpe-opt\": 9.79, \"rphpe-basic\": 6.6, \"rphpe-enterprise\": 3.08, \"yp-opt\": 11.12, \"yp-basic\": 7.83, \"yp-enterprise\": 3.82}, \"75\": {\"rp-opt\": 19.19, \"rp-basic\": 14.34, \"rp-enterprise\": 7.12, \"rphpe-opt\": 13.67, \"rphpe-basic\": 9.44, \"rphpe-enterprise\": 4.61, \"yp-opt\": 15.2, \"yp-basic\": 10.87, \"yp-enterprise\": 5.55}, " +
				"\"80\": {\"rp-opt\": 28.81, \"rp-basic\": 22.04, \"rp-enterprise\": 12.63, \"rphpe-opt\": 21.17, \"rphpe-basic\": 14.93, \"rphpe-enterprise\": 8.26, \"yp-opt\": 22.87, \"yp-basic\": 16.62, \"yp-enterprise\": 9.95}, \"85\": {\"rp-opt\": 42.82, \"rp-basic\": 33.72, \"rp-enterprise\": 23.84, \"rphpe-opt\": 31.96, \"rphpe-basic\": 23.34, \"rphpe-enterprise\": 15.98, \"yp-opt\": 33.62, \"yp-basic\": 24.93, \"yp-enterprise\": 18.38}}, " +
				"\"guarantees\": {\"50\": {\"rp\": 330, \"rphpe\": 330, \"yp\": 82}, \"55\": {\"rp\": 363, \"rphpe\": 363, \"yp\": 91}, \"60\": {\"rp\": 396, \"rphpe\": 396, \"yp\": 99}, \"65\": {\"rp\": 429, \"rphpe\": 429, \"yp\": 107}, \"70\": {\"rp\": 462, \"rphpe\": 462, \"yp\": 115}, \"75\": {\"rp\": 495, \"rphpe\": 495, \"yp\": 124}, \"80\": {\"rp\": 528, \"rphpe\": 528, \"yp\": 132}, \"85\": {\"rp\": 561, \"rphpe\": 561, \"yp\": 140}}}";

			countyJsonData = "{\"premiums\": {\"70\": {\"rp\": 6.91 , \"rphpe\": 4.11 , \"yp\": 5.8},\"75\": {\"rp\": 8.32 , \"rphpe\": 5.82 , \"yp\": 6.82},\"80\": {\"rp\": 9.56 , \"rphpe\": 6.74 , \"yp\": 7.18},\"85\": {\"rp\": 12.31 , \"rphpe\": 9.63 , \"yp\": 12.27},\"90\": {\"rp\": 17.64 , \"rphpe\": 12.12 , \"yp\": 16.6} }," +
				"\"guarantees\": {\"70\": {\"rp\": 491 , \"rphpe\": 491 , \"yp\": 123},\"75\": {\"rp\": 527 , \"rphpe\": 527 , \"yp\": 132},\"80\": {\"rp\": 564 , \"rphpe\": 564 , \"yp\": 138},\"85\": {\"rp\": 586 , \"rphpe\": 586 , \"yp\": 147},\"90\": {\"rp\": 654 , \"rphpe\": 654 , \"yp\": 155}}}";
		}


		if (policyJsonData !== null || countyJsonData !== null) {

			return (
				<div style={{padding: 4, display: "inline-block"}} >

					Graph and Table go here
					<Divider/>
					Graph and Table go here
					<Divider/>
					<span style={{fontWeight: "bold"}}>
							Enter Price to Evaluate:
					</span>
					<TextField
							id="priceEval"
							className={classes.textField}
							InputProps={{
								startAdornment: <InputAdornment
										position="start">$</InputAdornment>,
							}}
							margin="normal"
							variant="outlined"
					/>
				</div>
			);
		}
		else {
			return (
				<div />
			);
		}
	}
}

const mapStateToProps = (state) => {
	return {
		premResults: state.insPremiums.premResults,
		countyProductsResults: state.insPremiums.countyProductsResults
	};
};

export default connect(mapStateToProps, null)(withStyles(styles)(PriceDistributionResults));
