import React, {Component} from "react";
import {connect} from "react-redux";
import {browserHistory} from "react-router";

function redirectToLogin(){
	sessionStorage.setItem("referer_url", window.location.href);
	browserHistory.push("/login");
}

class AuthorizedWrap extends Component {
	render() {
		return (
			<div>
				{
					localStorage.getItem("isAuthenticated") === "true" ? this.props.children : redirectToLogin()
				}
			</div>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.user.isAuthenticated
	};
};

export default connect(mapStateToProps, null)(AuthorizedWrap);

