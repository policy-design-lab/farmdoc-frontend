import React, {Component} from "react";
class Term extends Component {

	render(){
		let linkText = "";

		if (this.props.links != null && this.props.links.length > 0) {
			let links = this.props.links.map((link, i) => {
				return <a href={link.href} key={i} className="termLink" target="_blank"> {link.name} </a>;
			});
			linkText = <div> For more information visit: {links} </div>;
		}

		return (
			<div>
				<div className="termName"> {this.props.term}</div>
				<div className="termDefinition">
					{this.props.definition}
					{linkText}
				</div>
			</div>
		);
	}
}

export default Term;
