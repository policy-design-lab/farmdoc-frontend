import React, {Component} from "react";
import {Router, Route, hashHistory, Redirect} from "react-router";

import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import RouteMismatch from "./RouteMismatch";
import "material-components-web/dist/material-components-web.min.css";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import {Cell, Grid, Title, Textfield, Button, Caption, Body1, Subheading2} from "react-mdc-web";
//import injectTapEventPlugin from 'react-tap-event-plugin'
import {isUserAuthenticated} from "../public/utils";
import RegistrationPage from "./RegistrationPage";
import FDModelPage from "./FDModelPage";
import FarmerCharts from "./FarmerCharts";
import Login from "./Login";


global.__base = `${__dirname  }/`;
//injectTapEventPlugin();

const theme = createMuiTheme();

class App extends Component {
	render() {

		const PrivateRoute = ({component: Component, ...rest}) => (

			<Route
				{...rest}
				render={props =>
					isUserAuthenticated()  ? (
						<Component {...props} />
					) : (
						<Redirect
							to={{
								pathname: "/home"
							}}
						/>
					)
				}
			/>
		);

		return (
			<MuiThemeProvider theme={theme}>
				<Router history={hashHistory}>
					<Route path="/" component={HomePage}/>
					<Route path="/model" component={FDModelPage}/>
					{/*<Route path="/profile" component={MyFarmPage}/>*/}
					<Route path="/about" component={AboutPage}/>
					{/*<Route path="/history" component={UserPage}/>*/}
					<Route path="/register" component={RegistrationPage}/>
					<Route path="/charts" component={FarmerCharts}/>
					<Route path="/login" component={Login}/>
					<Route path="*" component={RouteMismatch}/>
				</Router>
			</MuiThemeProvider>

		);
	}
}

export default App;
