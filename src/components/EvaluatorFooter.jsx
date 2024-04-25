import React, {Component} from "react";
import {roundResults} from "../public/utils";

class EvaluatorFooter extends Component {

	constructor(props) {
		super(props);
	}

	//TODO: Use this Tooltip inside the arc/plc tool also
	render() {


		return (
			<div style={{padding: "4px"}}>
				RMA 2024 Projected Price is ${this.props.projPrice} with Volatility Factor of {this.props.volFactor}. Last Updated on {this.props.lastUpdated}.
			</div>
		);
	}
}

export default EvaluatorFooter;
