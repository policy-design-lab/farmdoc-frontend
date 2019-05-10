import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {Bar} from "react-chartjs-2";
import {Grid} from "@material-ui/core";
import {roundResults} from "../public/utils.js";
import "../styles/main.css";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ToolTip from "@material-ui/core/Tooltip";

const styles = theme => ({
	root: {
		width: "auto",
		marginTop: theme.spacing.unit * 3,
		overflowX: "auto",
		borderColor: "black"
	},

	table: {
		//minWidth: 700,
		padding: 10,
		width: "auto",
		margin: 15
	},

	tableCell: {},

	paper: {
		position: "absolute",
		//width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
	}
});


class BinnedGraphs extends Component {

	state = {
		binYearRow: 0,
		hideZeroes: false
	};

	constructor(props) {
		super(props);
	}

	handleChange = name => event => {
		this.setState({[name]: event.target.checked});
	};

	// This is a workaround to make sure both x-axes represent the same size so that
	// the Charts are rendered with equal alignment. ex: "0-6.5" will be returned as "   0-6.5"
	// when the corresponding x value for other insurance is bigger, ex: "96.5-118.2"
	normalizeBinSizes(arcBins, plcBins) {

		if (arcBins.length === plcBins.length) {
			// arcBins = [];
			// plcBins = [];

			for (let i = 0; i < arcBins.length; i++) {
				let lenArc = arcBins[i].length;
				let lenPlc = plcBins[i].length;

				if (lenArc > lenPlc) {
					plcBins[i] = plcBins[i].padStart(lenArc, " ");
				}
				else if (lenArc < lenPlc) {
					arcBins[i] = arcBins[i].padStart(lenPlc, " ");
				}

				// plcBins[i] = i;
				// arcBins[i] = i;
			}
		}

		return {
			arcBins: arcBins,
			plcBins: plcBins
		};
	}

	render() {

		let bins = [];
		let arcDists = [];
		let plcDists = [];

		let jsonData = null;
		let yearRowIndex = 0;
		let maxYSimulations = 1000;

		if (this.props.hasOwnProperty("countyResultJson") && this.props["countyResultJson"] !== null) {
			jsonData = this.props["countyResultJson"];

		}
		// else { //Uncomment to test with static 5 year response
		//   //with bins
		// 	jsonData = "{\"mean_prices\":{\"xData\": \"Year\", \"xDataUnit\": \"\", \"yDataSet\": \"National mean prices\", \"yData1\": \"Price\", \"yData1Unit\": \"$\", \"yData2\": \"\", \"yData2Unit\": \"\", \"title\": \"Mean prices\", \"datasets\": {\"data\": [{\"point\": 2019, \"value1\": {\"mean\": 3.637, \"std\": 0.638, \"min\": 2.023, \"max\": 5.708, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2020, \"value1\": {\"mean\": 3.671, \"std\": 0.666, \"min\": 1.92, \"max\": 6.025, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2021, \"value1\": {\"mean\": 3.686, \"std\": 0.662, \"min\": 2.08, \"max\": 6.032, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2022, \"value1\": {\"mean\": 3.693, \"std\": 0.657, \"min\": 2.028, \"max\": 6.356, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2023, \"value1\": {\"mean\": 3.696, \"std\": 0.654, \"min\": 2.121, \"max\": 5.79, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}]}},\n" +
		// 			"\"county_yields\":{\"xData\": \"Year\", \"xDataUnit\": \"\", \"yDataSet\": \"County mean yields\", \"yData1\": \"Yield\", \"yData1Unit\": \"bushel/acre\", \"yData2\": \"\", \"yData2Unit\": \"\", \"title\": \"County yields\", \"datasets\": {\"data\": [{\"point\": 2019, \"value1\": {\"mean\": 199.029, \"std\": 24.163, \"min\": 103.698, \"max\": 254.788, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2020, \"value1\": {\"mean\": 201.087, \"std\": 24.162, \"min\": 105.521, \"max\": 256.754, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2021, \"value1\": {\"mean\": 203.144, \"std\": 24.161, \"min\": 107.349, \"max\": 258.723, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2022, \"value1\": {\"mean\": 205.202, \"std\": 24.161, \"min\": 109.181, \"max\": 260.694, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}, {\"point\": 2023, \"value1\": {\"mean\": 207.259, \"std\": 24.16, \"min\": 111.017, \"max\": 262.666, \"pos\": 100.0}, \"value2\": {\"mean\": null, \"std\": null, \"min\": null, \"max\": null, \"pos\": null}}]}},\n" +
		// 			"\"county_average_arc_and_plc_payments\":{\"xData\": \"Year\", \"xDataUnit\": \"\", \"yDataSet\": \"County ARC and PLC payments\", \"yData1\": \"County ARC\", \"yData1Unit\": \"$\", \"yData2\": \"County PLC\", \"yData2Unit\": \"$/acre\", \"title\": \"County average ARC and PLC payments\", \"datasets\": {\"data\": [{\"point\": 2019, \"value1\": {\"mean\": 13.441, \"std\": 23.411, \"min\": 0.0, \"max\": 64.473, \"pos\": 31.5}, \"value2\": {\"mean\": 29.517, \"std\": 37.578, \"min\": 0.0, \"max\": 171.09, \"pos\": 56.0}}, {\"point\": 2020, \"value1\": {\"mean\": 13.876, \"std\": 24.339, \"min\": 0.0, \"max\": 67.215, \"pos\": 30.8}, \"value2\": {\"mean\": 28.509, \"std\": 37.558, \"min\": 0.0, \"max\": 178.5, \"pos\": 54.8}}, {\"point\": 2021, \"value1\": {\"mean\": 11.166, \"std\": 22.346, \"min\": 0.0, \"max\": 69.858, \"pos\": 25.8}, \"value2\": {\"mean\": 27.954, \"std\": 36.848, \"min\": 0.0, \"max\": 165.232, \"pos\": 53.8}}, {\"point\": 2022, \"value1\": {\"mean\": 12.999, \"std\": 23.822, \"min\": 0.0, \"max\": 72.461, \"pos\": 28.8}, \"value2\": {\"mean\": 27.274, \"std\": 36.418, \"min\": 0.0, \"max\": 170.507, \"pos\": 53.3}}, {\"point\": 2023, \"value1\": {\"mean\": 11.75, \"std\": 22.946, \"min\": 0.0, \"max\": 76.034, \"pos\": 26.1}, \"value2\": {\"mean\": 26.924, \"std\": 36.713, \"min\": 0.0, \"max\": 161.014, \"pos\": 51.7}}]}},\n" +
		// 			"\"histograms_of_county_arc_payments\":{\"xData\": \"Price bins\", \"xDataUnit\": \"$\", \"yDataSet\": \"Payments distribution\", \"yData1\": \"Number of prices\", \"yData1Unit\": \"\", \"title\": \"Histograms of county ARC payments\", \"datasets\": {\"data\": [{\"year\": 2019, \"xdata\": [\"0.0-6.50\", \"6.5-13.0\", \"13.0-19.5\", \"19.5-26.0\", \"26.0-32.5\", \"32.5-39.0\", \"39.0-45.5\", \"45.5-52.0\", \"52.0-58.5\", \"158.5-165.0\"], \"ydata\": [711.0, 21.0, 21.0, 18.0, 27.0, 18.0, 21.0, 20.0, 12.0, 131.0]}, {\"year\": 2020, \"xdata\": [\"0.0-6.8\", \"6.8-13.6\", \"13.6-20.4\", \"20.4-27.2\", \"27.2-34.0\", \"34.0-40.8\", \"40.8-47.6\", \"47.6-54.4\", \"54.4-61.2\", \"61.2-68.0\"], \"ydata\": [714.0, 24.0, 24.0, 13.0, 21.0, 19.0, 14.0, 17.0, 20.0, 134.0]}, {\"year\": 2021, \"xdata\": [\"0.0-7.0\", \"7.0-14.0\", \"14.0-21.0\", \"21.0-28.0\", \"28.0-35.0\", \"35.0-42.0\", \"42.0-49.0\", \"49.0-56.0\", \"56.0-63.0\", \"63.0-70.0\"], \"ydata\": [767.0, 23.0, 14.0, 18.0, 14.0, 20.0, 16.0, 10.0, 16.0, 102.0]}, {\"year\": 2022, \"xdata\": [\"0.0-7.3\", \"7.3-14.6\", \"14.6-21.9\", \"21.9-29.2\", \"29.2-36.5\", \"36.5-43.8\", \"43.8-51.1\", \"51.1-58.4\", \"58.4-65.7\", \"65.7-73.0\"], \"ydata\": [732.0, 24.0, 15.0, 24.0, 21.0, 20.0, 24.0, 9.0, 43.0, 88.0]}, {\"year\": 2023, \"xdata\": [\"0.0-7.7\", \"7.7-15.4\", \"15.4-23.1\", \"23.1-30.8\", \"30.8-38.5\", \"38.5-46.2\", \"46.2-53.9\", \"53.9-61.6\", \"61.6-69.3\", \"69.3-77.0\"], \"ydata\": [756.0, 23.0, 20.0, 19.0, 25.0, 18.0, 14.0, 21.0, 78.0, 26.0]}]}},\n" +
		// 			"\"histograms_of_county_plc_payments\":{\"xData\": \"Price bins\", \"xDataUnit\": \"$/acre\", \"yDataSet\": \"Payments distribution\", \"yData1\": \"Number of prices\", \"yData1Unit\": \"\", \"title\": \"Histograms of county PLC payments\", \"datasets\": {\"data\": [{\"year\": 2019, \"xdata\": [\"0.0-17.2\", \"17.2-34.4\", \"34.4-51.6\", \"51.6-68.8\", \"68.8-86.0\", \"86.0-103.2\", \"103.2-120.4\", \"120.4-137.6\", \"137.6-154.8\", \"154.8-172.0\"], \"ydata\": [543.0, 101.0, 109.0, 81.0, 61.0, 47.0, 32.0, 17.0, 3.0, 6.0]}, {\"year\": 2020, \"xdata\": [\"0.0-17.9\", \"17.9-35.8\", \"35.8-53.7\", \"53.7-71.6\", \"71.6-89.5\", \"89.5-107.4\", \"107.4-125.3\", \"125.3-143.2\", \"143.2-161.1\", \"161.1-179.0\"], \"ydata\": [558.0, 117.0, 91.0, 80.0, 63.0, 43.0, 25.0, 13.0, 6.0, 4.0]}, {\"year\": 2021, \"xdata\": [\"0.0-16.6\", \"16.6-33.2\", \"33.2-49.8\", \"49.8-66.4\", \"66.4-83.0\", \"83.0-99.6\", \"99.6-116.2\", \"116.2-132.8\", \"132.8-149.4\", \"149.4-166.0\"], \"ydata\": [564.0, 90.0, 98.0, 75.0, 69.0, 42.0, 33.0, 15.0, 9.0, 5.0]}, {\"year\": 2022, \"xdata\": [\"0.0-17.1\", \"17.1-34.2\", \"34.2-51.3\", \"51.3-68.4\", \"68.4-85.5\", \"85.5-102.6\", \"102.6-119.7\", \"119.7-136.8\", \"136.8-153.9\", \"153.9-171.0\"], \"ydata\": [575.0, 101.0, 79.0, 90.0, 59.0, 46.0, 28.0, 10.0, 9.0, 3.0]}, {\"year\": 2023, \"xdata\": [\"0.0-16.2\", \"16.2-32.4\", \"32.4-48.6\", \"48.6-64.8\", \"64.8-81.0\", \"81.0-97.2\", \"97.2-113.4\", \"113.4-129.6\", \"129.6-145.8\", \"145.8-162.0\"], \"ydata\": [575.0, 90.0, 91.0, 79.0, 59.0, 36.0, 29.0, 29.0, 6.0, 6.0]}]}},\n" +
		// 			"\"binned_payments\":{\"xData\":\"Expected Payouts\",\"xDataUnit\":\"$\",\"yData\":\"Number of Simulations\",\"yDataUnit\":\"#\",\"title\":\"Histograms of county insurance payments distribution as bins\",\"datasets\":{\"data\":[{\"year\":2019,\"priceBins\":[\"0\",\"0.01-6.50\",\"6.5-13.0\",\"13.0-19.5\",\"19.5-26.0\",\"26.0-32.5\",\"32.5-39.0\",\"39.0-45.5\",\"45.5-52.0\",\"52.0-58.5\",\"158.5-165.0\"],\"arc\":[740,21,31,31,48,27,30,152,0,0,0],\"plc\":[700,11,21,21,18,27,18,21,20,12,131]},{\"year\":2020,\"priceBins\":[\"0\",\"0.01-6.50\",\"6.5-13.0\",\"13.0-19.5\",\"19.5-26.0\",\"26.0-32.5\",\"32.5-39.0\",\"39.0-45.5\",\"45.5-52.0\",\"52.0-58.5\",\"158.5-165.0\"],\"arc\":[700,11,21,21,38,27,30,152,0,12,131],\"plc\":[700,11,21,21,18,27,18,21,20,12,131]}]}}\n" +
		// 			"}";
		// }

		if (this.props.hasOwnProperty("yearRowIndex") && this.props["yearRowIndex"] !== null) {
			yearRowIndex = this.props["yearRowIndex"];
		}

		let currYear = "";
		let arcAvgPayout = "";
		let plcAvgPayout = "";
		let arcLikelihood = "";
		let plcLikelihood = "";

		if (jsonData !== null) {
			let objData = JSON.parse(jsonData);

			if (objData.county_average_arc_and_plc_payments && objData.county_average_arc_and_plc_payments !== null){
				currYear = objData.county_average_arc_and_plc_payments.datasets.data[yearRowIndex].point;

				let arc = objData.county_average_arc_and_plc_payments.datasets.data[yearRowIndex].value1;
				let plc = objData.county_average_arc_and_plc_payments.datasets.data[yearRowIndex].value2;

				arcAvgPayout = roundResults(arc.mean, 2);
				arcLikelihood = roundResults(arc.pos);

				plcAvgPayout = roundResults(plc.mean, 2);
				plcLikelihood = roundResults(plc.pos);
			}

			if (objData.binned_payments && objData.binned_payments !== null) {

				bins = objData.binned_payments.datasets.data[yearRowIndex].priceBins;
				arcDists = objData.binned_payments.datasets.data[yearRowIndex].arc;
				plcDists = objData.binned_payments.datasets.data[yearRowIndex].plc;

				if (this.state.hideZeroes){
					bins.shift();
					arcDists.shift();
					plcDists.shift();

					let maxSim = Math.max(...arcDists.concat(plcDists));
					maxYSimulations = Math.ceil(maxSim / 100) * 100; // ceil to nearest hundred
				}
			}

			// let normalizedBins = this.normalizeBinSizes(bins);
			// arcBins = normalizedBins.arcBins;
			// plcBins = normalizedBins.plcBins;

			let arcData = {
				labels: bins,
				datasets: [
					{
						label: "ARC Payments Distribution",
						backgroundColor: "#fd8a43",
						hoverBackgroundColor: "LightSlateGray",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: arcDists
					},
					{
						label: "PLC Payments Distribution",
						backgroundColor: "#5EACCF",
						hoverBackgroundColor: "LightSlateGray",
						strokeColor: "rgba(151,187,205,1)",
						pointColor: "rgba(151,187,205,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(151,187,205,1)",
						data: plcDists
					}
				]
			};

			let chartOptions = {
				responsive: true,
				maintainAspectRatio: true,
				height: 550,
				legend: {
					onClick: (e) => e.stopPropagation(),
					display: false
				},
				scales: {
					xAxes: [{
						ticks: {
							beginAtZero: true
						},
						scaleLabel: {
							display: true,
							labelString: "Expected Payment ($)",
							fontSize: "13"
						},
						position: "bottom"
					}],
					yAxes: [{
						ticks: {
							beginAtZero: true,
							min: 0,
							max: maxYSimulations
						},
						scaleLabel: {
							display: true,
							labelString: "Simulations",
							fontSize: "13"
						}
					}]
				}
			};


			return (
				<div >

					<Grid container style={{width: "1120px", boxShadow: " 0 2px 4px 0px"}} >

						<Grid item style={{padding: "1px", width: "50%", borderStyle: "none", boxShadow: " 0 2px 4px 0px", backgroundColor: "#fd8a43"}}>
							<div className="bin-header"> ARC Payout Distribution - {currYear} </div>
							<div className="bin-subheader"> Avg. Payout: ${arcAvgPayout} &nbsp; &nbsp; Likelihood: {arcLikelihood}% </div>

						</Grid>


						<Grid item style={{padding: "1px", width: "50%", borderStyle: "none", boxShadow: " 0 2px 4px 0px", backgroundColor: "#5EACCF"}}>
							<div className="bin-header"> PLC Payout Distribution - {currYear} </div>
							<div className="bin-subheader"> Avg. Payout: ${plcAvgPayout} &nbsp; &nbsp; Likelihood: {plcLikelihood}% </div>
						</Grid>

						<Grid item style={{width: "100%"}} className="bin-checkbox">
							<ToolTip title={"Click to remove all $0 payments from the simulation and compare only estimated\n" +
							"outcomes from the model that result in an estimated payment."}>
								<FormControlLabel label = "Hide Zero Payments" control={
									<Checkbox
										checked={this.state.hideZeroes}
										onChange={this.handleChange("hideZeroes")}
										value="checkedA"
										color="primary"
									/>
								}
								/>
							</ToolTip>

						</Grid>

						<Grid item style={{width: "100%"}} className="bin-griditem">
							<Bar key="line-2" data={arcData} options={chartOptions} />
						</Grid>

					</Grid>

				</div>
			);
		}
		else {
			//TODO: Improve the error message format
			return (
				<div>
					Nothing to show
				</div>
			);
		}
	}
}

const mapStateToProps = (state) => {
	return {
		countyResultJson: state.model.countyResults,
		yearRowIndex: state.results.yearRowIndex
	};
};

export default connect(mapStateToProps, null)(withStyles(styles)(BinnedGraphs));
