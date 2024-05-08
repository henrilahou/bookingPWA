// displayQRCode.js
export function displayQRCode(qrData) {
    try {
        const typeNumber = 4;
        const errorCorrectionLevel = 'L';
        const qr = qrcode(typeNumber, errorCorrectionLevel); // Accessing qrcode directly from the global scope
        qr.addData(qrData);
        qr.make();
        document.getElementById('qr-code').innerHTML = qr.createImgTag();
    } catch (error) {
        console.error("Failed to display QR Code:", error);
    }
}
