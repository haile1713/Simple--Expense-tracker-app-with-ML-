import React, { Component } from "react";
import { auth } from "../../config/Fire";
import "./Tracker.css";
import { getDatabase, ref, push, get } from "firebase/database";
import { type } from "@testing-library/user-event/dist/type";
import Transaction from "./Transaction/Transaction";
import { trainModel, predictExpense } from "../../ExpensePrediction";
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

		if (transactionName && transactionType && price) {
			const BackUpState = this.state.transaction;
			BackUpState.push({
				id: BackUpState.length + 1,
				name: transactionName,
				type: transactionType,
				price: price,
				user_id: currentUID,
			});

			const transactionRef = ref(database, "Transaction/" + currentUID);
			push(transactionRef, {
				id: BackUpState.length,
				name: transactionName,
				type: transactionType,
				price: price,
				user_id: currentUID,
			})
				.then(() => {
					console.log("Transaction added successfully");
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
						() => this.trainAndPredict() // Retrain the model and predict after state update
					);
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		}
	};

	componentDidMount() {
		const { currentUID } = this.state;
		let totalMoney = 0;
		const BackUpState = [];

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
							transaction: BackUpState,
							money: totalMoney,
						},
						() => this.trainAndPredict() // Train the model after setting the state
					);
				}
			})
			.catch((error) => {
				console.error("Error fetching transactions:", error);
			});
	}

	// Function to train the model and predict the expense
	trainAndPredict = async () => {
		const { transaction, numExpenses, futureDays } = this.state;
		const expenses = transaction
			.slice(0, numExpenses)
			.map((t) => parseFloat(t.price)); // Convert prices to numbers

		if (expenses.length >= 2) {
			const model = await trainModel(expenses, numExpenses);
			const predictions = [];

			for (let day = 1; day <= futureDays; day++) {
				const prediction = await predictExpense(model, day);
				predictions.push({ day, expense: prediction });
			}

			this.setState({ predictedExpenses: predictions });
		}
	};

	state = {
		transaction: [],
		money: 0,
		transactionName: "",
		transactionType: "",
		price: "",
		currentUID: auth.currentUser ? auth.currentUser.uid : null,
		predictedExpenses: [], // New state for multiple day predictions
		numExpenses: 2, // Number of initial expenses to use for training
		futureDays: 14, // Two weeks (14 days) prediction
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
								key={id}
								type={transaction.type}
								name={transaction.name}
								price={transaction.price}
							/>
						))}
					</ul>
				</div>
				<div className="predictedExpenseList">
					{this.state.predictedExpenses.map((prediction) => {
						let expenseClass = "low"; // Default to low

						if (prediction.expense >= 20 && prediction.expense <= 50) {
							expenseClass = "medium";
						} else if (prediction.expense > 50) {
							expenseClass = "high";
						}

						return (
							<div
								key={prediction.day}
								className={`expenseCard ${expenseClass}`}
							>
								<p>Day {prediction.day}</p>
								<p>${prediction.expense.toFixed(2)}</p>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
export default Tracker;
