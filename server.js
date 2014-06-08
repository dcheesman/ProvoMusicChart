var express = require('express'),
    ejs = require('ejs');


var port = Number(process.env.PORT || 5000),
    app = express();

app.use('/assets', express.static(__dirname + '/assets'));
app.engine('html', ejs.renderFile);

app.get('/', function (req, res) {
    res.render('chart.html');
});

app.get('/chart', function (req, res) {
    res.render('chart.html');
});

app.listen(port, function () {
    console.log('listening to on port %s', port);
});
