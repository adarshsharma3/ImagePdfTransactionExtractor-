from pdf2image import convert_from_path
import pytesseract
import re

# Step 1: Convert PDF pages to images
pages = convert_from_path("imageBasedPdf.pdf")  # Update your PDF filename

all_transactions = []

# Step 2: Improved regex to handle optional fields and spacing
pattern = re.compile(
    r"(?P<Date>\d{4}-\d{2}-\d{2})\s+"                     # Date
    r"(?P<Description>[A-Za-z0-9\-.,& ]+?)\s+"            # Description (non-greedy)
    r"(?:(?P<Ref>\d{3,5})\s+)?"                           # Optional Reference
    r"(?:(?P<Withdrawals>\d{1,3}(?:,\d{3})*\.\d{2})\s+)?" # Optional Withdrawals
    r"(?:(?P<Deposits>\d{1,3}(?:,\d{3})*\.\d{2})\s+)?"    # Optional Deposits
    r"(?P<Balance>-?\d{1,3}(?:,\d{3})*\.\d{2})"           # Balance
)

# Step 3: Loop through each page and extract text
for i, page in enumerate(pages):
    text = pytesseract.image_to_string(page)
    print(f"\n--- Page {i + 1} Text ---\n{text}")

    matches = pattern.finditer(text)
    print("\n--- Extracted Transactions ---")
    
    found = False
    for match in matches:
        txn = {
            "Date": match.group("Date"),
            "Description": match.group("Description").strip(),
            "Ref": match.group("Ref") or "",
            "Withdrawals": match.group("Withdrawals") or "",
            "Deposits": match.group("Deposits") or "",
            "Balance": match.group("Balance"),
        }
        all_transactions.append(txn)
        print(txn)
        found = True
    
    if not found:
        print("❌ No transactions matched on this page.")