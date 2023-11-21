
const signupForm = document.querySelector('#signup-form')
const username_input = signupForm.querySelector('#signup-username')
const password_input = signupForm.querySelector('#signup-password')
const re_password_input = signupForm.querySelector('#signup-password-retype')
signupForm.addEventListener('submit',async (e)=>{
    e.preventDefault()
    username = username_input.value
    password = password_input.value
    if(password.length < 7) {
        alert('Password must be atleast 7 characters')
        return
    }
    if(password !== re_password_input.value)
    {
        alert('Passwords do not match')
        return
    }
    const formData = {
        username,
        password
    }

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(formData)
          });
        if(response.ok)
        {
            alert('Successfully signed in, login to continue')
            window.location.href = '/login';
        }
        else{
            alert('signup unsuccessful')
        }
    }
    catch(error)
    {
        console.log('hehe')
    }
})

loginButton = document.getElementById('login-button')
loginButton.addEventListener('click',()=>{
    window.location.href = '/login'
})