import cv2

img = cv2.imread("qr.png")
detector = cv2.QRCodeDetector()
data, bbox, _ = detector.detectAndDecode(img)

if data:
    print("Decoded data:", data)
else:
    print("No QR code detected.")
