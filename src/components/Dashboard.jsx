import React, {Component} from "react";
import Header from "./Header";
import AuthorizedWarp from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import FDRunModel from "./FDRunModel";
import FarmerCharts from "./FarmerCharts";

class Dashboard extends Component {

	render() {
		return (
			<div>
				<Header selected='model'/>
				<AnalyzerWrap activeTab={3}/>
				<AuthorizedWarp>

					<FarmerCharts/>

				</AuthorizedWarp>
			</div>
		);
	}
}

export default Dashboard;
