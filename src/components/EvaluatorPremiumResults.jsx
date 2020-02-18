import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {
	FormControl,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@material-ui/core";
import {roundResults} from "../public/utils.js";
import "../styles/main.css";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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
		borderRightWidth: 1,
		width: "30px"

	}
})(TableCellDefaultStyles);


const CommonTableCell = withStyles({
	root: {
		fontSize: "1.15em"
	}
})(TableCellDefaultStyles);

const RightMostTableCell = withStyles({
	root: {
		fontSize: "1.15em"
	}
})(TableCellRightMostStyles);

const BottomMostTableCell = withStyles({
	root: {
		fontSize: "1.15em"
	}
})(TableCellBottomMostStyles);

const coloredBg = {backgroundColor: "WhiteSmoke"};

class EvaluatorPremiumResults extends Component {
	state = {
		unit: "Basic"
	};

	constructor(props) {
		super(props);

		this.state = {
			unit: "Basic"
		};
	}

	handleChange = name => event => {
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

	componentWillUnmount() {
		// this.props.handlePremiumResults(null);
	}


	render() {
		const {classes} = this.props;
		//TODO: Fetch from config
		// let coverageLevels = ["50", "55", "60", "65", "70", "75", "80", "85"];

		let units = "bu/acre"; //TODO: Get from crop input of api

		let evalResult = null;

		if (this.props.hasOwnProperty("evalJson") && this.props.hasOwnProperty("evalJson") !== null) {
			evalResult = this.props["evalJson"];
		}

		let farmPolicyRows = [];
		let countyProductsRows = [];
		let expectedYield = 0;

		if (evalResult !== null) {
			let evalResultJson = evalResult;
			let premiums = evalResultJson.policies.farm;

			let coverageLevels = Object.keys(premiums);

			let i = 1;
			let len = coverageLevels.length;
			coverageLevels.forEach(function(cov){
				if (i < len) {
					farmPolicyRows.push(
						<TableRow key={`childRowArc-${i}`}>
							<CommonTableCell style={{fontWeight: "bold"}}>{cov}%</CommonTableCell>

							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["est-premium"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["avg-payment"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["freq-payment"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["net-cost"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["avg-gross-rev"], 2)}</CommonTableCell>

							<CommonTableCell style={{}} >{roundResults(premiums[cov]["rp-basic"]["est-premium"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov]["rp-basic"]["avg-payment"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov]["rp-basic"]["freq-payment"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov]["rp-basic"]["net-cost"], 2)}</CommonTableCell>
							<CommonTableCell style={{}}>{roundResults(premiums[cov]["rp-basic"]["avg-gross-rev"], 2)}</CommonTableCell>

							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["est-premium"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["avg-payment"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["freq-payment"], 2)}</CommonTableCell>
							<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["net-cost"], 2)}</CommonTableCell>
							<RightMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["avg-gross-rev"], 2)}</RightMostTableCell>

						</TableRow>
					);
				}
				else {
					farmPolicyRows.push(
						<TableRow key={`childRowArc-${i}`}>

							<BottomMostTableCell style={{fontWeight: "bold"}}>{cov}%</BottomMostTableCell>

							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["est-premium"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["avg-payment"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["freq-payment"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["net-cost"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["avg-gross-rev"], 2)}</BottomMostTableCell>

							<BottomMostTableCell style={{}} >{roundResults(premiums[cov]["rp-basic"]["est-premium"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rp-basic"]["avg-payment"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rp-basic"]["freq-payment"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rp-basic"]["net-cost"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rp-basic"]["avg-gross-rev"], 2)}</BottomMostTableCell>

							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["est-premium"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["avg-payment"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["freq-payment"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp-basic"]["net-cost"], 2)}</BottomMostTableCell>
							<BottomMostTableCell style={{borderRightWidth: 0, backgroundColor: "WhiteSmoke", borderBottomRightRadius: "15px"}}>
								{roundResults(premiums[cov]["rp-basic"]["avg-gross-rev"], 2)}
							</BottomMostTableCell>
						</TableRow>
					);
				}
				i++;
			});


			let countyProductObjData = evalResultJson.policies.county;

			if (countyProductObjData) {
				let premiums = countyProductObjData;
				// let guarantees = countyProductObjData.guarantees;

				let coverageLevels = Object.keys(premiums);

				let i = 1;
				let len = coverageLevels.length;
				coverageLevels.forEach(function(cov){
					if (i < len) {
						countyProductsRows.push(

							<TableRow key={`childRowArc-${i}`}>
								<CommonTableCell style={{fontWeight: "bold"}}>{cov}%</CommonTableCell>

								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["est-premium"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["avg-payment"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["freq-payment"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["net-cost"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["avg-gross-rev"], 2)}</CommonTableCell>

								<CommonTableCell style={{}} >{roundResults(premiums[cov]["rphpe"]["est-premium"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["avg-payment"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["freq-payment"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["net-cost"], 2)}</CommonTableCell>
								<CommonTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["avg-gross-rev"], 2)}</CommonTableCell>

								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["est-premium"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["avg-payment"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["freq-payment"], 2)}</CommonTableCell>
								<CommonTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["net-cost"], 2)}</CommonTableCell>
								<RightMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["avg-gross-rev"], 2)}</RightMostTableCell>

							</TableRow>
						);
					}
					else {
						countyProductsRows.push(
							<TableRow key={`childRowArc-${i}`}>

								<BottomMostTableCell style={{fontWeight: "bold"}}>{cov}%</BottomMostTableCell>

								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["est-premium"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["avg-payment"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["freq-payment"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["net-cost"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["rp"]["avg-gross-rev"], 2)}</BottomMostTableCell>

								<BottomMostTableCell style={{}} >{roundResults(premiums[cov]["rphpe"]["est-premium"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["avg-payment"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["freq-payment"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["net-cost"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{}}>{roundResults(premiums[cov]["rphpe"]["avg-gross-rev"], 2)}</BottomMostTableCell>

								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["est-premium"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["avg-payment"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["freq-payment"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={coloredBg}>{roundResults(premiums[cov]["yp"]["net-cost"], 2)}</BottomMostTableCell>
								<BottomMostTableCell style={{borderRightWidth: 0, backgroundColor: "WhiteSmoke", borderBottomRightRadius: "15px"}}>
									{roundResults(premiums[cov]["yp"]["avg-gross-rev"], 2)}
								</BottomMostTableCell>
							</TableRow>
						);
					}
					i++;
				});
			}


			return (
				<div style={{padding: 4, display: "inline-block"}}>

					<div style={{padding: "15px"}}> <h2>Individual Farm Level Policies </h2></div>

					{farmPolicyRows.length === -1 ? <div style={{padding: "15px", color: "red"}}> Not applicable for the selected inputs.
								Please make sure the selected "Type" and "Practice" are applicable for your farm </div> :

						<div>
							<span style={{fontSize: "1.10em", padding: "8px"}}> Unit: </span>
							<FormControl style={{marginBottom: "8px"}}>
								<Select id="useTaAdj" labelId="taId" value={this.state.unit} onChange={this.handleChange("unit")}>
									<MenuItem value="Basic">Basic</MenuItem>
									<MenuItem value="Enterprise">Enterprise</MenuItem>
								</Select>
							</FormControl>
							<br/>

							<Table className={classes.table}>
								<TableBody>
									<TableRow style={{height: "64px"}}>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={1} rowSpan={2}
																		 style={{width: "120px"}}>Coverage
											Level</TableCellHeader>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1} style={coloredBg}>Revenue
											Protection</TableCellHeader>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1}>Revenue Protection
											With Harvest Price Exclusion</TableCellHeader>
										<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1}
																	 style={{borderRightWidth: 0,
																		 backgroundColor: "WhiteSmoke", borderTopRightRadius: "15px"}}>
											Yield Protection</TableCellHeader>
									</TableRow>
									<TableRow style={{height: "64px"}}>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Est.</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Avg.</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Freq.</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Net Cost</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Avg Gross Rev</TableCellHeader>

										<TableCellHeader
												className="table-header-tooltip">Est.</TableCellHeader>
										<TableCellHeader
												className="table-header-tooltip">Avg.</TableCellHeader>
										<TableCellHeader
												className="table-header-tooltip">Freq.</TableCellHeader>
										<TableCellHeader className="table-header-tooltip">Net Cost
										</TableCellHeader>
										<TableCellHeader className="table-header-tooltip">Avg Gross Rev
										</TableCellHeader>

										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Est.</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Avg.</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Freq.</TableCellHeader>
										<TableCellHeader className="table-header-tooltip"
																		 style={coloredBg}>Net Cost</TableCellHeader>
										<TableCellHeader className="table-header-tooltip" style={{
											borderRightWidth: 0,
											backgroundColor: "WhiteSmoke"
										}}> Avg Gross Rev</TableCellHeader>
									</TableRow>

									{farmPolicyRows}
								</TableBody>
							</Table>
						</div>
					}

					<br/>

					<Divider/>

					<div style={{padding: "20px 15px 15px 15px"}}> <h2>County Level Products </h2></div>

					{countyProductsRows.length === -1 ? <div style={{padding: "15px", color: "red"}}> Not applicable for the selected inputs </div> :

						<Table className={classes.table}>
							<TableBody>
								<TableRow style={{height: "64px"}}>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={1} rowSpan={2}
																		 style={{width: "150px"}}>Coverage
											Level</TableCellHeader>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1} style={coloredBg}>Area
											Revenue Protection</TableCellHeader>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1}>Area Revenue
											Protection With Harvest Price Exclusion</TableCellHeader>
									<TableCellHeader className="table-header-insurance"
																		 colSpan={5} rowSpan={1}
																	 style={{borderRightWidth: 0,	backgroundColor: "WhiteSmoke",
																		 borderTopRightRadius: "15px"
																		 }}>
											Area Yield Protection</TableCellHeader>
								</TableRow>

								<TableRow style={{height: "48px"}}>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>Est.</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>Avg.</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>Freq.</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>Net Cost</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>Avg Gross Rev</TableCellHeader>

									<TableCellHeader
											className="table-header-tooltip">Est.</TableCellHeader>
									<TableCellHeader
											className="table-header-tooltip">Avg.</TableCellHeader>
									<TableCellHeader
											className="table-header-tooltip">Freq.</TableCellHeader>
									<TableCellHeader className="table-header-tooltip">Net Cost
									</TableCellHeader>
									<TableCellHeader className="table-header-tooltip">Avg Gross Rev
									</TableCellHeader>

									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>Est.</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>Avg.</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>Freq.</TableCellHeader>
									<TableCellHeader className="table-header-tooltip"
																	 style={coloredBg}>Net Cost</TableCellHeader>
									<TableCellHeader className="table-header-tooltip" style={{
										borderRightWidth: 0,
										backgroundColor: "WhiteSmoke"
									}}> Avg Gross Rev</TableCellHeader>

								</TableRow>

								{countyProductsRows}
							</TableBody>
						</Table>
					}
					<br/>

					<Divider/>
					<br/>
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

export default connect(mapStateToProps, null)(withStyles(styles)(EvaluatorPremiumResults));
