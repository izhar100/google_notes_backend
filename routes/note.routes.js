const express = require("express")
const { auth } = require("../middleware/auth.middleware")
const { NoteModel } = require("../models/note.model")

const notesRouter = express.Router()

notesRouter.use(auth)

notesRouter.post("/create", async (req, res) => {
    try {
        const note = new NoteModel(req.body)
        await note.save()
        res.json({ msg: 'New note has been added', note: req.body })
    } catch (error) {
        res.json({ error: error.message })
    }
})

notesRouter.get("/", async (req, res) => {
    const { userID } = req.body;
    try {
        const notes = await NoteModel.find({ userID })
        res.json(notes)
    } catch (error) {
        res.json({ error: error })
    }
})

notesRouter.patch("/update/:noteID", async (req, res) => {
    //userID in the user doc===userID in the note doc
    const userIDinUserDoc = req.body.userID
    const { noteID } = req.params
    try {
        const note = await NoteModel.findOne({ _id: noteID })
        const userIDinNoteDoc = note.userID
        console.log(userIDinNoteDoc,"-",userIDinUserDoc)
        if (userIDinUserDoc === userIDinNoteDoc) {
            //update
            await NoteModel.findByIdAndUpdate({_id:noteID},req.body)
            res.json({msg:`${note.title} has been updated`})
        } else {
            res.json({ msg: 'Not Authorized!!!' })
        }
    } catch (error) {
       res.json({error:error})
    }

})

notesRouter.delete("/delete/:noteID", async (req, res) => {
    //userID in the user doc===userID in the note doc
    const userIDinUserDoc = req.body.userID
    const { noteID } = req.params
    try {
        const note = await NoteModel.findOne({ _id: noteID })
        const userIDinNoteDoc = note.userID

        if (userIDinUserDoc === userIDinNoteDoc) {
            //update
            await NoteModel.findByIdAndDelete({_id:noteID})
            res.json({msg:`${note.title} has been deleted`})
        } else {
            res.json({ msg: 'Not Authorized!!!' })
        }
    } catch (error) {
       res.json({error:error})
    }

})


module.exports = {
    notesRouter
}