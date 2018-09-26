import React, {Component} from "react";
import ReactDOM from "react-dom";
import { HotTable, HotRow } from "@handsontable/react";
import { connect } from "react-redux";
import AuthorizedWarp from "./AuthorizedWarp";
import AnalyzerWrap from "./AnalyzerWrap";
import Header from "./Header";
import {Line, Bar} from "react-chartjs-2";
import Grid from "@material-ui/core/Grid";
import "handsontable/dist/handsontable.full.css";

class FarmerCharts extends Component{

	constructor(props) {
		super(props);
	}

	render() {
		let arrYears, arrPrices, arrYields, arrProb, arrArc , arrPlc;
		let arrTable = [];

		let years = [];
		let prices = [];
		let yields = [];
		let arc = [];
		let plc = [];
		let probArc =[];
		let probPlc = [];

		//var hot = new Handsontable()

		if (this.props.hasOwnProperty("countyResultJson") && this.props["countyResultJson"] !== null) {
			let jsonData = this.props["countyResultJson"];
			let objData = JSON.parse(jsonData);

			if(objData.county_average_arc_and_plc_payments && objData.county_average_arc_and_plc_payments !== null){

				let arcplcData = objData.county_average_arc_and_plc_payments.datasets.data;

				arcplcData.forEach(function(element) {
					years.push(element.point);
					arc.push(element.value1.mean);
					plc.push(element.value2.mean);
					probArc.push(element.value1.pos);
					probPlc.push(element.value2.pos);

				});
			}

			if(objData.mean_prices && objData.mean_prices !== null){

				let priceData = objData.mean_prices.datasets.data;

				priceData.forEach(function(element) {
					prices.push(element.value1.mean);
				});
			}

			if(objData.county_yields && objData.county_yields !== null){

				let yieldData = objData.county_yields.datasets.data;

				yieldData.forEach(function(element) {
					yields.push(element.value1.mean);
				});
			}

			let arrYears = ["Year"].concat(years);
			let arrPrices = ["Simulated Price ($)"].concat(prices);
			let arrYields = ["Simulated Yield (bushels)"].concat(yields);
			let arrProbArc = ["ARC Payment Probability(%)"].concat(probArc);
			let arrProbPlc = ["PLC Payment Probability(%)"].concat(probPlc);
			let arrArc = ["ARC Payment($)"].concat(arc);
			let arrPlc = ["PLC Payment ($)"].concat(plc);


			let arrTable = [];
			arrTable[0]= arrYears;
			arrTable[1] = arrArc;
			arrTable[2] = arrPlc;
			arrTable[3] = arrProbArc;
			arrTable[4] = arrProbPlc;

			let arrPrYields =[];
			arrPrYields[0] = arrYears;
			arrPrYields[1] = arrPrices;
			arrPrYields[2] = arrYields;

			let avgpayments = [
			["","2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
			["Exp. ARC Payment($)", 14.889, 11.263, 9.6484, 8.5299, 8.8463, 9.318, 9.3806, 9.736, 9.6558, 9.6973],
			["Exp. PLC Payment ($)", 22.834, 22.876, 22.597, 22.449, 21.959, 21.787, 21.564, 21.831, 21.453, 21.011],
			["Simulated Price ($)", 3.713, 3.76, 3.781, 3.791, 3.795, 3.797, 3.798, 3.798, 3.799, 3.799],
			["Simulated Yield (bushels)", 191.79, 193.78, 195.77, 197.77, 199.76, 201.75, 203.74, 205.73, 207.73, 209.72],
			["Payment Probability", 0.71, 0.78, 0.77, 0.77, 0.76, 0.75, 0.74, 0.73, 0.73, 0.72]

			];

			let meanPrice ={
				labels: years,
				datasets: [
					{
						label: "Mean Corn Price",
						backgroundColor: "LightGray",
						hoverBackgroundColor: "LightSlateGray",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: prices
					}]
			};

			let meanPriceChartOptions = {
				responsive:false,
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: false
						}
					}]
				},
				title: {
					display:true,
					text:"Mean Corn Price($)",
					fontColor: "DarkBlue",
					fontSize: 18
				}
			};

			let meanYield ={
				labels: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
				datasets: [
					{
						label: "Mean Corn Yield",
						backgroundColor: "LightGray",
						hoverBackgroundColor: "LightSlateGray",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: [191.79, 193.78, 195.77, 197.77, 199.76, 201.75, 203.74, 205.73, 207.73, 209.72]
					}]
			};

			let meanYieldChartOptions = {
				responsive:false,
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: false
						}
					}]
				},
				title: {
					display:true,
					text:"Mean Corn Yield in Bushels",
					fontColor: "DarkBlue",
					fontSize: 18
				}
			};


			let arcplcPayments =  {
				labels: years,
				datasets: [
					{
						label: "ARC Payments",
						backgroundColor: "Orange",
						hoverBackgroundColor: "LightSlateGray",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: arc
					},
					{
						label: "PLC Payments",
						backgroundColor: "SkyBlue",
						hoverBackgroundColor: "DarkGray",
						strokeColor: "rgba(151,187,205,1)",
						pointColor: "rgba(151,187,205,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(151,187,205,1)",
						data: plc
					}
				]
			};

			let barChartOptions = {
				responsive:false,
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
						}
					}]
				},
				title: {
					display:true,
					text:"ARC/PLC Payments - Coverage: 86% Range: 10%",
					fontColor: "DarkBlue",
					fontSize: 18
				}
			};

			return (
			<div>
				<Header selected="charts"/>
				<AnalyzerWrap activeTab={5}/>
				<AuthorizedWarp>
					<div style={{margin:"50px"}}>

						<div >
							<Grid container  direction="column" alignItems="center">
								<Grid item>
									<Bar key="line-2" data={arcplcPayments} options={barChartOptions} width="600" height="300" />
								</Grid>

								<Grid item alignItems="center" justify="center" alignContent="center">

									<div id="hot-app3" >
										<HotTable  id="arcPlc" data={arrTable} colHeaders={false} rowHeaders={false} width="800" height="120" stretchH="all" />
									</div>								</Grid>


								<Grid item alignItems="center" justify="center" alignContent="center" style={{fontWeight: "bold"}} >
									<br/>Expected Avg. Prices & Yields

								</Grid>

								<Grid item alignItems="center" justify="center" alignContent="center">
									<div id="hot-app4" >
										<HotTable id="prYields" data={arrPrYields} colHeaders={false} rowHeaders={false} width="800" height="70" stretchH="all"   />
									</div>
								</Grid>
							</Grid>
						</div>

						<br/>

						<div>
							<Grid container  direction="column" alignItems="center">
								<Grid item>
									<Bar key="line-21" data={meanPrice} options={meanPriceChartOptions} width="600"  height="250" />
								</Grid>

								<Grid item alignItems="center" justify="center" alignContent="center">
									<Bar key="line-22" data={meanYield} options={meanYieldChartOptions} width="600" height="250" />
								</Grid>
							</Grid>
						</div>

						<div />

					</div>
				</AuthorizedWarp>
			</div>
			);
		}
		else{
			return(
				<div>
				<Header selected="charts" />
				<AnalyzerWrap activeTab={5} />
					<AuthorizedWarp>
				<div>Run the model first</div>
					</AuthorizedWarp>
		
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

export default connect(mapStateToProps, null) (FarmerCharts);
