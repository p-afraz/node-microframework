class Response
{
    constructor(res)
    {
        this._response = res;
        this._status = 200;
    }

    get response()
    {
        return this._response;
    }

    status(status)
    {
        this._status = status;

        return this;
    }

    set(key, value)
    {
        this._response.setHeader(key, value);
    }

    send(value)
    {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
            this.set('Content-Type', 'application/json');
        }

        if (this._status !== null) {
            this._response.writeHead(this._status);
        }

        this._response.end(value);
    }

    json(value)
    {
        this.send(value);
    }
}

module.exports = Response;