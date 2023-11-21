
const loginForm = document.querySelector('#login-form')
const username_input = loginForm.querySelector('#login-username')
const password_input = loginForm.querySelector('#login-password')

loginForm.addEventListener('submit',async (e)=>{
    e.preventDefault()
    username = username_input.value
    password = password_input.value
    console.log(username)
    
    const formData = {
        username,
        password
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(formData)
          });
        if(response.ok){
            window.location.href = '/tasks';
        }
    }
    catch(error)
    {

    }
})

signupButton = document.getElementById('signup-button')
signupButton.addEventListener('click',()=>{
    window.location.href = '/signup'
})