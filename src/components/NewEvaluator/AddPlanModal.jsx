import React from "react";
import {Box, Typography, Menu, MenuItem, ThemeProvider} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {ReactComponent as AutoGraphIcon} from "../../images/autograph-dark.svg";
import {ReactComponent as GraphTrendAlertIcon} from "../../images/graphtrendalert-dark.svg";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import "../../styles/new-evaluator.scss";

const AddPlanModal = ({open, anchorEl, onClose, onSelectOption}) => {
	const presetOptions = [
		{id: "minimize-net-cost", label: "Maximum Insurance Benefit", icon: "GraphTrendAlert"},
		{id: "max-variance", label: "Minimum rsk (one-in-ten years event)", icon: "AutoGraph"}
	];

	const handleNewPlan = () => {
		onSelectOption("new");
		onClose();
	};

	const handlePresetOption = (optionId) => {
		onSelectOption(optionId);
		onClose();
	};

	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Menu
				open={open}
				anchorEl={anchorEl}
				onClose={onClose}
				className="add-plan-dropdown"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				getContentAnchorEl={null}
				PaperProps={{
					className: "add-plan-dropdown-paper"
				}}
			>
				<MenuItem onClick={handleNewPlan} className="add-plan-dropdown-item new-plan-item">
					<Box className="dropdown-item-content">
						<AddIcon className="dropdown-item-icon" />
						<Typography className="dropdown-item-text">New insurance plan</Typography>
					</Box>
				</MenuItem>
				{presetOptions.map((option) => (
					<MenuItem
						key={option.id}
						onClick={() => handlePresetOption(option.id)}
						className="add-plan-dropdown-item preset-option-item"
						style={{display: (option.id === "minimize-net-cost" || option.id === "max-variance") ? "flex" : "none"}}
					>
						<Box className="dropdown-item-content">
							{option.icon === "AutoGraph" ? (
								<AutoGraphIcon style={{width: "20px", height: "20px", fill: option.color}} />
							) : option.icon === "GraphTrendAlert" ? (
								<GraphTrendAlertIcon style={{width: "20px", height: "20px", fill: option.color}} />
							) : (
								<span className="dropdown-item-emoji">{option.icon}</span>
							)}
							<Typography className="dropdown-item-text">{option.label}</Typography>
						</Box>
					</MenuItem>
				))}
			</Menu>
		</ThemeProvider>
	);
};

export default AddPlanModal;
