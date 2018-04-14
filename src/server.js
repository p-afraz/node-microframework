"use strict";

const Response = require('./response');
const Request = require('./request');
const Responder = require('./responder');
const Middleware = require('./middleware');
const bodyParser = require('./middlewares/body_parser');

const http = require('http');

class Server
{
    constructor()
    {
        this._responders = {};
        this._middleware = [];
        this._routeMidware = {};

        this._createServer();
    }

    _createServer()
    {
        this._server = http.createServer((req, res) => {
            const request = new Request(req);
            const response = new Response(res);

            this._newRequestArrived(request, response);
        });
    }

    _newRequestArrived(req, res)
    {
        this._attachResponder(req);

        if (req.responder === null) {
            req.callResponder(res);
        } else {
            this._runMiddlewares(req, res);
        }
    }

    _attachResponder(req)
    {
        if (this._responders[req.method] !== undefined && this._responders[req.method][req.pathname] !== undefined) {
            req.responder = this._responders[req.method][req.pathname];
        }
    }

    listen(port, callback)
    {
        this._server.listen(port, callback);
    }

    _addResponder(method, path, callback)
    {
        if (this._responders[method] === undefined) {
            this._responders[method] = {};
        }

        if (path === '') {
            path = '/';
        }

        if (path !== '/' && path.lastIndexOf('/') >= path.length - 1) {
            path = path.substr(0, path.length - 1);
        }

        this._responders[method][path] = new Responder(callback);
    }

    get(path, callback)
    {
        this._addResponder('GET', path, callback);

        return this;
    }

    post(path, callback)
    {
        this._addResponder('POST', path, callback);

        return this;
    }

    use(path, callback)
    {
        if (this._middleware === undefined) {
            this._middleware = [];
        }

        this._middleware.push(new Middleware(path, callback));

        return this;
    }

    _runMiddlewares(req, res)
    {
        let midwares = this._fetchRouteMidwares(req).concat([]);
        this._nextMiddleware(req, res, midwares);
    }

    _nextMiddleware(req, res, midwares)
    {
        if (midwares.length === 0) {
            req.callResponder(res);
        } else {
            const midware = midwares.shift();

            midware.run(req, res, () => {
                this._nextMiddleware(req, res, midwares);
            });
        }
    }

    _fetchRouteMidwares(req)
    {
        if (this._routeMidware[req.pathname] === undefined) {
            let midwares = [];

            for (let i = 0; i < this._middleware.length; i++) {
                const midware = this._middleware[i];

                if (midware.matchesRoute(req.pathname)) {
                    midwares.push(midware);
                }
            }

            this._routeMidware[req.pathname] = midwares;
        }

        return this._routeMidware[req.pathname];
    }
}

module.exports = {
    Server: Server,
    BodyParser: bodyParser
};