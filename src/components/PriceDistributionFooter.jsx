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
			<div style={{textAlign: "left", padding: "4px", marginLeft: "40px", fontWeight: 500}}>
				<span>Accessed on {priceDate}, {priceTime}. The implied distribution indicates that there is a {this.props.probability} %
				probability that the price will be below $ {this.props.expirationPrice} at expiration.</span>
				<br />
				<br />
				<span style={{fontSize: "small"}}>Copyright © 2020. Futures: at least 10 minutes delayed. Information is provided 'as is'and solely
				for informational purposes, not for trading purposes or advice. To see all exchange delays
				and terms of use, please see disclaimer.</span>
			</div>
		);
	}
}

PriceDistributionFooter.propTypes = {
	probability: PropTypes.number,
	expirationPrice: PropTypes.number,
};

export default PriceDistributionFooter;

