import React, {Component} from "react";
import {hashHistory, Route, Router} from "react-router";
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import RouteMismatch from "./RouteMismatch";
import "material-components-web/dist/material-components-web.min.css";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import RegistrationPage from "./RegistrationPage";
import FDModelPage from "./FDModelPage";
import FarmerCharts from "./FarmerCharts";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Results from "./Results";


global.__base = `${__dirname}/`;

const theme = createMuiTheme();

class App extends Component {
	render() {

		return (
			<MuiThemeProvider theme={theme}>
				<Router history={hashHistory}>
					<Route path="/" component={HomePage}/>
					<Route path="/dashboard" component={Dashboard}/>
					<Route path="/model" component={FDModelPage}/>
					<Route path="/about" component={AboutPage}/>
					<Route path="/register" component={RegistrationPage}/>
					<Route path="/chartsold" component={Results}/>
					<Route path="/charts" component={FarmerCharts}/>
					<Route path="/login" component={Login}/>
					<Route path="*" component={RouteMismatch}/>
				</Router>
			</MuiThemeProvider>

		);
	}
}

export default App;
