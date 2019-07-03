import React, {Component} from "react";
import Header from "./Header";
import AuthorizedWarp from "./AuthorizedWrap";
import FDRunModel from "./FDRunModel";
import Results from "./Results";

import {Grid} from "@material-ui/core";
import Layout from "./Layout";

class Dashboard extends Component {

	render() {
		return (
			<div>
				<Layout>
					{/*<AnalyzerWrap activeTab={3}/>*/}
					<AuthorizedWarp>
						<Grid container>
							<Grid item cols={4}>
								<div>
									<FDRunModel/>
								</div>
							</Grid>

							<Grid item cols={8} style={{marginLeft: 30, padding: 3, alignItems: "center", display: "flex"}}>
								<Results/>
							</Grid>
						</Grid>
					</AuthorizedWarp>
				</Layout>
			</div>
		);
	}
}

export default Dashboard;
