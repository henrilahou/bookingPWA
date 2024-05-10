// displayQRCode.js
export function displayQRCode(qrData) {
    try {
        const typeNumber = 4;
        const errorCorrectionLevel = 'L';
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(qrData);
        qr.make();

        // Create the QR code image tag with custom size
        const qrImgTag = qr.createImgTag(8); // The number 8 represents the pixel size for each module of the QR code
        document.getElementById('qr-code').innerHTML = qrImgTag;

        // Optionally, style the QR code directly via CSS
        const qrImg = document.querySelector('#qr-code img');
        if (qrImg) {
            qrImg.style.width = '200px';  // Adjust width
            qrImg.style.height = '200px'; // Adjust height
        }
    } catch (error) {
        console.error("Failed to display QR Code:", error);
    }
}
