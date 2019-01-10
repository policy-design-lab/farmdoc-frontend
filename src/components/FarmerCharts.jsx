import Header from "./Header";
import AnalyzerWrap from "./AnalyzerWrap";
import AuthorizedWarp from "./AuthorizedWrap";
import Results from "./Results";
import React, {Component} from "react";

class FarmerCharts extends Component {
	render() {
		return (
			<div>
				<Header selected="charts"/>
				<AnalyzerWrap activeTab={2}/>
				<AuthorizedWarp>
					<Results/>
				</AuthorizedWarp>
			</div>
		);
	}
}

export default FarmerCharts;
