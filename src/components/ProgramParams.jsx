import React, {Component} from "react";
import config from "../app.config";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";

const CustomTableRow = withStyles(() => ({
	root: {
		height: 24
	}
}))(TableRow);

const CustomTableHeadRow = withStyles(() => ({
	root: {
		height: 36,
		fontWeight: "bold",
		paddingLeft: 80

	}
}))(TableRow);

const CustomLabelCell = withStyles(() => ({
	root: {
		paddingLeft: 60,
		paddingRight: 12,
		width: "60%"
	}
}))(TableCell);

const CustomValueCell = withStyles(() => ({
	root: {
		paddingRight: 60,
		width: "40%"
	}
}))(TableCell);


class ProgramParams extends Component {

	render() {
		
		return (
			<div style={{backgroundColor: "#efefef"}}>
				<Table >
					<TableBody>
						<CustomTableHeadRow>
							<TableCell colSpan={2} style={{textAlign: "center", fontWeight: "bold"}}>
							ARC/PLC Program Inputs
							</TableCell>
						</CustomTableHeadRow>
						<CustomTableRow >
							<CustomLabelCell>
								ARC Coverage Level
							</CustomLabelCell>
							<CustomValueCell >
								{config.defaultsJson.coverage} %
							</CustomValueCell>
						</CustomTableRow>
						<CustomTableRow >
							<CustomLabelCell>
								ARC Coverage Range
							</CustomLabelCell>
							<CustomValueCell>
								{config.defaultsJson.range} %
							</CustomValueCell>
						</CustomTableRow>
						<CustomTableRow>
							<CustomLabelCell>
								Payment Acres
							</CustomLabelCell>
							<CustomValueCell>
								{config.defaultsJson.acres} %
							</CustomValueCell>
						</CustomTableRow>
					</TableBody>
				</Table>
			</div>
		);
	}
}

export default ProgramParams;
