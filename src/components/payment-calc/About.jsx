import React, {Component} from "react";
import "../../styles/main.css";
import "../../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import {arcplcWelcomeText} from "../../app.messages";
import Layout from "../Layout";
import AuthorizedWrap from "../AuthorizedWrap";

class About extends Component {

	render(){

		let welcome = (<div>
			<h2 className="secondary-color">Welcome to the Gardner Program Payment Calculator</h2>
			<br/>
			{arcplcWelcomeText.map((paragraph, index) => <p key={index} className="secondary-color">{paragraph} <br/></p>)}
		</div>);

		let howwork =
			(<div style={{textAlign: "center"}}>
				<h2 className="secondary-color">How does the simulation work?</h2>
				<br/>
				<img src={require("../../images/farmdoc-rep-image.png")} alt="Payment Calculator Inputs"/>
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
