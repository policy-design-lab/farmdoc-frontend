import React, {Component} from "react";
import AuthorizedWarp from "./AuthorizedWrap";
import PremiumCalculator from "./PremiumCalculator";
import PremiumResults from "./PremiumResults";

import {Grid} from "@material-ui/core";
import Layout from "./Layout";

class Dashboard extends Component {

	render() {
		return (
			<div>
				<Layout selectedTab="calculator">
					<AuthorizedWarp>

						<PremiumCalculator/>
						<div style={{textAlign: "center"}}>
							<PremiumResults/>
						</div>
					</AuthorizedWarp>
				</Layout>
			</div>
		);
	}
}

export default Dashboard;
