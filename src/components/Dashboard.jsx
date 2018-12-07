import React, {Component} from "react";
import Header from "./Header";
import AuthorizedWarp from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import FDRunModel from "./FDRunModel";
import FarmerCharts from "./FarmerCharts";
import Results from "./Results";

import {Grid, Table, TableCell, TableRow, TableHead, TableBody} from "@material-ui/core";

class Dashboard extends Component {

	render() {
		return (
			<div>
				<Header selected='model'/>
				{/*<AnalyzerWrap activeTab={3}/>*/}
				<span className="analyzer-line"> </span>
				<AuthorizedWarp>
					<Grid container >
						<Grid item cols={4} >
							<div >
								<FDRunModel  />
							</div>
						</Grid>

						<Grid item cols={8} style={{paddingTop:"16px"}}>
							<Results/>
						</Grid>
					</Grid>
				</AuthorizedWarp>
			</div>
		);
	}
}

export default Dashboard;
