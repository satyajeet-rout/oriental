import React, { useState } from 'react';
import { Folder, ArrowLeft, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const InvoiceList = ({ 
  invoices, 
  companyName, 
  onBack, 
  onSelectInvoice,
  documents,
  fetchDocuments // Add fetchDocuments prop
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (invoice, e) => {
    e.stopPropagation();
    setInvoiceToDelete(invoice);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (invoiceToDelete) {
      try {
        setIsDeleting(true);
        
        // Split the invoice string into individual invoice numbers
        const invoiceNumbers = invoiceToDelete.split(', ').map(num => num.trim());
        
        // Find documents that have ANY of these invoice numbers
        const documentsToDelete = documents.filter(doc => {
          return doc.company_name === companyName && 
                 doc.invoice_numbers.some(invoiceNum => 
                   invoiceNumbers.includes(invoiceNum)
                 );
        });

        // Delete each matching document
        for (const doc of documentsToDelete) {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/${doc._id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error(`Failed to delete document ${doc._id}`);
          }
        }

        // Fetch fresh documents after deletion
        await fetchDocuments();
        
        setIsDialogOpen(false);
        setInvoiceToDelete(null);
      } catch (error) {
        console.error('Error deleting documents:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold">{companyName}</h1>
      </div>

      {invoices.length === 0 ? (
        <Card className="p-4">
          <p className="text-gray-500">No invoices found</p>
        </Card>
      ) : (
        invoices.map(invoice => (
          <Card 
            key={invoice}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 relative group"
            onClick={() => onSelectInvoice(invoice)}
          >
            <div className="flex items-center space-x-3">
              <Folder className="w-6 h-6 text-blue-500" />
              <span className="font-medium">{invoice}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleDeleteClick(invoice, e)}
                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                disabled={isDeleting}
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <span className="text-gray-400">→</span>
            </div>
          </Card>
        ))
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all documents associated with invoice(s) {invoiceToDelete}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceList;