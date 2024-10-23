import React, { Component } from "react";
import "./Login.css";
class Register extends Component {
	state = {
		email: "",
		password: "",
        displayName: "",
		fireErrors: "",
	};

	render() {
		return (
			<>
				<form>
					<input
						type="text"
						className="regField"
						placeholder="Your name"
						value={this.state.email}
						onChange={this.handleChange}
						name="name"
					/>
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
export default Register;
