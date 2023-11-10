
/**
 * Converts an array of image files to a PDF blob.
 * @param {File[]} files - An array of image files to convert.
 * @returns {Promise<Blob>} A promise that resolves with the PDF blob.
 */


const { jsPDF } = window.jspdf;

async function convertToPDF(files) {
    const pdf = new jsPDF();

    for (const file of files) {
        const image = new Image();
        image.src = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
            image.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = image.width;
                canvas.height = image.height;

                ctx.drawImage(image, 0, 0);

                const imageData = canvas.toDataURL('image/jpeg'); // Convert all images to JPEG
                pdf.addImage(imageData, 'JPEG', 10, 10, 190, 150); // Adjust the position and size as needed
                pdf.addPage(); // Add a new page for each image

                resolve();
            };
        });
    }

    return pdf.output('blob');
}

/**
 * Downloads a PDF blob as a file.
 * @param {Blob} blob - The PDF blob to download.
 */
function downloadPDF(blob) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'output.pdf';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}

/**
 * Converts an array of image files to a PDF blob and downloads it.
 */
async function convertAndDownload() {
    const input = document.getElementById('imageInput');
    const files = input.files;

    showLoadingIndicator();

    const pdfBlob = await convertToPDF(files);

    hideLoadingIndicator();

    downloadPDF(pdfBlob);
}

/**
 * Converts an array of image files to a PDF blob and displays it in an iframe.
 */
async function previewPDF() {
    const input = document.getElementById('imageInput');
    const files = input.files;

    showLoadingIndicator();

    const pdfBlob = await convertToPDF(files);

    hideLoadingIndicator();

    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Use an iframe to display the PDF within the same page
    const iframe = document.createElement('iframe');
    iframe.src = pdfUrl;
    iframe.width = '100%';
    iframe.height = '500px';

    document.body.appendChild(iframe);
}

/**
 * Shows the loading indicator.
 */
function showLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

/**
 * Hides the loading indicator.
 */
function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'none';
}
