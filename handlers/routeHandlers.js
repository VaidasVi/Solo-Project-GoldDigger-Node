import { parseJSONBody } from "../utils/parseJSONBody.js";
import { sendResponse } from "../utils/sendResponse.js";
import { addNewpurchaseLog } from "../utils/addNewPurchaseLog.js";

export async function handleRandomGoldPrice(req, res) {
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();

	// Send immediately on connect
	let randomGoldPrice = (1800 + Math.random() * 400).toFixed(2);
	res.write(
		`data: ${JSON.stringify({ event: "price-update", price: randomGoldPrice })}\n\n`,
	);

	const interval = setInterval(() => {
		randomGoldPrice = (1800 + Math.random() * 400).toFixed(2);
		res.write(
			`data: ${JSON.stringify({ event: "price-update", price: randomGoldPrice })}\n\n`,
		);
	}, 3000);

	req.on("close", () => clearInterval(interval)); // cleanup on disconnect
	return;
}

export async function handlePost(req, res) {
	try {
		const parsedBody = await parseJSONBody(req);
		await addNewpurchaseLog(parsedBody);
		// await addNewSighting(sanitizedBody)
		// sightingEvents.emit('sighting-added', sanitizedBody)
		sendResponse(res, 201, "application/json", JSON.stringify(parsedBody));
	} catch (err) {
		sendResponse(res, 400, "application/json", JSON.stringify({ error: err }));
	}
}
