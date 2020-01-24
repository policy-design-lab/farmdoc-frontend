import React, {Component} from "react";
import "../styles/main.css";
import "../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import {welcometext, browserWarning, preReleaseMessage, loginMessage, sessionExpired} from "../app.messages";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Layout from "./Layout";

class HomePage extends Component {

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
			// this.handlePrereleasePopupOpen();
			localStorage.setItem("fdFirstVisit", "false");
		}

	}

	render(){

		let notificationDiv = null;

		if (localStorage.getItem("isAuthenticated") !== "true"){
			notificationDiv = (<div className="notification_div">
				<span className="isa_warning">
					{loginMessage}
				</span>
			</div>);
		}


		let welcome = (<div>
			<h2 className="secondary-color">Welcome to the Gardner Program Payment Calculator</h2>
			<br/>
			{welcometext.map((paragraph, index) => <p key={index} className="secondary-color">{paragraph} <br/></p>)}
		</div>);

		let howwork =
			(<div style={{textAlign: "center"}}>
				<h2 className="secondary-color">How does the simulation work?</h2>
				<br/>
				<img src={require("../images/farmdoc-rep-image.png")} alt="Payment Calculator Inputs"/>
			</div>);

		return (
			<div>
				<Layout selectedTab="about">

					<Dialog
						open={this.state.IEPopup}
						onClose={this.handleIEPopupClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title" >
							<span style={{fontWeight: "bolder"}}> Unsupported Browser Detected</span>
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								{browserWarning}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleIEPopupClose} color="primary" autoFocus>
								Continue
							</Button>
						</DialogActions>
					</Dialog>

					<Dialog
						open={this.state.PreReleasePopup}
						onClose={this.handlePrereleasePopupClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title" >
							<span style={{fontWeight: "bolder"}}> Beta Release Notification</span>
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								{/*{preReleaseMessage}*/}
								You are using a beta version of this tool which remains under development.
								The alpha release temporary account is now disabled.
								If you haven't already done so, you will need to click the
								<span style={{color: "red"}}><strong> REGISTER</strong></span> link at the top of this page to create an account.
								You will only need to create an account once, all subsequent releases of the tool will be available using the account you create.
								After creating and verifying your account, use the LOGIN button at the top of this page to access the payment calculator.
								The beta release operates as a demonstration of the tool and additional developments and data may be incorporated into the final version.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handlePrereleasePopupClose} color="primary" autoFocus>
								Continue
							</Button>
						</DialogActions>
					</Dialog>

					{notificationDiv}

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
				</Layout>
			</div>
		);

	}
}

export default HomePage;
