import {Box, Typography, ThemeProvider} from "@material-ui/core";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import "../../styles/new-evaluator.scss";

const CoverageLevelSlider = ({
	coverageLevel,
	onChange,
	minValue = 55,
	maxValue = 85,
	showNote = false,
	noteText = "Most common in the selected county",
}) => {
	const percentage = ((coverageLevel - minValue) / (maxValue - minValue)) * 100;
	const thumbColor = "#455A64";
	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Box className="coverage-level-section">
				<Box className="coverage-level-header">
					<Typography className="field-label" style={{marginBottom: 0}}>
						COVERAGE LEVEL
					</Typography>
					<Typography className="coverage-percentage">
						{coverageLevel}%
					</Typography>
				</Box>
				{showNote && (
					<Typography className="coverage-note">{noteText}</Typography>
				)}
				<Box className="coverage-slider">
					<Box className="slider-fill" style={{width: `${percentage}%`}} />
					<input
						type="range"
						min={minValue}
						max={maxValue}
						step="5"
						value={coverageLevel}
						onChange={(e) => onChange(parseInt(e.target.value))}
						style={{
							"--thumb-color": thumbColor,
						}}
					/>
					<span className="slider-tick tick-60" />
					<span className="slider-tick tick-65" />
					<span className="slider-tick tick-70" />
					<span className="slider-tick tick-75" />
					<span className="slider-tick tick-80" />
				</Box>
				<Box className="coverage-range">
					<Typography>{minValue}%</Typography>
					<Typography>{maxValue}%</Typography>
				</Box>
			</Box>
		</ThemeProvider>
	);
};

export default CoverageLevelSlider;
