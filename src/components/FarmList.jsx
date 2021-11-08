import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {lighten, makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FilterListIcon from "@material-ui/icons/FilterList";
import {browserHistory, Link} from "react-router";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 750,
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1,
	},
	tableHeadCell: {
		fontWeight: 600,
	},

}));


const farms = [
	{
		name: "Farm 1",
		crops: [{name: "Corn", baseAcres: 50, plantedAcres: 40}],
		state: "IL",
		county: "Champaign",
		acres: 100,
		created: "2021-08-06",
	},
	{
		name: "Farm 2",
		crops: [{name: "Soy", baseAcres: 50, plantedAcres: 40}],
		state: "IL",
		county: "Douglas",
		acres: 120,
		created: "2021-01-19",
	},
	{
		name: "Farm 3",
		crops: [{name: "Corn", baseAcres: 50, plantedAcres: 40}],
		state: "IL",
		county: "Ford",
		acres: 10,
		created: "2021-04-10",
	},
	{
		name: "Farm 4",
		crops: [{name: "Wheat", baseAcres: 50, plantedAcres: 40}, {name: "Soy", baseAcres: 50, plantedAcres: 40}],
		state: "IN",
		county: "Clay",
		acres: 100,
		created: "2021-01-13",
	},
	{
		name: "Farm 5",
		crops: [{name: "Wheat", baseAcres: 50, plantedAcres: 40}],
		state: "IL",
		county: "Douglas",
		acres: 150,
		created: "2021-02-12",
	},
	{
		name: "Farm 6",
		crops: [{name: "Corn", baseAcres: 50, plantedAcres: 40}],
		state: "IN",
		county: "Lawrence",
		acres: 70,
		created: "2021-01-11",
	},
	{
		name: "Farm 7",
		crops: [{name: "Soy", baseAcres: 50, plantedAcres: 40}],
		state: "IL",
		county: "McLean",
		acres: 85,
		created: "2021-02-12",
	},
	{
		name: "Farm 8",
		crops: [{name: "Corn", baseAcres: 50, plantedAcres: 40}],
		state: "IN",
		county: "Lawrence",
		acres: 50,
		created: "2021-01-03",
	},
];

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc"
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{
		id: "name",
		numeric: false,
		disablePadding: false,
		label: "Farm Name",
	},
	{id: "crop", numeric: false, disablePadding: false, label: "Crop(s)"},
	{id: "state", numeric: false, disablePadding: false, label: "State"},
	{id: "county", numeric: false, disablePadding: false, label: "County"},
	{id: "acres", numeric: true, disablePadding: false, label: "Total Base Acres"},
	{id: "created", numeric: false, disablePadding: false, label: "Created on"},
];

function EnhancedTableHead(props) {
	const {
		classes,
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
	} = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
			<TableHead>
				<TableRow>
					{headCells.map((headCell) => (
							<TableCell
									key={headCell.id}
									// align={headCell.numeric ? "right" : "left"}
									align={headCell.numeric ? "left" : "left"}
									padding={headCell.disablePadding ? "none" : "normal"}
									sortDirection={orderBy === headCell.id ? order : false}
									className={classes.tableHeadCell}
							>
								<TableSortLabel
										active={orderBy === headCell.id}
										direction={orderBy === headCell.id ? order : "asc"}
										onClick={createSortHandler(headCell.id)}
								>
									{headCell.label}
									{orderBy === headCell.id ? (
											<span className={classes.visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</span>
									) : null}
								</TableSortLabel>
							</TableCell>
					))}
				</TableRow>
			</TableHead>
	);
}

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
			theme.palette.type === "light"
					? {
						color: theme.palette.primary.main,
						backgroundColor: lighten(theme.palette.primary.light, 0.85),
					}
					: {
						color: theme.palette.text.primary,
						backgroundColor: theme.palette.primary.dark,
					},
	title: {
		flex: "1 1 100%",
	},
	tableRow: {
		paddingLeft: "12px",
	},
}));

function handleEditField() {
	browserHistory.push("/farms/edit?id=1");
}

const EnhancedTableToolbar = (props) => {
	const classes = useToolbarStyles();
	const {numSelected, selectedFarm} = props;

	return (
			<Toolbar
					className={clsx(classes.root, {
						[classes.highlight]: numSelected > 0,
					})}
			>
				{numSelected > 0 ? (
						<Typography className={classes.title} color="inherit"
												variant="subtitle1" component="div">
							{selectedFarm} selected
						</Typography>
				) : (
						<Typography className={classes.title} variant="h6" id="tableTitle"
												component="div">
							My Farms
						</Typography>
				)}

				{/*<span>*/}
				{numSelected > 0 ? (
						<span style={{width: "110px"}}>
					<Tooltip title="Edit">
						<IconButton aria-label="edit" onClick={handleEditField}>
							<EditIcon/>
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete">
						<IconButton aria-label="delete">
							<DeleteIcon/>
						</IconButton>
					</Tooltip>
				</span>


				) : (
						<Tooltip title="Filter list">
							<IconButton aria-label="filter list">
								<FilterListIcon/>
							</IconButton>
						</Tooltip>
				)}
				{/*</span>*/}
			</Toolbar>
	);
};

export default function EnhancedTable() {
	const classes = useStyles();
	// let history = useHistory();
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("calories");
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = farms.map((n) => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		setSelected([name]);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	const emptyRows = rowsPerPage -
			Math.min(rowsPerPage, farms.length - page * rowsPerPage);

	return (
			<div className={classes.root}>
				<Paper className={classes.paper}>
					<EnhancedTableToolbar numSelected={selected.length}
																selectedFarm={selected.length > 0
																		? selected[0]
																		: ""}/>
					<TableContainer>
						<Table
								className={classes.table}
								aria-labelledby="tableTitle"
								size={dense ? "small" : "medium"}
								aria-label="enhanced table"
						>
							<EnhancedTableHead
									classes={classes}
									numSelected={selected.length}
									selectedFarm={selected.length > 0
											? selected[0].toString()
											: ""}
									order={order}
									orderBy={orderBy}
									onSelectAllClick={handleSelectAllClick}
									onRequestSort={handleRequestSort}
									rowCount={farms.length}
							/>
							<TableBody>
								{stableSort(farms, getComparator(order, orderBy)).
										slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).
										map((row, index) => {
											const isItemSelected = isSelected(row.name);
											const labelId = `enhanced-table-checkbox-${index}`;

											return (
													<TableRow
															hover
															onClick={(event) => handleClick(event, row.name)}
															role="checkbox"
															aria-checked={isItemSelected}
															tabIndex={-1}
															key={row.name}
															selected={isItemSelected}
															style={{
																backgroundColor: isItemSelected
																		? "rgb(234, 236, 247)"
																		: "",
															}}
													>
														{/*<TableCell padding="checkbox">*/}
														{/*	<Checkbox*/}
														{/*			checked={isItemSelected}*/}
														{/*			inputProps={{"aria-labelledby": labelId}}*/}
														{/*	/>*/}
														{/*</TableCell>*/}
														<TableCell component="th" id={labelId} scope="row">
															{row.name}
														</TableCell>
														<TableCell align="left">{row.crops.map(e => e.name).join(", ")}</TableCell>
														<TableCell align="left">{row.state}</TableCell>
														<TableCell align="left">{row.county}</TableCell>
														<TableCell align="left">{row.acres}</TableCell>
														<TableCell align="left">{row.created}</TableCell>
													</TableRow>
											);
										})}
								{emptyRows > 0 && (
										<TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
											<TableCell colSpan={6}/>
										</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
							rowsPerPageOptions={[2, 4, 5, 10, 25]}
							component="div"
							count={farms.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onRowsPerPageChange={handleChangeRowsPerPage}
							onPageChange={handleChangePage}/>
				</Paper>
			</div>
	);
}
