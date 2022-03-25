import React, {Component} from "react";
import {browserHistory, Route, Router} from "react-router";
import {isIE} from "react-device-detect";
import "../styles/main.css";

import HomePage from "./HomePage";
import Login from "./Login";
import RouteMismatch from "./RouteMismatch";
import config from "../app.config";

import Dashboard from "./Dashboard";
import AboutPaymentCalc from "./About";
import Documentation from "./Documentation";

import PremiumDashboard from "./PremiumDashboard";
import AboutPremiumCalc from "./PremAbout";
import DocsPremiumCalc from "./PremDocumentation";

import PriceDistributionDashboard from "./PriceDistributionDashboard";
import AboutPriceDistribution from "./PriceDistributionAbout";
import PriceDistributionDocumentation from "./PriceDistributionDocumentation";

import EvaluatorDashboard from "./EvaluatorDashboard";
import AboutPaymentEval from "./EvalAbout";
import DocsPaymentEval from "./EvalDocumentation";

import "material-components-web/dist/material-components-web.min.css";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import MyFarms from "./MyFarms";
import Field from "./Field";
import Farm from "./Farm";
import IntegratedTool from "./IntegratedTool";

global.__base = `${__dirname}/`;

const theme = createMuiTheme();

class App extends Component {
	render() {
		sessionStorage.setItem("isIE", JSON.stringify(isIE));
		if (sessionStorage.getItem("firstVisit") == null) {
			sessionStorage.setItem("firstVisit", "true");
		}

		if (localStorage.getItem("fdFirstVisit") == null) {
			localStorage.setItem("fdFirstVisit", "true");
		}
		else if (localStorage.getItem("fdFirstVisit") === "true") {
			localStorage.setItem("fdFirstVisit", "false");
		}

		let arcplcPath = config.apps.arcplc.urlPath;
		let premiumCalcPath = config.apps.premiums.urlPath;
		let premiumEvalPath = config.apps.evaluator.urlPath;
		let priceDistibutionPath = config.apps.pricedistribution.urlPath;

		return (
			<div>
				<MuiThemeProvider theme={theme}>
					<Router history={browserHistory}>
						<Route path="/" component={HomePage}/>
						<Route path="/login" component={Login}/>
						{/*Remove these routes*/}
						<Route path="/farms" component={MyFarms}/>
						<Route path="/farms/edit" component={Farm}/>
						<Route path="/fields/edit" component={Field}/>
						<Route path="/tool" component={IntegratedTool}/>

						<Route path={arcplcPath} component={Dashboard}/>
						<Route path={`${arcplcPath}docs`} component={Documentation}/>
						<Route path={`${arcplcPath}about`} component={AboutPaymentCalc}/>


						<Route path={`${premiumCalcPath}`} component={PremiumDashboard}/>
						<Route path={`${premiumCalcPath}docs`}
										 component={DocsPremiumCalc}/>
						<Route path={`${premiumCalcPath}about`}
										 component={AboutPremiumCalc}/>

						<Route path={`${premiumEvalPath}`}
										 component={EvaluatorDashboard}/>
						<Route path={`${premiumEvalPath}docs`}
										 component={DocsPaymentEval}/>
						<Route path={`${premiumEvalPath}about`}
										 component={AboutPaymentEval}/>

						<Route path={`${priceDistibutionPath}`}
										 component={PriceDistributionDashboard}/>
						<Route path={`${priceDistibutionPath}docs`}
										 component={PriceDistributionDocumentation}/>
						<Route path={`${priceDistibutionPath}about`}
										 component={AboutPriceDistribution}/>

						<Route path="*" component={RouteMismatch}/>
					</Router>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default App;
