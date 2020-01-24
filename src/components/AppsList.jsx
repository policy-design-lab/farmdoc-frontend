import React, {Component} from "react";
import {Button} from "react-mdc-web"; //TODO: Change to material-ui button

import "../styles/main.css";
import {browserHistory} from "react-router";

class AppsList extends Component {

	handleAppChange = name => event => {
		switch (name) {
			case "paymentCalc":
				browserHistory.push("/payment-calculator/");
				break;

			case "premiumCalc":
				browserHistory.push("/premium-calculator/");
				break;
		}
	};

	render() {
		return (
			<div >
				Farmdoc Apps <br/>
				<Button id="paymentCalc" onClick={this.handleAppChange("paymentCalc")} style={{height: "40px"}}>Payment Calculator</Button>
				<Button id="premiumCalc" onClick={this.handleAppChange("premiumCalc")} style={{height: "40px"}}>Premium Calculator</Button>
			</div>
		);
	}

}

export default AppsList;
