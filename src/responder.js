class Responder
{
    constructor(callback)
    {
        this._callback = callback;
    }

    get callback()
    {
        return this._callback;
    }
}

module.exports = Responder;