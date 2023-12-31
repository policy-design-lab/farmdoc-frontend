import React, {Component} from "react";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import config from "../app.config";
import {clearKeycloakStorage, loginToKeycloak} from "../public/utils";

function redirectToLogin(){
	sessionStorage.setItem("referer_url", window.location.href);
	browserHistory.push("/login");
}

class AuthorizedWrap extends Component {

	constructor(props){
		super(props);

		this.state = {
			proxyCallComplete: false
		};

	}

	render() {
		let pathName = window.location.pathname;

		let needsAuth = true;
		for (let key in config.apps) {

			let app = config.apps[key];
			if (pathName.includes(app.urlPath)){
				needsAuth = app.needsAuthentication;
				break;
			}
		}

		if (needsAuth === false && localStorage.getItem("isAuthenticated") !== "true") {
			let that = this;
			loginToKeycloak().then(function(){
				that.setState({proxyCallComplete: true});
			});


			if (this.state.proxyCallComplete === true) {
				return (
					<div> {this.props.children} </div>
				);
			}
			else {
				return (<div />);
			}
		}
		else if (needsAuth === true && localStorage.getItem("isProxyAuth") === "true"){
			clearKeycloakStorage();
			return (
				<div>
					{redirectToLogin()}
				</div>
			);
		}
		else {
			return (
				<div>
					{
						localStorage.getItem("isAuthenticated") === "true" ? this.props.children : redirectToLogin()
					}
				</div>
			);
		}
	}
}


const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.user.isAuthenticated
	};
};

export default connect(mapStateToProps, null)(AuthorizedWrap);

