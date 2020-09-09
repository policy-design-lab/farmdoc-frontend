import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Line} from "react-chartjs-2";
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.css";
import {ReactTabulator} from "react-tabulator";
import "../styles/main.css";
import PriceDistributionFooter from "./PriceDistributionFooter";
import {
	handlePDResults
} from "../actions/priceDistribution";
import {
	generateChartData,
	generateProbPoints,
	regeneratePriceTableData
} from "../public/pd_data";

import {isNumeric, roundResults} from "../public/utils";

const styles = theme => ({
	root: {
		width: "auto",
		marginTop: theme.spacing.unit * 3,
		overflowX: "auto",
		borderColor: "black"
	},
});

const prepareProbChart = (poi, chartData, title, yAxisLabel, dataColumn) => {
	// Our labels along the x-axis
	let prices = chartData["price"];
	let graphData = chartData[dataColumn];

	let poiLine = [...graphData];
	for (let i = 0; i < prices.length; i++) {
		if (prices[i] > poi) {
			poiLine[i] = NaN;
		}
	}
	return {
		data: {
			labels: prices,
			datasets: [
				{
					label: yAxisLabel,
					data: graphData,
					borderColor: "rgb(133, 163, 225)",
					backgroundColor: "rgba(235, 240, 250, 0.3)",
					fill: true,
					pointRadius: 0,
					borderRadius: 2,
					borderWidth: 2
				},
				{
					label: `${yAxisLabel} of POI`,
					data: poiLine,
					// showLine: false,
					borderColor: "rgb(133, 163, 225)",
					// borderColor: "#5b84d7",
					backgroundColor: "rgba(153, 178, 230, 0.3)",
					fill: true,
					pointRadius: 0,
					borderRadius: 2,
					borderWidth: 2
				}
			]
		},
		legend: {
			display: false,
			position: "top",
			labels: {
				fontColor: "#323130",
				fontSize: 14
			}
		},
		options: {
			title: {
				display: true,
				text: title,
				fontSize: 16
			},
			animation: {
				duration: 0
			},
			legend: {
				display: false
			},
			tooltips: {
				mode: "index",
				intersect: false,
				position: "average",
				callbacks: {
					title: function(tooltipItems, data) {
						return `Price: ${ tooltipItems[0].xLabel}`;
					},
					label: function(item, data) {
						let datasetLabel = data.datasets[item.datasetIndex].label || "";
						let dataPoint = item.yLabel;
						if (!datasetLabel.toLowerCase().includes("poi")) { //do not include POI graph value in tooltip
							return `${datasetLabel}: ${roundResults(dataPoint * 100, 2)}%`;
						}
					}
				}
			},
			maintainAspectRatio: false,
			scales: {
				yAxes: [{
					ticks: {
						callback: function (label, index, labels) {
							return `${(label * 100).toFixed(0) }%`;
						},
						beginAtZero: true,
						autoSkip: true,
						maxTicksLimit: 6,
						fontSize: 12,
					},
					gridLines: {
						display: true,
						// drawOnChartArea: true,
						z: 100,
						lineWidth: 1,
						// borderDash: [10],
						// borderDashOffset: 3
					},
					scaleLabel: {
						display: true,
						labelString: yAxisLabel,
						fontSize: 14,
					}
				}],
				xAxes: [{
					ticks: {
						callback: function (label, index, labels) {
							return `$${ label.toFixed(2)}`;
						},
						beginAtZero: true,
						autoSkip: true,
						precision: 1,
						maxTicksLimit: 11, // Provide odd number here to show evenly distributed grids
						fontSize: 12,
						maxRotation: 45,
						minRotation: 45
					},
					gridLines: {
						display: true,
						z: 100,
						lineWidth: 1,
					},
					scaleLabel: {
						display: true,
						// labelString: "Price ($/bu)",
						fontSize: 14,
					}
				}]
			}
		}
	};
};

const prepareTable = (tableData, title, colName1, colName2, field1, field2, elementId) => {

	let formatterParamsFirst, formatterParamsSecond;
	let headerTooltipFirst, headerTooltipSecond;
	if (field1 === "price"){
		formatterParamsFirst = {symbol: "$"};
		formatterParamsSecond = {symbol: "%", symbolAfter: true};
		headerTooltipFirst = "Price at Expiration";
		headerTooltipSecond = "Probability at Expiration";
	}
	else {
		formatterParamsFirst = {symbol: "%", symbolAfter: true, precision: 0};
		formatterParamsSecond = {symbol: "$"};
		headerTooltipFirst = "Probability at Expiration";
		headerTooltipSecond = "Price at Expiration";
	}

	return {
		data: tableData,
		layout: "fitColumns",
		tooltipsHeader: true,
		columns: [
			{title: colName1, field: field1, hozAlign: "center", width: 120, tooltip: false,
				headerTooltip: headerTooltipFirst, formatter: "money", formatterParams: formatterParamsFirst},
			{title: colName2, field: field2, hozAlign: "center", width: 120, tooltip: false,
				headerTooltip: headerTooltipSecond, formatter: "money", formatterParams: formatterParamsSecond},
		],
		rowFormatter: function (row) {
			let data = row.getData();

			if (elementId === "table2" && data.id === 6) {
				row.getElement().style.fontWeight = "bold";
			}
		},
	};
};

class PriceDistributionResults extends Component {
	constructor(props) {
		super(props);

		this.handlePDResults = handlePDResults;
		this.state = {poi: null};
	}

	validateMaxValue = value => event => {
		if (isNumeric(event.target.value)) {
			if (isNaN(event.target.value)) {
				event.target.value = 0;
			}
			else {
				if (event.target.value <= 0) {
					event.target.value = 0;
				}
				else if (event.target.value > 4 * value) {
					event.target.value = value;
				}
			}
		}
		else {
			event.target.value = value;
		}
	};

	updateInputValue = (event) => {
		this.setState({
			poi: event.target.value
		});
	}

	render() {
		const {classes} = this.props;
		const tabulator_options = {
			// height: 250,
		};

		let futuresCode = "";
		let resultData = null;
		let pdResultsObj = null;
		let results = null;
		let price = null;
		let priceOfInterest = null;
		let solution = null;

		let priceTableData = null;
		let probTableData = null;
		let graph1 = null;
		let graph2 = null;
		let table1 = null;
		let table2 = null;

		if (this.props.hasOwnProperty("pdResults") && this.props["pdResults"] !== null) {
			resultData = this.props["pdResults"];
		}

		if (resultData) {
			pdResultsObj = JSON.parse(resultData);
			// get the futuresCode
			for (let prop in pdResultsObj) {
				if (!pdResultsObj.hasOwnProperty(prop)) {
					//The current property is not a direct property of pdResultsObj, filter prop metadata
					continue;
				}
				futuresCode = prop;
			}
			if (futuresCode) {
				results = pdResultsObj[futuresCode]["results"];

				price = roundResults(results["price"], 2);
				solution = results["solution"];

				const chartData = generateChartData(solution.sigma, solution.mu);

				priceOfInterest = price;
				if (this.state.poi) {
					priceOfInterest = this.state.poi;
				}
				graph1 = prepareProbChart(priceOfInterest, chartData, "Cumulative Probability of Prices at Expiration", "Probability", "bigPyt");
				graph2 = prepareProbChart(priceOfInterest, chartData, "Probability of Prices at Expiration", "Relative Probability", "litPyt");

				priceTableData = regeneratePriceTableData(price, solution.sigma, solution.mu);
				probTableData = generateProbPoints(solution.sigma, solution.mu);

				table1 = prepareTable(priceTableData, "Price at", "Price at<br/>Expiration", "Probability<br/>Below", "price", "probability", "table1");
				table2 = prepareTable(probTableData, "At expiration", "Probability<br/>Below", "Price at<br/>Expiration", "percentile", "price", "table2");
			}

			return (
				<Grid container>
					<Grid container direction="row">
						<Grid item xs={1} />
						<Grid item xs={10}>
							<div style={{fontSize: "1.0em", fontWeight: 600, maxWidth: "1085px", margin: "0 auto", padding: "6px 0px 0px 0px"}}>
								The charts below show the corn price distribution at expiration in two related forms.
								The top shows the cumulative probability distribution for expiration prices
								and can be interpreted by identifying a price of interest and reading the associated
								probability on the left axis. The lower chart contains the same information in a probability
								density form. The associated tables tabulate the information from the charts by price
								and probability.
							</div>

						</Grid>
						<Grid item xs={1} />
					</Grid>
					<Grid container justify="center" alignItems="center">
						<Grid item xs={1} />
						<Grid item xs={7}>
							<div style={{width: "90%", margin: "auto", height: "340px", padding: "10px"}}>
								<Line data={graph1.data} legend={graph1.legend} options={graph1.options}/>
							</div>
						</Grid>
						<Grid item xs={3} style={{flexBasis: "0%"}}>
							<div style={{width: "100%", marginTop: "20px", padding: "10px"}}>
								<ReactTabulator
											data={table1.data} layout={"fitColumns"} columns={table1.columns} options={tabulator_options}
											rowClick={table1.rowClick} rowFormatter={table1.rowFormatter} tooltips={true}
								/>
							</div>
						</Grid>
						<Grid item xs={1} />
					</Grid>
					<Grid container>
						<div style={{margin: "auto", width: "50%", padding: "0px"}}>
							<span style={{fontWeight: "bold"}}>Enter Price to Evaluate: &nbsp;</span>
							<TextField
								defaultValue={price}
								style={{width: "90px"}}
								value={this.state.inputValue}
								margin="normal"
								onChange={this.updateInputValue}
								onKeyDown={this.keyPress}
								required
								InputLabelProps={{shrink: true}}
								onBlur={this.validateMaxValue(price)}
								InputProps={{
									startAdornment:
										<InputAdornment position="start">$</InputAdornment>, padding: 5
								}}
							/>
							{/*<input type="text" defaultValue={price} value={this.state.inputValue} onChange={this.updateInputValue} />*/}
						</div>
					</Grid>
					<Grid container justify="center" alignItems="center">
						<Grid item xs={1} />
						<Grid item xs={7}>
							<div style={{width: "90%", margin: "auto", height: "340px", padding: "10px"}}>
								<Line data={graph2.data} legend={graph2.legend} options={graph2.options}/>
							</div>
						</Grid>
						<Grid item xs={3} style={{flexBasis: "0%"}}>
							<div style={{width: "100%", marginTop: "20px", padding: "10px"}}>
								<ReactTabulator
									data={table2.data} layout={"fitColumns"} columns={table2.columns} options={tabulator_options}
									rowClick={table2.rowClick} rowFormatter={table2.rowFormatter} tooltips={true}
								/>
							</div>
						</Grid>
						<Grid item xs={1} />
					</Grid>
					<Grid container>
						<Grid item xs={1} />
						<Grid item xs={10}>
							<div>
								<Divider/>
								<PriceDistributionFooter
									probability={roundResults(probTableData[5].percentile, 0)}
									expirationPrice={roundResults(probTableData[5].price, 2)}
								/>
							</div>
						</Grid>
						<Grid item xs={1} />
					</Grid>
				</Grid>
			);
		}
		else if (this.props["pdResults"] === ""){
			return (
				<div style={{padding: "15px", color: "red"}}> No data available for the selected crop and date. </div>
			);
		}
		else {
			return (
				<div />
			);
		}
	}
}

// You should declare that a prop is a specific JS type.
// See https://reactjs.org/docs/typechecking-with-proptypes.html for details
PriceDistributionResults.propTypes = {
	handlePDResults: PropTypes.func.isRequired,
	classes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object
	]),
};

PriceDistributionResults.propTypes = {
	pdResults: PropTypes.string
};

const mapStateToProps = (state) => {
	return {
		pdResults: state.priceDistribution.pdResults
	};
};

export default connect(mapStateToProps)(withStyles(styles)(PriceDistributionResults));
