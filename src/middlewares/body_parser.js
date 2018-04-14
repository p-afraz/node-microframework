// TODO: Add support to form-data content type header
const qs = require('querystring');

module.exports = (req, res, next) => {
    let body = '';

    req.request.on('readable', () => {
        const chunk = req.request.read();

        if (chunk !== null) {
            body += chunk;
        }
    });

    req.request.on('end', () => {
        try {
            const contentType = req.getHeader('content-type');

            switch (contentType) {
                case 'application/x-www-form-urlencoded':
                    body = qs.parse(body);
                    break;

                case 'application/json':
                    body = JSON.parse(body);
                    break;

                default:
                    body = {};
                    break;
            }
        } catch (e) {
            body = {};
        }

        req.body = body;
        next();
    });
};