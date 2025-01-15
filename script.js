const stateObject = {
    "Gujarat": { "Navsari": [], "Surat": [], "Ahmedabad": [] },
    "Maharashtra": { "Mumbai": [], "Pune": [], "Nagpur": [] },
    "Rajasthan": { "Jaipur": [], "Jodhpur": [], "Jaisalmer": [] }
};

const globalData = [];

window.onload = function () {
    const statesel = document.querySelector("select[name='State']");
    const citysel = document.querySelector("select[name='City']");
    for (const state in stateObject) {
        statesel.options[statesel.options.length] = new Option(state, state);
    }
    statesel.onchange = function () {
        citysel.length = 1;
        for (const city in stateObject[this.value]) {
            citysel.options[citysel.options.length] = new Option(city, city);
        }
    };
};

function validateForm(form) {
    let valid = true;
    const errorElement = document.querySelector(".error");
    const name = form.Name.value.trim();
    const email = form.Email.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const gender = form.gender.value;
    const hobbies = Array.from(form.querySelectorAll("input[type='checkbox']:checked"));
    const age = form.Age.value;
    const state = form.State.value;
    const city = form.City.value;
    if (!name || !emailPattern.test(email) || !gender || hobbies.length === 0 || !age || age < 1 || age > 100 || !state || !city) {
        errorElement.textContent = "* Fill up form with all data...";
        valid = false;
    } else {
        errorElement.textContent = "";
    }
    return valid;
}

// function printGlobalData() {
// document.getElementById("global-data-display").textContent = JSON.stringify(globalData); 
// }

function addRow(event, form) {
    event.preventDefault();
    if (!validateForm(form)) return;
    const data = {
        name: form.Name.value,
        email: form.Email.value,
        gender: form.gender.value,
        hobbies: Array.from(form.querySelectorAll("input[type='checkbox']:checked")).map(hobby => hobby.value).join(", "),
        age: form.Age.value,
        state: form.State.value,
        city: form.City.value
    };
    globalData.push(data);
    addToTable(); 
    printGlobalData();
    form.reset();
}

function addToTable() {
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = "";
    globalData.forEach((entry, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${entry.name}</td>
            <td>${entry.email}</td>
            <td>${entry.gender}</td>
            <td>${entry.hobbies}</td>
            <td>${entry.age}</td>
            <td>${entry.state}</td>
            <td>${entry.city}</td>
            <td><button onclick="editRow(${index})">Edit</button></td>
            <td><button onclick="deleteRow(${index})">Delete</button></td>
        `;
    });
}

function deleteRow(index) {
    globalData.splice(index, 1);
    addToTable();
    printGlobalData();
}

function editRow(index) {
    const data = globalData[index];
    const form = document.querySelector("#form2");
    form.Name.value = data.name;
    form.Email.value = data.email;
    form.gender.value = data.gender;
    form.Age.value = data.age;
    form.State.value = data.state;
    form.City.value = data.city;
    Array.from(form.querySelectorAll("input[type='checkbox']")).forEach(checkbox => {
        checkbox.checked = data.hobbies.includes(checkbox.value);
    });   
    deleteRow(index);
}

function searchName() {
    const filter = document.getElementById("myInput").value.toUpperCase();
    const rows = document.querySelectorAll("#data-table tbody tr");
    rows.forEach(row => {
        const td = row.getElementsByTagName("td")[0];
        row.style.display = td && td.textContent.toUpperCase().includes(filter) ? "" : "none";
    });
}

function sortTable() {
    const rows = Array.from(document.querySelectorAll("#data-table tbody tr"));
    const sortOption = document.getElementById("sort").value;
    rows.sort((rowA, rowB) => {
        const nameA = rowA.cells[0].textContent.toLowerCase();
        const nameB = rowB.cells[0].textContent.toLowerCase();
        return sortOption === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    rows.forEach(row => document.querySelector("#data-table tbody").appendChild(row));
}