import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, CheckCircle, Trash2, X, Eye } from 'lucide-react';
import DocumentStatusTable from './DocumentStatustable';

const PDFProcessor = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [processedCategories, setProcessedCategories] = useState({});
  const [companyType, setCompanyType] = useState('');

  const handleFileChange = (e) => {
    // Clear all previous messages and results
    setSuccessMessage('');
    setError(null);
    setResults({});
    setProcessedCategories({});
    
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    const newFiles = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9)
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    if (validFiles.length !== selectedFiles.length) {
      setError('Some files were skipped. Only PDF files are allowed.');
    }
  };

  const viewPDF = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
    setResults(prev => {
      const newResults = { ...prev };
      delete newResults[id];
      return newResults;
    });
    setProcessedCategories(prev => {
      const newCategories = { ...prev };
      delete newCategories[id];
      return newCategories;
    });
  };

  const resetForm = () => {
    setFiles([]);
    setCompanyType('');
    const fileInput = document.getElementById('pdf-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyType) {
      setError('Please select a company type');
      return;
    }

    setProcessing(true);
    setError(null);

    const processPromises = files.map(async ({ file, id }) => {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('companyType', companyType);

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error processing ${file.name}`);
        }

        const data = await response.json();
        
        // Handle both successful and failed uploads
        if (data.success && data.success.length > 0) {
          const pdfData = data.success[0];  // Get the first successful upload
          const categories = pdfData.categories || [];
          
          setProcessedCategories(prev => ({
            ...prev,
            [id]: categories
          }));

          setSuccessMessage(prev => {
            const newMessage = `${file.name} processed successfully (Categories: ${categories.join(', ')})`;
            return prev ? `${prev}\n${newMessage}` : newMessage;
          });
          
          setResults(prev => ({
            ...prev,
            [id]: { 
              status: 'completed', 
              data: pdfData.externalResponse,
              savedPDF: pdfData
            }
          }));
        } else if (data.failed && data.failed.length > 0) {
          // Handle failed upload due to missing Party's Invoice
          const failedUpload = data.failed[0];
          throw new Error(failedUpload.message || 'Failed to process PDF');
        }
      } catch (err) {
        const errorMessage = err.message === 'Failed to fetch' 
          ? 'Server connection error' 
          : err.message;
        
        setResults(prev => ({
          ...prev,
          [id]: { status: 'error', error: errorMessage }
        }));

        setError(prev => {
          const newError = `${file.name}: ${errorMessage}`;
          return prev ? `${prev}\n${newError}` : newError;
        });
      }
    });

    await Promise.all(processPromises);
    setProcessing(false);
    
    // Only reset if all files were processed successfully
    if (!Object.values(results).some(result => result?.status === 'error')) {
      resetForm();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Infrahive Data Intel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-type">Company Type</Label>
              <Select value={companyType} onValueChange={setCompanyType}>
                <SelectTrigger id="company-type">
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf-upload">Upload Documents</Label>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              {files.map(({ file, id }) => (
                <div key={id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{file.name}</div>
                    {processedCategories[id] && (
                      <div className="text-sm text-green-600 mt-1">
                        Categories: {processedCategories[id].join(', ')}
                      </div>
                    )}
                    {results[id]?.status === 'error' && (
                      <div className="text-sm text-red-600 mt-1">
                        Error: {results[id].error}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => viewPDF(file)}
                      className="text-blue-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {files.length > 0 && (
              <Button 
                type="submit" 
                disabled={processing}
                className="w-full"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing PDFs...
                  </>
                ) : (
                  `Process ${files.length} PDF${files.length !== 1 ? 's' : ''}`
                )}
              </Button>
            )}

            {/* {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md flex items-center justify-between">
                {error.split('\n').map((err, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <X className="h-4 w-4 flex-shrink-0" />
                    <p>{err}</p>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-4 bg-green-50 text-green-600 rounded-md">
                {successMessage.split('\n').map((message, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <p>{message}</p>
                  </div>
                ))}
              </div>
            )} */}

            
          </form>
          {/* <DocumentStatusTable error={error} successMessage={successMessage} /> */}
        </CardContent>
       
      </Card>
      <Card>
        <DocumentStatusTable error={error} successMessage={successMessage} />
      </Card>
    </div>
  );
};

export default PDFProcessor;
