const app = require('express')();
const bodyParser = require('body-parser')
const config = require('./config');
const routes = require('./routes');
const ioServer = require('./socket')(app);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  next();
});
app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', routes);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: 'Something failed', err });
});

ioServer.listen(config.http.port, () => {
  console.log('listening on: ' + config.http.port);
});