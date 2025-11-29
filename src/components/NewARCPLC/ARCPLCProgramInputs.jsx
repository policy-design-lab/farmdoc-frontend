import React from "react";
import {Box, Typography, ThemeProvider} from "@material-ui/core";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import config from "../../app.config";
import "../../styles/new-evaluator.scss";

const ARCPLCProgramInputs = () => {
	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Box className="arcplc-program-inputs">
				<Typography variant="h6" className="section-title">
					ARC/PLC PROGRAM INPUTS
				</Typography>

				<Box className="program-input-row">
					<Typography className="program-input-label">
						ARC Coverage level
					</Typography>
					<Typography className="program-input-value">
						{config.defaultsJson.coverage * 100}%
					</Typography>
				</Box>

				<Box className="program-input-row">
					<Typography className="program-input-label">
						ARC Coverage Range
					</Typography>
					<Typography className="program-input-value">
						{config.defaultsJson.range * 100}%
					</Typography>
				</Box>

				<Box className="program-input-row">
					<Typography className="program-input-label">Payment Acres</Typography>
					<Typography className="program-input-value">
						{config.defaultsJson.acres * 100}%
					</Typography>
				</Box>

				<Box className="program-input-row">
					<Typography className="program-input-label">
						Statutory Reference Price ($/bu)
					</Typography>
					<Typography className="program-input-value">$4.10</Typography>
				</Box>
			</Box>
		</ThemeProvider>
	);
};

export default ARCPLCProgramInputs;
