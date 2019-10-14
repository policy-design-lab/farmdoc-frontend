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
import config from "../app.config";
import {
	clearKeycloakStorage,
	checkForTokenExpiry
} from "../public/utils";

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
	}
});

class Header extends Component {

	constructor(props){
		super(props);

		this.handleLogout = this.handleLogout.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
	}

	componentDidMount(): void {
		if (localStorage.getItem("isAuthenticated") === "true") {
			this.handleTokenExpiry();

			let interval = setInterval( function(){
				if (localStorage.getItem("isAuthenticated") === "true") {
					if (checkForTokenExpiry()) {
						clearKeycloakStorage();
						browserHistory.push("/");
					}
				}
				else {
					clearInterval(interval);
					browserHistory.push("/");
				}
			}, 15000);
		}
	}

	handleTokenExpiry(){
		if (checkForTokenExpiry()) {
			clearKeycloakStorage();
			browserHistory.push("/");
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

		return (
			<div className={classes.root}>
				<Toolbar>
					<ToolbarRow className="banner">
						<ToolbarSection align="start" style={{maxWidth: 225}}>
							<a href="/" className={"farmdoc"}>
								<img src={require("../images/GAPP-logo.png")}/>
								<span style={{display: "inline", verticalAlign: "middle"}}>FarmDoc</span>
							</a>
						</ToolbarSection>
						<ToolbarSection>
							{/*{browserWarningSpan}*/}
							{(!this.props.selectedTab || !(localStorage.getItem("isAuthenticated") !== null && localStorage.getItem("isAuthenticated") === "true")) ? null :

								<Tabs value={this.props.selectedTab}
												TabIndicatorProps={{style: {backgroundColor: "orange"}}} className="headerSection">
									<Tab value="calculator" label={<span className={classes.label}>Payment Calculator</span>}
											 className={classes.tab} component={Link} to="/dashboard"/>
									<Tab value="docs" label={<span className={classes.label}>Documentation</span>}
											 className={classes.tab} component={Link}	to="/docs"/>
									<Tab value="about" label={<span className={classes.label}>About</span>}
											 className={classes.tab} component={Link} to="/about"/>
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
