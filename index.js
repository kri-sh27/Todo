const { response, json } = require("express");
const express = require("express");
const fs = require("fs");
const { request, maxHeaderSize } = require("http");
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (request, response) => {
  return response.send("hello world");
});

app.get("/todos", (request, response) => {
    const showPending=request.query.showPending


  fs.readFile("./store/todos.json", "utf-8", (err, data) => {
    if (err) {
      return response.status(500).send("someting went wrong");
    }

    const todos = JSON.parse(data);

    if(showPending!=="1"){
        return response.json({todos:todos})
    }
    else{
        return response.json({todos:todos.filter(t=>{
            return t.complete===false })})
    }
    // return response.json({ todos: todos });
  })
})

app.put("/todos/:id/complete", (request, response) => {
  const id = request.params.id;
  const findTodoById = (todos, id) => {
    for (let i = 0; i < todos.length; i++) {
        if(todos[i].id===parseInt(id)){
            return i
        }
    }
    return -1
  };

  fs.readFile("./store/todos.json", "utf-8", (err, data) => {
    if (err) {
      return response.status(500).send("sorrry, someting went wrong");
    }
    let todos = JSON.parse(data);
    const todoIndex=findTodoById(todos,id)

    if(todoIndex===-1){
        return response.status(404).send("sorry, not found")
    }
    todos[todoIndex].complete=true
fs.writeFile('./store/todos.json', JSON.stringify(todos),()=>
{
    return response.json({'status':'ok'})
})

  });
});


app.post('/todo',(request,response)=>{
    if(!request.body.name){
        return response.status(404).send("Missin name")
    }

    fs.readFile('./store/todos.json','utf-8',(err,data)=>{
        if(err){
            return response.status(500).send('sorry, something went wrong')
        }
        const todos=JSON.parse(data)
        const maxId=Math.max.apply(Math, todos.map(t=>{return t.id}))

        todos.push({
            id: maxId+1,
            complete:false,
            name:request.body.name
        })
        fs.writeFile('./store/todos.json', JSON.stringify(todos),()=>{
            return response.json({'status':'ok'})
        })
    })

})

app.listen(3000, () => {
  console.log("app runing on http://localhost:300");
});
