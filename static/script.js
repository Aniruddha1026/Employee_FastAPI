document.addEventListener("DOMContentLoaded",() => {
    const form = document.getElementById('login-form')
    const errormsg=document.getElementById('error-message')
    form.addEventListener("submit",async (e) => {
        e.preventDefault()
        const email=document.getElementById('email')
        const password=document.getElementById('password')
        try{
            const res = await fetch("http://localhost:8000/login",{
                method: "POST",
                headers: {"content-type" : "application/json"},
                body: JSON.stringify({ email,password })
            });
            const data=await res.json();
            if (res.ok){
                localStorage.setitem("access_token",data.access_token);
                window.location.href="dashboard.html";
            } else{
                const errordata=await res.json();
                errormsg.textContent=errordata.detail || "Login Failed";
            }
        } catch (err){
            errormsg.textContent="Something went wrong"
        }
    })
})