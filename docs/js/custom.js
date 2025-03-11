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