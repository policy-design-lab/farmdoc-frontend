import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {HorizontalBar} from "react-chartjs-2";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";

import {roundResults} from "../public/utils.js";
import {
	expectedPayoutTooltip,
	likelihoodTableToolTip,
	simulatedPriceTableToolTip,
	simulatedYieldTableToolTip,
	simulationGraphToolTip
} from "../app.messages";
import ToolTip from "@material-ui/core/Tooltip";
import "../styles/main.css";
import config from "../app.config";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

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
	}
});

const ChartTableCell = withStyles({
	root: {
		borderRightStyle: "solid",
		borderRightWidth: 0,
		borderRightColor: "rgb(144,144,144)",
		paddingRight: 0,
		borderBottomWidth: 0,
		maxWidth: 340,
		paddingLeft: 10
	}
})(TableCell);

const TableCellWithTable = withStyles({
	root: {
		borderStyle: "none",
		borderWidth: 0,
		borderColor: "rgb(144,144,144)",
		padding: "0 0 0 0 !important"
	}
})(TableCell);

const TableCellDefaultStyles = withStyles({
	root: {
		borderStyle: "solid",
		borderTopWidth: 0,
		borderRightWidth: 1,
		borderLeftWidth: 0,
		borderBottomWidth: 1,
		borderColor: "rgb(144,144,144)",
		textAlign: "center",
		width: "90px",
		paddingLeft: "3px !important",
		paddingRight: "3px !important"
	}
})(TableCell);

const TableCellRightMostStyles = withStyles({
	root: {

		borderTopWidth: 0,
		borderRightWidth: 0,
		borderLeftWidth: 0,
		borderBottomWidth: 1
	}
})(TableCellDefaultStyles);

const TableCellBottomMostStyles = withStyles({
	root: {

		borderTopWidth: 0,
		borderRightWidth: 1,
		borderLeftWidth: 0,
		borderBottomWidth: 0
	}
})(TableCellDefaultStyles);


const TableCellHeader = withStyles({
	root: {
		color: "rgba(0, 0, 0, 0.54)",
		fontFamily: "Roboto",
		fontSize: "0.75rem",
		fontWeight: "500",
		borderTopWidth: 0,
		borderBottomWidth: 1,
		borderRightWidth: 1

	}
})(TableCellDefaultStyles);


const CommonTableCell = withStyles({
	root: {
		fontWeight: "bolder"
	}
})(TableCellDefaultStyles);

const RightMostTableCell = withStyles({
	root: {
		fontWeight: "bolder"
	}
})(TableCellRightMostStyles);

const BottomMostTableCell = withStyles({
	root: {
		fontWeight: "bolder"
	}
})(TableCellBottomMostStyles);

const coloredBg = {backgroundColor: "WhiteSmoke"};

class PremiumResults extends Component {


	constructor(props) {
		super(props);
	}


	componentWillUnmount() {
		this.props.handlePremiumResults(null);
	}

	render() {
		const {classes} = this.props;
		console.log(this.props);

		let years = [];
		let prices = [];
		let yields = [];
		let arc = [];
		let plc = [];
		let probArc = [];
		let probPlc = [];
		let yieldUnits = "";
		//TODO: Fetch from config
		let coverageLevels = ["50", "55", "60", "65", "70", "75", "80", "85"];
		let premiumRows = [];
		let jsonData = null;

		if (this.props.hasOwnProperty("premResults") && this.props["premResults"] !== null) {
			jsonData = this.props["premResults"];
		}
		// else { //Uncomment to test with static response
		// 	jsonData = "{\"premiums\": {\"50\": {\"rp-opt\": 3.7, \"rp-basic\": 2.44, \"rp-enterprise\": 1.48, \"rphpe-opt\": 2.74, \"rphpe-basic\": 1.71, \"rphpe-enterprise\": 1.04, \"yp-opt\": 3.16, \"yp-basic\": 2.06, \"yp-enterprise\": 1.25}, \"55\": {\"rp-opt\": 5.43, \"rp-basic\": 3.66, \"rp-enterprise\": 2.03, \"rphpe-opt\": 3.96, \"rphpe-basic\": 2.52, \"rphpe-enterprise\": 1.4, \"yp-opt\": 4.59, \"yp-basic\": 3.06, \"yp-enterprise\": 1.7}, " +
		// 		"\"60\": {\"rp-opt\": 7.01, \"rp-basic\": 4.85, \"rp-enterprise\": 2.63, \"rphpe-opt\": 5.01, \"rphpe-basic\": 3.32, \"rphpe-enterprise\": 1.77, \"yp-opt\": 5.9, \"yp-basic\": 4.01, \"yp-enterprise\": 2.23}, \"65\": {\"rp-opt\": 10.36, \"rp-basic\": 7.25, \"rp-enterprise\": 3.4, \"rphpe-opt\": 7.31, \"rphpe-basic\": 4.81, \"rphpe-enterprise\": 2.21, \"yp-opt\": 8.57, \"yp-basic\": 5.91, \"yp-enterprise\": 2.88}, " +
		// 		"\"70\": {\"rp-opt\": 13.83, \"rp-basic\": 10.04, \"rp-enterprise\": 4.75, \"rphpe-opt\": 9.79, \"rphpe-basic\": 6.6, \"rphpe-enterprise\": 3.08, \"yp-opt\": 11.12, \"yp-basic\": 7.83, \"yp-enterprise\": 3.82}, \"75\": {\"rp-opt\": 19.19, \"rp-basic\": 14.34, \"rp-enterprise\": 7.12, \"rphpe-opt\": 13.67, \"rphpe-basic\": 9.44, \"rphpe-enterprise\": 4.61, \"yp-opt\": 15.2, \"yp-basic\": 10.87, \"yp-enterprise\": 5.55}, " +
		// 		"\"80\": {\"rp-opt\": 28.81, \"rp-basic\": 22.04, \"rp-enterprise\": 12.63, \"rphpe-opt\": 21.17, \"rphpe-basic\": 14.93, \"rphpe-enterprise\": 8.26, \"yp-opt\": 22.87, \"yp-basic\": 16.62, \"yp-enterprise\": 9.95}, \"85\": {\"rp-opt\": 42.82, \"rp-basic\": 33.72, \"rp-enterprise\": 23.84, \"rphpe-opt\": 31.96, \"rphpe-basic\": 23.34, \"rphpe-enterprise\": 15.98, \"yp-opt\": 33.62, \"yp-basic\": 24.93, \"yp-enterprise\": 18.38}}, " +
		// 		"\"guarantees\": {\"50\": {\"rp\": 330, \"rphpe\": 330, \"yp\": 82}, \"55\": {\"rp\": 363, \"rphpe\": 363, \"yp\": 91}, \"60\": {\"rp\": 396, \"rphpe\": 396, \"yp\": 99}, \"65\": {\"rp\": 429, \"rphpe\": 429, \"yp\": 107}, \"70\": {\"rp\": 462, \"rphpe\": 462, \"yp\": 115}, \"75\": {\"rp\": 495, \"rphpe\": 495, \"yp\": 124}, \"80\": {\"rp\": 528, \"rphpe\": 528, \"yp\": 132}, \"85\": {\"rp\": 561, \"rphpe\": 561, \"yp\": 140}}}";
		// }


		let rowElems = [];

		if (jsonData !== null) {
			let objData = JSON.parse(jsonData);
			if (objData.premiums !== null && objData.guarantees !== null) {
				let premiums = objData.premiums;
				let guarantees = objData.guarantees;

				coverageLevels = Object.keys(objData.premiums);

				let i = 1;
				let len = coverageLevels.length;
				coverageLevels.forEach(function(cov){
					if (i < len) {
						rowElems.push(
							<TableRow key={`childRowArc-${i}`}>
								<CommonTableCell style={{fontWeight: "bold"}}>{cov}%</CommonTableCell>

								<CommonTableCell style={coloredBg}>{premiums[cov]["rp-enterprise"]}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{premiums[cov]["rp-basic"]}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{premiums[cov]["rp-opt"]}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{guarantees[cov]["rp"]}</CommonTableCell>

								<CommonTableCell>{premiums[cov]["rp-enterprise"]}</CommonTableCell>
								<CommonTableCell>{premiums[cov]["rp-basic"]}</CommonTableCell>
								<CommonTableCell>{premiums[cov]["rp-opt"]}</CommonTableCell>
								<CommonTableCell>{guarantees[cov]["rp"]}</CommonTableCell>

								<CommonTableCell style={coloredBg}>{premiums[cov]["rp-enterprise"]}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{premiums[cov]["rp-basic"]}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{premiums[cov]["rp-opt"]}</CommonTableCell>
								<RightMostTableCell style={coloredBg}>{guarantees[cov]["rp"]}</RightMostTableCell>
							</TableRow>
						);
					}
					else {
						rowElems.push(
							<TableRow key={`childRowArc-${i}`}>
								<BottomMostTableCell style={{fontWeight: "bold"}}>{cov}%</BottomMostTableCell>

								<BottomMostTableCell style={coloredBg}>{premiums[cov]["rp-enterprise"]}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{premiums[cov]["rp-basic"]}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{premiums[cov]["rp-opt"]}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{guarantees[cov]["rp"]}</BottomMostTableCell>

								<BottomMostTableCell>{premiums[cov]["rp-enterprise"]}</BottomMostTableCell>
								<BottomMostTableCell>{premiums[cov]["rp-basic"]}</BottomMostTableCell>
								<BottomMostTableCell>{premiums[cov]["rp-opt"]}</BottomMostTableCell>
								<BottomMostTableCell>{guarantees[cov]["rp"]}</BottomMostTableCell>

								<BottomMostTableCell style={coloredBg}>{premiums[cov]["rp-enterprise"]}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{premiums[cov]["rp-basic"]}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{premiums[cov]["rp-opt"]}</BottomMostTableCell>
								<BottomMostTableCell style={{borderRightWidth: 0, backgroundColor: "WhiteSmoke", borderBottomRightRadius: "15px"}}>
									{guarantees[cov]["rp"]}</BottomMostTableCell>
							</TableRow>
						);
					}
					i++;
				});

				console.log(objData.premiums["50"]["rp-opt"]);
			}

			return (
				<div style={{padding: 4, display:"inline-block"}}>

					<Table className={classes.table}>
						<TableBody>
							<TableRow style={{height: "64px"}}>
								<TableCellHeader className="table-header-insurance" colspan={1} rowSpan={2} style={{width: "150px"}}>Coverage Level</TableCellHeader>
								<TableCellHeader className="table-header-insurance" colspan={4} rowSpan={1} style={coloredBg}>Revenue Protection</TableCellHeader>
								<TableCellHeader className="table-header-insurance" colspan={4} rowSpan={1}>Revenue Protection With Harvest Price Exclusion</TableCellHeader>
								<TableCellHeader className="table-header-insurance" colspan={4} rowSpan={1} style={{borderRightWidth: 0, backgroundColor: "WhiteSmoke", borderTopRightRadius: "15px"}}>
									Yield Protection</TableCellHeader>
							</TableRow>
							<TableRow style={{height: "64px"}}>
								<TableCellHeader className="table-header-tooltip" style={coloredBg}>Enterprise</TableCellHeader>
								<TableCellHeader className="table-header-tooltip" style={coloredBg}>Basic</TableCellHeader>
								<TableCellHeader className="table-header-tooltip" style={coloredBg}>Optional</TableCellHeader>
								<TableCellHeader className="table-header-tooltip" style={coloredBg}>Min. Revenue Guarantee</TableCellHeader>

								<TableCellHeader className="table-header-tooltip">Enterprise</TableCellHeader>
								<TableCellHeader className="table-header-tooltip">Basic</TableCellHeader>
								<TableCellHeader className="table-header-tooltip">Optional</TableCellHeader>
								<TableCellHeader className="table-header-tooltip">Min. Revenue Guarantee</TableCellHeader>

								<TableCellHeader className="table-header-tooltip" style={coloredBg}>Enterprise</TableCellHeader>
								<TableCellHeader className="table-header-tooltip" style={coloredBg}>Basic</TableCellHeader>
								<TableCellHeader className="table-header-tooltip" style={coloredBg}>Optional</TableCellHeader>
								<TableCellHeader className="table-header-tooltip" style={{borderRightWidth: 0, backgroundColor: "WhiteSmoke"}}>Min. Revenue Guarantee</TableCellHeader>
							</TableRow>

							{rowElems}
						</TableBody>
					</Table>


				</div>
			);
		}
		else {
			return (
				<div> </div>
			);
		}
	}
}

const mapStateToProps = (state) => {
	return {
		premResults: state.insPremiums.premResults
	};
};

export default connect(mapStateToProps, null)(withStyles(styles)(PremiumResults));
