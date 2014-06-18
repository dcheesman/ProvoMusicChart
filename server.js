var express = require('express'),
    ejs = require('ejs'),
    fs  = require('fs');


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

app.get('/form', function(req, res) {
    res.render('form.html');
});

app.get('/datasheet', function (req, res) {
    var spreadsheetKey = '0Ai29bxvOdvgjdDZuOEk0eWRGRUQ4ZmEwNnFEb3owVEE';
    var spreadsheetURL = 'http://spreadsheets.google.com/feeds/list/'+spreadsheetKey+'/od6/public/values?alt=json';
    var cacheFile = './cache.json';
    var http = require('http');
    // Get info about cache
    var cachedData = false;
    var cacheModified = 0;
    var lastModified  = Infinity; //getLastModified(spreadsheetKey);
    if(!fs.existsSync(cacheFile)){
        fs.writeFileSync(cacheFile, JSON.stringify({'lastModified' : 0, 'data':[]}));
    } else {
        cachedData = require(cacheFile);
        cacheModified = cachedData.lastModified;
    }
    
    var options = {method: 'HEAD', host: 'spreadsheets.google.com', port: 80, path: '/feeds/list/'+spreadsheetKey+'/od6/public/values'};
    var modReq = http.request(options, function(modRes) {
        var mod = new Date(modRes.headers['last-modified']);
        lastModified = mod.getTime() / 1000;
        console.log(lastModified);
        console.log(cacheModified);
        if(cacheModified < lastModified) {
            console.log('Cache miss');
            http.get(spreadsheetURL,function(sheetResult){            
                var rawResp = '';
                var writeDat = {'lastModified':lastModified,'data':''};

                sheetResult.on('data',function(d){
                    rawResp += d;
                });
                sheetResult.on('end', function () {
                    // Format result
                    var links = [];
                    rawResp = JSON.parse(rawResp);
                    var allRows = rawResp.feed.entry;
                    for (var i = allRows.length - 1; i >= 0; i--) {
                        links[i] = {};
                        links[i].member = allRows[i].gsx$member.$t;
                        links[i].memberband = allRows[i].gsx$memberband.$t;
                        links[i].relationship = allRows[i].gsx$relationship.$t;
                    };
                    writeDat.data = links;

                    // Write result to browser
                    res.write(JSON.stringify(links));

                    // Write result to file
                    fs.writeFile(cacheFile, JSON.stringify(writeDat), function (err) {
                        if (err) throw err;
                        console.log('Wrote ' + links.length +' rows');
                    });
                    res.end();
                });
            });
        } else {
            console.log('Cache hit');
            res.write(JSON.stringify(cachedData.data));
            res.end();
        }
    });
    modReq.end();
});

app.get('/datasheetOld', function (req, res) {
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
