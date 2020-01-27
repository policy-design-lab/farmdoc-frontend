import React, {Component} from "react";
// import {Button} from "@material-ui/core/Button"; //TODO: Change to material-ui button
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "../styles/main.css";
import {browserHistory} from "react-router";
import {withStyles} from "@material-ui/core/styles";
import arcPlcLogo from "../images/apps/arcplc.svg";
import premiumsLogo from "../images/apps/premium.svg";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

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
		// minWidth: 360
		//TODO: Make this responsive
	},
});

class AppsList extends Component {

	handleAppChange = name => event => {
		switch (name) {
			case "paymentCalc":
				browserHistory.push("/payment-calculator/");
				break;

			case "premiumCalc":
				browserHistory.push("/premium-calculator/");
				break;
		}
		window.location.reload();
	};

	render() {
		const {classes} = this.props;

		return (
			<div>

				<div >
					<div className="appsHeader">Farmdoc - Decision Support Tools </div> <br/> <br/>
					<Grid container direction="row" justify="center"
								alignItems="center" spacing={24}>
						{/*TODO: Is THE "RUN" button needed? Use the header itself as a button? If using button, display message to login*/}

						<Grid item xs={4}>
							<Paper className={classes.paper}>
								<div className="appHeader" style={{backgroundColor: "#F66B16"}}>
									<img className="appIcon" src={arcPlcLogo} alt="ARCPLC" style={{backgroundColor: "#CC5200"}}/>

									<span> Gardner Payment Calculator </span>

								</div>

								<div className="appLastUpdated">
									Last Updated: Mar 1, 2019
								</div>

								<div className="appDescription">
									The Gardner Payment Calculator will generate estimated program payments for individual
									farms from the ARC-CO and the PLC farm programs using county level historical data and modeled price and yield forecasts.
								</div>

								<div>
									<img className="appScreenshot" src="../images/apps/arc-plc-results.png" alt="ARC/PLC Results"/>
								</div>

								<Button variant="contained" color="primary" onClick={this.handleAppChange("paymentCalc")}
												className="appButton">
									<Icon className={classes.leftIcon}> send </Icon>
									&nbsp; Run
								</Button>

							</Paper>
						</Grid>

						<Grid item xs={4}>
							<Paper className={classes.paper}>
								<div className="appHeader" style={{backgroundColor: "#2361AE"}}>
									<img className="appIcon" src={premiumsLogo} alt="Premium-Calc" style={{backgroundColor: "#17244B"}}/>

									<span className="appName"> Premium Calculator </span>

								</div>

								<div className="appLastUpdated">
									Last Updated: Mar 1, 2019
								</div>

								<div className="appDescription">
									The 2020 iFarm Crop insurance Premium Calculator allows users to develop highly customized
									estimates of their crop insurance premiums, and compare revenue and yield
									guarantees across all available crop insurance products and elections for their actual farm case.	</div>

								<div>
									<img className="appScreenshot" src="../images/apps/premium-calc-screenshot.png" alt="Premium Results"/>
								</div>

								<div>
									<Button variant="contained" color="primary" onClick={this.handleAppChange("premiumCalc")}
													className="appButton">
										<Icon className={classes.leftIcon}> send </Icon>
										&nbsp; Run
									</Button>
								</div>

							</Paper>
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
