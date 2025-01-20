import React, { useState, useEffect } from 'react';
import { ChevronDown, Eye, Trash2, Plus, Save, X } from 'lucide-react';
import axios from 'axios';

const PDFWorkflow = () => {
  const [pdfs, setPdfs] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [categories, setCategories] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState({});

  useEffect(() => {
    fetchPDFs();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (openDropdownId && !event.target.closest('.category-dropdown')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  const fetchPDFs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/`);
      const data = await response.json();
      const sortedData = data.sort((a, b) => {
        if (sortOrder === 'desc') {
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        }
        return new Date(a.dateCreated) - new Date(b.dateCreated);
      });
      
      const initialSelectedCategories = {};
      const initialUnsavedChanges = {};
      
      sortedData.forEach(pdf => {
        const categoryArray = pdf.category ? pdf.category.split(',').map(cat => cat.trim()) : [];
        initialSelectedCategories[pdf._id] = categoryArray;
        initialUnsavedChanges[pdf._id] = false;
      });
      
      setSelectedCategories(initialSelectedCategories);
      setHasUnsavedChanges(initialUnsavedChanges);
      setPdfs(sortedData);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
      const data = await response.json();
      // Filter out any categories that contain commas (combined categories)
      const individualCategories = data.filter(cat => !cat.name.includes(','));
      setCategories(individualCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDeletePDF = async (id) => {
    if (window.confirm('Are you sure you want to delete this PDF?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/${id}`);
        setPdfs(pdfs.filter(pdf => pdf._id !== id));
      } catch (error) {
        console.error('Error deleting PDF:', error);
      }
    }
  };

  const handleCategoryChange = (pdfId, categoryName) => {
    setSelectedCategories(prev => {
      const currentCategories = prev[pdfId] || [];
      let newCategories;
      
      if (currentCategories.includes(categoryName)) {
        newCategories = currentCategories.filter(cat => cat !== categoryName);
      } else {
        newCategories = [...currentCategories, categoryName];
      }
      
      setHasUnsavedChanges(prev => ({
        ...prev,
        [pdfId]: true
      }));
      
      return {
        ...prev,
        [pdfId]: newCategories
      };
    });
  };

  const handleSaveCategories = async (pdfId) => {
    try {
      const categoryString = selectedCategories[pdfId].join(', ');
      
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/${pdfId}/category`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: categoryString
        })
      });

      setHasUnsavedChanges(prev => ({
        ...prev,
        [pdfId]: false
      }));

      await fetchPDFs();
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const handleAddCategory = async () => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory && !trimmedCategory.includes(',')) {
      // Check if category already exists (case-insensitive)
      const categoryExists = categories.some(
        cat => cat.name.toLowerCase() === trimmedCategory.toLowerCase()
      );
      
      if (!categoryExists) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: trimmedCategory })
          });
          setNewCategory('');
          await fetchCategories();
        } catch (error) {
          console.error('Error adding category:', error);
        }
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${categoryId}`, {
          method: 'DELETE'
        });
        await fetchCategories();
        
        // Remove the deleted category from all selected categories
        const updatedSelectedCategories = {};
        let hasChanges = false;
        
        Object.entries(selectedCategories).forEach(([pdfId, categories]) => {
          const deletedCategory = categories.find(cat => 
            categories.some(c => c._id === categoryId)
          );
          
          if (deletedCategory) {
            updatedSelectedCategories[pdfId] = categories.filter(cat => 
              cat._id !== categoryId
            );
            hasChanges = true;
          }
        });
        
        if (hasChanges) {
          setSelectedCategories(prev => ({
            ...prev,
            ...updatedSelectedCategories
          }));
          await fetchPDFs();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
      <div className="p-6 h-screen">
          <div className='text-[30px] font-bold ml-2'>My workflow</div>
      <div className="bg-gray-50 rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 font-medium text-gray-600">
          <div>File Name</div>
          <div>Categories</div>
          <div>Model ID</div>
          <div 
            className="cursor-pointer flex items-center gap-1" 
            onClick={() => {
              setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
              setPdfs(prev => [...prev].sort((a, b) => {
                if (sortOrder === 'asc') {
                  return new Date(b.dateCreated) - new Date(a.dateCreated);
                }
                return new Date(a.dateCreated) - new Date(b.dateCreated);
              }));
            }}
          >
            Date Created {sortOrder === 'desc' ? '↓' : '↑'}
          </div>
          <div>Actions</div>
        </div>

        {pdfs.map(pdf => (
          <div key={pdf._id} className="grid grid-cols-5 gap-4 p-4 border-t border-gray-200">
            <div className="truncate">{pdf.name}</div>
            <div className="relative category-dropdown">
              <button
                className="flex items-center justify-between w-full px-3 py-2 text-left bg-white border rounded-md hover:bg-gray-50"
                onClick={() => setOpenDropdownId(openDropdownId === pdf._id ? null : pdf._id)}
              >
                <span className="truncate">
                  {selectedCategories[pdf._id]?.join(', ') || 'Select categories'}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {openDropdownId === pdf._id && (
                <div className="absolute z-10 w-64 mt-1 bg-white border rounded-md shadow-lg">
                  <div className="p-3 border-b">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Add new category"
                        className="flex-1 px-2 py-1 border rounded"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddCategory();
                          }
                        }}
                      />
                      <button
                        onClick={handleAddCategory}
                        className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    {categories.map(category => (
                      <div key={category._id} className="flex items-center px-3 py-2 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          id={`${pdf._id}-${category.name}`}
                          checked={(selectedCategories[pdf._id] || []).includes(category.name)}
                          onChange={() => handleCategoryChange(pdf._id, category.name)}
                          className="mr-2"
                        />
                        <label htmlFor={`${pdf._id}-${category.name}`} className="flex-1">
                          {category.name}
                        </label>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="p-1 text-red-500 rounded hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {hasUnsavedChanges[pdf._id] && (
                    <div className="p-3 border-t">
                      <button
                        onClick={() => handleSaveCategories(pdf._id)}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-gray-500">{pdf.modelId}</div>
            <div className="text-gray-500">
              {new Date(pdf.dateCreated).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.open(`${import.meta.env.VITE_BACKEND_URL}/api/pdfs/view/${pdf._id}`)}
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
              >
                <Eye className="w-4 h-4" />
                View PDF
              </button>
              <button
                onClick={() => handleDeletePDF(pdf._id)}
                className="px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                title="Delete PDF"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFWorkflow;