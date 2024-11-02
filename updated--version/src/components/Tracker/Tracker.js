import React, { Component } from "react";
import { auth } from "../../config/Fire";
import "./Tracker.css";
import { getDatabase, ref, push, get } from "firebase/database";
import Transaction from "./Transaction/Transaction";
import { trainModel, predictFutureExpenses } from "../../ML/ExpensePrediction"; // Import ML functions

const database = getDatabase();

class Tracker extends Component {
	state = {
		transaction: [],
		money: 0,
		transactionName: "",
		transactionType: "",
		price: "",
		currentUID: auth.currentUser ? auth.currentUser.uid : null,
		predictedExpenses: [], // State for predicted expenses
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

			// Firebase database methods
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
					this.setState(
						{
							transaction: BackUpState,
							money:
								transactionType === "deposit"
									? money + parseFloat(price)
									: money - parseFloat(price),
							transactionName: "",
							transactionType: "",
							price: "",
						},
						() => {
							this.trainModel(); // Train the model after updating state
						}
					);
				})
				.catch((error) => {
					// Error handling
					console.error("Error:", error);
				});
		}
	};

	componentDidMount() {
		const { currentUID } = this.state;
		let totalMoney = 0;
		const BackUpState = []; // Reset BackUpState to an empty array

		// `database` instance from the modular SDK
		const transactionRef = ref(database, "Transaction/" + currentUID);
		get(transactionRef)
			.then((snapshot) => {
				if (snapshot.exists()) {
					snapshot.forEach((childSnapshot) => {
						totalMoney =
							childSnapshot.val().type === "deposit"
								? parseFloat(childSnapshot.val().price) + totalMoney
								: totalMoney - parseFloat(childSnapshot.val().price);

						BackUpState.push({
							id: childSnapshot.val().id,
							name: childSnapshot.val().name,
							type: childSnapshot.val().type,
							price: childSnapshot.val().price,
							user_id: childSnapshot.val().user_id,
						});
					});

					this.setState(
						{
							transaction: BackUpState, // Non-duplicated transactions
							money: totalMoney,
						},
						() => {
							this.trainModel(); // Train the model on component mount
						}
					);
				}
			})
			.catch((error) => {
				console.error("Error fetching transactions:", error);
			});
	}

	// Train the model using imported function
	trainModel = async () => {
		const { transaction } = this.state;
		const expenses = transaction
			.filter((t) => t.type === "expense")
			.map((t) => parseFloat(t.price));

		if (expenses.length < 2) {
			console.log("Not enough data to train the model.");
			return;
		}

		const model = await trainModel(expenses); // Use trainModel from ExpensePrediction.js
		if (model) {
			const futureExpenses = await predictFutureExpenses(
				model,
				14,
				transaction.length
			); // Predict for 14 days
			this.setState({
				predictedExpenses: futureExpenses.map((amount) =>
					amount.toFixed(2)
				),
			});
		}
	};

	render() {
		var currentUser = auth.currentUser;
		return (
			<div className="trackerBlock">
				<div className="welcome">
					<span>Hi, {currentUser.displayName}!</span>
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
								key={id} // Unique key for each component
								type={transaction.type}
								name={transaction.name}
								price={transaction.price}
							/>
						))}
					</ul>
				</div>
				{/* Display predicted expenses */}
				<div className="predictedExpenses">
					<p>Predicted Expenses for the Next 14 Days:</p>
					<div className="prediction-container">
						{this.state.predictedExpenses.map((expense, index) => {
							let expenseClass = "low";
							if (expense >= 50 && expense <= 100) {
								expenseClass = "medium";
							} else if (expense > 100) {
								expenseClass = "high";
							}

							return (
								<div
									key={index}
									className={`prediction-card ${expenseClass}`}
								>
									<p>Day {index + 1}</p>
									<p>${expense}</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default Tracker;
