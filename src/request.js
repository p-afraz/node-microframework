class Request
{
    constructor(req)
    {
        this._request = req;
        this._responder = null;
    }

    get request()
    {
        return this._request;
    }

    get headers()
    {
        return this._request.headers;
    }

    // TODO: Parse and return real query string params
    get query()
    {
        return {};
    }

    get method()
    {
        return this._request.method;
    }

    get pathname()
    {
        if (this._pathname === undefined) {
            const url = require('url');
            const parsedUrl = url.parse(this._request.url);

            this._pathname = parsedUrl.pathname;

            if (this._pathname !== '/' && this._pathname.lastIndexOf('/') >= this._pathname.length - 1) {
                this._pathname = this._pathname.substr(0, this._pathname.length - 1);
            }
        }

        return this._pathname;
    }

    set responder(responder)
    {
        this._responder = responder;

        return this;
    }

    get responder()
    {
        return this._responder;
    }

    set body(body)
    {
        this._body = body;

        return this;
    }

    get body()
    {
        return this._body;
    }

    getHeader(name)
    {
        return this.headers[name] || null;
    }

    callResponder(res)
    {
        if (this.responder !== null) {
            this.responder.callback(this, res);
        } else {
            res.status(404).send('Path not found!');
        }
    }
}

module.exports = Request;