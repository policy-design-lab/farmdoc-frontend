import React, {Component} from "react";
import AuthorizedWarp from "./AuthorizedWrap";
import PriceDistributionInputs from "./PriceDistributionInputs";
import PriceDistributionResults from "./PriceDistributionResults";
import Layout from "./Layout";

class Dashboard extends Component {

	render() {
		return (
			<div>
				<Layout selectedTab="calculator">
					<AuthorizedWarp>

						<PriceDistributionInputs/>
						<div style={{textAlign: "center"}}>
							<PriceDistributionResults/>
						</div>
					</AuthorizedWarp>
				</Layout>
			</div>
		);
	}
}

export default Dashboard;
