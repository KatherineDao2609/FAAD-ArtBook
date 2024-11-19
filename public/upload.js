// This module helps to handle image uploads

// Given a file, upload it.
// This works both via "Browse" ( file picker) and via drag-and-drop
const upload = async (theFile) => {
  // if the file is too big, prevent the upload 
  if (theFile.size > 10 * 1024 * 1024) {
    alert("Maximum file size is 10MB");
  } else {
    // activate a loading animation during upload
    imagePreview.setAttribute("src", "assets/load.svg");
    // Create a data structure for FormData and append the image data to it
    // Note: the body encoding here is "multipart/form-data"
    const formData = new FormData();
    formData.append("image", theFile);
    // prepare a POST request with the image file in the request body
    const endpoint = "/api/upload";
    const options = {
      method: "POST",
      body: formData,
    };
    try {
      // send the POST request prepared above
      const response = await fetch(endpoint, options); 
      // Check if the response is not OK (e.g., 500)
      if (!response.ok) {
        // Read and display error message from the response
        const errorData = await response.json();
        noticeArea.style.display = "block";
        noticeArea.textContent =
          errorData.message || "Something went wrong with the upload.";
        imagePreview.setAttribute("src", "assets/photo.svg");
        return; // Stop execution here if there's an error
      }

      // If response is OK, proceed with normal processing
      const uploadDetails = await response.json();
      console.log(uploadDetails);
      if (uploadDetails.newFileName) {
        // Set the uploaded file to appear as a preview in the form.
        imagePreview.setAttribute(
          "src",
          "/uploads/" + uploadDetails.newFileName
        );
        // Set a hidden value to match the uploaded filename (saved to MongoDB)
        itemForm.elements["fileName"].value = uploadDetails.newFileName;
      }
    } catch (err) {
      // Handle any fetch or network errors
      console.log(err); 
    }
  }
};

// BROWSE BUTTON
// if the user clicks the browse button and selects an image file
// A "change" event fires on the file input. 
// we can listen for this to trigger the upload process
fileInput.addEventListener("change", (event) => {
  upload(event.currentTarget.files[0]);
});

if (window.matchMedia("(pointer: fine)").matches) {
  // let's define some events for drag and drop behaviours
  // the area recieves a ".ready" CSS class during the relevant drag events
  // This allows us to style it as we like (e.g. make it green, etc.)
  let dragAndDropEvents = {
    dragenter: (event) => {
      uploadArea.classList.add("ready");
    },
    dragover: (event) => {
      uploadArea.classList.add("ready");
    },
    dragleave: (event) => {
      if (!uploadArea.contains(event.relatedTarget)) {
        uploadArea.classList.remove("ready");
      }
    },
    drop: (event) => {  
        uploadArea.classList.remove("ready"); 
        // Get the dropped file and check its type
        const file = event.dataTransfer.files[0];
        console.log(file)
        if (!file.type.startsWith('image/')) {
            // Display an error message for unsupported file types
            noticeArea.style.display = 'block';
            noticeArea.textContent = 'Only image files are supported. Please upload a valid image.';
            imagePreview.setAttribute('src', 'assets/photo.svg');
            return; // Stop further execution if the file is not an image
        } 
        // If file type is valid, proceed with upload
        upload(file);
    }
  };
  // Activate all the above event handlers
  // also, prevent default event handler from running/propogating
  for (const [eventName, eventHandler] of Object.entries(dragAndDropEvents)) {
    uploadArea.addEventListener(eventName, (e) => e.preventDefault());
    uploadArea.addEventListener(eventName, (e) => e.stopPropagation());
    uploadArea.addEventListener(eventName, eventHandler);
  }
}
