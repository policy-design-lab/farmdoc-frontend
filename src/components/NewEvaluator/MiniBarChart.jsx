import React from "react";
import {Box} from "@material-ui/core";
import "../../styles/new-evaluator.scss";

const MiniBarChart = ({metrics}) => {
	const values = [
		parseFloat(metrics?.estimatedPremium) || 0,
		parseFloat(metrics?.avgIndemnityPayment) || 0,
		parseFloat(metrics?.netCost) || 0,
		parseFloat(metrics?.netBenefit) || 0
	];
	const normalizedValues = values.map((v, i) => {
		if (i === 3) {
			return v / 30;
		}
		return v;
	});
	const maxAbsValue = Math.max(...normalizedValues.map(v => Math.abs(v))) || 1;
	return (
		<Box className="mini-bar-chart">
			{normalizedValues.map((value, index) => {
				const percentage = (Math.abs(value) / maxAbsValue) * 50;
				const barColor = index === 0 ? "#996300" : "#FFC966";
				const isPositive = value >= 0;

				const displayHeight = value === 0 ? 0 : Math.max(percentage, 5);
				const bottom = isPositive ? 50 : (50 - displayHeight);

				return (
					<Box key={index} className="mini-bar-item">
						<Box className="mini-bar-track">
							{value !== 0 && (
								<Box
									className="mini-bar-fill"
									style={{
										height: `${displayHeight}%`,
										bottom: `${bottom}%`,
										backgroundColor: barColor
									}}
								/>
							)}
							<Box className="mini-bar-center-line" />
						</Box>
					</Box>
				);
			})}
		</Box>
	);
};

export default MiniBarChart;
