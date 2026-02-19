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

import NewEvaluatorDashboard from "./NewEvaluator/NewEvaluatorDashboard";
import NewEvaluatorDocumentation from "./NewEvaluator/NewEvaluatorDocumentation";
import NewARCPLCDashboard from "./NewARCPLC/NewARCPLCDashboard";

import "material-components-web/dist/material-components-web.min.css";
import {createTheme, ThemeProvider} from "@material-ui/core/styles";

global.__base = `${__dirname}/`;

const theme = createTheme();

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

		let arcplcPath = config.apps.arcplc.urlPath;
		let premiumCalcPath = config.apps.premiums.urlPath;
		let premiumEvalPath = config.apps.evaluator.urlPath;
		let priceDistibutionPath = config.apps.pricedistribution.urlPath;
		let newEvaluatorPath = config.apps.newevaluator.urlPath;
		let newArcplcPath = config.apps.newarcplc.urlPath;

		return (
			<div>
				<ThemeProvider theme={theme}>
					<Router history={browserHistory}>
						<Route path="/" component={HomePage}/>
						<Route path="/login" component={Login}/>

						<Route path={arcplcPath} component={Dashboard}/>
						<Route path={`${arcplcPath}docs`} component={Documentation}/>
						<Route path={`${arcplcPath}about`} component={AboutPaymentCalc}/>


						<Route path={`${premiumCalcPath}`} component={PremiumDashboard}/>
						<Route path={`${premiumCalcPath}docs`} component={DocsPremiumCalc}/>
						<Route path={`${premiumCalcPath}about`} component={AboutPremiumCalc}/>

						<Route path={`${premiumEvalPath}`} component={EvaluatorDashboard}/>
						<Route path={`${premiumEvalPath}docs`} component={DocsPaymentEval}/>
						<Route path={`${premiumEvalPath}about`} component={AboutPaymentEval}/>

						<Route path={`${priceDistibutionPath}`} component={PriceDistributionDashboard}/>
						<Route path={`${priceDistibutionPath}docs`} component={PriceDistributionDocumentation}/>
						<Route path={`${priceDistibutionPath}about`} component={AboutPriceDistribution}/>

						<Route path={`${newEvaluatorPath}`} component={NewEvaluatorDashboard}/>
						<Route path={`${newEvaluatorPath}docs`} component={NewEvaluatorDocumentation}/>
						<Route path={`${newEvaluatorPath}about`} component={AboutPaymentEval}/>

						<Route path={`${newArcplcPath}`} component={NewARCPLCDashboard}/>
						<Route path={`${newArcplcPath}docs`} component={Documentation}/>
						<Route path={`${newArcplcPath}about`} component={AboutPaymentCalc}/>

						<Route path="*" component={RouteMismatch}/>
					</Router>
				</ThemeProvider>
			</div>
		);
	}
}

export default App;
