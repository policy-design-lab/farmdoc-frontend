import React, {Component} from "react";
import {connect} from "react-redux";
import AuthorizedWarp from "../AuthorizedWrap";
import NewEvaluatorSidebar from "./NewEvaluatorSidebar";
import NewEvaluatorResults from "./NewEvaluatorResults";
import CompareMode from "./CompareMode";
import Layout from "../Layout";
import {getScenarioKey} from "../../utils/insuranceScenarios";

class NewEvaluatorDashboard extends Component {
	state = {
		compareMode: false,
		scoEnabled: false,
		ecoLevel: "off",
	};

	handleCompareModeChange = (isCompareMode, scoEnabled, ecoLevel) => {
		this.setState({
			compareMode: isCompareMode,
			scoEnabled: scoEnabled || false,
			ecoLevel: ecoLevel || "off"
		});
	};

	handleBackFromCompare = () => {
		this.setState({compareMode: false});
	};

	componentDidMount() {
		if (this.state.compareMode) {
			document.body.classList.add("compare-mode-bg");
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.compareMode !== this.state.compareMode) {
			if (this.state.compareMode) {
				document.body.classList.add("compare-mode-bg");
			}
			else {
				document.body.classList.remove("compare-mode-bg");
			}
		}
	}
	componentWillUnmount() {
		document.body.classList.remove("compare-mode-bg");
	}

	render() {
		const {compareMode, scoEnabled, ecoLevel} = this.state;
		const {evaluatorResults, insurancePlan, coverageLevel, insUnit} =
			this.props;
		let farmInfo = null;
		let baseSelection = null;
		let policies = null;
		let bestBundles = null;
		if (evaluatorResults && evaluatorResults !== "") {
			try {
				const evalResult = JSON.parse(evaluatorResults);
				farmInfo = evalResult["farm-info"];
				policies = evalResult["policies"];
				bestBundles = evalResult["best-bundles"];
				const scenarioKey = getScenarioKey(scoEnabled, ecoLevel);
				const policyKey = `${insurancePlan}-${insUnit}`;
				baseSelection =
					policies?.farm?.[scenarioKey]?.[coverageLevel.toString()]?.[policyKey] || {};
			}
			catch (e) {
				console.error("Error parsing evaluator results:", e);
			}
		}
		return (
			<div>
				<Layout selectedTab="calculator">
					<AuthorizedWarp>
						{compareMode ? (
							<div
								style={{
									padding: "40px 0",
									maxWidth: 1300,
									margin: "0 auto",
									minWidth: 1300,
									boxSizing: "border-box",
								}}
							>
								<CompareMode
									onBack={this.handleBackFromCompare}
									farmInfo={farmInfo}
									baseSelection={baseSelection}
									policies={policies}
									bestBundles={bestBundles}
									insurancePlan={insurancePlan}
									coverageLevel={coverageLevel}
									insUnit={insUnit}
									initialScoEnabled={scoEnabled}
									initialEcoLevel={ecoLevel}
								/>
							</div>
						) : (
							<div
								style={{
									padding: "40px 0",
									maxWidth: 1300,
									margin: "0 auto",
									minWidth: 1300,
									boxSizing: "border-box",
								}}
							>
								<div style={{marginBottom: 32, textAlign: "center"}}>
									<span className="dashboard-title">
										Individual Farm Level Policies
									</span>
								</div>
								<div
									style={{
										display: "flex",
										gap: "24px",
										alignItems: "flex-start",
									}}
								>
									<div
										style={{
											flex: "0 0 calc(33.333% - 12px)",
											minWidth: 0,
										}}
									>
										<NewEvaluatorSidebar />
									</div>
									<div
										style={{
											flex: "0 0 calc(66.667% - 12px)",
											minWidth: 0,
										}}
									>
										<NewEvaluatorResults
											onCompareModeChange={this.handleCompareModeChange}
										/>
									</div>
								</div>
							</div>
						)}
					</AuthorizedWarp>
				</Layout>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		evaluatorResults: state.insEvaluator.evaluatorResults,
		insurancePlan: state.insEvaluator.insurancePlan || "rp",
		coverageLevel: state.insEvaluator.coverageLevel || 80,
		insUnit: state.insEvaluator.insUnit || "enterprise",
	};
};

export default connect(mapStateToProps, null)(NewEvaluatorDashboard);
