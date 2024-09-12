function displayResults() {
  const resultsContainer = document.querySelector("#results-table");

  // Retrieves results from local storage
  const results = JSON.parse(localStorage.getItem("typingTestResults")) || [];

  // Reverses the order of the results array
  results.reverse();

  // Limits the number of results to display (maximum 5)
  const numResultsToDisplay = Math.min(results.length, 5);

  // Creates a table row for each result and appends it to the container
  for (let index = 0; index < numResultsToDisplay; index++) {
    const result = results[index];
    const row = document.createElement("tr");
    const accuracyCell = document.createElement("td");
    const wpmCell = document.createElement("td");
    const improvementCell = document.createElement("td");

    accuracyCell.textContent = result.accuracy;
    wpmCell.textContent = result.wpm;

    row.appendChild(accuracyCell);
    row.appendChild(wpmCell);

    // Calculates and displays improvement for all rows except the last one
    if (index < numResultsToDisplay - 1) {
      const currentWPM = parseFloat(result.wpm);
      const nextWPM = parseFloat(results[index + 1].wpm);

      const improvement =
        ((currentWPM - nextWPM) / Math.max(currentWPM, nextWPM)) * 100;
      improvementCell.textContent = improvement.toFixed(2) + "%";

      row.appendChild(improvementCell);
    }

    resultsContainer.appendChild(row);
  }
}

export { displayResults };
