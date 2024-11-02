import React, { Component } from "react";
import { auth } from "../../config/Fire";
import "./Tracker.css";
import { getDatabase, ref, push } from "firebase/database";
import { type } from "@testing-library/user-event/dist/type";
import Transaction from "./Transaction/Transaction";
const database = getDatabase();

class Tracker extends Component {
	state = {
		transaction: [],
		money: 0,
		transactionName: "",
		transactionType: "",
		price: "",
		currentUID: auth.currentUser ? auth.currentUser.uid : null,
	};
	//logout

	logout = () => {
		auth.signOut();
	};

	handleChange = (input) => (e) => {
		this.setState({
			[input]: e.target.value !== "0" ? e.target.value : "",
		});
	};

	//add transaction
	addNewTransaction = () => {
		const { transactionName, transactionType, price, currentUID, money } =
			this.state;

		// Validation of transaction
		if (transactionName && transactionType && price) {
			const BackUpState = this.state.transaction;
			BackUpState.push({
				id: BackUpState.length + 1,
				name: transactionName,
				type: transactionType,
				price: price,
				user_id: currentUID,
			});

			// Use Firebase database methods
			const transactionRef = ref(database, "Transaction/" + currentUID);
			push(transactionRef, {
				id: BackUpState.length,
				name: transactionName,
				type: transactionType,
				price: price,
				user_id: currentUID,
			})
				.then(() => {
					// Success of transaction
					console.log("success");
					this.setState({
						transaction: BackUpState,
						money:
							transactionType === "deposit"
								? money + parseFloat(price)
								: money - parseFloat(price),
						transactionName: "",
						transactionType: "",
						price: "",
					});
				})
				.catch((error) => {
					// Error handling
					console.error("Error:", error);
				});
		}
	};

	render() {
		var currentUser = auth.currentUser;
		return (
			<div className="trackerBlock">
				<div className="welcome">
					<span>Hi,{currentUser.displayName}!</span>
					<button className="exit" onClick={this.logout}>
						Exit
					</button>
				</div>
				<div className="totalMoney">
					${this.state.money}
					<div className="newTransactionBlock">
						<div className="newTransaction">
							<form>
								<input
									placeholder="Transaction Name"
									type="text"
									name="transactionName"
									value={this.state.transactionName}
									onChange={this.handleChange("transactionName")}
								/>
								<div className="inputGroup">
									<select
										name="type"
										value={this.state.transactionType}
										onChange={this.handleChange("transactionType")}
									>
										<option value="0">Type</option>
										<option value="expense">Expense</option>
										<option value="deposit">Deposit</option>
									</select>
									<input
										placeholder="Price"
										type="text"
										name="Price"
										value={this.state.price}
										onChange={this.handleChange("price")}
									/>
								</div>
							</form>
							<button
								className="addTransaction"
								onClick={() => this.addNewTransaction()}
							>
								+ Add Transaction
							</button>
						</div>
					</div>
				</div>
				<div className="latestTransactions">
					<p>Latest Transactions</p>
					<ul>
						{this.state.transaction.map((transaction, id) => (
							<Transaction
								key={id} // Make sure to add a unique key for each component
								type={transaction.type}
								name={transaction.name}
								price={transaction.price}
							/>
						))}
					</ul>
				</div>
			</div>
		);
	}
}
export default Tracker;
