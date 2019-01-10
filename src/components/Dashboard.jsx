import React, {Component} from "react";
import Header from "./Header";
import AuthorizedWarp from "./AuthorizedWrap";
import FDRunModel from "./FDRunModel";
import Results from "./Results";

import {Grid} from "@material-ui/core";

class Dashboard extends Component {

	render() {
		return (
			<div>
				<Header selected="model"/>
				{/*<AnalyzerWrap activeTab={3}/>*/}
				<span className="analyzer-line"/>
				<AuthorizedWarp>
					<Grid container>
						<Grid item cols={4}>
							<div>
								<FDRunModel/>
							</div>
						</Grid>

						<Grid item cols={8} style={{paddingTop: "16px"}}>
							<Results/>
						</Grid>
					</Grid>
				</AuthorizedWarp>
			</div>
		);
	}
}

export default Dashboard;
