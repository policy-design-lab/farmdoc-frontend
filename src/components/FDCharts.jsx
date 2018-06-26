import React, {Component} from "react";
import AuthorizedWarp from "./AuthorizedWarp";
import AnalyzerWrap from "./AnalyzerWrap";
import Header from "./Header";
import {Line, Bar} from "react-chartjs-2";
import Grid from "@material-ui/core/Grid";

class FDCharts extends Component{

	render() {

		//let chartData = [{x: 1, y: 2}, {x: 3, y: 5}, {x: 7, y: -3}];

		let meanPrice ={
			labels: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
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
					data: [3.713, 3.76, 3.781, 3.791, 3.795, 3.797, 3.798, 3.798, 3.799, 3.799]
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
					data: [191.793, 193.785, 195.777, 197.77, 199.762, 201.754, 203.746, 205.738, 207.73, 209.723]
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
			labels: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
			datasets: [
				{
					label: "ARC Payments",
					backgroundColor: "LightGray",
					hoverBackgroundColor: "LightSlateGray",
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [14.889, 11.263, 9.6484, 8.5299, 8.8463, 9.318, 9.3806, 9.736, 9.6558, 9.6973]
				},
				{
					label: "PLC Payments",
					backgroundColor: "DarkGray",
					hoverBackgroundColor: "LightSlateGray",
					strokeColor: "rgba(151,187,205,1)",
					pointColor: "rgba(151,187,205,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(151,187,205,1)",
					data: [22.834, 22.876, 22.597, 22.449, 21.959, 21.787, 21.564, 21.831, 21.453, 21.011]
				}
			]
		};
		let currPaymentChartOptions = {
			responsive:false,
			scales: {
				responsive:false,
				yAxes: [{
					ticks: {
						beginAtZero: true
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

		let newPayments =  {
			labels: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
			datasets: [
				{
					label: "ARC Payments",
					backgroundColor: "LightGray",
					hoverBackgroundColor: "LightSlateGray",
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [19.833,13.59,12.834,10.423,12.292,10.398,10.16,11.505,11.099,10.227]
				},
				{
					label: "PLC Payments",
					backgroundColor: "DarkGray",
					hoverBackgroundColor: "LightSlateGray",
					strokeColor: "rgba(151,187,205,1)",
					pointColor: "rgba(151,187,205,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(151,187,205,1)",
					data: [30.367,30.422,30.052,29.855,29.203,28.974,28.678,29.034,28.53,27.942]
				}
			]
		};
		let newPaymentChartOptions = {
			responsive:false,
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			},
			title: {
				display:true,
				text:"ARC/PLC Payments - Coverage: 90% Range: 20%",
				fontColor: "DarkBlue",
				fontSize: 18
			}
		};

		let barChartOptions = {
			responsive:false,
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			},
			title: {
				display:true,
				text:"Bar Graph ARC/PLC Payments - Coverage: 90% Range: 20%",
				fontColor: "DarkBlue",
				fontSize: 18
			}
		};

		return (
			<div>
				<Header selected='charts'/>
				<AnalyzerWrap activeTab={5}/>
				<AuthorizedWarp>
					<div style={{margin:"50px"}}>

						<div>

							<Bar key="line-21" data={meanPrice} options={meanPriceChartOptions} width="600"  height="250" />
						</div>
						<br/>

						<div>

							<Bar key="line-22" data={meanYield} options={meanYieldChartOptions} width="600" height="250" />
						</div>
						<br/>


						<div >
							<Grid container alignItems="center" direction="row">
								<Grid item>
									<Line key="line-1" data={arcplcPayments} options={currPaymentChartOptions} width="600" height="250" />
								</Grid>
								<Grid item>
									<Line key="line-16" data={newPayments} options={newPaymentChartOptions} width="600" height="250" />
								</Grid>
							</Grid>
						</div>
						<br/>


						<div>
							<Line key="line-16" data={newPayments} options={newPaymentChartOptions} width="600" height="250" />

						</div>
						<br/>
						<br/>
						<hr/>
						<br/>
						<br/>
						<div>

							<Bar key="line-2" data={newPayments} options={barChartOptions} width="600" height="300" />
						</div>
					</div>
				</AuthorizedWarp>
			</div>
		);
	}

}

export default FDCharts;
