import React, {Component} from "react";
import {roundResults} from "../public/utils.js";

import {Line} from "react-chartjs-2";
import {connect} from "react-redux";

class IntegratedRiskGraph extends Component {

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

		if (this.props.graphInfo !== undefined && this.props.graphInfo !== null){
			graphInfo = this.props.graphInfo;
		}
		console.log(this.props);

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

			let applicableGraph = rp;

			switch (this.props.policy.toString().toLowerCase()){
				case "rp":
					applicableGraph = rp;
					break;
				case "rphpe":
					applicableGraph = rphpe;
					break;
				case "yp":
					applicableGraph = yp;
					break;
				case "arp":
					applicableGraph = arp;
					break;
				case "arphpe":
					applicableGraph = arphpe;
					break;
				case "ayp":
					applicableGraph = ayp;
					break;
			}
			
			let graphData = {
				labels: revs,
				datasets: [
					{
						label: "No Ins",
						data: noIns,
						borderColor: "red",
						backgroundColor: "red",
						fill: false,
						pointRadius: 0,
						borderRadius: 2,
						borderWidth: 2
					},
					{
						label: this.props.policy,
						data: applicableGraph,
						borderColor: "green",
						backgroundColor: "green",
						fill: false,
						pointRadius: 0,
						borderRadius: 2,
						borderWidth: 2
					},

				]
			};
			let cscName = ["Corn", "Illinois", "Adams"];
			if (this.props["CSCName"] !== undefined) {
				cscName = this.props["CSCName"];
			}

			let graphTitle = `Probabilities of ${cscName[0]} Revenue (per acre) with Insurance - ${cscName[2]}, ${cscName[1]} `;

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

				</div>
			);
		}
		else {
			return (
				<div>
					nothing to show
				</div>
			);
		}
	}
}

const mapStateToProps = state => ({
	CSCName: state.insEvaluator.cropStateCountyName
});

export default connect(mapStateToProps)((IntegratedRiskGraph));
