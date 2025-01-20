import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MainLayout from './MainLayout';
import CompanyList from './CompanyList';
import InvoiceList from './InvoiceList';
import DocumentList from './DocumentList';
import { current } from '@reduxjs/toolkit';

const DocumentContainer = () => {
  const [view, setView] = useState('main');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentType, setCurrentType] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/${docId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddDocument = async (category, file) => {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('category', category);
    formData.append('companyType', currentType);
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/invoice/${currentInvoice}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload document');
    }
    
    await fetchDocuments();
  };

  const getOrganizedData = () => {
    const organizedDocs = documents.reduce((acc, doc) => {
      if (!doc.company_name) return acc;
      
      if (!acc[doc.company_name]) {
        acc[doc.company_name] = {};
      }
      
      // Combine all invoice numbers into a single key
      const invoiceKey = doc.invoice_numbers.sort().join(', ');
      
      if (!acc[doc.company_name][invoiceKey]) {
        acc[doc.company_name][invoiceKey] = [];
      }
      
      if (doc.extracted_pdfs) {
        acc[doc.company_name][invoiceKey].push(...doc.extracted_pdfs.map(pdf => ({
          ...pdf,
          docId: doc._id,
        })));
      }
      
      return acc;
    }, {});

    return organizedDocs;
  };

  const getCompanies = () => {
    const organizedData = getOrganizedData();
    return Object.keys(organizedData).filter(company => 
      documents.some(doc => 
        doc.company_name === company && 
        doc.companyType === currentType
      )
    );
  };

  const getInvoices = (company) => {
    const organizedData = getOrganizedData();
    return Object.keys(organizedData[company] || {});
  };

  const getDocuments = (company, invoice) => {
    const organizedData = getOrganizedData();
    return organizedData[company]?.[invoice] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading documents...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>
            Error: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'main':
        return (
          <MainLayout 
            onSelectType={(type) => {
              setCurrentType(type);
              setView('companies');
            }} 
          />
        );
      
      case 'companies':
        return (
          <CompanyList 
            companies={getCompanies()}
            type={currentType}
            onBack={() => {
              setCurrentType(null);
              setView('main');
            }}
            onSelectCompany={(company) => {
              setCurrentCompany(company);
              setView('invoices');
            }}
          />
        );
      
      case 'invoices':
        return (
          <InvoiceList 
            invoices={getInvoices(currentCompany)}
            companyName={currentCompany}
            documents={documents}
            onBack={() => {
              setCurrentCompany(null);
              setView('companies');
            }}
            onSelectInvoice={(invoice) => {
              setCurrentInvoice(invoice);
              setView('documents');
            }}
          />
        );
      
      case 'documents':
        return (
          <DocumentList 
            documents={getDocuments(currentCompany, currentInvoice)}
            invoiceNumber={currentInvoice}
      
            onBack={() => {
              setCurrentInvoice(null);
              setView('invoices');
            }}
            onDelete={handleDelete}
            onAddDocument={handleAddDocument}
            isDeleting={isDeleting}
          />
        );
      
      default:
        return <MainLayout />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {renderView()}
    </div>
  );
};

export default DocumentContainer;