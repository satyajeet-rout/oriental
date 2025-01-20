import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from 'react-router-dom';

import Layout from './Pages/Layout';
import PDFProcessor from './Pages/PdfProcessor';


import DocumentContainer from './components/document-management/DocumentContainer';
import MissingDocsDashboard from './components/document-management/MissingDocsDashboard';







const App = () => {
  // Define the Router
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Layout />}>
          <Route
            path="/my-files"
            element={

              <DocumentContainer />
             
            }
          />

          <Route
            path="/new-workflow"
            element={
              <PDFProcessor />
            }
          />
          <Route
            path="/"
            element={
              
              // <PDFUploaderPage />
              <MissingDocsDashboard />
             
            }
          />
          
         
          
        </Route>
        
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

// Render the App
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

