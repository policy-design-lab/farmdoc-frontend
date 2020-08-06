import React, {Component} from "react";
import "../styles/main.css";
import "../styles/home-page.css";
import {priceDistrWelcomeText} from "../app.messages";
import {Cell, Grid} from "react-mdc-web";
import Layout from "./Layout";
import AuthorizedWrap from "./AuthorizedWrap";

class About extends Component {

	render(){
		let welcome = (<div>
			<h2 className="secondary-color">Welcome to the Price Distribution Tool</h2>
			<br/>
			{priceDistrWelcomeText.map((paragraph, index) => <p key={index} className="secondary-color">{paragraph} <br/></p>)}
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
								<Cell col={5}>
									{welcome}
								</Cell>
								<Cell col={7}>
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
