function generatePDF() {
    let url = window.location.origin + "/Artur%20Mudrykh.md";
    fetch(url)
        .then(response => response.text())
        .then(markdown => {
            const pdf = new jsPDF();
            pdf.text(markdown, 10, 10);
            pdf.save("Artur_Mudrykh_CV.pdf");
        })
        .catch(error => console.error("Loading error MD:", error));
}
