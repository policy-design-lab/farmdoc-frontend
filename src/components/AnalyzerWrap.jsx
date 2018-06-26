import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import {Button, Tabbar, Tab, ToolbarSection, ToolbarTitle, Grid, Cell, Textfield, Caption, Icon, MenuAnchor, Menu, MenuItem, MenuDivider} from 'react-mdc-web';
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";

class AnalyzerWrap extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const {activeTab} = this.props;
		// Cannot use Link within Tab
		return(
			<div>
				<span className="analyzer-line"> </span>
				<div className="analyzer-tab">
					<Tabbar>
						<Tab
							active={activeTab===3}
							href="#/profile"
						>
							My Fields
						</Tab>
						<Tab
							active={activeTab===4}
							href="#/model"
						>
							Farmdoc Model
						</Tab>
						<Tab
							active={activeTab===5}
							href="#/charts"
						>
							Farmdoc Charts
						</Tab>

					</Tabbar>

				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		isAuthenticated: state.user.isAuthenticated
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogout: () => {
			dispatch(handleUserLogout());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalyzerWrap);
