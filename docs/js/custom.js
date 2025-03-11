function generatePDF() {
    const { jsPDF } = window.jspdf;
    const url = "https://raw.githubusercontent.com/arturmon/cv/refs/heads/main/docs/index.md";

    fetch(url)
        .then(response => response.text())
        .then(markdown => {
            const pdf = new jsPDF();
            pdf.text(markdown, 10, 10);
            pdf.save("Artur_Mudrykh_CV.pdf");
        })
        .catch(error => console.error("Error:", error));
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
