const {Task,List} = require('../models/task')

const addList = async (userId,listName) => {
    try {
        const list = await List.findOne({userId,listName})
        if(list)
        {
            throw new Error('List already exists')
        }
        const newList = new List({
            userId,
            listName,
            tasks:[]
        })
        await newList.save()
    }
    catch(e)
    {
        throw e
    }
}
const getLists = async (userId) => {
    try {
        const lists = await List.find({userId}).exec()
        return lists
    }
    catch(e)
    {
        console.log(e)
    }
}
const deleteList = async (userId,listName) => {
    try{
        await List.findOneAndDelete({userId,listName})
    }catch(e){

    }
}
const addTask = async (userId,listName,title,description) => {
    try{
        const foundList = await List.findOne({userId,listName})
        if(!foundList){
            throw new Error('List not found')
        }
        newTask = new Task({
            title,
            description
        })
        foundList.tasks.push(newTask)
        await foundList.save()
    }catch(e){
        console.log(e)
    }
}
const getTasks = async(userId,listName) => {
    try{
        const foundList = await List.findOne({userId,listName})
        if(!foundList){
            throw new Error('List not found')
        }
        return foundList.tasks
    }catch(e){
        console.log(e)
    }
}
const deleteTask = async (listName,taskId) => {
    try{
        const list = await List.findOne({listName})
        if(!list)
        {
            throw new Error('List not found')
        }
        const taskIndex = list.tasks.findIndex(task => task._id.toString() === taskId);
        if(taskIndex === -1)
        {
            throw new Error('task not found')
        }
        list.tasks.splice(taskIndex,1)
        await list.save()

    }catch(e){
        console.log(e)
    }
}
const updateTask = async(listName,taskId,newTitle,newDescription) => {
    try{
        const list = await List.findOne({listName})
        if(!list)
        {
            throw new Error('List not found')
        }
        const taskIndex = list.tasks.findIndex(task => task._id.toString() === taskId);
        if(taskIndex === -1)
        {
            throw new Error('task not found')
        }
        list.tasks[taskIndex].title = newTitle
        list.tasks[taskIndex].description = newDescription
        await list.save()

    }catch(e){
        console.log(e)
    }
}
module.exports = {
    addList,
    getLists,
    deleteList,
    addTask,
    getTasks,
    deleteTask,
    updateTask
}