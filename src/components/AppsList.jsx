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
		// minWidth: 360
		//TODO: Make this responsive
	},
});

class AppsList extends Component {

	handleAppChange = name => event => {
		switch (name) {
			case "paymentCalc":
				browserHistory.push("/arcplc-calculator/");
				break;

			case "premiumCalc":
				browserHistory.push("/insurance-premiums/");
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

									<span className="appName"> {config.apps["insurance-premiums"].appName} </span>

								</div>

								<div className="appLastUpdated">
									Last Updated: {config.apps["insurance-premiums"].lastUpdated}
								</div>

								<div className="appDescription">
									{config.apps["insurance-premiums"].appDesc}	</div>

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
