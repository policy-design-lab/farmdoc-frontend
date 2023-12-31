import React, {Component} from "react";
import {connect} from "react-redux";

import {withStyles} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import EvaluatorPremiumResults from "./EvaluatorPremiumResults";
import EvaluatorRiskResults from "./EvaluatorRiskResults";
import EvaluatorFarmInfo from "./EvaluatorFarmInfo";
import EvaluatorFooter from "./EvaluatorFooter";
import {roundResults} from "../public/utils";


const styles = theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
	tabsRoot: {
		borderBottom: "1px solid #e8e8e8",
	},
	tabsIndicator: {
		backgroundColor: "#1890ff",
	},
	tabRoot: {
		textTransform: "initial",
		minWidth: 72,
		fontSize: "1.125em",
		fontWeight: "700",
		marginRight: theme.spacing(4),
		fontFamily: [
			"-apple-system",
			"BlinkMacSystemFont",
			"\"Segoe UI\"",
			"Roboto",
			"\"Helvetica Neue\"",
			"Arial",
			"sans-serif",
			"\"Apple Color Emoji\"",
			"\"Segoe UI Emoji\"",
			"\"Segoe UI Symbol\"",
		].join(","),
		"&:hover": {
			color: "#40a9ff",
			opacity: 1,
		},
		"&$tabSelected": {
			color: "#1890ff",
			fontWeight: "700",
		},
		"&:focus": {
			color: "#40a9ff",
		},
	},
	tabSelected: {},
	typography: {
		padding: theme.spacing(3),
	},
});

class EvaluatorResults extends Component {
	state = {
		tabIndex: 1,
	};

	constructor(props) {
		super(props);
		this.state = {
			tabIndex: 1
		};
	}

	handleChange = (event, value) => {
		this.setState({tabIndex: value});
	};

	shouldComponentUpdate() {
		if (this.props["evaluatorResults"] === null){
			this.setState({tabIndex: 1});
		}
		return true;
	}

	render() {
		const {classes} = this.props;
		let tabIndex = this.state.tabIndex;

		let evalResult = null;
		let farmInfo = null;
		let graphJson = null;

		 //Uncomment to test with static response
		// evalResult = "{\"farm-info\":{\"avg-yield\":173.057,\"std-yield\":45.38791069602186,\"county-avg-yield\":173.057,\"county-std-yield\":36.30981584142272,\"avg-futures-price\":3.7573791038845945,\"std-price\":0.0854726419773733,\"avg-harvest-cash-basis\":0.35,\"avg-gross-crop-rev\":588.1995990921772,\"farm-yield-below-30\":149.65932279755242,\"farm-yield-below-20\":134.2242216791648,\"farm-yield-below-10\":112.76986720529109,\"farm-yield-below-5\":95.42000852921056,\"county-yield-below-30\":149.65932279755242,\"county-yield-below-20\":134.2242216791648,\"county-yield-below-10\":112.76986720529109,\"county-yield-below-5\":95.42000852921056,\"trend-adj-aph\":173,\"county-ta-rate\":1.9,\"farm-aph\":164,\"sigma\":\"0.022745\",\"mu\":\"1.323463\"},\"policies\":{\"farm\":{\"50\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"55\":{\"rp-basic\":{\"est-premium\":1.55,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"60\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"65\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"70\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"75\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"80\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"85\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}}},\"county\":{\"70\":{\"rp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"75\":{\"rp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"80\":{\"rp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"85\":{\"rp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"90\":{\"rp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}}},\"gross-target\":536,\"no-ins-prob\":0.35,\"no-ins-var-1\":301.05,\"no-ins-var-5\":331.05,\"no-ins-var-10\":341.05,\"no-ins-var-25\":381.05,\"no-ins-var-change-1\":65.05,\"no-ins-var-change-5\":365.05,\"no-ins-var-change-10\":65.05,\"no-ins-var-change-25\":65.05},\"chartData\":{}}";
		// evalResult = JSON.parse(evalResult);


		if (this.props["evaluatorResults"] && typeof(this.props["evaluatorResults"] === "object")) {
			evalResult = this.props["evaluatorResults"];
			evalResult = JSON.parse(evalResult);
			farmInfo = evalResult["farm-info"];
			if (evalResult["chartData"]) {
				graphJson = evalResult["chartData"];
			}
			return (

				<div style={{textAlign: "center"}}>

					<Tabs value={tabIndex} onChange={this.handleChange}
									classes={{
										root: classes.tabsRoot,
										indicator: classes.tabsIndicator
									}}
					>
						<Tab disableRipple classes={{
							root: classes.tabRoot,
							selected: classes.tabSelected
						}}
									 label="Case Farm Info"
						/>
						<Tab disableRipple classes={{
							root: classes.tabRoot,
							selected: classes.tabSelected
						}}
									 label="Insurance Evaluator"
						/>
						<Tab disableRipple classes={{
							root: classes.tabRoot,
							selected: classes.tabSelected
						}}
									 label="Revenue Risk Info"
						/>
					</Tabs>

					{tabIndex === 0 && <EvaluatorFarmInfo farmInfo={farmInfo}/>}
					{tabIndex === 1 && <EvaluatorPremiumResults evalJson={evalResult}/>}
					{tabIndex === 2 && <EvaluatorRiskResults evalJson={evalResult} graphJson={graphJson}/>}

					<EvaluatorFooter projPrice={roundResults(farmInfo["proj-price"], 2)}
													 volFactor={roundResults(farmInfo["volatility-factor"], 2)} lastUpdated={farmInfo["rma-last-updated"]}/>
				</div>
			);
		}
		else if (this.props["evaluatorResults"] === ""){
			return (
				<div style={{padding: "15px", color: "red"}}> No data available for the selected crop or county </div>
			);
		}
		else {
			return (
				<div/>
			);
		}
	}
}

const mapStateToProps = (state) => {
	return {
		evaluatorResults: state.insEvaluator.evaluatorResults
	};
};

export default connect(mapStateToProps, null) (withStyles(styles)(EvaluatorResults));
