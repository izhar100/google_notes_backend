const express=require("express")
const { connection } = require("./db")
const { userRouter } = require("./routes/user.routes")
const { notesRouter } = require("./routes/note.routes")
const cors=require("cors")
require("dotenv").config()
const app=express()
app.use(cors())
app.use(express.json())
app.use("/notes",notesRouter)
app.use("/users",userRouter)

app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connected to db")
        console.log(`Server is running at port ${process.env.PORT}`)
    } catch (error) {
        console.log(error)
        console.log("Something went wrong!!")
    }
})