# 🧾 Bank Transaction Extractor

A full-stack web application to extract bank transaction data from uploaded PDFs or image files using OCR (Optical Character Recognition) and regular expressions.

---

## 🚀 Features

- Upload PDF/image-based bank statements
- Extracts transaction data using pytesseract and regex
- Backend: Flask with image processing
- Frontend: React (Vite) for UI
- CORS-enabled API for frontend-backend communication

---

## 🛠️ Tech Stack

**Frontend**  
- React  
- Vite  
- Tailwind CSS *(optional)*

**Backend**  
- Flask  
- Flask-CORS  
- pytesseract  
- pdf2image

---

## 🗂️ Project Structure

PdfExtraction/
│
├── Backend/
│ ├── app.py # Flask app entry point
│ ├── Logic.py # OCR and regex logic
│ ├── uploads/ # Uploaded PDF/images
│ └── requirements.txt # Python dependencies
│
└── Frontend/
├── TransactionExtractor/
│ ├── src/
│ ├── vite.config.js
│ ├── package.json
│ └── index.html


---

## ⚙️ Setup Instructions

### ✅ Backend Setup

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py

Make sure Tesseract is installed on your system:
Ubuntu

sudo apt update
sudo apt install tesseract-ocr

✅ Frontend Setup

cd Frontend/TransactionExtractor
npm install
npm run dev

⚠️ Limitations

    The app works only on specific types of bank statement images or PDFs.
    You will need to modify the regex in Logic.py to support other formats.

    