import React, { Component } from "react";
import { auth } from "../../config/Fire";
import "./Tracker.css";

class Tracker extends Component {
	state = {
		transaction: [],
		money: 0,
		transactionName: "",
		transactionType: "",
		price: "",
		currentUID: auth.currentUser.uid,
	};
	//logout

	logout = () => {
		auth.signOut();
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
					$145
					<div className="newTransactionBlock">
						<div className="newTransaction">
							<form>
								<input
									placeholder="Transaction Name"
									type="text"
									name="transactionName"
								/>
								<div className="inputGroup">
									<select name="type">
										<option value="0">Type</option>
										<option value="expense">Expense</option>
										<option value="deposit">Deposit</option>
									</select>
									<input
										placeholder="Price"
										type="text"
										name="Price"
									/>
								</div>
								<button className="addTransaction">
									+ Add Transaction
								</button>
							</form>
						</div>
					</div>
				</div>
				<div className="latestTransactions">
					<p>Latest Transactions</p>

					<ul>
						<li>
							<div>ATM Deposit</div>
							<div>$5</div>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}
export default Tracker;
