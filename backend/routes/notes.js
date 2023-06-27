const express = require('express');
const route = express.Router();
const { body , validationResult } = require('express-validator');
const fetchUser = require('../Middleware/fetchUser')
const notes = require('../models/Notes')



// Route 1 : Create Note of a user
route.post('/createnote',fetchUser,[body('title',"Enter a valid tittle").exists(),body('description',"Description must be atleast 3 character long").isLength({min:3})],async (req,res)=>{
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
          return res.status(400).json({errors:result.array()})
        }
        const {title,description} = req.body;
    
        const note = new notes({
            user:req.user.id,title : title, description : description
        })
    
        const saveNote = await note.save()
        res.json(saveNote);
    } catch (error) {
        return res.status(500).json({error : "Internal server Error. Please try again later..."})
    }

    
})

// Route 2 : Get Note of a user

route.get('/getnotes',fetchUser,async (req,res)=>{
    try {
       const find = await notes.find({user:req.user.id})
       res.json(find)
    } catch (error) {
        return res.status(500).json({error : "Internal server Error. Please try again later..."})
    }

    
})


// Route 3 : update Note of a user

route.put('/updatenote/:id',fetchUser,async (req,res)=>{
    const {title,description} = req.body;
    let newnote = {};

    if(title) newnote.title = title
    if(description) newnote.description = description

    let note = await notes.findById(req.params.id);
    if(!note) return res.status(404).send("Note not found")

    if(note.user.toString()!==req.user.id){
        res.status(401).send("Action Prohibited")
    }
    note = await notes.findByIdAndUpdate(req.params.id,{$set : newnote},{new : true})
    res.json(note)
})

// Route 3 : Delete Note of a user

route.delete('/deletenote/:id',fetchUser,async (req,res)=>{

    let note = await notes.findById(req.params.id);
    if(!note) return res.status(404).send("Note not found")

    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Action Prohibited")
    }
    note = await notes.findByIdAndDelete(req.params.id)
    res.json({success : "Note deleted successfully", note : note})
})

module.exports = route