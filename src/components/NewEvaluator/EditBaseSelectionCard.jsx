import React, {useState, useEffect} from "react";
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
import "../../styles/new-evaluator.scss";

const EditBaseSelectionCard = ({
	planTitle = "YOUR BASE SELECTION",
	onClose,
	onSave,
	initialPlan,
	initialCoverageLevel,
}) => {
	const [selectedPlan, setSelectedPlan] = useState(initialPlan || "rp");
	const [coverageLevel, setCoverageLevel] = useState(
		initialCoverageLevel || 80
	);
	useEffect(() => {
		if (initialPlan) {
			setSelectedPlan(initialPlan);
		}
		if (initialCoverageLevel) {
			setCoverageLevel(initialCoverageLevel);
		}
	}, [initialPlan, initialCoverageLevel]);
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
					<Box className="insurance-plan-header-row">
						<Typography className="insurance-plan-label">
							Insurance Plan
						</Typography>
						<Button
							variant="contained"
							className="save-changes-btn"
							onClick={() => onSave({planName: selectedPlan, coverageLevel})}
						>
							Save
						</Button>
					</Box>

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
				</Box>
			</Box>
		</ThemeProvider>
	);
};

export default EditBaseSelectionCard;
