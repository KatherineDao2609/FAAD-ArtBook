// import helper functions for crud frontend user experience
import { getFormData, validateItem, saveItem, renderItem } from './crud.js';
// import upload handler
import './upload.js'
 

// function to fetch items and render them
const getItems = async () => {
  try { 
      const response = await fetch('/api/items');
      const items = await response.json(); 
      content.innerHTML = ''; // clear away any previous items
      content.classList.remove('loading')
      items.forEach(renderItem );
  } catch (error) {
      console.log(error);
  }
};

// Open the form for adding a new item
document.querySelector('button#add').addEventListener('click', event => {
  itemForm.reset();  
  formPopover.showPopover();
  formHeading.innerHTML = 'Share Your Work';
  document.querySelector('.save').textContent = 'Post';  // Set to "Post" when adding
});  

// Function to populate form for editing an item
const editItem = (data) => {
  // Set form heading
  formHeading.innerHTML = `Edit ${data.workTitle}`;
  document.querySelector('.save').textContent = 'Save';  // Set to "Save" when editing
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

  if (data.fileName) {
    imagePreview.setAttribute("src", '/uploads/' + data.fileName);
  }
};

// Reset the form and set default text on "Save" button when reset
itemForm.addEventListener('reset', (event) => { 
  formHeading.innerHTML = 'Share Your Work';
  document.querySelector('.save').textContent = 'Post';  // Default to "Post" when form is reset
  noticeArea.style.display = 'none';
  noticeArea.textContent = '';
  event.currentTarget.elements['_id'].value = '';
});


// Listen for Form submit and save the data 
itemForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = getFormData(event.target);
  if (validateItem(data)) {
    saveItem(data).then(() => { 
      itemForm.reset()
      formPopover.hidePopover()
    }); 
  }
});
 

// Function to reset the form.
// NOTE: this is augmenting the default reset behaviour which already blanks out most form elements.
// Here we also do a visual / narrative reset and blank out  hidden fields 
itemForm.addEventListener('reset', (event) => { 
  formHeading.innerHTML = 'Share Your Work'
  noticeArea.style.display = 'none';
  noticeArea.textContent = '';
  event.currentTarget.elements['_id'].value = ''
})

// Reset the form when we click the add or cancel buttons
// NOTE: popover behaviours are handled here explicitly 
// this helps to create a consistent experience between different browsers.
document.querySelector('button#add').addEventListener('click', event => {
  itemForm.reset()  
  formPopover.showPopover();
})  

document.querySelector('form button.cancel').addEventListener('click', event => {
  itemForm.reset()  
  formPopover.hidePopover();  // Explicitly hide popover
})  



// fetch the initial list of items
getItems();



