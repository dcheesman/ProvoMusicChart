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

app.get('/datasheet', function (req, res) {
    var GoogleSpreadsheet = require("google-spreadsheet");

    var my_sheet = new GoogleSpreadsheet('0Ai29bxvOdvgjdDZuOEk0eWRGRUQ4ZmEwNnFEb3owVEE');

    // without auth -- read only
    // # is worksheet id - IDs start at 1
    my_sheet.getRows( 1, function(err, row_data){
        console.log( 'pulled in '+row_data.length + ' rows ')
        res.write(JSON.stringify(row_data, null, "  "));
        res.end();
    })
});

app.listen(port, function () {
    console.log('listening to on port %s', port);
});