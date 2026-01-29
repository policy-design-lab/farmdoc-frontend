import React, {useState} from "react";
import {
	Box,
	Typography,
	IconButton,
	Button,
	ThemeProvider,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CoverageLevelSlider from "./CoverageLevelSlider";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import "../../styles/new-evaluator.scss";

const AddPlanCard = ({planTitle = "PLAN 2", onClose, onRunEvaluator}) => {
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [coverageLevel, setCoverageLevel] = useState(80);

	const insurancePlans = [
		{id: "rp", label: "Revenue Protection (RP)"},
		{
			id: "rphpe",
			label: "Revenue Protection With Harvest Price Exclusion (RP-HPE)",
		},
		{id: "yp", label: "Yield Protection (YP)"},
	];

	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Box className="add-plan-card">
				<Box className="add-plan-header">
					<Typography className="add-plan-title">{planTitle}</Typography>
					<IconButton size="small" onClick={onClose} className="close-button">
						<CloseIcon />
					</IconButton>
				</Box>

				<Box className="add-plan-content">
					<Typography className="insurance-plan-label">
						Insurance Plan
					</Typography>

					<Box className="insurance-plan-options-compare">
						{insurancePlans.map((plan) => (
							<>
								<Box
									key={plan.id}
									className={`insurance-option-compare ${
										selectedPlan === plan.id ? "selected" : ""
									}`}
									onClick={() => setSelectedPlan(plan.id)}
								>
									<input
										type="radio"
										checked={selectedPlan === plan.id}
										onChange={() => setSelectedPlan(plan.id)}
									/>
									<Typography className="option-label">{plan.label}</Typography>
								</Box>
								{selectedPlan === plan.id && (
									<CoverageLevelSlider
										coverageLevel={coverageLevel}
										onChange={setCoverageLevel}
										showNote={false}
										noteText="Most common in the selected county"
									/>
								)}
							</>
						))}
					</Box>
					<Button
						variant="contained"
						className="run-evaluator-btn-compare run-evaluator-button"
						disabled={!selectedPlan}
						onClick={() => onRunEvaluator({selectedPlan, coverageLevel})}
					>
						<ArrowForwardIcon className="button-icon" />
						<span
							style={{
								fontWeight: 600,
								fontSize: "0.9375rem",
								lineHeight: "1.625rem",
								marginLeft: "0.5rem",
							}}
						>
							Run Evaluator
						</span>
					</Button>
				</Box>
			</Box>
		</ThemeProvider>
	);
};

export default AddPlanCard;
