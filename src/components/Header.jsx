import React, {Component} from "react";
import {hashHistory, Link} from "react-router";
import {withStyles} from "@material-ui/core/styles";
import "../styles/header-footer.css";
import "../styles/main.css";
import {Button, Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";
import {browserWarning} from "../app.messages";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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

		this.state = {
			open: false
		};

		this.handleLogout = this.handleLogout.bind(this);
	}
	
	handleLogout(){
		sessionStorage.removeItem("personId");
		sessionStorage.removeItem("email");
		this.props.handleUserLogout();
		hashHistory.push("/");
	}

	//TODO: add fixed for Toolbar
	render(){

		const {classes} = this.props;

		let browserWarningSpan = "";
		if (sessionStorage.getItem("isIE") === "true") {
			browserWarningSpan = 	<span className="notification" > {browserWarning} </span>;
		}

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
						<ToolbarSection >
							{/*{browserWarningSpan}*/}
							{(!this.props.selectedTab || !this.props.isAuthenticated) ? null :
								<Tabs value={this.props.selectedTab}
												TabIndicatorProps={{style: {backgroundColor: "orange"}}} >
									<Tab value="calculator" label={<span className={classes.label}>Payment Calculator</span>}
											 className={classes.tab} component={Link} to="/dashboard"/>
									<Tab value="documentation" label={<span className={classes.label}>Documentation</span>}
											 className={classes.tab} component={Link}	to="/about"/>
									<Tab value="about" label={<span className={classes.label}>About</span>}
											 className={classes.tab} component={Link} to="/about"/>
								</Tabs>
							}
						</ToolbarSection>
						<ToolbarSection align="end" style={{maxWidth: 300}}>
							<span className="email-address">{this.props.email}</span>

							{this.props.isAuthenticated === false ? null :
								<Button onClick={this.handleLogout}>Logout</Button>}

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
