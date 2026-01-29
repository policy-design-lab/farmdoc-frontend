import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadAsPDF = async (element, filename = "download.pdf") => {
	if (!element) {
		console.error("No element provided for PDF download");
		return;
	}
	try {
		const canvas = await html2canvas(element, {
			scale: 2,
			useCORS: true,
			logging: false,
			windowWidth: element.scrollWidth,
			windowHeight: element.scrollHeight,
		});
		const imgData = canvas.toDataURL("image/png");
		const pdf = new jsPDF({
			orientation: canvas.width > canvas.height ? "landscape" : "portrait",
			unit: "px",
			format: [canvas.width, canvas.height],
		});
		pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
		pdf.save(filename);
	}
	catch (error) {
		console.error("Error generating PDF:", error);
	}
};
