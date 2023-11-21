var selectedList = undefined
var selectedButton = undefined

const displayTasks = async (listName) => {
    try {
        const response = await fetch(`/managetasks?listName=${listName}`, {
            method: 'GET',
        });            
        if(response.ok){
            const elements = document.querySelectorAll('.task-container');
            elements.forEach(element => {
                element.remove()
              });
            const data = await response.json()
            for(let i=0;i<data.listOftasks.length;i++)
            {
                addTask(data.listOftasks[i].title,data.listOftasks[i].description,data.listOftasks[i]._id)
            }
        }
    }
    catch(error)
    {
        console.log(error)
    }
}

function fillSidebar(title) {
    var sidebar = document.getElementById('sidebar-list-container');
    var listButton = document.createElement('button');
    listButton.addEventListener('click',async ()=>{
        addtaskButton.style.display='flex'
        selectedList = title
        if(selectedButton){
            selectedButton.className='sidebar-button'
        }
        selectedButton = listButton
        selectedButton.className='sidebar-button-selected'
        displayTasks(selectedList)
    })
    const icon = document.createElement('i');
    icon.className = 'fas fa-trash-alt';
    icon.id='trash-icon'
    listButton.addEventListener('mouseenter',()=>{
        listButton.append(icon)
    })
    listButton.addEventListener('mouseleave',()=>{
        icon.remove()
    })
    icon.addEventListener('mouseenter',()=>{
        icon.style.color = '#6b9ad4'
    })
    icon.addEventListener('mouseleave',()=>{
        icon.style.color = 'white'
    })
    //Handle list removal logic here
    icon.addEventListener('click',async ()=>{
        try {
            const response = await fetch('/lists', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({listName: title})
              });
            if(response.ok){
                listButton.remove()
            }
        }
        catch(error)
        {
    
        }
    })
    listButton.textContent = title;
    listButton.className='sidebar-button';
    sidebar.appendChild(listButton);
}
const displayLists = async () => {
    try {
        const response = await fetch('/lists', {
            method: 'GET',
        });
        if(response.ok)
        {
            const data = await response.json()
            lists = data.lists
            for (let i =0 ;i<lists.length;i++)
            {
                fillSidebar(lists[i].listName)
            }
        }
    }
    catch(error)
    {

    }
}
displayLists()


const addTask = (title,description,id) => {
    var mainpage = document.getElementById('main-content')
    var taskDiv = document.createElement('div')
    taskDiv.className = 'task-container'
    var taskDivHeader = document.createElement('div')
    taskDivHeader.textContent=title
    taskDivHeader.className='task-header'
    var taskDivBody = document.createElement('div')
    taskDivBody.textContent = description
    taskDivBody.className='task-body'
    taskDiv.appendChild(taskDivHeader)
    taskDiv.appendChild(taskDivBody)
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fas fa-check';
    checkIcon.id='check-icon'
    const pencilIcon = document.createElement('i');
    pencilIcon.className = 'fas fa-pencil-alt'
    pencilIcon.id='pencil-icon'
    const appendIcons = ()=>{
        taskDivHeader.append(pencilIcon)
        taskDivHeader.append(checkIcon)
    }
    checkIcon.addEventListener('mouseenter',()=>{
        checkIcon.style.color='rgb(161, 211, 255)'
    })
    checkIcon.addEventListener('mouseleave',()=>{
        checkIcon.style.color='white'
    })
    checkIcon.addEventListener('click',async ()=>{
        //Handle task deletion here
        try {
            const response = await fetch('/managetasks', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({listName:selectedList,taskId: id})
              });
            if(response.ok){
                displayTasks(selectedList)
            }
        }
        catch(error)
        {
        }
    })
    pencilIcon.addEventListener('mouseenter',()=>{
        pencilIcon.style.color='rgb(161, 211, 255)'
    })
    pencilIcon.addEventListener('mouseleave',()=>{
        pencilIcon.style.color='white'
    })
    pencilIcon.addEventListener('click',()=>{
        const convertToForm = () => {
            taskDivHeader.removeEventListener('mouseenter',appendIcons)
            const originalTitle = taskDivHeader.textContent
            const originalBody = taskDivBody.textContent
            taskDivHeader.innerHTML=''
            taskDivBody.innerHTML=''
            const titleInput = document.createElement('input')
            const bodyInput = document.createElement('textarea')
            titleInput.className='edit-task-title'
            bodyInput.className='edit-task-body'
            titleInput.value=originalTitle
            bodyInput.value=originalBody
            taskDivHeader.append(titleInput)
            taskDivBody.append(bodyInput)
            bodyInput.style.height = (bodyInput.scrollHeight) + 'px'
            const submitButton = document.createElement('button')
            submitButton.className='edit-task-submit-button'
            submitButton.textContent='Submit'
            submitButton.addEventListener('click',async ()=>{
                const newTitle = titleInput.value
                const newBody = bodyInput.value
                if(newTitle.length==0)
                {
                    alert('Title cannot be empty')
                    return 
                }
                try {
                    const response = await fetch('/managetasks', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                          },
                        body: JSON.stringify({listName:selectedList,taskId:id,newTitle,newDescription: newBody})
                      });
                    if(response.ok){
                        taskDivHeader.innerHTML=''
                        taskDivBody.innerHTML=''
                        taskDivHeader.textContent=newTitle
                        taskDivBody.textContent=newBody
                        taskDivHeader.addEventListener('mouseenter',appendIcons)
                    }
                }
                catch(error)
                {
                    taskDivHeader.innerHTML=''
                    taskDivBody.innerHTML=''
                    taskDivHeader.textContent=originalTitle
                    taskDivBody.textContent=originalBody
                    taskDivHeader.addEventListener('mouseenter',appendIcons)
                }
            })
            taskDivBody.append(submitButton)
        }
        convertToForm()
    })
    
    taskDivHeader.addEventListener('mouseenter',appendIcons)

    taskDivHeader.addEventListener('mouseleave',()=>{
        checkIcon.remove()
        pencilIcon.remove()
    })
    mainpage.prepend(taskDiv)
}


var addListDiv = document.getElementById('sidebar-addlist-container');
var clickHandler = () => {
    addListDiv.removeEventListener('click', clickHandler);
    addListDiv.innerHTML = '';
    addListDiv.style.cursor='default'

    // Create and append the form
    var form = document.createElement("form");
    form.className='addlist-form'
    var input = document.createElement("input");
    input.className = 'addlist-input'
    input.type = "text";
    input.placeholder = "Enter something...";
    form.appendChild(input);
    var submitButton = document.createElement("button");
    submitButton.className = 'addlist-submit-button'
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    form.appendChild(submitButton);
    addListDiv.appendChild(form);

    form.addEventListener('submit',async (e)=>{
        e.preventDefault()
        try {
            const response = await fetch('/lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({listName: input.value})
              });
            if(response.ok)
            {
                fillSidebar(input.value)
            }
            else{
                alert('Failed to add list - make sure list name is unique')
            }
        }
        catch(error)
        {
            console.log('some eror')
        }
        
    })
};
// Add the click event listener to the div
addListDiv.addEventListener('click', clickHandler);
addListDiv.addEventListener('mouseleave',()=>{
    addListDiv.addEventListener('click',clickHandler)
    addListDiv.style.cursor='pointer'
    addListDiv.innerHTML='<p>+ Add a new List</p>'
})

var addtaskForm = document.getElementById('addtask-form')
var addtaskPopup = document.getElementById('addtask-popup')
var addtaskButton = document.getElementById('addtask-container')
addtaskButton.style.display = 'none'
var addtaskTitle = document.getElementById('task-title')
var addtaskDescription = document.getElementById('task-description')
var closeTaskPopupButton = document.getElementById('closePopup')
addtaskButton.addEventListener('click',()=>{
    if(!selectedList)
    {
        alert('No list is selected')
        return
    }
    addtaskPopup.style.display = 'flex'
})
closeTaskPopupButton.addEventListener('click',()=>{
    addtaskPopup.style.display = 'none'
})
addtaskForm.addEventListener('submit',async (e)=>{
    e.preventDefault()
    if(!selectedList)
    {
        alert('No list is selected')
    }
    title = addtaskTitle.value
    description = addtaskDescription.value
    if(title.length===0)
    {
        alert('title cannot be empty')
        return 
    }
    addtaskTitle.value = ''
    addtaskDescription.value = ''
    addtaskPopup.style.display = 'none'
    try {
        const response = await fetch('/managetasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({listName:selectedList,title,description})
          });
        if(response.ok){
            displayTasks(selectedList)
        }
    }
    catch(error)
    {

    }
})

const logoutLink = document.getElementById('logout-link')
logoutLink.addEventListener('click',async ()=>{
    const response = await fetch('/logout', {
        method: 'GET'
    });
    if(response.ok)
    {
        window.location.href = '/login';
    }
})

const welcomeText = document.getElementById('header-text')
const displayWelcomeText = async () => {
    try {
        const response = await fetch('/getusername', {
            method: 'GET'
          });
        if(response.ok){
            data = await response.json()
            welcomeText.innerHTML='Welcome '+data.username+'!'
        }
    }
    catch(error)
    {

    }
}
displayWelcomeText()
