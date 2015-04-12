// Clipon Copyright (c) 2015 Elodie Rafalimanana. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// This server is only used in development to mimic the firebase static server

var path = require('path');
var express = require('express');
var http = require('http');
var app = express();
var PORT = process.env.PORT || 5000;

// Expose static content.
app.use(express.static(path.join(__dirname, '..', 'app')));

app.get('*', serveIndex);

function serveIndex(req, res) {
  	res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
}

// Create and expose server.
var server = app.listen(PORT);

// Log when server is started.
server.on('listening', function () {
  console.log('Server started http://localhost:%d/', server.address().port);
});

