var express = require('express'),
    port = Number(process.env.PORT || 5000),
    app = express();

app.use(express.static(__dirname));

app.listen(port, function () {
    console.log('listening to on port %s', port);
});
