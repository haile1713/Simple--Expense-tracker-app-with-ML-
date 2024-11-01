import React, { Component } from "react";
import { auth } from "../../config/Fire";

class Tracker extends Component {
	//logout

	logout = () => {
		auth.signOut();
	};
	render() {
		return (
			<>
				<button onClick={this.logout}>Exit</button>
			</>
		);
	}
}
export default Tracker;
