import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RotateCw, Loader2, FileText, Building2, ArrowUpDown } from 'lucide-react';
import axios from 'axios';
import DocumentList from './DocumentList';

const REQUIRED_CATEGORIES = {
  import: [
    "Party's Invoice",
    "Air Way Bill",
    "Bill of Entry",
    "Custom duty Invoice",
    "Freight Invoice",
    "Clearing Agent Invoice"
  ],
  export: [
    "Custom Invoice",
    "Bill of Lading",
    "Shipping Bill",
    "Freight Invoice",
    "Tax Invoice",
    "Bilty",
    "Clearing Agent Invoice",
    "Purchase Order",
    "Eway Bill"
  ]
};

const MissingDocsDashboard = () => {
  const [allPdfs, setAllPdfs] = useState({ import: [], export: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCompanyType, setActiveCompanyType] = useState('import');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [stats, setStats] = useState({
    totalPdfs: 0,
    totalProcessedDocs: 0,
    typePdfs: { import: 0, export: 0 },
    uniqueCompanies: 0,
    companyList: [],
    categoryCounts: { import: {}, export: {} }
  });

  const calculateStats = (data) => {
    // Initialize category counts with zeros for both types
    const categoryCounts = {
      import: Object.fromEntries(REQUIRED_CATEGORIES.import.map(cat => [cat, 0])),
      export: Object.fromEntries(REQUIRED_CATEGORIES.export.map(cat => [cat, 0]))
    };

    // Separate PDFs by type
    const importPdfs = data.filter(pdf => pdf.companyType === 'import');
    const exportPdfs = data.filter(pdf => pdf.companyType === 'export');
    
    // Get unique companies
    const uniqueCompanies = new Set(
      data
        .filter(pdf => pdf.company_name)
        .map(pdf => pdf.company_name.trim().toLowerCase())
    );
    
    // Count documents by category for each type
    let totalProcessedDocs = 0;

    [importPdfs, exportPdfs].forEach((pdfs, idx) => {
      const type = idx === 0 ? 'import' : 'export';
      pdfs.forEach(pdf => {
        if (pdf.extracted_pdfs) {
          totalProcessedDocs += pdf.extracted_pdfs.length;
          pdf.extracted_pdfs.forEach(doc => {
            if (doc.category && categoryCounts[type][doc.category] !== undefined) {
              categoryCounts[type][doc.category]++;
            }
          });
        }
      });
    });

    setStats({
      totalPdfs: data.length,
      totalProcessedDocs,
      typePdfs: {
        import: importPdfs.length,
        export: exportPdfs.length
      },
      uniqueCompanies: uniqueCompanies.size,
      companyList: Array.from(uniqueCompanies),
      categoryCounts
    });

    setAllPdfs({
      import: importPdfs,
      export: exportPdfs
    });
  };

  const fetchPdfs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs`);
      calculateStats(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch PDFs: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const findMissingCategories = (pdf) => {
    const requiredCats = REQUIRED_CATEGORIES[pdf.companyType || activeCompanyType];
    const existingCategories = new Set([
      ...(pdf.categories || []),
      ...(pdf.extracted_pdfs || []).map(doc => doc.category)
    ]);
    return requiredCats.filter(category => !existingCategories.has(category));
  };

  const pdfsWithMissingDocs = allPdfs[activeCompanyType].filter(pdf => {
    const missingCategories = findMissingCategories(pdf);
    return missingCategories.length > 0;
  });

  const handleViewDocuments = (invoiceNumber) => {
    setSelectedInvoice(invoiceNumber);
  };

  const handleBack = () => {
    setSelectedInvoice(null);
  };

  if (selectedInvoice) {
    return <DocumentList 
      invoiceNumber={selectedInvoice}
      onBack={handleBack}
    />;
  }

  if (isLoading && !stats.totalPdfs) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
            <h1 className="text-2xl font-bold m-auto">Overview Dashboard</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Processed Documents</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalProcessedDocs}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Invoice folders</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalPdfs}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Import Invoice folders</h3>
          <p className="text-2xl font-bold mt-2">{stats.typePdfs.import}</p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Export Invoice folders</h3>
          <p className="text-2xl font-bold mt-2">{stats.typePdfs.export}</p>
        </Card>

        {/* <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Unique Companies</h3>
          <p className="text-2xl font-bold mt-2">{stats.uniqueCompanies}</p>
        </Card> */}

        
      </div>

      {/* Registered Companies */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Registered Companies :- {stats.uniqueCompanies}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.companyList.map((company, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium capitalize">{company}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Distribution */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Document Category Distribution</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={activeCompanyType === 'import' ? 'default' : 'outline'}
              onClick={() => setActiveCompanyType('import')}
              className="flex items-center space-x-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Import</span>
            </Button>
            <Button
              variant={activeCompanyType === 'export' ? 'default' : 'outline'}
              onClick={() => setActiveCompanyType('export')}
              className="flex items-center space-x-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {REQUIRED_CATEGORIES[activeCompanyType].map(category => (
            <div key={category} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{category}</p>
                <p className="text-2xl font-bold">
                  {stats.categoryCounts[activeCompanyType][category] || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Missing Documents Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Missing Documents Dashboard</h2>
            <p className="text-gray-500 mt-1">
              Showing {pdfsWithMissingDocs.length} {activeCompanyType} PDFs with missing essential documents
            </p>
          </div>
          <Button 
            onClick={fetchPdfs} 
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {pdfsWithMissingDocs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No PDFs with missing documents found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Invoice Numbers</TableHead>
                  <TableHead>Missing Categories</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pdfsWithMissingDocs.map((pdf) => (
                  <TableRow key={pdf._id}>
                    <TableCell className="font-medium">{pdf.company_name}</TableCell>
                    <TableCell>
                      {pdf.invoice_numbers?.length > 0 
                        ? pdf.invoice_numbers.join(', ') 
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside space-y-1">
                        {findMissingCategories(pdf).map((category, idx) => (
                          <li key={idx} className="text-red-500 text-sm">
                            {category}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleViewDocuments(pdf.invoice_numbers?.[0])}
                        variant="outline"
                        className="hover:bg-blue-50"
                        disabled={!pdf.invoice_numbers?.length}
                      >
                        View Documents
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MissingDocsDashboard;