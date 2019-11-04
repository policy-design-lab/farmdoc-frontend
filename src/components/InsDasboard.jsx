import React, {Component} from "react";
import AuthorizedWarp from "./AuthorizedWrap";
import PremiumCalculator from "./PremiumCalculator";
import PremiumResults from "./PremiumResults";
import {Grid} from "@material-ui/core";
import Layout from "./Layout";

class InsDashboard extends Component {

	render() {
		return (
			<div>
				<Layout selectedTab="calculator">
					<AuthorizedWarp>
						{/*<Grid container>*/}
						{/*	<Grid item cols={12}>*/}
						<div>
							<PremiumCalculator/>
						</div>
						{/*</Grid>*/}

						{/*<Grid item cols={8} style={{marginLeft: 30, padding: 3, alignItems: "center", display: "flex"}}>*/}
						{/*	<PremiumResults/>*/}
						{/*</Grid>*/}
						{/*</Grid>*/}
					</AuthorizedWarp>
				</Layout>
			</div>
		);
	}
}

export default InsDashboard;
