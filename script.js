document.addEventListener("DOMContentLoaded", function () {
	let expenses = [];
	let totalAmount = 0;

	const categorySelect = document.getElementById("category-select");
	const amountInput = document.getElementById("amount-input");
	const dateInput = document.getElementById("date-input");
	const addBtn = document.getElementById("add-btn");
	const expensesTableBody = document.getElementById("expnese-table-body");
	const totalAmountCell = document.getElementById("total-amount");
	const recommendationsDiv = document.getElementById("recommendations");

	addBtn.addEventListener("click", function () {
		const category = categorySelect.value;
		const amount = Number(amountInput.value);
		const date = dateInput.value;

		if (category === "") {
			alert("Please select a category");
			return;
		}
		if (isNaN(amount) || amount <= 0) {
			alert("Please enter a valid amount");
			return;
		}
		if (date === "") {
			alert("Please select a date");
			return;
		}

		const newExpense = { category, amount, date };
		expenses.push(newExpense);

		totalAmount += amount;
		totalAmountCell.textContent = totalAmount;

		const newRow = expensesTableBody.insertRow();
		const categoryCell = newRow.insertCell();
		const amountCell = newRow.insertCell();
		const dateCell = newRow.insertCell();
		const deleteCell = newRow.insertCell();
		const deleteBtn = document.createElement("button");

		deleteBtn.textContent = "Delete";
		deleteBtn.classList.add("delete-btn");
		deleteBtn.addEventListener("click", function () {
			expenses.splice(expenses.indexOf(newExpense), 1);
			totalAmount -= newExpense.amount;
			totalAmountCell.textContent = totalAmount;
			expensesTableBody.removeChild(newRow);
			trainModel(); // Re-train model after deletion
		});

		categoryCell.textContent = category;
		amountCell.textContent = amount;
		dateCell.textContent = date;
		deleteCell.appendChild(deleteBtn);

		trainModel(); // Train the model after each addition
	});

	// Train the Linear Regression model using TensorFlow.js
	async function trainModel() {
		const { xs, ys } = prepareData();

		// Check if we have enough data to train
		if (xs.length < 2) {
			console.log("Not enough data to train the model.");
			return;
		}

		const inputTensor = tf.tensor2d(xs, [xs.length, 1]);
		const outputTensor = tf.tensor2d(ys, [ys.length, 1]);

		const model = tf.sequential();
		model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

		model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

		await model.fit(inputTensor, outputTensor, {
			epochs: 100,
		});

		// Predict for the next 30 days
		const futureExpenses = await predictFutureExpenses(model);
		displayPredictions(futureExpenses);
	}

	// Prepare data for the model (using dates as X and amounts as Y)
	function prepareData() {
		const xs = expenses.map((exp, i) => i + 1); // Simple index as X values (1, 2, 3, ...)
		const ys = expenses.map((exp) => exp.amount); // The amount is Y

		return { xs, ys };
	}

	// Predict future expenses (for the next 30 days)
	async function predictFutureExpenses(model) {
		const futureXs = [];
		for (let i = expenses.length + 1; i <= expenses.length + 30; i++) {
			futureXs.push([i]); // Predict the next 30 days
		}

		const futureTensor = tf.tensor2d(futureXs);
		const predictions = await model.predict(futureTensor).data();

		return Array.from(predictions);
	}

	// Display predicted future expenses in card format
	function displayPredictions(predictions) {
		recommendationsDiv.innerHTML =
			"<h3>Predicted Expenses for the Next 30 Days:</h3>";

		const predictionsContainer = document.createElement("div");
		predictionsContainer.id = "predictions-container";

		predictions.forEach((amount, index) => {
			const predictionElement = document.createElement("div");
			predictionElement.classList.add("prediction-card");

			// Assign classes based on the amount
			if (amount < 50) {
				predictionElement.classList.add("low");
			} else if (amount >= 50 && amount <= 100) {
				predictionElement.classList.add("medium");
			} else {
				predictionElement.classList.add("high");
			}

			predictionElement.innerHTML = `<strong>Day ${
				index + 1
			}</strong><br>$${amount.toFixed(2)}`;
			predictionsContainer.appendChild(predictionElement);
		});

		recommendationsDiv.appendChild(predictionsContainer);
	}

	// Initial table population (if any existing expenses)
	for (const expense of expenses) {
		totalAmount += expense.amount;
		totalAmountCell.textContent = totalAmount;

		const newRow = expensesTableBody.insertRow();
		const categoryCell = newRow.insertCell();
		const amountCell = newRow.insertCell();
		const dateCell = newRow.insertCell();
		const deleteCell = newRow.insertCell();
		const deleteBtn = document.createElement("button");

		deleteBtn.textContent = "Delete";
		deleteBtn.classList.add("delete-btn");
		deleteBtn.addEventListener("click", function () {
			expenses.splice(expenses.indexOf(expense), 1);
			totalAmount -= expense.amount;
			totalAmountCell.textContent = totalAmount;
			expensesTableBody.removeChild(newRow);
			trainModel(); // Re-train model after deletion
		});

		categoryCell.textContent = expense.category;
		amountCell.textContent = expense.amount;
		dateCell.textContent = expense.date;
		deleteCell.appendChild(deleteBtn);
	}

	// Initialize model training on page load
	trainModel();
});
