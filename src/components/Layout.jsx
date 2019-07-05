import React, {Component} from "react";
import Header from "./Header";
import Footer from "./Footer";


class Layout extends Component {

	render() {
		return ( <div>
			<Header selectedTab={this.props.selectedTab}/>
			<div className="masterContent">
				{this.props.children}
			</div>
			<Footer/>
		</div>
		);
	}
}

export default Layout;
