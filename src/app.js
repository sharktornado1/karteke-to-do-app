const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const { signup, login,getUsername } = require('../routers/user-router');
const {addList,getLists,deleteList} = require('../routers/task-router')
const {addTask,getTasks,deleteTask,updateTask} = require('../routers/task-router');

const app = express();
const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URL);

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwtToken;
    if (!token) {
        console.log('token not found') //remove this
        return res.redirect('/login');
    }
    jwt.verify(token, process.env.SECRET_JSON_KEY, (error, decoded) => {
        if (error) {
            console.log('wrong token') //remove this
            res.clearCookie('jwtToken', { path: '/' });
            return res.redirect('/login');
        }
        req.userId = decoded.userId;
        next();
    });
};

const redirectToTasks = (req, res, next) => {
    const token = req.cookies.jwtToken;
    if (token) {
        return res.redirect('/tasks');
    }
    next();
};
app.get('/',redirectToTasks,(req,res)=>{
    res.redirect('/login')
})
app.get('/tasks', verifyToken, (req, res) => {
    res.sendFile(path.join(publicDirectory, 'home.html'));
});

app.get('/login', redirectToTasks, (req, res) => {
    res.sendFile(path.join(publicDirectory, 'login.html'));
});

app.get('/signup', redirectToTasks, (req, res) => {
    res.sendFile(path.join(publicDirectory, 'signup.html'));
});

app.get('/logout', (req, res) => {
    res.clearCookie('jwtToken', { path: '/' });
    res.redirect('/login');
});

app.post('/signup', async (req, res) => {
    try{
        const { username, password } = req.body;

        await signup(username, password);
        res.status(200).send('Signup successful');
    }
    catch(e)
    {
        res.status(400).send('Signup unsuccessful')
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await login(username, password);

        res.cookie('jwtToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600000,
            path: '/'
        });
        res.redirect('/tasks');
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal server error');
    }
});
app.post('/lists',verifyToken,async (req,res)=>{
    try{
        const {listName} = req.body
        const userId = req.userId
        await addList(userId,listName)
        res.status(200).send('list added successfully')
    }
    catch(e)
    {
        console.log(e)
        res.status(400).send()
    }
})
app.get('/lists',verifyToken,async (req,res)=>{
    try {
        const userId = req.userId
        const lists =  await getLists(userId)
        res.status(200).json({lists})
    }catch(e){

    }
})
app.delete('/lists',verifyToken,async (req,res)=>{
    try{
        const userId = req.userId
        const {listName} = req.body
        await deleteList(userId,listName)
        res.status(200).send('Deletion successful')
    }catch(e){
        res.status(400).send()
    }
})
app.post('/managetasks',verifyToken, async (req,res)=>{
    try{
        const userId = req.userId
        const {listName,title,description} = req.body
        await addTask(userId,listName,title,description)
        res.status(200).send('Task successfully added')
    }catch(e){
        res.status(400).send()
    }
})
app.get('/managetasks',verifyToken, async (req,res)=>{
    try{
        const userId = req.userId
        const {listName} = req.query
        const listOftasks = await getTasks(userId,listName)
        res.status(200).json({listOftasks})
    }catch(e){
        res.status(400).send()
    }
})
app.delete('/managetasks',verifyToken,async (req,res)=>{
    try{
        const {listName,taskId} = req.body
        await deleteTask(listName,taskId)
        res.status(200).send('task deleted successfully')
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
})
app.patch('/managetasks',verifyToken,async (req,res)=>{
    try{
        const {listName,taskId,newTitle,newDescription} = req.body
        await updateTask(listName,taskId,newTitle,newDescription)
        res.status(200).send('task updated successfully')
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
})
app.get('/getusername',verifyToken,async (req,res)=>{
    try{
        const user = await getUsername(req.userId)
        const username = user.username
        res.status(200).json({username})
    }catch(e){
        res.status(400).send()
    }
})

app.listen(port, () => {
    console.log('Server is up on port:', port);
});
