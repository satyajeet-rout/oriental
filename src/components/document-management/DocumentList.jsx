import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Eye, Trash2, Plus, RotateCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import UploadDialog from './UploadDialogue';
import axios from 'axios';

const REQUIRED_CATEGORIES = [
  "Party's Invoice",
  "Air Way Bill",
  "Bill of Entry",
  "Custom duty Invoice",
  "Freight Invoice",
  "Clearing Agent Invoice"
];

const DocumentList = ({ invoiceNumber, onBack }) => {
  const [documents, setDocuments] = useState([]);
  const [uploadCategory, setUploadCategory] = useState(null);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, doc: null });
  const [pdfData, setPdfData] = useState(null);

  // Parse invoice numbers into an array
  const invoiceNumbers = invoiceNumber.split(/[,\s]+/).map(num => num.trim()).filter(Boolean);

  // Fetch documents
  // const fetchDocuments = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);
      
  //     // Split invoice numbers and fetch each one
  //     const invoiceArray = invoiceNumber.split(/[,\s]+/).map(num => num.trim()).filter(Boolean);
      
  //     const allDocuments = [];
  //     let lastPdfData = null;

  //     // Fetch documents for each invoice number
  //     for (const invoice of invoiceArray) {
  //       try {
  //         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/extracted/${invoice}`);
  //         if (response.data && response.data.extracted_pdfs) {
  //           // Add invoice number to each document for reference
  //           const docsWithSource = response.data.extracted_pdfs.map(doc => ({
  //             ...doc,
  //             sourceInvoice: invoice
  //           }));
  //           allDocuments.push(...docsWithSource);
  //           lastPdfData = response.data;
  //         }
  //       } catch (err) {
  //         console.error(`Error fetching invoice ${invoice}:`, err);
  //       }
  //     }

  //     if (allDocuments.length === 0) {
  //       throw new Error('No documents found for any invoice number');
  //     }

  //     setDocuments(allDocuments);
  //     setPdfData(lastPdfData); // Store the last PDF data for reference
  //   } catch (err) {
  //     console.error('Fetch error:', err);
  //     setError('Failed to fetch documents');
  //     setDocuments([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchDocuments = async () => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Get only the first invoice number
    const invoiceArray = invoiceNumber.split(/[,\s]+/).map(num => num.trim()).filter(Boolean);
    const firstInvoice = invoiceArray[0];  // Take only the first invoice

    if (!firstInvoice) {
      throw new Error('No valid invoice number found');
    }

    // Fetch documents for the first invoice only
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/extracted/${firstInvoice}`);
    
    if (response.data && response.data.extracted_pdfs) {
      // Add invoice number to each document for reference
      const docsWithSource = response.data.extracted_pdfs.map(doc => ({
        ...doc,
        sourceInvoice: firstInvoice
      }));
      
      setDocuments(docsWithSource);
      setPdfData(response.data);
    } else {
      throw new Error('No documents found for invoice number');
    }

  } catch (err) {
    console.error('Fetch error:', err);
    setError('Failed to fetch documents');
    setDocuments([]);
  } finally {
    setIsLoading(false);
  }
};



  useEffect(() => {
    if (invoiceNumber) {
      fetchDocuments();
    }
  }, [invoiceNumber]);

  // Group documents by category
  const { documentsByCategory, otherDocuments } = documents.reduce((acc, doc, index) => {
    const matchingCategory = REQUIRED_CATEGORIES.find(
      category => doc.category && doc.category.toLowerCase() === category.toLowerCase()
    );
    
    const processedDoc = {
      ...doc,
      index,
      pdfId: pdfData?.pdf_id
    };

    if (matchingCategory) {
      if (!acc.documentsByCategory[matchingCategory]) {
        acc.documentsByCategory[matchingCategory] = [];
      }
      acc.documentsByCategory[matchingCategory].push(processedDoc);
    } else {
      acc.otherDocuments.push(processedDoc);
    }
    return acc;
  }, { documentsByCategory: {}, otherDocuments: [] });

  const renderDocumentList = (docs) => (
    <div className="space-y-4">
      {docs.map((doc, idx) => (
        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">{doc.category}</p>
              {/* {doc.pdf_range && (
                <p className="text-sm text-gray-600">Page Range: {doc.pdf_range}</p>
              )} */}
              {/* {doc.company_name && (
                <p className="text-sm text-gray-600">Company: {doc.company_name}</p>
              )} */}
              {doc.invoice_number && (
                <p className="text-sm text-gray-600">Invoice: {doc.invoice_number}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => handleViewDocument(doc)}
              variant="ghost"
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </Button>
            <Button
              onClick={() => handleDeleteClick(doc)}
              variant="ghost"
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const handleViewDocument = (doc) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}${doc.viewUrl}`;
      window.open(url, '_blank');
    } catch (err) {
      setError('Failed to view document');
    }
  };

  const handleDeleteClick = (doc) => {
    setDeleteDialog({ isOpen: true, doc });
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const doc = deleteDialog.doc;

      if (!doc.pdfId) {
        throw new Error('PDF ID not found');
      }

      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/${doc.pdfId}/extracted/${doc.index}`);
      
      setDeleteDialog({ isOpen: false, doc: null });
      await fetchDocuments();
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Failed to delete document: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadSuccess = async () => {
    await fetchDocuments();
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold">
            Invoice No:- {invoiceNumbers.join(', ')}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setUploadCategory("Custom duty Invoice")}
            className="flex items-center space-x-2 bg-red-500 text-white hover:bg-red-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add Missing Documents</span>
          </Button>
          <Button
            onClick={fetchDocuments}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-green-500 text-white hover:bg-green-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Required Categories */}
      {REQUIRED_CATEGORIES.map((category) => {
        const docs = documentsByCategory[category] || [];
        
        return (
          <Card key={category} className="p-4">
            <div className="mb-2">
              <h3 className="text-lg font-medium">{category}</h3>
              <div className="h-px bg-gray-200 my-2" />
            </div>
            
            {docs.length > 0 ? (
              renderDocumentList(docs)
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-300" />
                  <p className="text-sm text-red-500">Document Missing</p>
                </div>
                <button
                  onClick={() => setUploadCategory(category)}
                  className="flex items-center space-x-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            )}
          </Card>
        );
      })}

      {/* Other Documents */}
      {otherDocuments.length > 0 && (
        <Card className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-medium">Others</h3>
            <div className="h-px bg-gray-200 my-2" />
          </div>
          {renderDocumentList(otherDocuments)}
        </Card>
      )}

      <AlertDialog 
        open={deleteDialog.isOpen} 
        onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, doc: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the extracted PDF.
              {deleteDialog.doc && (
                <div className="mt-2 text-sm text-gray-500">
                  Category: {deleteDialog.doc.category}<br/>
                  Company: {deleteDialog.doc.company_name}<br/>
                  Page Range: {deleteDialog.doc.pdf_range}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UploadDialog
        isOpen={!!uploadCategory}
        onClose={() => setUploadCategory(null)}
        category={uploadCategory}
        invoiceNumber={invoiceNumber}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default DocumentList;