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
import {
	calculateMuSigmaEff
} from "../public/pd_sigmamu";

import {roundResults} from "../public/utils";

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
					borderWidth: 1,
					borderColor: "#C2D1F0",
					// backgroundColor: "#C2D1F0",
					fill: true
				},
				{
					label: `${yAxisLabel} of POI`,
					data: poiLine,
					borderWidth: 1,
					// showLine: false,
					borderColor: "#5b84d7",
					backgroundColor: "#C2D1F0",
					fill: true
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
				// contentFormatter: function(e) { return ( e.entries[0].dataSeries.name + " " + e.entries[0].dataPoint.y + "" ) ;},
				// content: "{name}: {y}",
				mode: "label",
				callbacks: {
					label: function (tooltipItem, graphData) {
						return Number(tooltipItem.yLabel).toFixed(2);
					}
				}
			},
			maintainAspectRatio: false,
			scales: {
				yAxes: [{
					ticks: {
						callback: function (label, index, labels) {
							return label.toFixed(2);
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
							return label.toFixed(2);
						},
						beginAtZero: true,
						autoSkip: true,
						maxTicksLimit: 15,
						fontSize: 12,
						maxRotation: 0,
						minRotation: 0
					},
					gridLines: {
						display: true,
						z: 100,
						lineWidth: 1,
					},
					scaleLabel: {
						display: true,
						labelString: "Price ($/bu)",
						fontSize: 14,
					}
				}]
			}
		}
	};
};

const prepareTable = (tableData, title, colName1, colName2, field1, field2, elementId) => {
	return {
		data: tableData,
		layout: "fitColumns",
		columns: [
			{title: colName1, field: field1, hozAlign: "center", formatter: "textarea"},
			{title: colName2, field: field2, hozAlign: "center", formatter: "textarea"},
		],
		// rowClick: function (e, row) {
		// 	alert(`Row ${row.getData().id} Clicked!!!!`);
		// },
		rowFormatter: function (row) {
			let data = row.getData();

			if (elementId === "table2" && data.id === 6) {
				row.getElement().style.fontWeight = "bold";
				//row.getElement().style.backgroundColor = "#FDEDEC"; //apply css change to row element
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
		if (event.target.value !== "") {
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
	};

	updateInputValue = (event) => {
		this.setState({
			poi: event.target.value
		});
	}

	render() {
		const {classes} = this.props;
		const tabulator_options = {
			height: 250,
		};

		let futuresCode = "";
		let resultData = null;
		let pdResultsObj = null;
		let results = null;
		let price = null;
		let priceOfInterest = null;
		let futuresData = null;
		let dte = null;
		let optionValuesByStrike = null;
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
		// else {
		// 	resultData = "{\"ZCZ21\": {\"results\": {\"price\": 3.655, \"optionValuesByStrike\": [{\"strike\": 310, \"call\": 62.625, \"put\": 5.375}, {\"strike\": 320, \"call\": 54.625, \"put\": 7.375}, {\"strike\": 330, \"call\": 47.125, \"put\": 9.875}, {\"strike\": 340, \"call\": 40.25, \"put\": 13.0}, {\"strike\": 350, \"call\": 34.125, \"put\": 17.25}, {\"strike\": 360, \"call\": 28.75, \"put\": 21.5}, {\"strike\": 370, \"call\": 24.125, \"put\": 26.875}, {\"strike\": 380, \"call\": 20.125, \"put\": 32.875}, {\"strike\": 390, \"call\": 16.75, \"put\": 39.5}, {\"strike\": 400, \"call\": 13.875, \"put\": 46.625}, {\"strike\": 410, \"call\": 11.5, \"put\": 54.25}, {\"strike\": 420, \"call\": 9.5, \"put\": 62.25}, {\"strike\": 430, \"call\": 7.875, \"put\": 70.5}], \"dte\": -487, \"futuresData\": {\"dte\": -487, \"data\": {\"180-0C\": 187.375, \"180-0P\": 0.125, \"190-0C\": 177.375, \"190-0P\": 0.125, \"200-0C\": 167.375, \"200-0P\": 0.125, \"210-0C\": 157.5, \"210-0P\": 0.25, \"220-0C\": 147.625, \"220-0P\": 0.375, \"230-0C\": 137.75, \"230-0P\": 0.5, \"240-0C\": 127.875, \"240-0P\": 0.625, \"250-0C\": 118.125, \"250-0P\": 0.875, \"260-0C\": 108.375, \"260-0P\": 1.125, \"270-0C\": 98.75, \"270-0P\": 1.5, \"280-0C\": 89.375, \"280-0P\": 2.125, \"290-0C\": 80.125, \"290-0P\": 2.875, \"300-0C\": 71.125, \"300-0P\": 4.0, \"310-0C\": 62.625, \"310-0P\": 5.375, \"320-0C\": 54.625, \"320-0P\": 7.375, \"330-0C\": 47.125, \"330-0P\": 9.875, \"340-0C\": 40.25, \"340-0P\": 13.0, \"350-0C\": 34.125, \"350-0P\": 17.25, \"360-0C\": 28.75, \"360-0P\": 21.5, \"370-0C\": 24.125, \"370-0P\": 26.875, \"380-0C\": 20.125, \"380-0P\": 32.875, \"390-0C\": 16.75, \"390-0P\": 39.5, \"400-0C\": 13.875, \"400-0P\": 46.625, \"410-0C\": 11.5, \"410-0P\": 54.25, \"420-0C\": 9.5, \"420-0P\": 62.25, \"430-0C\": 7.875, \"430-0P\": 70.5, \"440-0C\": 6.5, \"440-0P\": 79.25, \"450-0C\": 5.375, \"450-0P\": 88.125, \"460-0C\": 4.5, \"460-0P\": 97.25, \"470-0C\": 3.75, \"470-0P\": 106.5, \"480-0C\": 3.25, \"480-0P\": 116.0, \"490-0C\": 2.875, \"490-0P\": 125.5, \"500-0C\": 2.5, \"500-0P\": 135.125, \"510-0C\": 2.125, \"510-0P\": 144.875, \"520-0C\": 2.0, \"520-0P\": 154.625, \"530-0C\": 1.75, \"530-0P\": 164.5, \"540-0C\": 1.625, \"540-0P\": 174.25, \"550-0C\": 1.5, \"550-0P\": 184.125, \"560-0C\": 1.375, \"560-0P\": 194.0, \"570-0C\": 1.25, \"570-0P\": 203.875, \"580-0C\": 1.125, \"580-0P\": 213.875, \"590-0C\": 1.0, \"590-0P\": 223.75, \"600-0C\": 1.0, \"600-0P\": 233.625, \"610-0C\": 0.875, \"610-0P\": 243.625, \"620-0C\": 0.75, \"620-0P\": 253.5, \"630-0C\": 0.75, \"630-0P\": 263.5}, \"price\": 365.5}, \"previousSolution\": {\"sigma\": 0.2108, \"mu\": 1.3173}}}}";
		// }
		// 	"ZCZ21": 	"results": 	"price": 3.655,
		// 							"optionValuesByStrike": [{}, {}, {}, {}, {}],
		// 							"dte": -487,
		// 							"futuresData":
		// 								"dte": -487,
		// 								"data": {},
		// 								"price": 365.5
		// 							"previousSolution":
		// 								"sigma": 0.2108,
		// 							"mu": 1.3173

		if (resultData) {
			pdResultsObj = JSON.parse(resultData);
			// get the futuresCode
			for (let prop in pdResultsObj) {
				if (!pdResultsObj.hasOwnProperty(prop)) {
					//The current property is not a direct property of pdResultsObj, filter prop metadata
					continue;
				}
				futuresCode = prop;
				// console.log(prop);
			}
			if (futuresCode) {
				results = pdResultsObj[futuresCode]["results"];

				price = results["price"];
				// optionValuesByStrike = results["optionValuesByStrike"];
				// dte = results["dte"];
				// futuresData = results["futuresData"];
				// solution = results["previousSolution"];

				// this should be calculated on the server side
				solution = calculateMuSigmaEff(results);
				//console.log(solution);

				const chartData = generateChartData(solution.sigma, solution.mu);
				//console.log(chartData);

				priceOfInterest = price;
				if (this.state.poi) {
					priceOfInterest = this.state.poi;
				}
				graph1 = prepareProbChart(priceOfInterest, chartData, "Cumulative Probability of Prices at Expiration", "Probability", "bigPyt");
				graph2 = prepareProbChart(priceOfInterest, chartData, "Probability of Prices at Expiration", "Relative Probability", "litPyt");
				// console.log(graph1.data);

				priceTableData = regeneratePriceTableData(price, solution.sigma, solution.mu);
				probTableData = generateProbPoints(solution.sigma, solution.mu);
				//console.log(probTableData);
				table1 = prepareTable(priceTableData, "Price at", "Expiration ($)", "Below (%)", "price", "probability", "table1");
				table2 = prepareTable(probTableData, "At expiration", "Below (%)", "Price ($)", "percentile", "price", "table2");
			}

			return (
				<Grid container>
					<Grid container direction="row">
						<Grid item xs={1} />
						<Grid item xs={10}>
							{/*<div style={{padding: 0, display: "inline-block"}} >*/}
							{/*	{futuresCode}<br />*/}
							{/*	{JSON.stringify(solution)}*/}
							{/*</div>*/}
							<div style={{textAlign: "left", fontSize: "1.0em", fontWeight: 500, maxWidth: "1085px"}}>
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
					<Grid container>
						<Grid item xs={1} />
						<Grid item xs={7}>
							<div style={{width: "90%", margin: "auto", height: "300px", padding: "10px"}}>
								<Line data={graph1.data} legend={graph1.legend} options={graph1.options}/>
							</div>
						</Grid>
						<Grid item xs={3}>
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
							<span style={{fontWeight: "bold"}}>Enter Price to Evaluate: </span>
							<TextField
								defaultValue={price}
								value={this.state.inputValue}
								margin="normal"
								onChange={this.updateInputValue}
								onKeyDown={this.keyPress}
								className={classes.textField}
								required
								InputLabelProps={{shrink: true}}
								onInput={this.validateMaxValue(price)}
								InputProps={{
									startAdornment:
										<InputAdornment position="start">$</InputAdornment>, padding: 5
								}}
							/>
							{/*<input type="text" defaultValue={price} value={this.state.inputValue} onChange={this.updateInputValue} />*/}
						</div>
					</Grid>
					<Grid container>
						<Grid item xs={1} />
						<Grid item xs={7}>
							<div style={{width: "90%", margin: "auto", height: "300px", padding: "10px"}}>
								<Line data={graph2.data} legend={graph2.legend} options={graph2.options}/>
							</div>
						</Grid>
						<Grid item xs={3}>
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
