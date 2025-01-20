import React from 'react';
import { Folder, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

const CompanyList = ({ companies, type, onBack, onSelectCompany }) => {
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
        <h1 className="text-2xl font-bold">{type === 'import' ? 'Import' : 'Export'} Folders</h1>
      </div>

      {companies.length === 0 ? (
        <Card className="p-4">
          <p className="text-gray-500">No companies found</p>
        </Card>
      ) : (
        companies.map(company => (
          <Card 
            key={company}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectCompany(company)}
          >
            <div className="flex items-center space-x-3">
              <Folder className="w-6 h-6 text-green-500" />
              <span className="font-medium">{company}</span>
            </div>
            <span className="text-gray-400">→</span>
          </Card>
        ))
      )}
    </div>
  );
};

export default CompanyList;