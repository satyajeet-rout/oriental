import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Trash2, AlertCircle, FileText, CheckCircle, X, RefreshCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PDFViewer = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/pdfs`;

  const fetchPDFs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching PDFs from:', API_URL);
      const response = await fetch(API_URL);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched PDFs:', data);
      
      setPdfs(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to load PDFs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPDFs();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleView = async (id) => {
    try {
      window.open(`${API_URL}/${id}/view`, '_blank');
    } catch (err) {
      setError('Failed to view PDF. Please try again later.');
    }
  };

  const handleDelete = async (id, name) => {
    setDeleteDialogOpen(false);
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete PDF');
      }

      setSuccessMessage(`"${name}" has been successfully deleted`);
      fetchPDFs();
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Failed to delete PDF: ${err.message}`);
    }
  };

  const confirmDelete = (pdf) => {
    setSelectedPdf(pdf);
    setDeleteDialogOpen(true);
  };

  const handleRefresh = () => {
    fetchPDFs();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin mr-2">
          <FileText className="h-6 w-6" />
        </div>
        <p>Loading PDFs...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              PDF Document Manager
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
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
            <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <p>{successMessage}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSuccessMessage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company Type</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Invoice Numbers</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pdfs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No PDFs found. Upload some PDFs to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  pdfs.map((pdf) => (
                    <TableRow key={pdf._id}>
                      <TableCell className="font-medium">{pdf.name}</TableCell>
                      <TableCell>{pdf.companyType}</TableCell>
                      <TableCell>{pdf.categories?.join(', ') || '-'}</TableCell>
                      <TableCell>{pdf.invoice_numbers?.join(', ') || '-'}</TableCell>
                      <TableCell>{pdf.company_name || '-'}</TableCell>
                      <TableCell>
                        {new Date(pdf.dateCreated).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(pdf._id)}
                            className="text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(pdf)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the PDF "{selectedPdf?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(selectedPdf?._id, selectedPdf?.name)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PDFViewer;