import React, {useState} from "react";
import {Dialog, DialogContent, DialogTitle, Box, Typography, IconButton, Button, ThemeProvider} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CoverageLevelSlider from "./CoverageLevelSlider";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import "../../styles/new-evaluator.scss";

const EditInsurancePlanModal = ({open, onClose, onSave, initialData = {}}) => {
	const [selectedPlan, setSelectedPlan] = useState(initialData.planName || "rp");
	const [coverageLevel, setCoverageLevel] = useState(initialData.coverageLevel || 80);

	const insurancePlans = [
		{id: "rp", label: "Revenue Protection (RP)"},
		{id: "rphpe", label: "Revenue Protection With Harvest Price Exclusion (RP-HPE)"},
		{id: "yp", label: "Yield Protection (YP)"}
	];

	const handleSave = () => {
		if (onSave) {
			onSave({
				planName: selectedPlan,
				coverageLevel: coverageLevel
			});
		}
		onClose();
	};

	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Dialog
				open={open}
				onClose={onClose}
				maxWidth="sm"
				fullWidth
				className="edit-insurance-plan-modal"
			>
				<DialogTitle className="modal-title">
					<Typography className="modal-title-text">Edit Insurance Plan</Typography>
					<IconButton onClick={onClose} className="modal-close-button">
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent className="modal-content">
					<Box className="modal-form">
						<Typography className="insurance-plan-label">Insurance Plan</Typography>

						<Box className="insurance-plan-options-compare">
							{insurancePlans.map((plan) => (
								<Box
									key={plan.id}
									className={`insurance-option-compare ${selectedPlan === plan.id ? "selected" : ""}`}
									onClick={() => setSelectedPlan(plan.id)}
								>
									<input
										type="radio"
										checked={selectedPlan === plan.id}
										onChange={() => setSelectedPlan(plan.id)}
									/>
									<Typography className="option-label">{plan.label}</Typography>
								</Box>
							))}
						</Box>

						<CoverageLevelSlider
							coverageLevel={coverageLevel}
							onChange={setCoverageLevel}
							showNote={false}
							noteText="Most common in the selected county"
						/>

						<Box className="modal-actions">
							<Button onClick={onClose} className="modal-cancel-btn">
								Cancel
							</Button>
							<Button onClick={handleSave} variant="contained" className="modal-save-btn">
								Save
							</Button>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</ThemeProvider>
	);
};

export default EditInsurancePlanModal;
