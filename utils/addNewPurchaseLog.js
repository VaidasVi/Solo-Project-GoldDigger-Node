import path from "node:path";
import fs from "node:fs/promises";
import { createPDF } from "./createPDF.js";

export async function addNewpurchaseLog(formData) {
	try {
		const line = `${formData.date}, amount paid: £${formData.investment}, price per Oz: £${formData.price}, gold sold: ${formData.boughtGold} Oz\n`;
		const pathOrder = path.join("data", "orders.txt");

		// Or append each order on a new line
		await fs.appendFile(pathOrder, line, "utf-8");
		await createPDF(formData);
	} catch (err) {
		throw new Error(err);
	}
}
