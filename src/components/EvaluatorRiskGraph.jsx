import React, {Component} from "react";
import {roundResults} from "../public/utils.js";

import {Line} from "react-chartjs-2";
import {connect} from "react-redux";

class EvaluatorRiskGraph extends Component {

	render() {

		let graphInfo = [{
			"revenue": 79.712177364702,
			"no-ins": 0,
			"rp-85": 0,
			"rphpe-85": 0,
			"yp-85": 0,
			"arp-90": 0,
			"arphpe-90": 0,
			"ayp-90": 0
		},
		{
			"revenue": 239.712177364702,
			"no-ins": 0.018,
			"rp-85": 0,
			"rphpe-85": 0,
			"yp-85": 0,
			"arp-90": 0,
			"arphpe-90": 0,
			"ayp-90": 0.0007
		},
		{
			"revenue": 311,
			"no-ins": 0.035,
			"rp-85": 0,
			"rphpe-85": 0,
			"yp-85": 0,
			"arp-90": 0.0017,
			"arphpe-90": 0.017,
			"ayp-90": 0.003
		},
		{
			"revenue": 470,
			"no-ins": 0.23,
			"rp-85": 0,
			"rphpe-85": 0,
			"yp-85": 0.0003,
			"arp-90": 0.0067,
			"arphpe-90": 0.067,
			"ayp-90": 0.097
		},
		{
			"revenue": 530,
			"no-ins": 0.34,
			"rp-85": 0.0017,
			"rphpe-85": 0.0017,
			"yp-85": 0.268,
			"arp-90": 0.0167,
			"arphpe-90": 0.167,
			"ayp-90": 0.192
		},
		{
			"revenue": 620,
			"no-ins": 0.56,
			"rp-85": 0.568,
			"rphpe-85": 0.568,
			"yp-85": 0.568,
			"arp-90": 0.3167,
			"arphpe-90": 0.3167,
			"ayp-90": 0.42
		}
		];

		if (this.props.graphInfo !== null){
			graphInfo = this.props.graphInfo;
		}

		if (graphInfo !== null) {

			let revs = [];
			let noIns = [];
			let rp = [];
			let rphpe = [];
			let yp = [];
			let arp = [];
			let arphpe = [];
			let ayp = [];

			graphInfo.forEach(function(e){
				revs.push(`$${roundResults(e["revenue"])}`);
				noIns.push(roundResults(e["no-ins"] * 100, 2));
				rp.push(roundResults(e["rp-85"] * 100, 2));
				rphpe.push(roundResults(e["rphpe-85"] * 100, 2));
				yp.push(roundResults(e["yp-85"] * 100, 2));
				arp.push(roundResults(e["arp-90"] * 100, 2));
				arphpe.push(roundResults(e["arphpe-90"] * 100, 2));
				ayp.push(roundResults(e["ayp-90"] * 100, 2));
			});

			let graphData = {
				labels: revs,
				datasets: [
					{
						label: "No Ins",
						data: noIns,
						borderColor: "blue",
						backgroundColor: "blue",
						fill: false,
						pointRadius: 0,
						borderRadius: 2,
						borderWidth: 2
					},
					{
						label: "RP85",
						data: rp,
						borderColor: "red",
						backgroundColor: "red",
						fill: false,
						pointRadius: 0,
						borderRadius: 2,
						borderWidth: 2
					},
					{
						label: "RP-HPE85",
						data: rphpe,
						borderColor: "orange",
						backgroundColor: "orange",
						fill: false,
						pointRadius: 0,
						borderRadius: 2,
						borderWidth: 2
					},
					{
						label: "YP85",
						data: yp,
						borderColor: "green",
						backgroundColor: "green",
						fill: false,
						pointRadius: 0,
						borderRadius: 2,
						borderWidth: 2
					},
					{
						label: "ARP90",
						data: arp,
						borderColor: "purple",
						backgroundColor: "purple",
						fill: false,
						pointRadius: 0,
						borderRadius: 2,
						borderWidth: 2
					},
					{
						label: "ARP-HPE90",
						data: arphpe,
						borderColor: "magenta",
						backgroundColor: "magenta",
						fill: false,
						pointRadius: 0,
						borderRadius: 2,
						borderWidth: 2
					},
					{
						label: "AYP90",
						data: ayp,
						borderColor: "cyan",
						backgroundColor: "cyan",
						fill: false,
						pointRadius: 0,
						borderRadius: 2,
						borderWidth: 2
					}
				]
			};

			let graphTitle = `Probabilities of ${this.props["CSCName"][0]} Revenue (per acre) with Insurance - ${this.props["CSCName"][2]}, ${this.props["CSCName"][1]}`;

			let graphOptions = {
				title: {
					display: true,
					text: `${graphTitle}`,
					// fontColor: "DarkBlue",
					fontSize: 20
				},
				layout: {
					padding: {
						// left: 50,
					}
				},
				tooltips: {
					mode: "index",
					intersect: false,
					position: "average",
					callbacks: {
						title: function(tooltipItems, data) {
							return `Target Revenue: ${ tooltipItems[0].xLabel}`;
						},
						label: function(item, data) {
							let datasetLabel = data.datasets[item.datasetIndex].label || "";
							let dataPoint = item.yLabel;
							return `${datasetLabel }: ${ roundResults(dataPoint, 1) }%`;
						}
					}
				},
				hover: {
					mode: "index",
					intersect: false
				},
				legend: {
					position: "right",
					 labels: {
						usePointStyle: false,
						boxWidth: 15,
						 padding: 12
					}
				},
				scales: {
					yAxes: [{
						ticks: {
							// min: 0,
							// max: 100,
							callback: function(value) {
								return `${value }%`;
							}
						},
						scaleLabel: {
							display: true,
							labelString: "Percentage"
						}
					}],
					xAxes: [{
						scaleLabel: {
							display: true,
							labelString: "Target Revenue"
						}
					}]
				}
			};

			return (
				<div style={{textAlign: "center", margin: "0 auto", maxWidth: "1085px"}}>
					<div style={{maxWidth: "900px", margin: "0 auto", padding: "15px"}}>
						<Line data={graphData} options={graphOptions}/>
					</div>

					This graph shows the impact of alternative crop insurance products,
					associating the likelihood of revenue outcomes with their levels.
					It is generally better to have a higher likelihood of higher revenue,
					so lines that are below and to the right are preferable. Often, group products,
					if offered in a county, will have lower net costs and improve average revenue but
					do less to mitigate the likelihood for very low outcomes, for example.
					The "No Ins" line shows the revenues and their associated probabilities with no insurance.
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

const mapStateToProps = state => ({
	CSCName: state.insEvaluator.cropStateCountyName
});

export default connect(mapStateToProps)((EvaluatorRiskGraph));
