export function sendResponse(res, statusCode, contentType, payload) {
	res.status = statusCode;
	res.setHeader("Content-Type", contentType);
	res.end(payload);
}
