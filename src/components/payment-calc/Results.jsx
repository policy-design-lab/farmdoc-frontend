import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {HorizontalBar} from "react-chartjs-2";
import {Modal, Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import {handleResults} from "../../actions/model";
import {changeYearRow} from "../../actions/results";
import BinnedGraphs from "./BinnedGraphs";
import {roundResults} from "../../public/utils.js";
import {
	expectedPayoutTooltip,
	likelihoodTableToolTip,
	simulatedPriceTableToolTip,
	simulatedYieldTableToolTip,
	simulationGraphToolTip
} from "../../app.messages";
import ToolTip from "@material-ui/core/Tooltip";
import "../../styles/main.css";
import config from "../../app.config";
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
		borderTopWidth: 1,
		borderRightWidth: 0,
		borderLeftWidth: 1,
		borderBottomWidth: 0,
		borderColor: "rgb(144,144,144)",
		textAlign: "center",
		width: "90px",
		paddingLeft: "3px !important",
		paddingRight: "3px !important"
	}
})(TableCell);

const TableCellHeader = withStyles({
	root: {
		color: "rgba(0, 0, 0, 0.54)",
		fontFamily: "Roboto",
		fontSize: "0.75rem",
		fontWeight: "500",
		borderTopWidth: 0,
		borderRightWidth: 0

	}
})(TableCellDefaultStyles);


const ArcTableCell = withStyles({
	root: {
		borderBottomStyle: "none",
		paddingBottom: "1px",
		verticalAlign: "bottom",
		color: "#fd8a43",
		fontWeight: "bolder"
	}
})(TableCellDefaultStyles);

const PlcTableCell = withStyles({
	root: {
		borderTopStyle: "none",
		verticalAlign: "top",
		color: "#5EACCF",
		fontWeight: "bolder"

	}
})(TableCellDefaultStyles);

const CommonTableCell = withStyles({
	root: {
		fontWeight: "bolder"
	}
})(TableCellDefaultStyles);


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


class Results extends Component {

	state = {
		open: false,
		yearRowIndex: 0
	};

	constructor(props) {
		super(props);
		this.handleResultsChange = this.handleResultsChange.bind(this);
		this.handleYearRowChange = this.handleYearRowChange.bind(this);
	}

	handleOpen = (i) => {
		this.setState({open: true});
		this.setState({yearRowIndex: i});
		this.props.handleYearRowChange(i);
	};

	handleClose = () => {
		this.setState({open: false});
	};

	componentWillUnmount() {
		this.props.handleResultsChange(null);
	}

	handleResultsChange(results) {
		this.props.handleResultsChange(results);
	}

	handleYearRowChange(yearRowIndex) {
		this.props.handleYearRowChange(yearRowIndex);
	}


	render() {
		const {classes} = this.props;

		let years = [];
		let prices = [];
		let yields = [];
		let arc = [];
		let plc = [];
		let probArc = [];
		let probPlc = [];
		let yieldUnits = "";

		let jsonData = null;

		if (this.props.hasOwnProperty("countyResultJson") && this.props["countyResultJson"] !== null) {
			jsonData = this.props["countyResultJson"];

		}
		// else { //Uncomment to test with static 5 year response
		//
		// 	//with bins
		// 	jsonData = "{\"mean_prices\":{\"xData\": \"Year\", \"xDataUnit\": \"\", \"yDataSet\": \"National mean prices\", \"yData1\": \"Price\", \"yData1Unit\": \"$\", \"yData2\": \"\", \"yData2Unit\": \"\", \"title\": \"Mean prices\", \"datasets\": {\"data\": [{\"point\": 2019, \"value1\": {\"mean\": 3.637, \"std\": 0.638, \"min\": 2.023, \"max\": 5.708, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2020, \"value1\": {\"mean\": 3.671, \"std\": 0.666, \"min\": 1.92, \"max\": 6.025, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2021, \"value1\": {\"mean\": 3.686, \"std\": 0.662, \"min\": 2.08, \"max\": 6.032, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2022, \"value1\": {\"mean\": 3.693, \"std\": 0.657, \"min\": 2.028, \"max\": 6.356, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2023, \"value1\": {\"mean\": 3.696, \"std\": 0.654, \"min\": 2.121, \"max\": 5.79, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}]}},\n" +
		// 			"\"county_yields\":{\"xData\": \"Year\", \"xDataUnit\": \"\", \"yDataSet\": \"County mean yields\", \"yData1\": \"Yield\", \"yData1Unit\": \"bushel/acre\", \"yData2\": \"\", \"yData2Unit\": \"\", \"title\": \"County yields\", \"datasets\": {\"data\": [{\"point\": 2019, \"value1\": {\"mean\": 199.029, \"std\": 24.163, \"min\": 103.698, \"max\": 254.788, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2020, \"value1\": {\"mean\": 201.087, \"std\": 24.162, \"min\": 105.521, \"max\": 256.754, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2021, \"value1\": {\"mean\": 203.144, \"std\": 24.161, \"min\": 107.349, \"max\": 258.723, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2022, \"value1\": {\"mean\": 205.202, \"std\": 24.161, \"min\": 109.181, \"max\": 260.694, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2023, \"value1\": {\"mean\": 207.259, \"std\": 24.16, \"min\": 111.017, \"max\": 262.666, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}]}},\n" +
		// 			"\"county_average_arc_and_plc_payments\":{\"xData\": \"Year\", \"xDataUnit\": \"\", \"yDataSet\": \"County ARC and PLC payments\", \"yData1\": \"County ARC\", \"yData1Unit\": \"$\", \"yData2\": \"County PLC\", \"yData2Unit\": \"$/acre\", \"title\": \"County average ARC and PLC payments\", \"datasets\": {\"data\": [{\"point\": 2019, \"value1\": {\"mean\": 13.441, \"std\": 23.411, \"min\": 0.0, \"max\": 64.473, \"pos\": 31.5}, \"value2\": {\"mean\": 29.517, \"std\": 37.578, \"min\": 0.0, \"max\": 171.09, \"pos\": 56.0}}, {\"point\": 2020, \"value1\": {\"mean\": 13.876, \"std\": 24.339, \"min\": 0.0, \"max\": 67.215, \"pos\": 30.8}, \"value2\": {\"mean\": 28.509, \"std\": 37.558, \"min\": 0.0, \"max\": 178.5, \"pos\": 54.8}}, {\"point\": 2021, \"value1\": {\"mean\": 11.166, \"std\": 22.346, \"min\": 0.0, \"max\": 69.858, \"pos\": 25.8}, \"value2\": {\"mean\": 27.954, \"std\": 36.848, \"min\": 0.0, \"max\": 165.232, \"pos\": 53.8}}, {\"point\": 2022, \"value1\": {\"mean\": 12.999, \"std\": 23.822, \"min\": 0.0, \"max\": 72.461, \"pos\": 28.8}, \"value2\": {\"mean\": 27.274, \"std\": 36.418, \"min\": 0.0, \"max\": 170.507, \"pos\": 53.3}}, {\"point\": 2023, \"value1\": {\"mean\": 11.75, \"std\": 22.946, \"min\": 0.0, \"max\": 76.034, \"pos\": 26.1}, \"value2\": {\"mean\": 26.924, \"std\": 36.713, \"min\": 0.0, \"max\": 161.014, \"pos\": 51.7}}]}},\n" +
		// 			"\"histograms_of_county_arc_payments\":{\"xData\": \"Price bins\", \"xDataUnit\": \"$\", \"yDataSet\": \"Payments distribution\", \"yData1\": \"Number of prices\", \"yData1Unit\": \"\", \"title\": \"Histograms of county ARC payments\", \"datasets\": {\"data\": [{\"year\": 2019, \"xdata\": [\"0.0-6.5\", \"6.5-13.0\", \"13.0-19.5\", \"19.5-26.0\", \"26.0-32.5\", \"32.5-39.0\", \"39.0-45.5\", \"45.5-52.0\", \"52.0-58.5\", \"58.5-65.0\"], \"ydata\": [711.0, 21.0, 21.0, 18.0, 27.0, 18.0, 21.0, 20.0, 12.0, 131.0]}, {\"year\": 2020, \"xdata\": [\"0.0-6.8\", \"6.8-13.6\", \"13.6-20.4\", \"20.4-27.2\", \"27.2-34.0\", \"34.0-40.8\", \"40.8-47.6\", \"47.6-54.4\", \"54.4-61.2\", \"61.2-68.0\"], \"ydata\": [714.0, 24.0, 24.0, 13.0, 21.0, 19.0, 14.0, 17.0, 20.0, 134.0]}, {\"year\": 2021, \"xdata\": [\"0.0-7.0\", \"7.0-14.0\", \"14.0-21.0\", \"21.0-28.0\", \"28.0-35.0\", \"35.0-42.0\", \"42.0-49.0\", \"49.0-56.0\", \"56.0-63.0\", \"63.0-70.0\"], \"ydata\": [767.0, 23.0, 14.0, 18.0, 14.0, 20.0, 16.0, 10.0, 16.0, 102.0]}, {\"year\": 2022, \"xdata\": [\"0.0-7.3\", \"7.3-14.6\", \"14.6-21.9\", \"21.9-29.2\", \"29.2-36.5\", \"36.5-43.8\", \"43.8-51.1\", \"51.1-58.4\", \"58.4-65.7\", \"65.7-73.0\"], \"ydata\": [732.0, 24.0, 15.0, 24.0, 21.0, 20.0, 24.0, 9.0, 43.0, 88.0]}, {\"year\": 2023, \"xdata\": [\"0.0-7.7\", \"7.7-15.4\", \"15.4-23.1\", \"23.1-30.8\", \"30.8-38.5\", \"38.5-46.2\", \"46.2-53.9\", \"53.9-61.6\", \"61.6-69.3\", \"69.3-77.0\"], \"ydata\": [756.0, 23.0, 20.0, 19.0, 25.0, 18.0, 14.0, 21.0, 78.0, 26.0]}]}},\n" +
		// 			"\"histograms_of_county_plc_payments\":{\"xData\": \"Price bins\", \"xDataUnit\": \"$/acre\", \"yDataSet\": \"Payments distribution\", \"yData1\": \"Number of prices\", \"yData1Unit\": \"\", \"title\": \"Histograms of county PLC payments\", \"datasets\": {\"data\": [{\"year\": 2019, \"xdata\": [\"0.0-17.2\", \"17.2-34.4\", \"34.4-51.6\", \"51.6-68.8\", \"68.8-86.0\", \"86.0-103.2\", \"103.2-120.4\", \"120.4-137.6\", \"137.6-154.8\", \"154.8-172.0\"], \"ydata\": [543.0, 101.0, 109.0, 81.0, 61.0, 47.0, 32.0, 17.0, 3.0, 6.0]}, {\"year\": 2020, \"xdata\": [\"0.0-17.9\", \"17.9-35.8\", \"35.8-53.7\", \"53.7-71.6\", \"71.6-89.5\", \"89.5-107.4\", \"107.4-125.3\", \"125.3-143.2\", \"143.2-161.1\", \"161.1-179.0\"], \"ydata\": [558.0, 117.0, 91.0, 80.0, 63.0, 43.0, 25.0, 13.0, 6.0, 4.0]}, {\"year\": 2021, \"xdata\": [\"0.0-16.6\", \"16.6-33.2\", \"33.2-49.8\", \"49.8-66.4\", \"66.4-83.0\", \"83.0-99.6\", \"99.6-116.2\", \"116.2-132.8\", \"132.8-149.4\", \"149.4-166.0\"], \"ydata\": [564.0, 90.0, 98.0, 75.0, 69.0, 42.0, 33.0, 15.0, 9.0, 5.0]}, {\"year\": 2022, \"xdata\": [\"0.0-17.1\", \"17.1-34.2\", \"34.2-51.3\", \"51.3-68.4\", \"68.4-85.5\", \"85.5-102.6\", \"102.6-119.7\", \"119.7-136.8\", \"136.8-153.9\", \"153.9-171.0\"], \"ydata\": [575.0, 101.0, 79.0, 90.0, 59.0, 46.0, 28.0, 10.0, 9.0, 3.0]}, {\"year\": 2023, \"xdata\": [\"0.0-16.2\", \"16.2-32.4\", \"32.4-48.6\", \"48.6-64.8\", \"64.8-81.0\", \"81.0-97.2\", \"97.2-113.4\", \"113.4-129.6\", \"129.6-145.8\", \"145.8-162.0\"], \"ydata\": [575.0, 90.0, 91.0, 79.0, 59.0, 36.0, 29.0, 29.0, 6.0, 6.0]}]}}\n" +
		// 			"}";
		// }

		if (jsonData !== null) {
			let objData = JSON.parse(jsonData);
			if (objData.county_average_arc_and_plc_payments && objData.county_average_arc_and_plc_payments !== null) {

				let arcplcData = objData.county_average_arc_and_plc_payments.datasets.data;

				arcplcData.forEach(function (element) {
					years.push(element.point);
					arc.push(roundResults(element.value1.mean, 2));
					plc.push(roundResults(element.value2.mean, 2));

					probArc.push(roundResults(element.value1.pos));
					probPlc.push(roundResults(element.value2.pos));

				});
			}

			if (objData.mean_prices && objData.mean_prices !== null) {

				let priceData = objData.mean_prices.datasets.data;

				priceData.forEach(function (element) {
					prices.push(roundResults(element.value1.mean, 2));
				});
			}

			if (objData.county_yields && objData.county_yields !== null) {

				//yData1Unit
				let yieldData = objData.county_yields.datasets.data;
				yieldUnits = objData.county_yields.yData1Unit;

				yieldData.forEach(function (element) {
					yields.push(roundResults(element.value1.mean, 1));
				});
			}


			let rowElems = [];
			for (let i = 0; i < years.length; i++) {
				rowElems.push(
					<TableRow key={`childRowArc-${i}`}>
						<ArcTableCell>${arc[i]}</ArcTableCell>
						<ArcTableCell>{probArc[i]}%</ArcTableCell>
						<CommonTableCell rowSpan={2} style={{verticalAlign: "middle"}}>
							<img src={require("../../images/sample-dist.png")} onClick={() => this.handleOpen(i)}
								 style={{cursor: "pointer"}}/>
						</CommonTableCell>
						<CommonTableCell rowSpan={2}> ${prices[i]} </CommonTableCell>
						<CommonTableCell rowSpan={2}> {yields[i]} </CommonTableCell>
					</TableRow>
				);

				rowElems.push(
					<TableRow key={`childRowPlc-${i}`}>
						<PlcTableCell>${plc[i]}</PlcTableCell>
						<PlcTableCell>{probPlc[i]}%</PlcTableCell>
					</TableRow>
				);
			}


			let arcplcPayments = {
				labels: years,
				datasets: [
					{
						label: "ARC-CO Payments",
						backgroundColor: "#fd8a43",
						hoverBackgroundColor: "LightSlateGray",
						strokeColor: "rgba(246,107,22,1)",
						pointColor: "rgba(246,107,22,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(246,107,22,1)",
						data: arc
					},
					{
						label: "PLC Payments",
						/*backgroundColor: "#003366", */
						backgroundColor: "#5EACCF",
						hoverBackgroundColor: "DarkGray",
						strokeColor: "rgba(0,51,102,1)",
						pointColor: "rgba(0,51,102,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(0,51,102,1)",
						data: plc
					}
				]
			};

			let barChartOptions = {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					xAxes: [{
						ticks: {
							beginAtZero: true

						},
						gridLines: {
							display: true,
							drawTicks: true,
							drawBorder: true,
							color: "rgba(0,0,0,0.1)"
						},
						position: "top"
					}]
				},
				title: {
					display: false,
					text: "ARC/PLC Payments - Coverage: 86% Range: 10%",
					fontColor: "DarkBlue",
					fontSize: 18
				}
			};


			return (
				<div>
					<Modal open={this.state.open} onClose={this.handleClose}>
						<div style={getModalStyle()} className={classes.paper}>
							<IconButton className="distributionCloseImg" onClick={this.handleClose}>
								<CloseIcon />
							</IconButton>
							<BinnedGraphs/>
						</div>
					</Modal>

					<Table className={classes.table}>

						<TableBody>
							<TableRow>
								<ChartTableCell rowSpan={1}>
									<HorizontalBar key="line-2" data={arcplcPayments} options={barChartOptions}/>

								</ChartTableCell>
								<TableCellWithTable>

									<Table>
										<TableBody>
											<TableRow style={{height: "64px"}}>
												<ToolTip title={expectedPayoutTooltip} enterTouchDelay={config.tooltipTouchDelay}><TableCellHeader className="table-header-tooltip">Expected  &nbsp;Payment ($)</TableCellHeader></ToolTip>
												<ToolTip title={likelihoodTableToolTip} enterTouchDelay={config.tooltipTouchDelay}><TableCellHeader className="table-header-tooltip">Likelihood of Payment (avg)</TableCellHeader></ToolTip>
												<ToolTip title={simulationGraphToolTip} enterTouchDelay={config.tooltipTouchDelay}><TableCellHeader className="table-header-tooltip">Payment Distributions</TableCellHeader></ToolTip>
												<ToolTip title={simulatedPriceTableToolTip} enterTouchDelay={config.tooltipTouchDelay}><TableCellHeader className="table-header-tooltip"> MYA <br/>Price ($)</TableCellHeader></ToolTip>
												<ToolTip title={simulatedYieldTableToolTip} enterTouchDelay={config.tooltipTouchDelay}><TableCellHeader className="table-header-tooltip">Expected Yield ({yieldUnits})</TableCellHeader></ToolTip>
											</TableRow>

											{rowElems}
										</TableBody>
									</Table>

								</TableCellWithTable>
							</TableRow>

						</TableBody>
					</Table>

				</div>
			);
		}
		else {
			//TODO: Improve the error message format
			return (
				<div>
					{/*<div style={{textAlign: "center"}}>Run the model first</div>*/}
				</div>
			);
		}
	}
}

const mapStateToProps = (state) => {
	return {
		countyResultJson: state.model.countyResults
	};
};

const mapDispatchToProps = dispatch => ({
	handleResultsChange: results => dispatch(handleResults(results)),
	handleYearRowChange: yearRowIndex => dispatch(changeYearRow(yearRowIndex))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Results));
