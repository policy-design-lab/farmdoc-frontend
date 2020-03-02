import React, {Component} from "react";

class EvaluatorFooter extends Component {

	constructor(props) {
		super(props);
	}

	//TODO: Use this Tooltip inside the arc/plc tool also
	render() {


		return (
			<div style={{padding: "4px"}}>
				Projected Price of ${this.props.projPrice} and Volatility Factor
				of {this.props.volFactor} have been locked down as of {this.props.lastUpdated} by RMA
			</div>
		);
	}
}

export default EvaluatorFooter;
