async function generatePDF(lang = 'en') {
    const { jsPDF } = window.jspdf;

    // Load required libraries dynamically
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js");
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");

    try {
        // Fetch Markdown content based on language
        const fileName = lang === 'ru' ? 'index_ru.md' : 'index.md';
        const url = `https://raw.githubusercontent.com/arturmon/cv/main/docs/${fileName}`;
        const response = await fetch(url);
        const markdown = await response.text();

        // Convert Markdown to HTML
        const htmlContent = marked.parse(markdown);

        // Create a temporary container for rendering
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = `
            <style>
                body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; width: 800px; }
                h1, h2, h3 { color: #333; }
                p { line-height: 1.5; }
            </style>
            ${htmlContent}`;
        tempDiv.style.backgroundColor = "white";
        tempDiv.style.padding = "20px";
        tempDiv.style.width = "800px";
        document.body.appendChild(tempDiv);

        // Render the HTML to canvas
        const canvas = await html2canvas(tempDiv, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // Create a new PDF
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let yPosition = 0;

        // Split the content into multiple pages
        while (yPosition < imgHeight) {
            pdf.addImage(imgData, "PNG", 0, -yPosition, imgWidth, imgHeight);
            yPosition += pageHeight;
            if (yPosition < imgHeight) {
                pdf.addPage();
            }
        }

        const pdfName = lang === 'ru' ? "Artur_Mudrykh_CV_RU.pdf" : "Artur_Mudrykh_CV.pdf";
        pdf.save(pdfName);

        // Remove the temporary container
        document.body.removeChild(tempDiv);
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
}

function downloadMD(lang = 'en') {
    const fileName = lang === 'ru' ? 'index_ru.md' : 'index.md';
    const url = `https://raw.githubusercontent.com/arturmon/cv/refs/heads/main/docs/${fileName}`;
    fetch(url)
        .then(response => response.text())
        .then(content => {
            const blob = new Blob([content], { type: "text/markdown" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            const mdName = lang === 'ru' ? "Artur_Mudrykh_CV_RU.md" : "Artur_Mudrykh_CV.md";
            link.download = mdName; // Specify the file name
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