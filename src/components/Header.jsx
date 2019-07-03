import React, {Component} from "react";
import {hashHistory} from "react-router";
import "../styles/header-footer.css";
import "../styles/main.css";
import {Button, Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";
import {browserWarning} from "../app.messages";

class Header extends Component {

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};

		this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogout() {
		sessionStorage.removeItem("personId");
		sessionStorage.removeItem("email");
		this.props.handleUserLogout();
		hashHistory.push("/");
	}

	//TODO: add fixed for Toolbar
	render() {
		let browserWarningSpan = "";
		if (sessionStorage.getItem("isIE") === "true") {
			browserWarningSpan = 	<span className="notification" > {browserWarning} </span>;
		}

		return (
			<div>
				<Toolbar>
					<ToolbarRow className="banner">
						<ToolbarSection align="start" style={{maxWidth: 350}}>
							<a href="/" className={"farmdoc"}>
								<img src={require("../images/GAPP-logo.png")}/>
								<span style={{display: "inline", verticalAlign: "middle"}}>FarmDoc</span>
							</a>
						</ToolbarSection>
						<ToolbarSection >
							{browserWarningSpan}
						</ToolbarSection>
						<ToolbarSection align="end" style={{maxWidth: 350}}>
							<span className="email-address">{this.props.email}</span>

							{this.props.isAuthenticated === false ? null :
								<Button onClick={this.handleLogout}>Logout</Button>}

						</ToolbarSection>
					</ToolbarRow>
				</Toolbar>

				{/*<div className="header-tab">*/}
				{/*<div className="rectangle-2">*/}
				{/*<Link to="/dashboard" className="farmdoc-analyzer">Payment Calculator </Link>*/}

				{/*</div>*/}

				{/*{this.props.selected === "home" && <div className="triangle-bottomright"/>}*/}
				{/*{this.props.selected === "home" ? <div className="rectangle-3-onselect">*/}
				{/*<Link to="/" className="about-the-project-onselect">About the Project</Link>*/}
				{/*</div> :*/}
				{/*<Link to="/" className="about-the-project">About the Project</Link>*/}

				{/*}*/}
				{/*</div>*/}

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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
