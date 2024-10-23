import React, { Component } from "react";
import "./Login.css";
class Login extends Component {
	state = {
		email: "",
		password: "",
		fireErrors: "",
	};

	render() {
		return (
			<>
				<form>
					<input
						type="text"
						className="regField"
						placeholder="Email"
						value={this.state.email}
						onChange={this.handleChange}
						name="email"
					/>
					<input
						className="regField"
						placeholder="Pasword"
						value={this.state.password}
						onChange={this.handleChange}
						name="password"
						type="password"
					/>
					<input
						className="submitBtn"
						type="submit"
						onClick={this.login}
						value="ENTER"
					/>
				</form>
			</>
		);
	}
}
export default Login;
