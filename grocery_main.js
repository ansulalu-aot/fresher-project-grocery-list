const form = document.querySelector("#grocery-form");
const alert = document.querySelector("#alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector("#submit-btn");
const container = document.querySelector("#grocery-container");
const list = document.querySelector("#grocery-list");
const clearBtn = document.querySelector("#clear-btn");

let editElement, editFlag = false, editID = "";
//event listeners
form.addEventListener("submit", addItem);                             // submit form
clearBtn.addEventListener("click", clearItems);                      // clear list
window.addEventListener("DOMContentLoaded", setupItems);            // display items onload
// add item
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if(value !== "" && !editFlag){
        const element = document.createElement("article");
        let attr = document.createAttribute("data-id");
        attr.value = id;
        element.setAttributeNode(attr);
        element.classList.add("grocery-item");
        element.innerHTML = `
            <p class="my-2" id="title">${value}</p>
            <div class="d-flex gap-2 justify-content-end">
                <button class="btn" type="button" id="edit-btn"><i class="bi bi-pencil-square text-success"></i></button>
                <button class="btn" type="button" id="delete-btn"><i class="bi bi-trash-fill text-danger"></i></button>
            </div>
        `;
        // add event listeners to both buttons;
        const deleteBtn = element.querySelector("#delete-btn");
        deleteBtn.addEventListener("click", deleteItem);
        const editBtn = element.querySelector("#edit-btn");
        editBtn.addEventListener("click", editItem);
        list.appendChild(element);                                          // append child
        displayAlert("item added to the list", "success");                  // display alert
        container.classList.add("show-container");                          // show container
        addToLocalStorage(id, value);                                       // set local storage
        setBackToDefault();                                                 // set back to default
    }
    else if(value !== "" && editFlag){
        editElement.innerHTML = value;
        displayAlert("value changed", "success");
        editLocalStorage(editID, value);                                  // edit  local storage
        setBackToDefault();
    } 
    else{
        displayAlert("please enter value", "danger");
    }
}
// display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(function (){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}
// clear items
function clearItems(){
    const items = document.querySelectorAll(".grocery-item");
    if(items.length > 0){
        items.forEach(function (item){
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}
// delete item
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
    setBackToDefault();                                     // set back to default
    removeFromLocalStorage(id);                            // remove from local storage
}
// edit item
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;         // set edit item
    grocery.value = editElement.innerHTML;                                      // set form value
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";                     //changing to edit
}
// set backt to defaults
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}
// add to local storage
function addToLocalStorage(id, value){
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function (item){
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function (item){
        if(item.id === id){
            item.value = value;
        }
    return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}
//setup localsorage.removeitem('list')
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function (item){
            createListItem(item.id, item.value);
        });
    container.classList.add("show-container");
    }
}

function createListItem(id, value){
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `
    <p class="my-2" id="title">${value}</p>
    <div class="d-flex gap-2 justify-content-end">
        <button class="btn" type="button" id="edit-btn"><i class="bi bi-pencil-square text-success"></i></button>
        <button class="btn" type="button" id="delete-btn"><i class="bi bi-trash-fill text-danger"></i></button>
    </div>
     `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector("#delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector("#edit-btn");
    editBtn.addEventListener("click", editItem);
    // append child
    list.appendChild(element);
}
