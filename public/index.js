const eventSource = new EventSource("/stream");

let currentPrice = null;

// Handle live price updates
eventSource.onmessage = (event) => {
	const data = JSON.parse(event.data);
	currentPrice = data.price;
	document.getElementById("price-display").textContent = currentPrice;
};

// Handle connection loss
eventSource.onerror = () => {
	console.log("onerror fired, readyState:", eventSource.readyState);
	if (eventSource.readyState === EventSource.CONNECTING) {
		console.log("Connection lost. Attempting to reconnect...");
		document.getElementById("price-display").textContent = "----.--";
		document.getElementById("connection-status").textContent =
			"Disconnected 🔴";
	}
};

eventSource.onopen = () => {
	document.getElementById("connection-status").textContent = "Live Price 🟢";
};

// DIALOG LOGIC
const dialog = document.querySelector("dialog");
const okBtn = dialog.querySelector("button");

okBtn.addEventListener("click", () => {
	dialog.close();
});

// FORM LOGIC
const form = document.getElementById("eventForm");

form.addEventListener("submit", async function (event) {
	event.preventDefault();

	function financial(x) {
		return Number.parseFloat(x).toFixed(2);
	}

	const timeStamp = new Date();
	const price = currentPrice;
	const investmentAmount = parseInt(
		document.getElementById("investment-amount").value,
	);
	const boughtOzt = financial(investmentAmount / currentPrice);

	const formData = {
		date: timeStamp,
		price: price,
		investment: investmentAmount,
		boughtGold: boughtOzt,
	};

	try {
		// Send form data using fetch API
		const response = await fetch("./api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});
		if (response.ok) {
			document.getElementById("investment-summary").textContent =
				`You just bought ${boughtOzt} ozt for £${investmentAmount}. You will receive documentation shortly.`;
			dialog.showModal();
			form.reset();
		} else {
			// formMessageText.textContent = `The server Ghosted you(!). Please try again.`
			console.error("Server Error:", response.statusText);
		}
	} catch (error) {
		// formMessageText.textContent = `Serious ghouls! Please try again.`
		console.error("Error:", error);
	}
});
