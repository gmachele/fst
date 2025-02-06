// Quantity input handling
function generateInputs() {
    const quantity = document.getElementById("quantity").value;
    const container = document.getElementById("input-container");
    container.innerHTML = ""; // Clear previous inputs

    for (let i = 1; i <= quantity; i++) {
        const div = document.createElement("div");
        div.classList.add("form-group");

        // Static Receiver Label
        const receiverLabel = document.createElement("label");
        receiverLabel.textContent = `Receiver ${i}:`;
        receiverLabel.setAttribute("for", `item-type-${i}`);

        // Dropdown for Item Type (Cylinder, Valve, Other)
        const itemTypeContainer = document.createElement("div");
        itemTypeContainer.classList.add("item-type-container");

        const selectLabel = document.createElement("label");
        selectLabel.textContent = `Item Type:`;
        selectLabel.setAttribute("for", `item-type-${i}`);

        const select = document.createElement("select");
        select.id = `item-type-${i}`;
        select.name = `item-type-${i}`;
        select.required = true;

        const defaultOption = new Option("Select an option", "", true, true);
        defaultOption.disabled = true;
        const option1 = new Option("Cylinder", "cylinder");
        const option2 = new Option("Valve", "valve");
        const option3 = new Option("Other", "other");

        select.appendChild(defaultOption);
        select.appendChild(option1);
        select.appendChild(option2);
        select.appendChild(option3);

        itemTypeContainer.appendChild(selectLabel);
        itemTypeContainer.appendChild(select);

        // Always visible description input
        const descContainer = document.createElement("div");
        descContainer.classList.add("description-container");

        const descLabel = document.createElement("label");
        descLabel.textContent = "Description:";
        descLabel.setAttribute("for", `description-${i}`);

        const descInput = document.createElement("input");
        descInput.type = "text";
        descInput.id = `description-${i}`;
        descInput.name = `description-${i}`;
        descInput.placeholder = "Enter description";

        descContainer.appendChild(descLabel);
        descContainer.appendChild(descInput);

        // Image upload inputs (3 images)
        const imagesContainer = document.createElement("div");
        imagesContainer.classList.add("images-container");

        const imagesLabel = document.createElement("label");
        imagesLabel.textContent = "Upload Images:";
        imagesLabel.setAttribute("for", `image-${i}-1`);

        const imageInputsContainer = document.createElement("div");
        imageInputsContainer.classList.add("image-inputs");

        for (let j = 1; j <= 3; j++) {
            const imageInput = document.createElement("input");
            imageInput.type = "file";
            imageInput.id = `image-${i}-${j}`;
            imageInput.name = `image-${i}-${j}`;
            imageInput.accept = "image/*";
            imageInput.required = j === 1; // Make the first image input required
            imageInputsContainer.appendChild(imageInput);

            // Image preview container
            const previewContainer = document.createElement("div");
            previewContainer.classList.add("preview-container");
            const previewImage = document.createElement("img");
            previewImage.classList.add("preview");
            previewContainer.appendChild(previewImage);

            // Append preview container to the image input
            imageInput.addEventListener("change", function (e) {
                previewImage.src = URL.createObjectURL(e.target.files[0]);
                previewImage.style.display = "block"; // Show the preview
            });

            // Append preview container after image input
            imageInputsContainer.appendChild(previewContainer);
        }

        imagesContainer.appendChild(imagesLabel);
        imagesContainer.appendChild(imageInputsContainer);

        // Append elements to container
        div.appendChild(receiverLabel);
        div.appendChild(itemTypeContainer);
        div.appendChild(descContainer);
        div.appendChild(imagesContainer);
        container.appendChild(div);
    }
}


document.getElementById("dispatch-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from reloading

    // Get the RMA number
    const rmaNumber = document.getElementById("rma-number").value.trim();
    if (!rmaNumber) {
        alert("Please enter a valid RMA number.");
        return;
    }

    // Create a wrapper div for proper margins
    const originalContent = document.querySelector(".container");
    const clonedContent = originalContent.cloneNode(true); // Clone the content

    // Apply margins using padding (instead of jsPDF margins)
    clonedContent.style.padding = "20mm";  // Adds 20mm margin inside the PDF

    // Create a temporary div and add cloned content
    const tempDiv = document.createElement("div");
    tempDiv.appendChild(clonedContent);
    document.body.appendChild(tempDiv);

    // Convert to PDF
    const options = {
        filename: `${rmaNumber}_dispatch_receiving_form.pdf`, 
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 5, useCORS: true }, 
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().from(tempDiv).set(options).save().then(() => {
        document.body.removeChild(tempDiv); // Remove temporary div after PDF generation
    });
});
