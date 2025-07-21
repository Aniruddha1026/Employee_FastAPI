document.getElementById("register-form").addEventListener('submit',async (e) => {
    e.preventDefault()
    const email=document.getElementById('email').value.trim()
    const password=document.getElementById('password').value.trim()
    const error_message=document.getElementById('error-message')
                
    error_message.textContent=""
    
    try{
        const res=await fetch("http://localhost:8000/register",{
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({ email,password })
        })
        const data=await res.json()
        console.log(data)
        if (!res.ok){
            const errordata=await res.json();
            error_message.textContent=errordata.detail || "Registration Failed"
            return
        }
        alert("Registration Successful! Please Log in")
        window.location.href="/static/login.html"
    } catch(err){
        console.error("Fetch error:", err);
        error_message.textContent="Something went wrong. Please try again."
    }
})