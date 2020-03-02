import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import {
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {roundResults} from "../public/utils.js";
import Divider from "@material-ui/core/Divider";

const TableCellDefaultStyles = withStyles({
	root: {
		paddingLeft: "8px !important",
		paddingRight: "8px !important"
	}
})(TableCell);

const TableCellLeftName = withStyles({
	root: {
		textAlign: "right",
		fontWeight: 700
	}
})(TableCellDefaultStyles);

const TableCellLeftValue = withStyles({
	root: {
		textAlign: "left",
	}
})(TableCellDefaultStyles);

const TableCellHeader = withStyles({
	root: {
		textAlign: "center",
		fontWeight: 700,
	}
})(TableCellDefaultStyles);

const TableCellRightName = withStyles({
	root: {
		textAlign: "right",
		fontWeight: 700,
		fontSize: "14px"
	}
})(TableCellDefaultStyles);

const TableCellRightValue = withStyles({
	root: {
		textAlign: "center",
		fontSize: "14px"
	}
})(TableCellDefaultStyles);

class EvaluatorFarmInfo extends Component {

	render() {

		let farmInfo = null;

		if (this.props.hasOwnProperty("farmInfo") && this.props.hasOwnProperty("farmInfo") !== null) {
			farmInfo = this.props["farmInfo"];
		}

		if (farmInfo !== null) {

			return (
				<div style={{textAlign: "left"}}>
					<br/>
					<Grid container direction="row" justify="center"
									alignItems="center" spacing={32} style={{paddingBottom: "4px"}}>
						<Grid item>
							<Table>
								<TableRow>
									<TableCellLeftName> Farm Average Yield </TableCellLeftName>
									<TableCellLeftValue> {roundResults(farmInfo["avg-yield"],
										2)}
									<span style={{fontSize: "0.875em"}}> bu/acre</span>
									</TableCellLeftValue>
								</TableRow>
								<TableRow>
									<TableCellLeftName> Farm Std Dev of
											Yield </TableCellLeftName>
									<TableCellLeftValue> {roundResults(farmInfo["std-yield"],
										2)}
									<span style={{fontSize: "0.875em"}}> bu/acre</span>
									</TableCellLeftValue>
								</TableRow>
								<TableRow>
									<TableCellLeftName> County Average
											Yield </TableCellLeftName>
									<TableCellLeftValue> {roundResults(
										farmInfo["county-avg-yield"], 2)}
									<span style={{fontSize: "0.875em"}}> bu/acre</span>
									</TableCellLeftValue>
								</TableRow>
								<TableRow>
									<TableCellLeftName> County Std Dev of
											Yield </TableCellLeftName>
									<TableCellLeftValue> {roundResults(
										farmInfo["county-std-yield"], 2)}
									<span style={{fontSize: "0.875em"}}> bu/acre</span>
									</TableCellLeftValue>
								</TableRow>
								<TableRow>
									<TableCellLeftName> Current Futures
											Price </TableCellLeftName>
									<TableCellLeftValue> { `$${ roundResults(
										farmInfo["avg-futures-price"], 2)}`}
									<span style={{fontSize: "0.875em"}}> /bu</span>
									</TableCellLeftValue>
								</TableRow>
								<TableRow>
									<TableCellLeftName> Std Dev of Price </TableCellLeftName>
									<TableCellLeftValue> {roundResults(farmInfo["std-price"],
										2)}
									<span style={{fontSize: "0.875em"}}> /bu</span>
									</TableCellLeftValue>
								</TableRow>
								<TableRow>
									<TableCellLeftName> Average Harvest Cash
											Basis </TableCellLeftName>
									<TableCellLeftValue> {roundResults(
										farmInfo["avg-harvest-cash-basis"], 2)}
									<span style={{fontSize: "0.875em"}}> /bu</span>
									</TableCellLeftValue>
								</TableRow>
								<TableRow>
									<TableCellLeftName> Average Gross Crop
											Rev </TableCellLeftName>
									<TableCellLeftValue> {roundResults(
										farmInfo["avg-gross-crop-rev"], 2)}
									<span style={{fontSize: "0.875em"}}> /acre</span>
									</TableCellLeftValue>
								</TableRow>
							</Table>
						</Grid>
						<Grid item>
							<Grid container direction="column" justify="center"
											alignItems="center" spacing={24}>
								<Grid item>
									<Table>
										<TableHead>
											<TableRow>
												<TableCellHeader/>
												<TableCellHeader align="right">Farm Yield
														(bu/acre)</TableCellHeader>
												<TableCellHeader align="right">County Yield
														(bu/acre)</TableCellHeader>
											</TableRow>
										</TableHead>

										<TableBody>
											<TableRow>
												<TableCellRightName> 30% of years yields
														below </TableCellRightName>
												<TableCellRightValue> {roundResults(
													farmInfo["farm-yield-below-30"],
													2)} </TableCellRightValue>
												<TableCellRightValue> {roundResults(
													farmInfo["county-yield-below-30"],
													2)} </TableCellRightValue>
											</TableRow>

											<TableRow>
												<TableCellRightName> 20% of years yields
														below </TableCellRightName>
												<TableCellRightValue> {roundResults(
													farmInfo["farm-yield-below-20"],
													2)} </TableCellRightValue>
												<TableCellRightValue> {roundResults(
													farmInfo["county-yield-below-20"],
													2)} </TableCellRightValue>
											</TableRow>

											<TableRow>
												<TableCellRightName> 10% of years yields
														below </TableCellRightName>
												<TableCellRightValue> {roundResults(
													farmInfo["farm-yield-below-10"],
													2)} </TableCellRightValue>
												<TableCellRightValue> {roundResults(
													farmInfo["county-yield-below-10"],
													2)} </TableCellRightValue>
											</TableRow>

											<TableRow>
												<TableCellRightName> 5% of years yields
														below </TableCellRightName>
												<TableCellRightValue> {roundResults(
													farmInfo["farm-yield-below-5"],
													2)} </TableCellRightValue>
												<TableCellRightValue> {roundResults(
													farmInfo["county-yield-below-5"],
													2)} </TableCellRightValue>
											</TableRow>
										</TableBody>
									</Table>
								</Grid>
								<Grid item>
									<Table>
										<TableRow>
											<TableCellLeftName> Farm Trend-Adjusted
													APH </TableCellLeftName>
											<TableCellLeftValue> {roundResults(
												farmInfo["trend-adj-aph"], 2)}
											<span style={{fontSize: "0.875em"}}> bu/acre</span>
											</TableCellLeftValue>
										</TableRow>
										<TableRow>
											<TableCellLeftName> County TA Rate </TableCellLeftName>
											<TableCellLeftValue> {roundResults(
												farmInfo["county-ta-rate"], 2)}
											<span
															style={{fontSize: "0.875em"}}> bu/acre/year</span>
											</TableCellLeftValue>
										</TableRow>
										<TableRow>
											<TableCellLeftName> Farm APH (ref) </TableCellLeftName>
											<TableCellLeftValue> {roundResults(farmInfo["farm-aph"],
												2)}
											<span style={{fontSize: "0.875em"}}> bu/acre</span>
											</TableCellLeftValue>
										</TableRow>
									</Table>
								</Grid>
							</Grid>
						</Grid>
					</Grid>

					<Divider/>
				</div>
			);
		}
		else {
			return (
				<div />
			);
		}
	}
}

export default EvaluatorFarmInfo;
