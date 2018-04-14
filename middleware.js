class Middleware
{
    constructor(path, callback)
    {
        this.path = path;
        this._callback = callback;
    }

    get path()
    {
        return this._path;
    }

    set path(path)
    {
        if (path === '') {
            path = '/';
        }

        if (path !== '/' && path.lastIndexOf('/') >= path.length - 1) {
            path = path.substr(0, path.length - 1);
        }

        this._path = path;

        return this;
    }

    matchesRoute(route)
    {
        if (this.path === '/') {
            return true;
        }

        return this.path === route;
    }

    run(req, res, next)
    {
        this._callback(req, res, next);
    }
}

module.exports = Middleware;