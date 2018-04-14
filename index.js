const { Server, BodyParser } = require('./http_server');
const app = new Server();

app.use('/', BodyParser);

app.post('/test', (req, res) => {
    let response = {
        test: Math.random(),
        msg: "سلام چطوری؟",
        path: req.pathname,
        method: req.method,
        body: req.body
    };

    res.status(200).send(response);
});

app.get('/', (req, res) => {
    res.send('Welcome to my framework!');
});

const port = 8080;

app.listen(port, () => {
    console.log('Server is listening on port ' + port);
});