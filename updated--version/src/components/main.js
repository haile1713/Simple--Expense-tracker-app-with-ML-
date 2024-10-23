import React, { Component } from "react";
import "./Main.css";
import Login from "./forms/Login";
import Register from "./forms/Register";
export default class Main extends Component {
	state = {
		user: 1,
		loading: true,
		formSwitcher: false,
	};
	formSwitcher = (action) => {
		this.setState({ formSwitcher: action === "register" ? true : false });
	};
	render() {
        const form = !this.state.formSwitcher ? <Login /> : <Register />;


		return (
			<>
				<div className="mainBlock">
                {form}
					{ !this.state.formSwitcher ?
						(<span className="underLine">
							Not registered?{" "}
							<button
								onClick={() =>
									this.formSwitcher(
										!this.state.formSwitcher ? "register" : "login"
									)
								}
								className="linkBtn"
							>
								Create an account
							</button>
						</span>):(
                          <span className="underLine">Have an account already? <button onClick={() => this.formSwitcher(!this.state.formSwitcher ? 'register' : 'login')} 
                          className="linkBtn">Sign in here</button>
                        </span>
                        )
					}
				</div>
			</>
		);
	}
}
