import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "../styles/main.css";
import {Link} from "react-router";
import {withStyles} from "@material-ui/core/styles";
import arcPlcLogo from "../images/arcplc.svg";
import premiumsLogo from "../images/premium.svg";
import evaluatorLogo from "../images/payment-evaluator.svg";
import pricedistrLogo from "../images/price-distr.svg";
import config from "../app.config";

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
		height: 500,
		display: "table",
		position: "relative",
		maxWidth: 420
	},
});

class AppsList extends Component {

	render() {
		const {classes} = this.props;

		return (
			<div>

				<div >
					<div className="appsHeader">Farmdoc - Decision Support Tools </div> <br/> <br/>
					<Grid container direction="row" justify="center"
								alignItems="center" spacing={4}>
						{/*TODO: Is THE "RUN" button needed? Use the header itself as a button? If using button, display message to login*/}

						<Grid item>
							<Link to="/arcplc" onlyActiveOnIndex={false}>

								<Paper className={classes.paper}>
									<div className="appHeader" style={{backgroundColor: "#F66B16"}}>
										<span className="appName">
											<img className="appIcon" src={arcPlcLogo} alt="ARCPLC" style={{backgroundColor: "#CC5200"}}/>
											{config.apps["arcplc"].appName}
										</span>
									</div>

									<div className="appLastUpdated">
									Last Updated: {config.apps["arcplc"].lastUpdated}
									</div>

									<div className="appDescription">
										{config.apps["arcplc"].appDesc}
									</div>

									<div>
										<img className="appScreenshot" src={require("../images/arc-plc-results.png")} alt="ARC/PLC Results"/>
									</div>
								</Paper>
							</Link>
						</Grid>

						<Grid item>
							<Link to="/premiums" onlyActiveOnIndex={false}>
								<Paper className={classes.paper}>
									<div className="appHeader" style={{backgroundColor: "#2361AE"}}>
										<span className="appName">
											<img className="appIcon" src={premiumsLogo} alt="Premium-Calc" style={{backgroundColor: "#17244B"}}/>
											{config.apps["premiums"].appName}
										</span>
									</div>

									<div className="appLastUpdated">
									Last Updated: {config.apps["premiums"].lastUpdated}
									</div>

									<div className="appDescription">
										{config.apps["premiums"].appDesc}	</div>

									<div>
										<img className="appScreenshot" src={require("../images/premium-calc-screenshot.png")} alt="Premium Results"/>
									</div>

								</Paper>
							</Link>
						</Grid>

						<Grid item>
							<Link to="/evaluator" onlyActiveOnIndex={false}>
								<Paper className={classes.paper}>
									<div className="appHeader" style={{backgroundColor: "#756B53"}}>
										<span className="appName">
											<img className="appIcon" src={evaluatorLogo} alt="Payment-Eval" style={{backgroundColor: "#544D3B"}}/>
											{config.apps["evaluator"].appName}
										</span>
									</div>

									<div className="appLastUpdated">
										Last Updated: {config.apps["evaluator"].lastUpdated}
									</div>

									<div className="appDescription">
										{config.apps["evaluator"].appDesc}	</div>

									<div>
										<img className="appScreenshot" src={require("../images/payment-evaluator-screenshot.png")} alt="Payment Results"/>
									</div>

								</Paper>
							</Link>
						</Grid>
						<Grid item>
							<Link to="/pricedistribution" onlyActiveOnIndex={false}>
								<Paper className={classes.paper}>
									<div className="appHeader" style={{backgroundColor: "#228B22"}}>
										<span className="appName">
											<img className="appIcon" src={pricedistrLogo} alt="Price-Distribution" style={{backgroundColor: "#1A7234"}}/>
											{config.apps["pricedistribution"].appName}
										</span>
									</div>

									<div className="appLastUpdated">
										Last Updated: {config.apps["pricedistribution"].lastUpdated}
									</div>

									<div className="appDescription">
										{config.apps["pricedistribution"].appDesc}	</div>
									<div>
										<img className="appScreenshot" src={require("../images/price-distr-screenshot.png")} alt="Price distribution results" />
									</div>

								</Paper>
							</Link>
						</Grid>
					</Grid>

					<br/>
					<br/>
				</div>
			</div>
		);
	}

}

export default withStyles(styles)(AppsList);
