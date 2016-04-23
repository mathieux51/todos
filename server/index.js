import express from 'express';
import nunjucks from 'nunjucks';

const todos = [
  "Save Dr. Poopy Butthole.",
  "Get Blowjob.",
  "Get Blowjob.",
  "Confirm spelling of Dr. Poopy Butthole."
];

var app = express();

app.use(express.static('public'));

nunjucks.configure('views', {autoescape: true, express: app});
app.get('/todos', function(req, res) {
  // res.set('Content-Type', 'text/html');
  // res.send(nunjucks.render('todos.html', todos));
  res.render('todos.html', {todos: todos});
});

app.get('/todos.json', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.send(todos);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
