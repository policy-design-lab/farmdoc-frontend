import React, {Component} from "react";
import "../../styles/main.css";
import "../../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import {welcometext, browserWarning, preReleaseMessage, loginMessage, sessionExpired} from "../../app.messages";
import Button from "@material-ui/core/Button";

import Layout from "../Layout";
import AuthorizedWrap from "../AuthorizedWrap";

class About extends Component {

	state = {
		IEPopup: false,
		PreReleasePopup: false
	};

	handleIEPopupOpen = () => {
		this.setState({IEPopup: true});
	};

	handleIEPopupClose = () => {
		this.setState({IEPopup: false});
	};

	handlePrereleasePopupOpen = () => {
		this.setState({PreReleasePopup: true});
	};

	handlePrereleasePopupClose = () => {
		this.setState({PreReleasePopup: false});
	};

	componentDidMount() {
		if (sessionStorage.getItem("firstVisit") === "true"){
			if (sessionStorage.getItem("isIE") === "true") {
				this.handleIEPopupOpen();
			}
			sessionStorage.setItem("firstVisit", "false");
		}

		if (localStorage.getItem("fdFirstVisit") === "true"){
			this.handlePrereleasePopupOpen();
			localStorage.setItem("fdFirstVisit", "false");
		}
	}

	render(){

		let welcome = (<div>
			<h2 className="secondary-color">Welcome to the Gardner Program Payment Calculator</h2>
			<br/>
			{welcometext.map((paragraph, index) => <p key={index} className="secondary-color">{paragraph} <br/></p>)}
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
						<div className="docsHeader"> Coming Soon.. </div>

					</AuthorizedWrap>
				</Layout>
			</div>
		);

	}
}

export default About;
