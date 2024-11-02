// src/ml/ExpensePrediction.js
import * as tf from "@tensorflow/tfjs";

// Function to prepare and normalize the data
function prepareData(expenses) {
  const xs = expenses.map((_, index) => index + 1);
  const ys = expenses;
  return { xs, ys };
}

// Function to train the Linear Regression model
export async function trainModel(expenses) {
  if (expenses.length < 2) {
    console.log("Not enough data to train the model.");
    return null;
  }

  const { xs, ys } = prepareData(expenses);
  const inputTensor = tf.tensor2d(xs, [xs.length, 1]);
  const outputTensor = tf.tensor2d(ys, [ys.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

  await model.fit(inputTensor, outputTensor, { epochs: 100 });
  return model;
}

// Function to predict future expenses
export async function predictFutureExpenses(model, daysCount, transactionLength) {
  const futureXs = [];
  for (let i = transactionLength + 1; i <= transactionLength + daysCount; i++) {
    futureXs.push([i]);
  }

  const futureTensor = tf.tensor2d(futureXs);
  const predictions = await model.predict(futureTensor).data();
  return Array.from(predictions);
}
