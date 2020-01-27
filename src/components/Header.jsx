import React, {Component} from "react";
import {browserHistory, Link} from "react-router";
import {withStyles} from "@material-ui/core/styles";
import "../styles/header-footer.css";
import "../styles/main.css";
import {Button, Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppsIcon from "@material-ui/icons/Apps";
import IconButton from "@material-ui/core/IconButton";

import config from "../app.config";
import {
	clearKeycloakStorage,
	checkForTokenExpiry
} from "../public/utils";
import {Modal} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AppsList from "./AppsList";


const keycloak = config.keycloak;


const styles = theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
	label: {
		textTransform: "none",
		fontSize: "16px !important"
	},
	tab: {
		minWidth: "80px"
	},
	paper: {
		position: "absolute",
		//width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		outline: "none"
	}
});

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
		display: "inline-block",
		borderRadius: 12
	};
}

class Header extends Component {

	constructor(props){
		super(props);

		this.state = {
			appsPopupOpen: false
		};

		this.handleLogout = this.handleLogout.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
	}

	handleAppsOpen = () => {
		this.setState({appsPopupOpen: true});
	};

	handleAppsClose = () => {
		this.setState({appsPopupOpen: false});
	};

	componentDidMount(): void {

		if (localStorage.getItem("isAuthenticated") === "true") {
			// if authenticated flag is set, re-check for token expiry. Reload page if expired
			if (checkForTokenExpiry()) {
				clearKeycloakStorage();
				window.location.reload();
			}
			else { // If token is not expired, set the timer to check for expiry
				let interval = setInterval( function(){
					if (localStorage.getItem("isAuthenticated") === "true") {
						if (checkForTokenExpiry()) {
							clearKeycloakStorage();
							browserHistory.push("/"); //TODO: Change to apps
						}
					}
					else { // clear timer once isAuthenticated is set to false in storage
						clearInterval(interval);
						// browserHistory.push("/");
					}
				}, 15000);
			}
		}
	}

	handleLogin(){
		browserHistory.push("/login");
	}

	handleRegister(){
		keycloak.init().success(function(){
			keycloak.register({});
		});
	}

	handleLogout(){
		clearKeycloakStorage();
		this.props.handleUserLogout();
		keycloak.init().success(function(){
			keycloak.logout({}).success(function(){
				browserHistory.push("/");
			});
		});
	}


	//TODO: add fixed for Toolbar
	render(){

		const {classes} = this.props;

		//TODO: Improve this logic to get from a config when more apps are defined
		let currApp = (window.location.pathname).split("/")[1];
		if (currApp === ""){
			currApp = "home";
		}

		console.log(currApp);

		let tabHeader = "Calculator";

		if (currApp.indexOf("payment") !== -1){
			tabHeader = "Payment Calculator";
		}
		else if (currApp.indexOf("premium") !== -1){
			tabHeader = "Premium Calculator";
		}

		return (
			<div className={classes.root}>

				<Modal open={this.state.appsPopupOpen} onClose={this.handleAppsClose}>
					<div style={getModalStyle()} className={classes.paper}>
						<IconButton className="closeImg" onClick={this.handleAppsClose}>
							<CloseIcon />
						</IconButton>
						<AppsList/>

					</div>
				</Modal>

				<Toolbar>
					<ToolbarRow className="banner">
						<ToolbarSection align="start" style={{maxWidth: 225}}>
							<IconButton onClick={this.handleAppsOpen} >
								<AppsIcon style={{width: "44px", height: "44px", color: "white"}} />
							</IconButton>

							<a href="/" className={"farmdoc"}>
								<img src={require("../images/GAPP-logo.png")}/>
								<span style={{display: "inline", verticalAlign: "middle"}}>FarmDoc</span>
							</a>
						</ToolbarSection>
						<ToolbarSection>
							{/*{browserWarningSpan}*/}
							{(!this.props.selectedTab || !(localStorage.getItem("isAuthenticated") !== null &&
									localStorage.getItem("isAuthenticated") === "true") && (currApp === "home")) ? null :

								<Tabs value={this.props.selectedTab}
												TabIndicatorProps={{style: {backgroundColor: "orange"}}} className="headerSection">
									<Tab value="calculator" label={<span className={classes.label}>{tabHeader}</span>}
											 className={classes.tab} component={Link} to={`/${currApp}/`}/>
									<Tab value="docs" label={<span className={classes.label}>Documentation</span>}
											 className={classes.tab} component={Link} to={`/${currApp}/docs`}/>
									<Tab value="about" label={<span className={classes.label}>About</span>}
											 className={classes.tab} component={Link} to={`/${currApp}/about`}/>
								</Tabs>
							}
						</ToolbarSection>
						<ToolbarSection align="end" style={{maxWidth: 300}} >
							<div className="headerSection">
								{localStorage.getItem("isAuthenticated") !== "true" ?
									<div>
										<Button onClick={this.handleLogin} style={{height: "40px"}}>Login</Button>
										<Button onClick={this.handleRegister} style={{height: "40px"}}>Register</Button>
									</div>
									:
									<div><span>{localStorage.getItem("kcEmail")} </span>
										<Button onClick={this.handleLogout} style={{height: "40px"}}>Logout</Button>
									</div>
								}
							</div>
						</ToolbarSection>
					</ToolbarRow>
				</Toolbar>

			</div>

		);
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		isAuthenticated: state.user.isAuthenticated
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogout: () => {
			dispatch(handleUserLogout());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps) ( withStyles(styles) (Header));
