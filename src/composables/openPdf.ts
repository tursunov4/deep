export function openPdf(pdfUrl: string | null | undefined) {
    if (!pdfUrl) {
        return;
    }
    window.open(pdfUrl, '_blank');
}
