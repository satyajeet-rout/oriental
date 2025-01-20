import { useState } from 'react';

 const PDFUploaderPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [categories, setCategories] = useState([
    'Work', 'Personal', 'Finance', 'Academic', 'Other'
  ]);
  const [currentPage, setCurrentPage] = useState('uploader');
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Auto-categorization function
  const autoDetectCategory = (fileName) => {
    const lowercaseFileName = fileName.toLowerCase();
    if (lowercaseFileName.includes('invoice') || lowercaseFileName.includes('bill')) return 'Finance';
    if (lowercaseFileName.includes('report') || lowercaseFileName.includes('analysis')) return 'Work';
    if (lowercaseFileName.includes('resume') || lowercaseFileName.includes('cv')) return 'Personal';
    if (lowercaseFileName.includes('paper') || lowercaseFileName.includes('thesis')) return 'Academic';
    return 'Other';
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files) return;

    const newUploadedFiles = Array.from(files).map(file => ({
      uid: Math.random().toString(36).substr(2, 9),
      name: file.name,
      category: autoDetectCategory(file.name),
      file: file,
      modelId: `model-${Math.random().toString(36).substr(2, 6)}`,
      dateCreated: new Date().toISOString()
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
  };

  const handleCategoryChange = (fileUid, newCategory) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.uid === fileUid ? { ...file, category: newCategory } : file
      )
    );
  };

  const handleSubmit = () => {
    // Move uploaded files to processed files
    setProcessedFiles(uploadedFiles);
    // Clear uploaded files
    setUploadedFiles([]);
    // Navigate to PDF library page
    setCurrentPage('library');
  };

  // Category Management Functions
  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setNewCategory('');
      return updatedCategories;
    }
    return categories;
  };

  const removeCategory = (categoryToRemove) => {
    // Prevent removing the last category
    if (categories.length > 1) {
      const updatedCategories = categories.filter(cat => cat !== categoryToRemove);
      setCategories(updatedCategories);
      
      // Update files with this category to 'Other'
      const updateFileCategories = (files) => 
        files.map(file => 
          file.category === categoryToRemove ? { ...file, category: 'Other' } : file
        );

      setUploadedFiles(updateFileCategories);
      setProcessedFiles(updateFileCategories);

      return updatedCategories;
    }
    return categories;
  };

  // Update file category in processed files
  const updateProcessedFileCategory = (fileUid, newCategory) => {
    setProcessedFiles(prev => 
      prev.map(file => 
        file.uid === fileUid ? { ...file, category: newCategory } : file
      )
    );
  };

  // Render different pages based on current page state
  const renderPage = () => {
    switch(currentPage) {
      case 'uploader':
        return (
          <div className="p-4 max-w-4xl mx-auto space-y-4">
            {/* File Upload Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">PDF Uploader & Categorizer</h2>
                <button 
                  onClick={() => setIsEditingCategories(!isEditingCategories)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  {isEditingCategories ? 'Done' : 'Edit Categories'}
                </button>
              </div>

              {isEditingCategories && (
                <div className="mb-4 flex space-x-2">
                  <input 
                    type="text" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="border rounded px-2 py-1 flex-grow"
                  />
                  <button 
                    onClick={addNewCategory}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
              )}

              {isEditingCategories && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <div 
                      key={category} 
                      className="flex items-center bg-gray-100 px-2 py-1 rounded"
                    >
                      <span className="mr-2">{category}</span>
                      {category !== 'Other' && (
                        <button 
                          onClick={() => removeCategory(category)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-center w-full">
                <label 
                  htmlFor="pdf-upload" 
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg 
                      className="w-10 h-10 text-gray-500 mb-3" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF files only</p>
                  </div>
                  <input 
                    id="pdf-upload"
                    type="file" 
                    multiple 
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            {/* Uploaded Files Section */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Uploaded PDFs</h2>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div 
                      key={file.uid} 
                      className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex-grow mr-4 truncate">
                        <span className="font-medium">{file.name}</span>
                      </div>
                      <select 
                        value={file.category}
                        onChange={(e) => handleCategoryChange(file.uid, e.target.value)}
                        className="border rounded px-2 py-1 w-40"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Submit PDFs
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'library':
        return (
          <PDFDisplayPage 
            files={processedFiles} 
            categories={categories}
            onUpdateCategory={updateProcessedFileCategory}
            onAddCategory={addNewCategory}
            onRemoveCategory={removeCategory}
            onBackToUploader={() => setCurrentPage('uploader')}
          />
        );

      default:
        return null;
    }
  };

  return renderPage();
};

 const PDFDisplayPage = ({ 
  files, 
  categories, 
  onUpdateCategory, 
  onAddCategory,
  onRemoveCategory,
  onBackToUploader
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Filter files based on selected category
  const filteredFiles = selectedCategory === 'All' 
    ? files 
    : files.filter(file => file.category === selectedCategory);

  // Get unique categories from uploaded files
  const uniqueCategories = ['All', ...new Set(files.map(file => file.category))];

  const handleAddCategory = () => {
    const updatedCategories = onAddCategory(newCategory);
    if (updatedCategories !== categories) {
      setNewCategory('');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Uploaded PDF Library</h2>
          <div className="flex space-x-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-2 py-1 w-40"
            >
              {uniqueCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button 
              onClick={() => setIsEditingCategories(!isEditingCategories)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              {isEditingCategories ? 'Done' : 'Edit Categories'}
            </button>
            <button 
              onClick={onBackToUploader}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
            >
              Back to Uploader
            </button>
          </div>
        </div>

        {isEditingCategories && (
          <div className="mb-4 flex space-x-2">
            <input 
              type="text" 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="border rounded px-2 py-1 flex-grow"
            />
            <button 
              onClick={handleAddCategory}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
        )}

        {isEditingCategories && (
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <div 
                key={category} 
                className="flex items-center bg-gray-100 px-2 py-1 rounded"
              >
                <span className="mr-2">{category}</span>
                {category !== 'Other' && (
                  <button 
                    onClick={() => onRemoveCategory(category)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 ? (
          <p className="text-center text-gray-500">No PDFs in this category</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">File Name</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Model ID</th>
                  <th className="py-2 px-4 text-left">Date Created</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.uid} className="border-b">
                    <td className="py-2 px-4">{file.name}</td>
                    <td className="py-2 px-4">
                      <select 
                        value={file.category}
                        onChange={(e) => onUpdateCategory(file.uid, e.target.value)}
                        className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4">{file.modelId}</td>
                    <td className="py-2 px-4">{new Date(file.dateCreated).toLocaleString()}</td>
                    <td className="py-2 px-4">
                      <button 
                        onClick={() => {
                          // In a real app, this would open/download the PDF
                          window.open(URL.createObjectURL(file.file), '_blank');
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                      >
                        View PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};



export default PDFUploaderPage;

