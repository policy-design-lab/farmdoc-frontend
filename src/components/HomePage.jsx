import React, {Component} from "react";
import "../styles/main.css";
import "../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import {welcometext, browserWarning, preReleaseMessage} from "../app.messages";
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
		this.setState({PreReleasePopup: true});
	};

	handleIEPopupClose = () => {
		this.setState({PreReleasePopup: false});
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
								{preReleaseMessage}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handlePrereleasePopupClose} color="primary" autoFocus>
								Continue
							</Button>
						</DialogActions>
					</Dialog>

					<div className="home-content"
					 style={{backgroundSize: "cover", backgroundPosition: "center"}}
					>
						{window.innerWidth > 1300 ?
							<Grid>
								<Cell col={6}>

									{welcome}
								</Cell>
								<Cell col={6}>
									{howwork}
								</Cell>
							</Grid> :
							<Grid>
								<Cell col={6}>
									{welcome}
									<br/>
									{howwork}
								</Cell>
							</Grid>}
					</div>
				</Layout>
			</div>
		);

	}
}

export default HomePage;
