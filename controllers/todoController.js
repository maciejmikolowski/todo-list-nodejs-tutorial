var bodyParser = require('body-parser')
var mongoose = require('mongoose')

// Connect to database
mongoose.connect('mongodb+srv://todoUser:test@todo-mnx7s.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })

// Create a schema
var todoSchema = new mongoose.Schema({
  item: String
})

var Todo = mongoose.model('Todo', todoSchema)

var urlencodingParser = bodyParser.urlencoded({
  extended: false
})

module.exports = function(app) {
  app.get('/todo', function(req, res) {
    // get data from mongodb and pass it to view
    Todo.find({}, function(err, data) {
      if(err) throw err
      res.render('todo', {todos: data})
    })
  })

  app.post('/todo', urlencodingParser, function(req, res) {
    // get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err, data) {
      if(err) throw err
      res.json(data)
    })
  })

  app.delete('/todo/:item', function(req, res) {
    // delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data) {
      if(err) throw err
      res.json(data)
    })
  })
}
