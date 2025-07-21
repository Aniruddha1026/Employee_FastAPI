//add employee
document.getElementById('toggle-form').addEventListener("click",() => {
    const form= document.getElementById('employee-form')
    form.style.display=form.style.display==="none" ? "block" : "none"
})

document.getElementById('add-employee-form').addEventListener("submit",async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token");
    const error = document.getElementById("add-error");

    const data = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,
        joining_date: document.getElementById("joining_date").value,
        department: document.getElementById("department").value,
        position: document.getElementById("position").value,
        salary: parseFloat(document.getElementById("salary").value)
    }

    try {
        const response = await fetch("http://localhost:8000/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Failed to add employee");
        }

        alert("Employee added successfully!");
        e.target.reset();
        document.getElementById("employee-form").style.display = "none";
        fetchemployee();

    } catch (err) {
        error.textContent = err.message;
    }
})

//view employee
async function fetchemployee(){
    const token=localStorage.getItem("token")
    const error_message=document.getElementById('error-message')
    const tablebody=document.getElementById('employee-body')
    const searchValue = document.getElementById("search-input").value.trim().toLowerCase()
    const department = document.getElementById("department-filter").value
    const position = document.getElementById("position-filter").value
    const idSearch = document.getElementById("id-search").value.trim()

    tablebody.innerHTML=""
    error_message.textContent=""
    console.log(token)
    if (!token){
        error_message.textContent="You are not logged in. Redirecting to login"
        setTimeout(() => {
            window.location.href="/static/login.html"
        }, 2000);
        return
    }

    try{
        let employees=[]
        if (idSearch) {
            const res = await fetch(`http://localhost:8000/employees/${idSearch}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Employee not found");
            }

            const emp = await res.json();
            employees = [emp];
        } else{
            let query_params=[]
            if (department){
                query_params.push(`department=${encodeURIComponent(department)}`)
            }
            if (position){
                query_params.push(`position=${encodeURIComponent(position)}`)
            }
            const query_string= query_params.length>0 ? "?" + query_params.join("&"):""
            const res=await fetch(`http://localhost:8000/employees${query_string}`,{
                headers: {"Authorization" : `Bearer ${token}`}
        })
    
        if (!res.ok){
            const data=await res.json()
            throw new Error(data.detail || "Failed to fetch employee data")
        }

        employees=await res.json()
    }

    const filtered=employees.filter(emp => {
        const full_name=(emp.first_name+" "+emp.last_name).toLowerCase()
        return (
            (!idSearch || emp.id.toString() === idSearch) &&
            full_name.includes(searchValue) || emp.email.toLowerCase().includes(searchValue)
        )
    })
    if (filtered.length==0){
        tablebody.innerHTML=`<tr><td colspan="10">No results found</td> </tr>`
    }
    employees.forEach(emp => {
        const row = document.createElement("tr")
        row.innerHTML=`
            <td>${emp.id}</td>
            <td>${emp.first_name}</td>
            <td>${emp.last_name}</td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td>${emp.dob}</td>
            <td>${emp.joining_date}</td>
            <td>${emp.department}</td>
            <td>${emp.position}</td>
            <td>${emp.salary}</td>
            <td><button onclick="editEmployee(${emp.id})">Edit</button>
                <button onclick="deleteEmployee(${emp.id})" style="margin-left: 5px; background-color: red; color: white;">Delete</button>
            </td>
            `
        tablebody.appendChild(row)
    })
    } catch(err){
        error_message.textContent = err.message || "Something went wrong."
    }
}


//update employee
async function editEmployee(id) {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/employees/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        alert("Failed to fetch employee data");
        return;
    }

    const emp = await res.json();
    
    
    document.getElementById("update-id").value = emp.id
    document.getElementById("update-first-name").value = emp.first_name
    document.getElementById("update-last-name").value = emp.last_name
    document.getElementById("update-email").value = emp.email
    document.getElementById("update-phone").value = emp.phone
    document.getElementById("update-dob").value = emp.dob
    document.getElementById("update-joining-date").value = emp.joining_date
    document.getElementById("update-department").value = emp.department
    document.getElementById("update-position").value = emp.position
    document.getElementById("update-salary").value = emp.salary

    document.getElementById("update-form").style.display = "block"
}



document.getElementById("update-employee-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const id = document.getElementById("update-id").value
    const token = localStorage.getItem("token")
    const error = document.getElementById("update-error")

    const data = {
        first_name: document.getElementById("update-first-name").value,
        last_name: document.getElementById("update-last-name").value,
        email: document.getElementById("update-email").value,
        phone: document.getElementById("update-phone").value,
        dob: document.getElementById("update-dob").value,
        joining_date: document.getElementById("update-joining-date").value,
        department: document.getElementById("update-department").value,
        position: document.getElementById("update-position").value,
        salary: parseFloat(document.getElementById("update-salary").value)
    };

    try {
        const res = await fetch(`http://localhost:8000/employees/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.detail || "Update failed")
        }

        alert("Employee updated successfully!")
        document.getElementById("update-form").style.display = "none"
        e.target.reset()
        fetchemployee()

    } catch (err) {
        error.textContent = err.message
    }
});

//delete employee
async function deleteEmployee(id) {
    const confirmDelete = confirm("Are you sure you want to delete this employee?")
    if (!confirmDelete) {
        return
    }

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:8000/employees/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.detail || "Failed to delete employee")
        }

        alert("Employee deleted successfully!")
        fetchemployee()

    } catch (err) {
        alert("Error: " + err.message)
    }
}

//logout
document.getElementById("logout-button").addEventListener("click", () => {
    localStorage.removeItem("token")
    alert("You have been logged out.")
    window.location.href = "/static/login.html"  
})


document.addEventListener("DOMContentLoaded",() => {
    document.getElementById('filter-button').addEventListener('click',fetchemployee)
    document.getElementById('id-search').addEventListener("input", fetchemployee)
    document.getElementById('search-input').addEventListener("input", fetchemployee)
    fetchemployee()
})