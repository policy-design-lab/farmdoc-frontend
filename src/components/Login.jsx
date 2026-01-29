import React, {Component} from "react";
import "../styles/main.css";
import "../styles/home-page.css";
import {connect} from "react-redux";
import {handleUserLogin} from "../actions/user";
import {browserHistory} from "react-router";
import config from "../app.config";
import {checkIfDatawolfUserExists, createDatawolfUser} from "../public/utils";

const keycloak = config.keycloak;

class Login extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const self = this;
		keycloak.init({onLoad: "login-required"}).success(function(){

			localStorage.setItem("kcToken", keycloak.token);
			localStorage.setItem("kcRefreshToken", keycloak.refreshToken);
			localStorage.setItem("kcTokenExpiry", keycloak.tokenParsed.exp);
			localStorage.setItem("isProxyAuth", "false");

			keycloak.loadUserProfile().success(function(profile) {

				localStorage.setItem("isAuthenticated", "true");
				localStorage.setItem("kcEmail", profile["username"]);

				checkIfDatawolfUserExists(profile["username"]).then(function(response){
					if (response.status === 200){
						return response.json();
					}
					else {
						localStorage.removeItem("dwPersonId");
						console.log("Datawolf API call failed. Most likely the token expired");
						return [];
					}
				}).then(function(users){
					let createUser = false;
					if (users.length === 0){
						createUser = true;
						console.log("no users found..create user");
					}
					else if (users.length === 1){
						if (users[0] !== null){
							localStorage.setItem("dwPersonId", users[0].id);
						}
						else {
							createUser = true;
							console.log("no users found..create user");
						}
					}
					else {
						console.log("Unexpected output: More than one user found");
					}

					if (createUser){
						createDatawolfUser(profile["username"], profile["firstName"], profile["lastName"]).then(function(response) {
							if (response.status === 200){
								return response.text();
							}
							else {
								localStorage.removeItem("dwPersonId");
								console.log("Datawolf API call failed. Most likely the token expired");
							}
						}).then(function(personId){
							if (personId) {
								localStorage.setItem("dwPersonId", personId);
							}
							self.props.handleUserLogin(profile["username"], profile["username"], true);
							self.performRedirect();
						}).catch(error => {
							console.log("Error creating user:", error);
							self.props.handleUserLogin(profile["username"], profile["username"], true);
							self.performRedirect();
						});
					}
					else {
						self.props.handleUserLogin(profile["username"], profile["username"], true);
						self.performRedirect();
					}

				}).catch(error => {
					localStorage.removeItem("dwPersonId");
					console.log(error);
					console.log("Error in making the api call. Most likely due to network or service being down");
					self.props.handleUserLogin(profile["username"], profile["username"], true);
					self.performRedirect();
				});


			}).error(function() {
				console.log("Failed to load user profile");
			});

		}).error(function() {
			console.log("Failed to initialize Keycloak");
		});
	}

	performRedirect() {
		let referer_url = sessionStorage.getItem("referer_url");
		if (referer_url){
			sessionStorage.removeItem("referer_url");
			browserHistory.push(referer_url);
		}
		else {
			browserHistory.push("/");
		}
	}

	render() {
		return (
			<div>
				Redirecting to keycloak...
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
		handleUserLogin: (email, userId, isAuthenticated) => {
			dispatch(handleUserLogin(email, userId, isAuthenticated));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

