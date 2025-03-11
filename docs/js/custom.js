async function generatePDF() {
    const { jsPDF } = window.jspdf;

    // Load external libraries dynamically
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js");
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");

    try {
        // Fetch the Markdown file
        const url = "https://raw.githubusercontent.com/arturmon/cv/main/docs/index.md";
        const response = await fetch(url);
        const markdown = await response.text();

        // Convert Markdown to HTML
        const htmlContent = marked.parse(markdown);

        // Create a temporary container for rendering
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = `
            <style>
                body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; }
                h1, h2, h3 { color: #333; }
                p { line-height: 1.5; }
            </style>
            ${htmlContent}`;
        tempDiv.style.width = "800px";
        tempDiv.style.backgroundColor = "white";
        document.body.appendChild(tempDiv);

        // Render the HTML to canvas
        const canvas = await html2canvas(tempDiv);
        const imgData = canvas.toDataURL("image/png");

        // Create a PDF and insert the image
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("Artur_Mudrykh_CV.pdf");

        // Remove the temporary container
        document.body.removeChild(tempDiv);
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
}

function downloadMD() {
    const url = "https://raw.githubusercontent.com/arturmon/cv/refs/heads/main/docs/index.md";
    fetch(url)
        .then(response => response.text())
        .then(content => {
            const blob = new Blob([content], { type: "text/markdown" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Artur_Mudrykh_CV.md"; // Specify the file name
            link.click();
        })
        .catch(error => console.error("Error downloading MD:", error));
}

function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}