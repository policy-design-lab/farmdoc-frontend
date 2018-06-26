import React, {Component} from "react";
import Header from "./Header";

import RightPaneCC from "./RightPaneCC";
import AuthorizedWarp from "./AuthorizedWarp";
import AnalyzerWrap from "./AnalyzerWrap";
import FDRunModel from "./FDRunModel";

class FDModelPage extends Component {

	render() {
		return (
			<div>
				<Header selected='model'/>
				<AnalyzerWrap activeTab={4}/>
				<AuthorizedWarp>

					<FDRunModel/>

				</AuthorizedWarp>
			</div>
		);
	}
}

export default FDModelPage;
