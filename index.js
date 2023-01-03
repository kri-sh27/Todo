const express=require('express')
const app=express()

app.get('/',(request,response)=>{
    return response.send("hello world")
})

app.listen(3000,()=>{
    console.log("app runing on http://localhost:300")
})