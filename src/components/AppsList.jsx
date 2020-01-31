import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "../styles/main.css";
import {browserHistory, Link} from "react-router";
import {withStyles} from "@material-ui/core/styles";
import arcPlcLogo from "../images/arcplc.svg";
import premiumsLogo from "../images/premium.svg";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import config from "../app.config";

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing.unit * 2,
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
								alignItems="center" spacing={24}>
						{/*TODO: Is THE "RUN" button needed? Use the header itself as a button? If using button, display message to login*/}

						<Grid item>
							<Link to="/arcplc-calculator" onlyActiveOnIndex={false}>

								<Paper className={classes.paper}>
									<div className="appHeader" style={{backgroundColor: "#F66B16"}}>
										<span className="appName">
											<img className="appIcon" src={arcPlcLogo} alt="ARCPLC" style={{backgroundColor: "#CC5200"}}/>
											{config.apps["arcplc-calculator"].appName}
										</span>
									</div>

									<div className="appLastUpdated">
									Last Updated: {config.apps["arcplc-calculator"].lastUpdated}
									</div>

									<div className="appDescription">
										{config.apps["arcplc-calculator"].appDesc}
									</div>

									<div>
										<img className="appScreenshot" src={require("../images/arc-plc-results.png")} alt="ARC/PLC Results"/>
									</div>
								</Paper>
							</Link>
						</Grid>

						<Grid item>
							<Link to="/insurance-premiums" onlyActiveOnIndex={false}>
								<Paper className={classes.paper}>
									<div className="appHeader" style={{backgroundColor: "#2361AE"}}>
										<span className="appName">
											<img className="appIcon" src={premiumsLogo} alt="Premium-Calc" style={{backgroundColor: "#17244B"}}/>
											{config.apps["insurance-premiums"].appName}
										</span>
									</div>

									<div className="appLastUpdated">
									Last Updated: {config.apps["insurance-premiums"].lastUpdated}
									</div>

									<div className="appDescription">
										{config.apps["insurance-premiums"].appDesc}	</div>

									<div>
										<img className="appScreenshot" src={require("../images/premium-calc-screenshot.png")} alt="Premium Results"/>
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
