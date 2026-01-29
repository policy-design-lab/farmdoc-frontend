import React, {Component} from "react";
import {connect} from "react-redux";
import AuthorizedWarp from "../AuthorizedWrap";
import NewARCPLCSidebar from "./NewARCPLCSidebar";
import NewARCPLCResults from "./NewARCPLCResults";
import Layout from "../Layout";

class NewARCPLCDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lastYear: null,
		};
	}

	handleYearUpdate = (year) => {
		this.setState({lastYear: year});
	};

	render() {
		const titleText = this.state.lastYear
			? `2026 ARC/PLC Payment Estimates ($/base acre) - ${this.state.lastYear}`
			: "2026 ARC/PLC Payment Estimates ($/base acre)";

		return (
			<div>
				<Layout selectedTab="calculator">
					<AuthorizedWarp>
						<div
							style={{
								padding: "40px 0",
								maxWidth: 1300,
								margin: "0 auto",
								minWidth: 1300,
								boxSizing: "border-box",
							}}
						>
							<div
								style={{
									display: "flex",
									gap: "24px",
									alignItems: "flex-start",
								}}
							>
								<div
									style={{
										flex: "0 0 calc(33.333% - 12px)",
										minWidth: 0,
									}}
								>
									<NewARCPLCSidebar />
								</div>
								<div
									style={{
										flex: "0 0 calc(66.667% - 12px)",
										minWidth: 0,
									}}
								>
									<div style={{marginBottom: 24, textAlign: "center"}}>
										<span className="dashboard-title">{titleText}</span>
									</div>
									<NewARCPLCResults onYearUpdate={this.handleYearUpdate} />
								</div>
							</div>
							<div
								style={{
									textAlign: "center",
									marginTop: "24px",
									color: "#8A9BA4",
									fontSize: "0.75rem",
									fontStyle: "italic",
									lineHeight: "1.25rem",
								}}
							>
								The projected payments are a result of a simulation model. The model takes into account the uncertainty in prices and yields, and shows the average payment.
							</div>
						</div>
					</AuthorizedWarp>
				</Layout>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		countyResults: state.arcplcCalculator.countyResults,
	};
};

export default connect(mapStateToProps, null)(NewARCPLCDashboard);
