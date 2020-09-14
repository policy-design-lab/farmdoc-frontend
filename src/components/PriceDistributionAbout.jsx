import React, {Component} from "react";
import "../styles/main.css";
import "../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import Layout from "./Layout";
import AuthorizedWrap from "./AuthorizedWrap";

class About extends Component {

	render(){
		let welcome = (<div>
			<h2 className="secondary-color">Welcome to the Price Distribution Tool</h2>
			<br/>
			<p key="about" className="secondary-color">
				The iFARM Price Distribution Tool uses current option market prices from the ChicagoMercantile Exchange to derive estimates
				of the probability distribution of prices at the Expiration of an underlying corn and soybean futures contracts.
			</p>
			<br/>
			<h3 className="secondary-color">Tool Features</h3>
			<p key="feature1" className="secondary-color">
			The model uses a process similar to the Black-Scholes model for option prices to identify the best fitting distribution of prices,
			parameterized as a lognormal distribution, but generalized across all options simultaneously  (estimation process similar to that
			developed in Sherrick, B.J., S.H. Irwin and D.L. Forster, "An Examination of Option-Implied S&P 500 Futures Price Distributions",
			The Financial Review, v.31, no. 3(1996), 667-694.)
			</p>
			<p key="feature2" className="secondary-color" style={{paddingTop: "5px"}}>
				The utility allows the user to identify the probability distribution most consistent with current market prices and then tabulates
				the probability of being above or below various price levels.  The outputs are provided in both graphical and tabular form.
			</p>
		</div>);

		let howwork =
			(<div style={{textAlign: "center"}}>
				<h2 className="secondary-color">How does the price distribution tool work?</h2>
				<br/>
				<img src={require("../images/pricedistr-rep-image.png")} alt="Price Distribution Tool Inputs" style={{maxWidth: "600px"}}/>
			</div>);

		return (
			<div>
				<Layout selectedTab="about">
					<AuthorizedWrap>
						<div className="home-content"
								 style={{backgroundSize: "cover", backgroundPosition: "center"}}
						>
							<Grid>
								<Cell col={6}>
									{welcome}
								</Cell>
								<Cell col={6}>
									{howwork}
								</Cell>
							</Grid>
						</div>
					</AuthorizedWrap>
				</Layout>
			</div>
		);
	}
}

export default About;
