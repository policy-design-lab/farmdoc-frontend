import React, {Component} from "react";
import {browserHistory, Route, Router} from "react-router";
import HomePage from "./HomePage";
import RouteMismatch from "./RouteMismatch";
import "material-components-web/dist/material-components-web.min.css";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import Dashboard from "./Dashboard";
import Results from "./Results";
import {isIE} from "react-device-detect";
import ProgramParams from "./ProgramParams";
import "../styles/main.css";
import Documentation from "./Documentation";
import Login from "./Login";
import PremiumResults from "./premium-calc/PremiumResults";
import PremiumDashboard from "./premium-calc/PremiumDashboard";

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
						<Route path="/payment-calculator/dashboard" component={Dashboard}/>
						<Route path="/payment-calculator/about" component={HomePage}/>
						<Route path="/payment-calculator/docs" component={Documentation}/>

						<Route path="/premium-calculator/" component={PremiumDashboard}/>
						<Route path="/premium-calculator/dashboard" component={PremiumDashboard}/>

						<Route path="*" component={RouteMismatch}/>
					</Router>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default App;
