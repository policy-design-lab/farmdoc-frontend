import React, {Component} from "react";
import Header from "./Header";
import "../styles/main.css";
import "../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import Login from "./Login";
import {welcometext, browserWarning} from "../app.messages";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class HomePage extends Component {

	state = {
		IEPopup: false
	};

	handlePopupOpen = () => {
		this.setState({IEPopup: true});
	};

	handlePopupClose = () => {
		this.setState({IEPopup: false});
	};

	componentDidMount() {
		if (sessionStorage.getItem("firstVisit") === "true"){
			if (sessionStorage.getItem("isIE") === "true") {
				this.handlePopupOpen();
			}
			sessionStorage.setItem("firstVisit", "false");
		}
	}
	
	render(){

		let welcome = (<div>
			<h1 className="secondary-color">Welcome to the Farmdoc Project</h1>
			<br/>
			{welcometext.map((paragraph, index) => <p key={index} className="secondary-color">{paragraph} <br/></p>)}
		</div>);


		let howwork =
			(<div style={{textAlign: "center"}}>
				<h1 className="secondary-color">How does the simulation work?</h1>
				<br/>
				<img src={require("../images/farmdoc-rep-image.png")} style={{borderStyle: "ridge"}}/>
			</div>);


		return (
			<div>

				<Dialog
						open={this.state.IEPopup}
						onClose={this.handlePopupClose}
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
						<Button onClick={this.handlePopupClose} color="primary" autoFocus>
							Continue
						</Button>
					</DialogActions>
				</Dialog>

				<Header selected="home"/>
				<span className="home-line"/>

				<div className="home-content"
					 style={{backgroundSize: "cover", backgroundPosition: "center"}}
				>
					{window.innerWidth > 1300 ?
						<Grid>
							<Cell col={4}>

								{welcome}
							</Cell>
							<Cell col={4}>
								{howwork}
							</Cell>
							<Cell col={4}>
								<Login message={this.props.message}/>
							</Cell>
						</Grid> :
						<Grid>
							<Cell col={6}>
								{welcome}
								<br/>
								{howwork}
							</Cell>
							<Cell col={6}>
								<Login message={this.props.message}/>
							</Cell>
						</Grid>}
				</div>
			</div>
		);


	}
}

export default HomePage;
