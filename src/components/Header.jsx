import React, {Component} from "react";
import {hashHistory,Link} from "react-router";
import styles from "../styles/header.css";
import styles2 from "../styles/main.css";
import {Button, Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle, Grid, Cell, Textfield, Caption, Icon, MenuAnchor, Menu, MenuItem, MenuDivider} from "react-mdc-web";
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";

class Header extends Component {

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};

		this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogout() {
		sessionStorage.removeItem("personId");
		sessionStorage.removeItem("email");
		this.props.handleUserLogout();
		hashHistory.push("/");
	}
    //TODO: add fixed for Toolbar
	render() {
		return(
			<div>
				<Toolbar>
					<ToolbarRow className="banner">
						<ToolbarSection className="farmdoc" align="start">
							<img src={require("../images/logo.png")}/>
							FarmDoc
						</ToolbarSection>
						<ToolbarSection align="end" >
							<span className="email-address">{this.props.email}</span>

							{this.props.isAuthenticated === false ? null :
								<Button onClick={this.handleLogout}>Logout</Button>}

						</ToolbarSection>
					</ToolbarRow>
				</Toolbar>
					<Grid className="no-bottom-grid">

						<Cell col={5} className="rectangle-2">
							<div>
								<Link to="/model" className="farmdoc-analyzer" >FarmDoc </Link>

							</div>
						</Cell>
						<Cell col={2} />
						<Cell col={5} className="rectangle-3">
							<div>
								<Link to="/" className="about-the-project">About the Project</Link>
							</div>
						</Cell>
					</Grid>
			</div>

		);
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		isAuthenticated: state.user.isAuthenticated
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogout: () => {
			dispatch(handleUserLogout());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
