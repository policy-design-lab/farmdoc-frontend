import React, {Component} from "react";

class EvaluatorFarmInfo extends Component {

	render() {

		let farmInfo = null;

		if (this.props.hasOwnProperty("farmInfo") && this.props.hasOwnProperty("farmInfo") !== null) {
			farmInfo = this.props["farmInfo"];
		}

		return (
			<div>
				Farm Info goes here.....
			</div>
		);
	}
}

export default EvaluatorFarmInfo;
