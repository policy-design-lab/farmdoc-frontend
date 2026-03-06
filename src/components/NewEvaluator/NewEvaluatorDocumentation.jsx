import React, {Component} from "react";
import "../../styles/main.css";
import Layout from "../Layout";
import AuthorizedWrap from "../AuthorizedWrap";

class NewEvaluatorDocumentation extends Component {
	componentDidMount() {
		document.body.classList.add("new-evaluator-docs-layout");
	}

	componentWillUnmount() {
		document.body.classList.remove("new-evaluator-docs-layout");
	}

	render() {
		return (
			<div>
				<Layout selectedTab="docs">
					<AuthorizedWrap>
						<div className="newEvaluatorDocumentationPage">
							<iframe
								src="https://farmdocdaily.illinois.edu/2026/02/release-of-insurance-evaluator-with-the-new-sco-and-eco.html"
								title="Release of Insurance Evaluator with the New SCO and ECO"
								className="newEvaluatorDocumentationFrame"
							/>
							<div className="newEvaluatorDocumentationLinkWrap">
								<a
									href="https://www.youtube.com/watch?v=mU-GG0lWpvo"
									target="_blank"
									rel="noopener noreferrer"
									className="newEvaluatorDocumentationLink"
								>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
									</svg>
									Watch the YouTube walkthrough: Release of Insurance Evaluator with the New SCO and ECO
								</a>
							</div>
						</div>
					</AuthorizedWrap>
				</Layout>
			</div>
		);
	}
}

export default NewEvaluatorDocumentation;
