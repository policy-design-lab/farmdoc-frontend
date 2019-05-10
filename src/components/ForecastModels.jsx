import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import "../styles/main.css";
import config from "../app.config";
import ToolTip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Info from "@material-ui/icons/Info";
import {forecastYearsToolTip} from "../app.messages";


const styles = theme => ({
	root: {
		width: "100%",
		marginTop: theme.spacing.unit * 3,
		overflowX: "auto",
	},
	table: {
		maxWidth: 800,
	},
	modelColumn: {
		minWidth: 200,
		paddingRight: 20
	},
	tableTitle: {
		fontSize: 18,
		fontWeight: "bolder",
		fontStyle: "oblique",
		textAlign: "center",
		textDecoration: "underline",
		paddingTop: 8
	}
});


class ForecastModels extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const {classes} = this.props;

		let jsonData = config.forecastTypes;

		if (jsonData != null) {

			let startYear = config.defaultsJson.startYear;

			let commodity = "corn";
			if (this.props.hasOwnProperty("commodity") && this.props["commodity"] !== null && this.props["commodity"] !== "") {
				commodity = this.props["commodity"];
			}
			let tableTitle = `Price Scenarios Used in Model for Payment Estimates for ${commodity.charAt(0).toUpperCase()}${commodity.substr(1)}`;
			let years = [startYear++, startYear++, startYear++, startYear++, startYear++];
			let headers = ["Model"].concat(years);

			let modelsList = config.forecastTypes;
			let modelRows = [];
			for (let i = 0 ; i < modelsList.length ; i++) {
				modelRows.push({
					"id": modelsList[i]["id"],
					"name": modelsList[i]["name"],
					"description": modelsList[i]["description"],
					"year1": modelsList[i]["prices"][commodity][0],
					"year2": modelsList[i]["prices"][commodity][1],
					"year3": modelsList[i]["prices"][commodity][2],
					"year4": modelsList[i]["prices"][commodity][3],
					"year5": modelsList[i]["prices"][commodity][4],
				});
			}

			return (
				<div className={classes.table} >

					<div id="tableTitle" className={classes.tableTitle}>
						{tableTitle}
					</div>


					<Table className={classes.table} aria-labelledby="tableTitle">
						<TableHead>

							<TableRow key="rowheader">
								{headers.map(header => (
									<ToolTip title={forecastYearsToolTip}><TableCell key={`header-${header}`}> {header}</TableCell></ToolTip>
								))}

							</TableRow>
						</TableHead>
						<TableBody>
							{modelRows.map(row => (
								<TableRow key={row.id}>
									<TableCell component="th" scope="row" className={classes.modelColumn}>
										{row.name}
										<ToolTip title={row.description} enterTouchDelay={50}>
											<IconButton aria-label={row.description}>
												<Info />
											</IconButton>
										</ToolTip>

									</TableCell>
									<TableCell align="right">${row.year1}</TableCell>
									<TableCell align="right">${row.year2}</TableCell>
									<TableCell align="right">${row.year3}</TableCell>
									<TableCell align="right">${row.year4}</TableCell>
									<TableCell align="right">${row.year5}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					{/*</Paper>*/}

				</div>
			);
		}
		else {

			return (
				<div>
					Make sure to select a crop first
				</div>
			);
		}
	}
}

const mapStateToProps = (state) => {
	return {
		commodity: state.model.commodity
	};
};

export default connect(mapStateToProps, null)(withStyles(styles)(ForecastModels));
