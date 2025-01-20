import React from 'react';
import { Folder } from 'lucide-react';
import { Card } from '@/components/ui/card';

const MainLayout = ({ onSelectType }) => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">Document Management System</h1>
      
      <Card 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => onSelectType('import')}
      >
        <div className="flex items-center space-x-3">
          <Folder className="w-6 h-6 text-green-500" />
          <span className="font-medium">Import</span>
        </div>
        <span className="text-gray-400">→</span>
      </Card>
      
      <Card 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => onSelectType('export')}
      >
        <div className="flex items-center space-x-3">
          <Folder className="w-6 h-6 text-orange-500" />
          <span className="font-medium">Export</span>
        </div>
        <span className="text-gray-400">→</span>
      </Card>
    </div>
  );
};

export default MainLayout;