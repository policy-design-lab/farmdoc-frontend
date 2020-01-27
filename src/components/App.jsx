import React, {Component} from "react";
import {browserHistory, Route, Router} from "react-router";
import {isIE} from "react-device-detect";
import "../styles/main.css";

import HomePage from "./HomePage";
import Login from "./Login";
import RouteMismatch from "./RouteMismatch";

import Dashboard from "./payment-calc/Dashboard";
import About from "./payment-calc/About";
import Documentation from "./payment-calc/Documentation";

import PremiumDashboard from "./premium-calc/PremiumDashboard";
import AboutPremiumCalc from "./premium-calc/About";
import DocsPremiumCalc from "./premium-calc/Documentation";

import "material-components-web/dist/material-components-web.min.css";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";

global.__base = `${__dirname}/`;

const theme = createMuiTheme();

class App extends Component {
	render() {
		sessionStorage.setItem("isIE", JSON.stringify(isIE));
		if (sessionStorage.getItem("firstVisit") == null){
			sessionStorage.setItem("firstVisit", "true");
		}

		if (localStorage.getItem("fdFirstVisit") == null){
			localStorage.setItem("fdFirstVisit", "true");
		}
		else if (localStorage.getItem("fdFirstVisit") === "true"){
			localStorage.setItem("fdFirstVisit", "false");
		}

		return (
			<div>
				<MuiThemeProvider theme={theme}>
					<Router history={browserHistory}>
						<Route path="/" component={HomePage}/>
						<Route path="/login" component={Login}/>

						<Route path="/payment-calculator/" component={Dashboard}/>
						<Route path="/payment-calculator/docs" component={Documentation}/>
						<Route path="/payment-calculator/about" component={About}/>


						<Route path="/premium-calculator/" component={PremiumDashboard}/>
						<Route path="/premium-calculator/docs" component={DocsPremiumCalc}/>
						<Route path="/premium-calculator/about" component={AboutPremiumCalc}/>

						<Route path="*" component={RouteMismatch}/>
					</Router>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default App;
