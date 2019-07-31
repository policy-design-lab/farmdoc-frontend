import React, {Component} from "react";
import {hashHistory, Route, Router} from "react-router";
import HomePage from "./HomePage";
import RouteMismatch from "./RouteMismatch";
import "material-components-web/dist/material-components-web.min.css";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import RegistrationPage from "./RegistrationPage";
import FarmerCharts from "./FarmerCharts";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Results from "./Results";
import {isIE} from "react-device-detect";
import ProgramParams from "./ProgramParams";
import "../styles/main.css";
import Documentation from "./Documentation";

global.__base = `${__dirname}/`;

const theme = createMuiTheme();

class App extends Component {
	render() {
		sessionStorage.setItem("isIE", JSON.stringify(isIE));
		if (sessionStorage.getItem("firstVisit") == null){
			sessionStorage.setItem("firstVisit", "true");
		}

		return (
			<div>
				<MuiThemeProvider theme={theme}>
					<Router history={hashHistory}>
						<Route path="/" component={HomePage}/>
						<Route path="/dashboard" component={Dashboard}/>
						<Route path="/about" component={HomePage}/>
						<Route path="/register" component={RegistrationPage}/>
						<Route path="/chartsold" component={Results}/>
						<Route path="/charts" component={FarmerCharts}/>
						<Route path="/login" component={Login}/>
						<Route path="/params" component={ProgramParams}/>
						<Route path="/glossary" component={Documentation}/>
						<Route path="*" component={RouteMismatch}/>
					</Router>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default App;
