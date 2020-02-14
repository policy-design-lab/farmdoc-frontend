import React, {Component} from "react";
import AuthorizedWarp from "./AuthorizedWrap";
import EvaluatorInputs from "./EvaluatorInputs";
import EvaluatorResults from "./EvaluatorResults";
import Layout from "./Layout";

class Dashboard extends Component {

	render() {
		return (
			<div>
				<Layout selectedTab="calculator">
					<AuthorizedWarp>

						<EvaluatorInputs/>
						<div style={{textAlign: "center"}}>
							<EvaluatorResults/>
						</div>
					</AuthorizedWarp>
				</Layout>
			</div>
		);
	}
}

export default Dashboard;
