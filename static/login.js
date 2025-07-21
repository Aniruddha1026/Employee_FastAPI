document.getElementById('login-form').addEventListener("submit",async (e) => {
    e.preventDefault()
    const email=document.getElementById('email').value.trim()
    const password=document.getElementById('password').value.trim()
    const errormsg=document.getElementById('error-message')
    errormsg.textContent=""
    try{
        const res = await fetch("http://localhost:8000/login",{
            method: "POST",
            headers: {"content-type" : "application/json"},
            body: JSON.stringify({email,password})
        });
        const data=await res.json();
        
        if (!res.ok){
            errormsg.textContent=data.detail || "Login Failed";
            return
        }

        localStorage.setItem("token",data.access_token);
        window.location.href="/static/employee.html";

        } catch (err){
            errormsg.textContent="Something went wrong"
        }
    })