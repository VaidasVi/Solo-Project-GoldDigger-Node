import nodemailer from "nodemailer";
import "dotenv/config";

export async function sendSalesReport(userEmail) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASS,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL,
		to: userEmail,
		subject: "Your Purchase Report",
		text: "Please find your purchase raport attached.",
		attachments: [
			{
				filename: "sales.pdf",
				path: "./PDF/sales.pdf",
			},
		],
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (err) {
		throw new Error(err);
	}
}
