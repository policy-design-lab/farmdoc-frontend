import React, {useEffect, useRef} from "react";
import * as d3 from "d3";
import {Box, ThemeProvider} from "@material-ui/core";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import "../../styles/new-evaluator.scss";

const ARCPLCBarChartD3 = ({arcPayments, plcPayments, years}) => {
	const svgRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		if (!arcPayments || !plcPayments || !years || years.length === 0) {
			return;
		}

		const lastYearIndex = years.length - 1;
		const data = [
			{
				label: "ARC-CO",
				value: parseFloat(arcPayments[lastYearIndex]) || 0,
				color: "#FD8945",
				hoverColor: "#E57A3C",
			},
			{
				label: "PLC",
				value: parseFloat(plcPayments[lastYearIndex]) || 0,
				color: "#60ABD0",
				hoverColor: "#5499BA",
			},
		];

		const container = containerRef.current;
		const containerWidth = container.offsetWidth;
		const margin = {top: 40, right: 20, bottom: 40, left: 60};
		const width = containerWidth - margin.left - margin.right;
		const height = 300 - margin.top - margin.bottom;

		d3.select(svgRef.current).selectAll("*").remove();

		const svg = d3
			.select(svgRef.current)
			.attr("width", containerWidth)
			.attr("height", 300)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.label))
			.range([0, width])
			.padding(0.4);

		const maxValue = d3.max(data, (d) => d.value);
		const y = d3
			.scaleLinear()
			.domain([0, maxValue * 1.2])
			.range([height, 0]);

		const xAxis = svg
			.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x).tickSize(0));

		xAxis.select(".domain").attr("stroke", "#DADEE0").attr("stroke-width", 1);

		xAxis
			.selectAll("text")
			.attr("dy", "1.5em")
			.attr("class", "x-axis-text")
			.style("font-family", "'Open Sans', sans-serif")
			.style("font-size", "0.875rem")
			.style("fill", "#586B74")
			.style("font-weight", 600);

		const yAxis = svg.append("g").call(
			d3
				.axisLeft(y)
				.ticks(0)
				.tickSize(0)
		);

		yAxis.select(".domain").attr("stroke", "#DADEE0").attr("stroke-width", 1);

		svg
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left + 20)
			.attr("x", 0 - height / 2)
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.style("font-family", "'Open Sans', sans-serif")
			.style("font-size", "16px")
			.style("fill", "#586B74")
			.text("Expected Payments ($/base acre)");

		const bars = svg
			.selectAll(".bar")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", (d) => x(d.label))
			.attr("width", x.bandwidth())
			.attr("y", (d) => y(d.value))
			.attr("height", (d) => height - y(d.value))
			.attr("fill", (d) => d.color)
			.style("cursor", "pointer");

		const labelGroups = svg
			.selectAll(".label-group")
			.data(data)
			.enter()
			.append("g")
			.attr("class", "label-group")
			.attr("transform", (d) => `translate(${x(d.label) + x.bandwidth() / 2}, ${y(d.value) - 8})`);

		labelGroups
			.append("rect")
			.attr("rx", 8)
			.attr("ry", 8)
			.attr("fill", "rgba(44, 52, 60, 0.08)")
			.attr("x", function() {
				const textNode = d3.select(this.parentNode).append("text")
					.text((d) => `$${d.value.toFixed(2)}`)
					.style("font-family", "'Open Sans', sans-serif")
					.style("font-size", "16px")
					.style("font-weight", 600);
				const bbox = textNode.node().getBBox();
				textNode.remove();
				const padding = 8;
				return -(bbox.width + padding * 2) / 2;
			})
			.attr("y", -24)
			.attr("width", function() {
				const textNode = d3.select(this.parentNode).append("text")
					.text((d) => `$${d.value.toFixed(2)}`)
					.style("font-family", "'Open Sans', sans-serif")
					.style("font-size", "1rem")
					.style("font-weight", 600);
				const bbox = textNode.node().getBBox();
				textNode.remove();
				const padding = 8;
				return bbox.width + padding * 2;
			})
			.attr("height", 24);

		labelGroups
			.append("text")
			.attr("text-anchor", "middle")
			.attr("y", -6)
			.style("font-size", "1rem")
			.style("font-weight", 400)
			.style("fill", "#29363C")
			.text((d) => `$${d.value.toFixed(2)}`);

		bars
			.on("mouseover", function (event, d) {
				d3.select(this).attr("fill", d.hoverColor);
			})
			.on("mouseout", function (event, d) {
				d3.select(this).attr("fill", d.color);
			});
	}, [arcPayments, plcPayments, years]);

	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Box className="arcplc-bar-chart" ref={containerRef}>
				<svg ref={svgRef} />
			</Box>
		</ThemeProvider>
	);
};

export default ARCPLCBarChartD3;
