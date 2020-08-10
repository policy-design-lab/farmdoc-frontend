import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import "../styles/main.css";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {roundResults} from "../public/utils.js";
import {Line} from "react-chartjs-2";

const styles = theme => ({
	wrapper: {
		maxWidth: "1000px",
		margin: "0px auto",
	},
	tabulator: {
		paddingLeft: "10px",
		textAlign: "center",
	},
	tabulatorHeader: {
		paddingLeft: "10px",
		textAlign: "center",
	},
	tabulatorCol: {
		paddingLeft: "10px",
		textAlign: "center",
	},
});

class PriceDistributionResults extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {classes} = this.props;

		let pdResult = null;

		let price = null;
		let futuresData = null;
		let dte = null;
		let optionValuesByStrike = null;
		let previousSolution = null;
		let farmInfo = null;
		let graphJson = null;

		let futuresCode = "ZCZ21";

		//Uncomment to test with static response
		let evalResult = null;
		evalResult = "{\"farm-info\":{\"avg-yield\":173.057,\"std-yield\":45.38791069602186,\"county-avg-yield\":173.057,\"county-std-yield\":36.30981584142272,\"avg-futures-price\":3.7573791038845945,\"std-price\":0.0854726419773733,\"avg-harvest-cash-basis\":0.35,\"avg-gross-crop-rev\":588.1995990921772,\"farm-yield-below-30\":149.65932279755242,\"farm-yield-below-20\":134.2242216791648,\"farm-yield-below-10\":112.76986720529109,\"farm-yield-below-5\":95.42000852921056,\"county-yield-below-30\":149.65932279755242,\"county-yield-below-20\":134.2242216791648,\"county-yield-below-10\":112.76986720529109,\"county-yield-below-5\":95.42000852921056,\"trend-adj-aph\":173,\"county-ta-rate\":1.9,\"farm-aph\":164,\"sigma\":\"0.022745\",\"mu\":\"1.323463\"},\"policies\":{\"farm\":{\"50\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"55\":{\"rp-basic\":{\"est-premium\":1.55,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"60\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"65\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"70\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"75\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"80\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"85\":{\"rp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp-basic\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81},\"yp-enterprise\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}}},\"county\":{\"70\":{\"rp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"75\":{\"rp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"80\":{\"rp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"85\":{\"rp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}},\"90\":{\"rp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"rphpe\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05},\"yp\":{\"est-premium\":1.48,\"avg-payment\":2.02,\"freq-payment\":4.28,\"net-cost\":-0.13,\"avg-gross-rev\":443.08,\"target-prob\":35.81,\"var-1\":301.05,\"var-5\":331.05,\"var-10\":341.05,\"var-25\":381.05,\"var-change-1\":65.05,\"var-change-5\":-1.05,\"var-change-10\":-4.05,\"var-change-25\":-8.05}}},\"gross-target\":536,\"no-ins-prob\":0.35,\"no-ins-var-1\":301.05,\"no-ins-var-5\":331.05,\"no-ins-var-10\":341.05,\"no-ins-var-25\":381.05,\"no-ins-var-change-1\":65.05,\"no-ins-var-change-5\":365.05,\"no-ins-var-change-10\":65.05,\"no-ins-var-change-25\":65.05},\"chartData\":{}}";
		// evalResult = JSON.parse(evalResult);
		pdResult = "{\"ZCZ21\": {\"results\": {\"price\": 3.655, \"optionValuesByStrike\": [{\"strike\": 310, \"call\": 62.625, \"put\": 5.375}, {\"strike\": 320, \"call\": 54.625, \"put\": 7.375}, {\"strike\": 330, \"call\": 47.125, \"put\": 9.875}, {\"strike\": 340, \"call\": 40.25, \"put\": 13.0}, {\"strike\": 350, \"call\": 34.125, \"put\": 17.25}, {\"strike\": 360, \"call\": 28.75, \"put\": 21.5}, {\"strike\": 370, \"call\": 24.125, \"put\": 26.875}, {\"strike\": 380, \"call\": 20.125, \"put\": 32.875}, {\"strike\": 390, \"call\": 16.75, \"put\": 39.5}, {\"strike\": 400, \"call\": 13.875, \"put\": 46.625}, {\"strike\": 410, \"call\": 11.5, \"put\": 54.25}, {\"strike\": 420, \"call\": 9.5, \"put\": 62.25}, {\"strike\": 430, \"call\": 7.875, \"put\": 70.5}], \"dte\": -487, \"futuresData\": {\"dte\": -487, \"data\": {\"180-0C\": 187.375, \"180-0P\": 0.125, \"190-0C\": 177.375, \"190-0P\": 0.125, \"200-0C\": 167.375, \"200-0P\": 0.125, \"210-0C\": 157.5, \"210-0P\": 0.25, \"220-0C\": 147.625, \"220-0P\": 0.375, \"230-0C\": 137.75, \"230-0P\": 0.5, \"240-0C\": 127.875, \"240-0P\": 0.625, \"250-0C\": 118.125, \"250-0P\": 0.875, \"260-0C\": 108.375, \"260-0P\": 1.125, \"270-0C\": 98.75, \"270-0P\": 1.5, \"280-0C\": 89.375, \"280-0P\": 2.125, \"290-0C\": 80.125, \"290-0P\": 2.875, \"300-0C\": 71.125, \"300-0P\": 4.0, \"310-0C\": 62.625, \"310-0P\": 5.375, \"320-0C\": 54.625, \"320-0P\": 7.375, \"330-0C\": 47.125, \"330-0P\": 9.875, \"340-0C\": 40.25, \"340-0P\": 13.0, \"350-0C\": 34.125, \"350-0P\": 17.25, \"360-0C\": 28.75, \"360-0P\": 21.5, \"370-0C\": 24.125, \"370-0P\": 26.875, \"380-0C\": 20.125, \"380-0P\": 32.875, \"390-0C\": 16.75, \"390-0P\": 39.5, \"400-0C\": 13.875, \"400-0P\": 46.625, \"410-0C\": 11.5, \"410-0P\": 54.25, \"420-0C\": 9.5, \"420-0P\": 62.25, \"430-0C\": 7.875, \"430-0P\": 70.5, \"440-0C\": 6.5, \"440-0P\": 79.25, \"450-0C\": 5.375, \"450-0P\": 88.125, \"460-0C\": 4.5, \"460-0P\": 97.25, \"470-0C\": 3.75, \"470-0P\": 106.5, \"480-0C\": 3.25, \"480-0P\": 116.0, \"490-0C\": 2.875, \"490-0P\": 125.5, \"500-0C\": 2.5, \"500-0P\": 135.125, \"510-0C\": 2.125, \"510-0P\": 144.875, \"520-0C\": 2.0, \"520-0P\": 154.625, \"530-0C\": 1.75, \"530-0P\": 164.5, \"540-0C\": 1.625, \"540-0P\": 174.25, \"550-0C\": 1.5, \"550-0P\": 184.125, \"560-0C\": 1.375, \"560-0P\": 194.0, \"570-0C\": 1.25, \"570-0P\": 203.875, \"580-0C\": 1.125, \"580-0P\": 213.875, \"590-0C\": 1.0, \"590-0P\": 223.75, \"600-0C\": 1.0, \"600-0P\": 233.625, \"610-0C\": 0.875, \"610-0P\": 243.625, \"620-0C\": 0.75, \"620-0P\": 253.5, \"630-0C\": 0.75, \"630-0P\": 263.5}, \"price\": 365.5}, \"previousSolution\": {\"sigma\": 0.2108, \"mu\": 1.3173}}}}";
		// {
		// 	"ZCZ21": {
		// 		"results": {
		// 			"price": 3.655,
		// 			"optionValuesByStrike": [{}, {}, {}, {}, {}],
		// 			"dte": -487,
		// 			"futuresData": {
		// 				"dte": -487,
		// 				"data": {},
		// 				"price": 365.5
		// 			},
		// 			"previousSolution": {
		// 				"sigma": 0.2108,
		// 				"mu": 1.3173
		// 			}
		// 		}
		// 	}

		// if (this.props["pdResults"] && typeof(this.props["pdResults"] === "object")) {
		if (pdResult) {
			// pdResult = this.props["pdResults"];
			pdResult = JSON.parse(pdResult);
			pdResult = pdResult[futuresCode]["results"];

			farmInfo = evalResult["farm-info"];
			if (evalResult["chartData"]) {
				graphJson = evalResult["chartData"];
			}
			if (pdResult["price"]) {
				price = pdResult["price"];
				// price": 3.655
				console.log(price);
			}
			if (pdResult["optionValuesByStrike"]) {
				optionValuesByStrike = pdResult["optionValuesByStrike"];
				// optionValuesByStrike": {}
				console.log(optionValuesByStrike);
			}
			if (pdResult["dte"]) {
				dte = pdResult["dte"];
				// dte": -487
				console.log(dte);
			}
			if (pdResult["futuresData"]) {
				futuresData = pdResult["futuresData"];
				// futuresData": {"dte": -487, "price": 365.5}
				console.log(futuresData.dte, futuresData.price);
			}
			if (pdResult["previousSolution"]) {
				previousSolution = pdResult["previousSolution"];
				// previousSolution": {"sigma": 0.2108, "mu": 1.3173}
				console.log(previousSolution.sigma, previousSolution.mu);
			}

			return (

				<div style={{padding: 4, display: "inline-block", "wordBreak": "break-all"}} >
					<br />
					<br />
					<Divider/>
					<br />
					<br />
					Graph and table of Cumulative probability of prices at expiration.
					<br />
					<br />
					<Divider/>
					<br />
					<br />
					<div>{price}</div>
					<br />
					<br />
					<Divider/>
					<span style={{fontWeight: "bold"}}>
							Enter Price to Evaluate:
					</span>
					<TextField
							id="priceEval"
							className={classes.textField}
							InputProps={{
								startAdornment: <InputAdornment
										position="start">$</InputAdornment>
							}}
							margin="normal"
							variant="outlined"
					/>
					<span style={{fontWeight: 500}}>The implied distribution indicates that there is a</span>
					<TextField
						id="percentEval"
						className={classes.textField}
						InputProps={{
							endAdornment: <InputAdornment
								position="end">%</InputAdornment>
						}}
						margin="normal"
						variant="outlined"
					/>
					<span>probability that the price will be below</span>
					<TextField
						id="priceEval"
						className={classes.textField}
						InputProps={{
							startAdornment: <InputAdornment
								position="start">$</InputAdornment>,
						}}
						margin="normal"
						variant="outlined"
					/>
					<span>at expiration.</span>
					<br />
					<span>Accessed</span>
					<TextField
						id="priceDate"
						className={classes.textField}
						margin="normal"
						variant="outlined"
					/>
					<br />
					<span>Copyright © 2020. Futures: at least 10 minutes delayed. Information is provided 'as is'
						and solely for informational purposes, not for trading purposes or advice.
						To see all exchange delays and terms of use, please see disclaimer.</span>
				</div>
			);
		}
		else if (this.props["pdResults"] === ""){
			return (
				<div style={{padding: "15px", color: "red"}}> No data available for the selected crop and date. </div>
			);
		}
		else {
			return (
				<div />
			);
		}
	}
}

const mapStateToProps = (state) => {
	return {
		pdResults: state.priceDistribution.pdResults
	};
};

export default connect(mapStateToProps, null)(withStyles(styles)(PriceDistributionResults));
