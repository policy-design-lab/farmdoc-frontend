import React, {Component} from "react";
import ReactDOM from "react-dom";
import { HotTable, HotRow } from "@handsontable/react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import Header from "./Header";
import {Line, Bar, HorizontalBar} from "react-chartjs-2";
import {Grid, Table, TableCell, TableRow, TableHead, TableBody, Modal} from "@material-ui/core";
import "handsontable/dist/handsontable.full.css";

const styles = theme => ({
	root: {
		width: "auto",
		marginTop: theme.spacing.unit * 3,
		overflowX: "auto",
		borderColor: "black"
	},

	table: {
		//minWidth: 700,
		padding: 10,
		width: "auto",
		margin: 15
	},

	tableCell: {
	},

	paper: {
		position: "absolute",
		//width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
	}
});

const ChartTableCell = withStyles({
	root: {
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "rgb(224,224,224)",
		paddingRight: 0,
		minWidth: 450
	}
}) (TableCell);

const TableCellWithTable = withStyles({
	root: {
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "rgb(224,224,224)",
		padding:"0 0 0 0 !important"
	}
}) (TableCell);

const TableCellDefaultStyles = withStyles({
	root: {
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "rgb(224,224,224)",
		textAlign: "center",
		width: "95px",
		paddingLeft: "4px !important",
		paddingRight: "4px !important"
	}
}) (TableCell);

const TableCellHeader = withStyles({
	root: {
		color: "rgba(0, 0, 0, 0.54)",
		fontFamily: "Roboto",
		fontSize: "0.75rem",
		fontWeight: "500",

	}
}) (TableCellDefaultStyles);


const ArcTableCell = withStyles({
	root: {
		borderBottomStyle: "none",
		paddingBottom: "1px",
		verticalAlign: "bottom",
		color: "Orange",
		fontWeight: "bolder"
	}
}) (TableCellDefaultStyles);

const PlcTableCell = withStyles({
	root: {
		borderTopStyle: "none",
		verticalAlign: "top",
		color: "SkyBlue",
		fontWeight: "bolder"

	}
}) (TableCellDefaultStyles);

const CommonTableCell = withStyles({
	root: {
		fontWeight: "bolder"
	}
}) (TableCellDefaultStyles);


function getModalStyle() {
	const top = 50; //+ rand();
	const left = 50;// + rand();

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
		display: "inline-block"
	};
}


class FarmerCharts extends Component{

	state = {
		open: false,
	};

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};


	constructor(props) {
		super(props);
	}


	render() {
		const { classes } = this.props;

		let years = [];
		let prices = [];
		let yields = [];
		let arc = [];
		let plc = [];
		let probArc =[];
		let probPlc = [];
		let yieldUnits = "";

		let jsonData = null;

		if (this.props.hasOwnProperty("countyResultJson") && this.props["countyResultJson"] !== null) {
			jsonData = this.props["countyResultJson"];

		}
		// else{ //Uncomment to test with static 5 year response
		// 	jsonData = "{\"mean_prices\":{\"title\":\"Mean prices\",\"xData\":\"Year\",\"xDataUnit\":\"\",\"yData1Unit\":\"$\",\"yData2\":\"\",\"datasets\":{\"data\":[{\"value1\":{\"std\":0.583,\"pos\":100,\"mean\":3.713,\"max\":5.96,\"min\":2.258},\"point\":2017,\"value2\":{\"std\":null,\"pos\":null,\"mean\":null,\"max\":null,\"min\":null}},{\"value1\":{\"std\":0.638,\"pos\":100,\"mean\":3.76,\"max\":5.813,\"min\":2.134},\"point\":2018,\"value2\":{\"std\":null,\"pos\":null,\"mean\":null,\"max\":null,\"min\":null}},{\"value1\":{\"std\":0.666,\"pos\":100,\"mean\":3.781,\"max\":6.123,\"min\":2.02},\"point\":2019,\"value2\":{\"std\":null,\"pos\":null,\"mean\":null,\"max\":null,\"min\":null}},{\"value1\":{\"std\":0.662,\"pos\":100,\"mean\":3.791,\"max\":6.128,\"min\":2.177},\"point\":2020,\"value2\":{\"std\":null,\"pos\":null,\"mean\":null,\"max\":null,\"min\":null}},{\"value1\":{\"std\":0.657,\"pos\":100,\"mean\":3.795,\"max\":6.448,\"min\":2.123},\"point\":2021,\"value2\":{\"std\":null,\"pos\":null,\"mean\":null,\"max\":null,\"min\":null}}]},\"yData2Unit\":\"\",\"yDataSet\":\"National mean prices\",\"yData1\":\"Price\"},\"county_yields\":{\"title\":\"County yields\",\"xData\":\"Year\",\"xDataUnit\":\"\",\"yData1Unit\":\"bushel/acre\",\"yData2\":\"\",\"datasets\":{\"data\":[{\"value1\":{\"std\":21.948,\"pos\":100,\"mean\":191.793,\"max\":241.99,\"min\":103.991},\"point\":2017,\"value2\":{\"std\":null,\"pos\":null,\"mean\":null,\"max\":null,\"min\":null}},{\"value1\":{\"std\":21.947,\"pos\":100,\"mean\":193.785,\"max\":243.905,\"min\":105.78},\"point\":2018,\"value2\":{\"std\":null,\"pos\":null,\"mean\":null,\"max\":null,\"min\":null}},{\"value1\":{\"std\":21.947,\"pos\":100,\"mean\":195.777,\"max\":245.821,\"min\":107.572},\"point\":2019,\"value2\":{\"std\":null,\"pos\":null,\"mean\":null,\"max\":null,\"min\":null}},{\"value1\":{\"std\":21.946,\"pos\":100,\"mean\":197.77,\"max\":247.739,\"min\":109.368},\"point\":2020,\"value2\":{\"std\":null,\"pos\":null,\"mean\":null,\"max\":null,\"min\":null}},{\"value1\":{\"std\":21.945,\"pos\":100,\"mean\":199.762,\"max\":249.659,\"min\":111.168},\"point\":2021,\"value2\":{\"std\":null,\"pos\":null,\"mean\":null,\"max\":null,\"min\":null}}]},\"yData2Unit\":\"\",\"yDataSet\":\"County mean yields\",\"yData1\":\"Yield\"},\"county_average_arc_and_plc_payments\":{\"title\":\"County average ARC and PLC payments\",\"xData\":\"Year\",\"xDataUnit\":\"\",\"yData1Unit\":\"$\",\"yData2\":\"County PLC\",\"datasets\":{\"data\":[{\"value1\":{\"std\":27.06,\"pos\":45,\"mean\":22.2,\"max\":67.822,\"min\":0},\"point\":2017,\"value2\":{\"std\":28.743,\"pos\":52.2,\"mean\":22.211,\"max\":136.085,\"min\":0}},{\"value1\":{\"std\":23.611,\"pos\":32.5,\"mean\":13.59,\"max\":69.229,\"min\":0},\"point\":2018,\"value2\":{\"std\":30.799,\"pos\":48.9,\"mean\":21.238,\"max\":147.709,\"min\":0}},{\"value1\":{\"std\":23.261,\"pos\":29.7,\"mean\":12.834,\"max\":71.593,\"min\":0},\"point\":2019,\"value2\":{\"std\":31.262,\"pos\":48.3,\"mean\":20.98,\"max\":158.524,\"min\":0}},{\"value1\":{\"std\":21.487,\"pos\":24.8,\"mean\":10.423,\"max\":70.561,\"min\":0},\"point\":2020,\"value2\":{\"std\":30.672,\"pos\":47.7,\"mean\":20.842,\"max\":143.67,\"min\":0}},{\"value1\":{\"std\":23.132,\"pos\":27.6,\"mean\":12.292,\"max\":81.558,\"min\":0},\"point\":2021,\"value2\":{\"std\":30.362,\"pos\":46.7,\"mean\":20.387,\"max\":148.834,\"min\":0}}]},\"yData2Unit\":\"$/acre\",\"yDataSet\":\"County ARC and PLC payments\",\"yData1\":\"County ARC\"}}";
		// }

		if(jsonData !== null){
			let objData = JSON.parse(jsonData);

			if(objData.county_average_arc_and_plc_payments && objData.county_average_arc_and_plc_payments !== null){

				let arcplcData = objData.county_average_arc_and_plc_payments.datasets.data;

				arcplcData.forEach(function(element)
				{
					years.push(element.point);
					arc.push(element.value1.mean);
					plc.push(element.value2.mean);
					probArc.push(element.value1.pos);
					probPlc.push(element.value2.pos);

				});
			}

			if(objData.mean_prices && objData.mean_prices !== null){

				let priceData = objData.mean_prices.datasets.data;

				priceData.forEach(function(element) {
					prices.push(element.value1.mean);
				});
			}

			if(objData.county_yields && objData.county_yields !== null){

				//yData1Unit
				let yieldData = objData.county_yields.datasets.data;
				yieldUnits = objData.county_yields.yData1Unit;

				yieldData.forEach(function(element) {
					yields.push(element.value1.mean);
				});
			}




			let rowElems = [];
			for(let i = 0; i< years.length; i++){
				rowElems.push(
					<TableRow key={`childRowArc-${i}`}>
						<ArcTableCell>{arc[i]}</ArcTableCell>
						<ArcTableCell>{probArc[i]}%</ArcTableCell>
						<PlcTableCell rowSpan={2} style={{verticalAlign: "middle"}}>
							<img src={require(`../images/sample-dist${i+1}.png`)} onClick={this.handleOpen} />
						</PlcTableCell>
						<CommonTableCell rowSpan={2}> {prices[i]} </CommonTableCell>
						<CommonTableCell rowSpan={2}> {yields[i]} </CommonTableCell>
					</TableRow>
				);

				rowElems.push(
					<TableRow key={`childRowPlc-${i}`}>
						<PlcTableCell>{plc[i]}</PlcTableCell>
						<PlcTableCell>{probPlc[i]}%</PlcTableCell>
					</TableRow>
				);
			}


			let arcplcPayments =  {
				labels: years,
				datasets: [
					{
						label: "ARC Payments",
						backgroundColor: "Orange",
						hoverBackgroundColor: "LightSlateGray",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: arc
					},
					{
						label: "PLC Payments",
						backgroundColor: "SkyBlue",
						hoverBackgroundColor: "DarkGray",
						strokeColor: "rgba(151,187,205,1)",
						pointColor: "rgba(151,187,205,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(151,187,205,1)",
						data: plc
					}
				]
			};

			let barChartOptions = {
				responsive:true,
				maintainAspectRatio: false,
				scales: {
					xAxes: [{
						ticks: {
							beginAtZero: true

						},
						gridLines: {
							display:true,
							drawTicks: true,
							drawBorder: true,
							color:"rgba(0,0,0,0.1)"
						},
						position: "top"
					}]
				},
				title: {
					display:false,
					text:"ARC/PLC Payments - Coverage: 86% Range: 10%",
					fontColor: "DarkBlue",
					fontSize: 18
				}
			};


			return (
			<div>
				<Header selected="charts"/>
				<AnalyzerWrap activeTab={2}/>
				<AuthorizedWrap>

					<Modal open={this.state.open} onClose={this.handleClose}>
						<div style={getModalStyle()} className={classes.paper} >
							<Grid container style={{width: "900px", }}>
								<Grid item style={{padding: "10px", width:"50%"}}>
									<img src={require("../images/bin-arc.png")} style={{width:"100%"}} />
								</Grid>
								<Grid item style={{padding: "10px", width:"50%"}}>
									<img src={require("../images/bin-plc.png")} style={{width:"100%"}} />
								</Grid>
							</Grid>
						</div>
					</Modal>

				<Table className={classes.table}>

					<TableBody>
						<TableRow >
							<ChartTableCell rowSpan={1} >
								<HorizontalBar key="line-2" data={arcplcPayments} options={barChartOptions} />

							</ChartTableCell>
							<TableCellWithTable>

								<Table >
									<TableBody>
										<TableRow style={{height:"64px"}}>
											<TableCellHeader >Expected  &nbsp;Payment ($)</TableCellHeader>
											<TableCellHeader >Likelihood of Payment (avg)</TableCellHeader>
											<TableCellHeader >Simulation Distribution</TableCellHeader>
											<TableCellHeader >Simulated  &nbsp;Price ($)</TableCellHeader>
											<TableCellHeader >Simulated Yield ({yieldUnits})</TableCellHeader>
										</TableRow>

										{rowElems}
									</TableBody>
								</Table>


							</TableCellWithTable>
						</TableRow>


					</TableBody>
				</Table>

				</AuthorizedWrap>
			</div>
			);
		}
		else{
			//TODO: Improve the error message format
			return(
				<div>
				<Header selected="charts" />
				<AnalyzerWrap activeTab={5} />
					<AuthorizedWrap>
				<div>Run the model first</div>
					</AuthorizedWrap>
		
				</div>

			);
		}
	}

}

const mapStateToProps = (state) => {
	return {
		countyResultJson: state.model.countyResults
	};
};

export default connect(mapStateToProps, null) (withStyles(styles)(FarmerCharts));
