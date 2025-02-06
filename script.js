// Function to preview an image
function previewImage(input, previewId) {
    const file = input.files[0];
    const preview = document.getElementById(previewId);
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
}

// Add event listeners for file inputs
document.getElementById('package-label').addEventListener('change', function () {
    previewImage(this, 'preview-package-label');
});
document.getElementById('package-condition').addEventListener('change', function () {
    previewImage(this, 'preview-package-condition');
});
document.getElementById('damaged-parts').addEventListener('change', function () {
    previewImage(this, 'preview-damaged-parts');
});
document.getElementById('additional-pictures').addEventListener('change', function () {
    previewImage(this, 'preview-additional-pictures');
});

// Form submission with PDF generation
document.getElementById('dispatch-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const values = {};
    formData.forEach((value, key) => {
        values[key] = value;
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(12);
    let y = 10;

    doc.text('Dispatch Receiving Form', 105, y, { align: 'center' });
    y += 10;

    // Add form text
    for (const key in values) {
        if (key.startsWith("file")) continue; // Skip file inputs
        doc.text(`${key.replace(/-/g, ' ')}: ${values[key]}`, 10, y);
        y += 10;
        if (y > 280) {
            doc.addPage();
            y = 10;
        }
    }

    // Add images to PDF
    const imageIds = [
        { id: 'preview-package-label', label: 'Package Label' },
        { id: 'preview-package-condition', label: 'Package Condition' },
        { id: 'preview-damaged-parts', label: 'Damaged Parts' },
        { id: 'preview-additional-pictures', label: 'Additional Notes' },
    ];

    for (const { id, label } of imageIds) {
        const img = document.getElementById(id);
        if (img.src) {
            y += 10;
            doc.text(label, 10, y);
            y += 5;
            doc.addImage(img.src, 'JPEG', 10, y, 50, 50);
            y += 55;
            if (y > 280) {
                doc.addPage();
                y = 10;
            }
        }
    }

    doc.save(`dispatch_receiving_form_${values['dispatch-number'] || 'unknown'}.pdf`);
});
