import { useState } from 'react';
import { Upload, FileText, DollarSign, Calendar, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function BankTransactionExtractor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setSuccess(false);
      setTransactions([]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(data);
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to extract transactions');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure your Flask backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `$${amount}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bank Transaction Extractor
          </h1>
          <p className="text-lg text-gray-600">
            Upload an image of your bank statement to extract transaction data
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                      <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-indigo-600 hover:text-indigo-500">
                    Click to upload
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-500">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
            </div>

            {file && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {file.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              <span>{loading ? 'Extracting...' : 'Extract Transactions'}</span>
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">Error</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          {success && transactions.length > 0 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700 font-medium">Success</span>
              </div>
              <p className="text-green-600 mt-1">
                Successfully extracted {transactions.length} transactions
              </p>
            </div>
          )}
        </div>

        {/* Results Table */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <DollarSign className="w-6 h-6" />
                <span>Extracted Transactions</span>
              </h2>
              <p className="text-indigo-100 mt-1">
                {transactions.length} transactions found
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Date</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Reference
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Withdrawals
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Deposits
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((txn, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(txn.Date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={txn.Description}>
                          {txn.Description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {txn.Ref || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        {txn.Withdrawals && (
                          <span className="text-red-600 font-medium">
                            -{formatCurrency(txn.Withdrawals)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        {txn.Deposits && (
                          <span className="text-green-600 font-medium">
                            +{formatCurrency(txn.Deposits)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium">
                        <span className={txn.Balance.startsWith('-') ? 'text-red-600' : 'text-gray-900'}>
                          {formatCurrency(txn.Balance)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Total transactions: {transactions.length}</span>
                <span>Data extracted from uploaded document</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}