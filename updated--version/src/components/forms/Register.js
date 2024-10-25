import React, { Component } from 'react';
import { auth, createUserWithEmailAndPassword, updateProfile } from '../../config/Fire';
import './Login.css';

class Register extends Component {
    state = {
        email: '',
        password: '',
        displayName: '',
        fireErrors: ''
    }

    register = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
            .then((userCredential) => {
                const currentUser = userCredential.user;
                return updateProfile(currentUser, {
                    displayName: this.state.displayName
                });
            })
            .catch((error) => {
                this.setState({ fireErrors: error.message });
            });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { displayName, email, password, fireErrors } = this.state;

        return (
            <>
                {fireErrors && <div className="Error">{fireErrors}</div>}
                <form>
                    <input
                        type="text"
                        className="regField"
                        placeholder="Your Name"
                        value={displayName}
                        onChange={this.handleChange}
                        name="displayName"
                    />
                    <input
                        type="text"
                        className="regField"
                        placeholder="Email"
                        value={email}
                        onChange={this.handleChange}
                        name="email"
                    />
                    <input
                        type="password"
                        className="regField"
                        placeholder="Password"
                        value={password}
                        onChange={this.handleChange}
                        name="password"
                    />
                    <input
                        className="submitBtn"
                        type="submit"
                        onClick={this.register}
                        value="REGISTER"
                    />
                </form>
            </>
        );
    }
}

export default Register;
