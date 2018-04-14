const { Server, BodyParser } = require('node-microframework');
const app = new Server();

app.use('/', BodyParser);

app.post('/test', (req, res) => {
    let response = {
        test: Math.random(),
        msg: "Test message",
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