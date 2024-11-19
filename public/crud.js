const getFormData = (form) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Ensure checkboxes are properly captured in the data object
    form.querySelectorAll('input[type=checkbox]').forEach(el => {
        data[el.name] = el.checked ? true : false;
    });

//Start the code from ChatGPT https://chatgpt.com/share/6733efd9-9378-8012-b029-f6f636ce1fba
    // Set a default value for studentName if left blank
    if (!data.studentName || data.studentName.trim() === '') {
        data.studentName = "Anonymous";
    }
//End the code from ChatGPT https://chatgpt.com/share/6733efd9-9378-8012-b029-f6f636ce1fba

    return data;
};

// Frontend validation to give feedback to the user
const validateItem = (data) => {
    const errors = [];
    noticeArea.style.display = errors.length ? 'block' : 'none';
    noticeArea.textContent = errors.join(' ');
    return errors.length === 0;
};

const saveItem = async (data) => {
    console.log(data);
    const endpoint = data._id ? `/api/item/${data._id}` : '/api/item/';
    const options = {
        method: data._id ? "PUT" : "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(endpoint, options);
        const updatedItem = await response.json();
        renderItem(updatedItem); // Re-render item with updated data
    } catch (error) {
        console.log(error);
    }
};

const deleteItem = async (id) => {
    const endpoint = `/api/item/${id}`;
    const options = { method: "DELETE" };
    try {
        await fetch(endpoint, options);
        document.querySelector(`[data-id="${id}"]`).remove(); // Remove from DOM
    } catch (error) {
        console.log(error);
    }
};

const editItem = (data) => {
    // Populate the form with data to be edited
    Object.keys(data).forEach(field => {
        const element = itemForm.elements[field];
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = data[field];
            } else if (element.type === "date") {
                element.value = new Date(data[field]).toLocaleDateString('en-CA');
            } else {
                element.value = data[field];
            }
        }
    });

    // Set the preview image for the file
    if (data.fileName) {
        imagePreview.setAttribute("src", '/uploads/' + data.fileName);
    }

    formHeading.innerHTML = `Edit ${data.workTitle}`;
};

// Template function to render an item
const template = (data) => DOMPurify.sanitize(`
    <section class="image"> 
        <div class="frame">
            <img src="${data.fileName ? '/uploads/' + data.fileName : '/assets/photo.svg'}" alt="${data.name}">
        </div> 
    </section>
    <section class="information">
        <header> 
            <h2>${data.workTitle}</h2>
            <h3>by ${data.studentName}</h3>
        </header>
        <main>
            <p class="program-year">${data.program}, ${data.year}</p>
        </main>
        <div class="options"> 
            <button class="edit" popovertarget="formPopover">Edit</button> 
            <button class="delete">Delete</button>
        </div>
    </section> 
`);


const renderItem = (data) => {
    const div = document.createElement('div');
    div.classList.add('item');
    div.setAttribute('data-id', data._id);
    div.innerHTML = template(data);
    div.querySelector('.edit').onclick = () => editItem(data);
    div.querySelector('.delete').onclick = () => deleteItem(data._id);
    const existingElement = document.querySelector(`[data-id="${data._id}"]`);
    existingElement ? content.replaceChild(div, existingElement) : content.prepend(div);
};

// Export functions for use in other modules
export { getFormData, validateItem, saveItem, renderItem, deleteItem };
