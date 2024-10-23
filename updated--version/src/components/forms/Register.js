import React, { Component } from "react";
import "./Login.css";
class Register extends Component {
	state = {
		email: "",
		password: "",
        displayName: "",
		fireErrors: "",
	};

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

	render() {
		return (
			<>
				<form>
					<input
						type="text"
						className="regField"
						placeholder="Your name"
						value={this.state.displayName}
						onChange={this.handleChange}
						name="displayName"
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
						value="REGISTER"
					/>
				</form>
			</>
		);
	}
}
export default Register;
