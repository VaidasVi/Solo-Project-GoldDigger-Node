import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export async function createPDF(PDFText) {
	try {
		const doc = new PDFDocument();
		const stream = fs.createWriteStream(path.join("PDF", "sales.pdf"));

		doc.pipe(stream);
		// doc.fontSize(15).text(`Date: ${PDFText.date}`, 100, 100);
		doc
			.fontSize(15)
			.fillColor("black")
			.text(`Date: `, 100, 100, { continued: true })
			.fillColor("red")
			.text(`${PDFText.date}`);
		doc
			.fontSize(15)
			.fillColor("black")
			.text(`Amount Paid: `, 100, 140, { continued: true })
			.fillColor("red")
			.text(`£${PDFText.investment}`);
		doc
			.fontSize(15)
			.fillColor("black")
			.text(`Price per Oz: `, 100, 180, { continued: true })
			.fillColor("red")
			.text(`£${PDFText.price}`);
		doc
			.fontSize(15)
			.fillColor("black")
			.text(`Gold sold: `, 100, 220, { continued: true })
			.fillColor("red")
			.text(`${PDFText.boughtGold} Oz`);

		doc.end();

		await new Promise((resolve, reject) => {
			stream.on("finish", resolve);
			stream.on("error", reject);
		});
	} catch (err) {
		throw new Error(err);
	}
}
