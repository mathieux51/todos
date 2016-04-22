import {createServer} from 'http';
import express from 'express';

const todos = [
  "Save Dr. Poopy Butthole.",
  "Get Blowjob.",
  "Confirm spelling of Dr. Poopy Butthole."
]

var app = express(); 
app.get('*', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.send(todos);
});

app.listen(3000);
