from flask import Flask, request, jsonify
from flask_cors import CORS
from pdf2image import convert_from_path
import pytesseract
import os
import re
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Regex pattern for transaction
pattern = re.compile(
    r"(?P<Date>\d{4}-\d{2}-\d{2})\s+"
    r"(?P<Description>[A-Za-z0-9\-.,& ]+?)\s+"
    r"(?:(?P<Ref>\d{3,5})\s+)?"
    r"(?:(?P<Withdrawals>\d{1,3}(?:,\d{3})*\.\d{2})\s+)?"
    r"(?:(?P<Deposits>\d{1,3}(?:,\d{3})*\.\d{2})\s+)?"
    r"(?P<Balance>-?\d{1,3}(?:,\d{3})*\.\d{2})"
)

@app.route('/extract', methods=['POST'])
def extract_transactions():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    pages = convert_from_path(filepath)
    transactions = []

    for page in pages:
        text = pytesseract.image_to_string(page)
        for match in pattern.finditer(text):
            txn = {
                "Date": match.group("Date"),
                "Description": match.group("Description").strip(),
                "Ref": match.group("Ref") or "",
                "Withdrawals": match.group("Withdrawals") or "",
                "Deposits": match.group("Deposits") or "",
                "Balance": match.group("Balance"),
            }
            transactions.append(txn)

    return jsonify(transactions)

if __name__ == '__main__':
    app.run(debug=True)
