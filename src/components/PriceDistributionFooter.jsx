import React, {Component} from "react";
import PropTypes from "prop-types";

class PriceDistributionFooter extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		let dateOptions = {year: "numeric", month: "long", day: "numeric"};
		let timeOptions = {hour: "2-digit", minute: "2-digit"};
		let date = new Date();
		let priceDate = date.toLocaleDateString("en-US", dateOptions); // September 17, 2016
		let priceTime = date.toLocaleTimeString("en-US", timeOptions); // 12:12 PM

		return (
			<div style={{textAlign: "left", padding: "0px", margin: "10px", fontWeight: 500}}>
				<span>Accessed on {priceDate}, {priceTime}.</span>
				<br />
				<span style={{fontSize: "small"}}>Copyright © 2020. Futures: at least 10 minutes delayed. Information is provided 'as is'
					and solely for informational purposes, not for trading purposes or advice. To see all exchange delays
					and terms of use, please see <a href="https://www.barchartmarketdata.com/terms"
																					style={{color: "blue", textDecoration: "underline"}}
																					target="_blank">disclaimer</a>.</span>
			</div>
		);
	}
}

PriceDistributionFooter.propTypes = {
	probability: PropTypes.number,
	expirationPrice: PropTypes.string,
};

export default PriceDistributionFooter;

