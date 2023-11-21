const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    }
});
const listSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    listName: {
        type: String,
        required: true,
        unique: false
    },
    tasks: [taskSchema]
})


const Task = mongoose.model('Task',taskSchema)
const List = mongoose.model('List',listSchema)

module.exports ={
    Task,
    List
}