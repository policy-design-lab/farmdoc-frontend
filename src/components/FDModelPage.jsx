import React, {Component} from "react";
import Header from "./Header";
import AuthorizedWarp from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import FDRunModel from "./FDRunModel";

class FDModelPage extends Component {

	render() {
		return (
			<div>
				<Header selected="model"/>
				<AnalyzerWrap activeTab={1}/>
				<AuthorizedWarp>

					<FDRunModel/>

				</AuthorizedWarp>
			</div>
		);
	}
}

export default FDModelPage;
