import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  PictureAsPdf as PdfIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  DataObject as JsonIcon,
} from '@mui/icons-material';
import { Document, Page, pdfjs } from 'react-pdf';

// Initialize PDF.js worker
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;
}

interface DocumentComparisonViewerProps {
  open: boolean;
  onClose: () => void;
  document: {
    id: string;
    name: string;
    originalUrl?: string;
    extractedUrl?: string;
    jsonUrl?: string;
    size: string;
    uploadDate: string;
    status: string;
    url: string;
    type?: string;
    category?: string;
  };
}

const DocumentComparisonViewer: React.FC<DocumentComparisonViewerProps> = ({
  open,
  onClose,
  document: doc
}) => {
  const [jsonContent, setJsonContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    if (open && doc) {
      loadDocumentContent();
      // Set the PDF URL with the full path
      const url = doc.originalUrl || doc.url;
      if (url) {
        // For development server, ensure we're using the correct port and public path
        setPdfUrl(url);
        console.log('Loading PDF from URL:', url);
        
        // Verify if the file is accessible
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
          })
          .then(blob => {
            if (blob.type !== 'application/pdf') {
              console.warn('Warning: Resource is not a PDF:', blob.type);
            }
          })
          .catch(error => {
            console.error('Error checking PDF file:', error);
            setError('Cannot access the PDF file. Please check if the file exists in the public folder.');
          });
      }
    }
  }, [open, doc]);

  const loadDocumentContent = async () => {
    setLoading(true);
    try {
      // Load the actual JSON data from the file
      if (doc?.jsonUrl) {
        const response = await fetch(doc.jsonUrl);
        if (response.ok) {
          const jsonData = await response.json();
          setJsonContent(jsonData);
        }
      }
    } catch (error) {
      console.error('Error loading document content:', error);
      setError('Failed to load document content');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    console.error('PDF URL:', pdfUrl);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Try to fetch the PDF directly to check if it's accessible
    fetch(pdfUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('PDF file is accessible, but failed to load in viewer');
        setError('PDF viewer failed to load the file. Please try downloading it instead.');
      })
      .catch(fetchError => {
        console.error('Failed to fetch PDF:', fetchError);
        setError('Cannot access the PDF file. Please make sure the file exists and try again.');
      });
    
    setPdfLoading(false);
  };

  const onDocumentLoadProgress = () => {
    setPdfLoading(true);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const renderPdfViewer = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
        <Box sx={{ width: '100%', height: '600px', position: 'relative' }}>
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            onError={(e) => {
              console.error('Error loading PDF in object tag:', e);
              setError('Failed to load PDF file. Please try downloading it instead.');
            }}
          >
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="error" gutterBottom>
                {error || 'Error loading PDF file'}
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleDownload(pdfUrl, `${doc.name}`)}
                startIcon={<DownloadIcon />}
              >
                Download Instead
              </Button>
            </Box>
          </object>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => setZoomLevel(prev => Math.max(prev - 10, 50))}>
            <ZoomOutIcon />
          </IconButton>
          <Typography>
            {zoomLevel}%
          </Typography>
          <IconButton onClick={() => setZoomLevel(prev => Math.min(prev + 10, 200))}>
            <ZoomInIcon />
          </IconButton>
        </Box>
      </Box>
    );
  };

  // Helper function to format field names from camelCase
  const formatFieldName = (field: string): string => {
    return field
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to format values based on their type
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      return value.map(item => formatValue(item)).join(', ');
    }
    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([k, v]) => `${formatFieldName(k)}: ${formatValue(v)}`)
        .join(', ');
    }
    return String(value);
  };

  // Render a nested table for object values
  const renderNestedTable = (data: any, level: number = 0) => {
    if (!data || typeof data !== 'object') {
      return <Typography>{formatValue(data)}</Typography>;
    }

    return (
      <TableContainer 
        component={Paper} 
        variant="outlined" 
        sx={{ 
          mb: 1,
          backgroundColor: level === 0 ? 'background.paper' : 'background.default'
        }}
      >
        <Table size="small">
          <TableBody>
            {Object.entries(data).map(([field, value]) => (
              <TableRow key={field}>
                <TableCell 
                  component="th" 
                  scope="row" 
                  sx={{ 
                    width: '30%',
                    fontWeight: 'medium',
                    color: 'text.primary',
                    borderBottom: '1px solid rgba(224, 224, 224, 0.4)'
                  }}
                >
                  {formatFieldName(field)}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.4)' }}>
                  {typeof value === 'object' && value !== null ? (
                    Array.isArray(value) ? (
                      <Box sx={{ '& > *:not(:last-child)': { mb: 1 } }}>
                        {value.map((item, index) => (
                          <Box key={index} sx={{ mb: 1 }}>
                            {renderNestedTable(item, level + 1)}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      renderNestedTable(value, level + 1)
                    )
                  ) : (
                    formatValue(value)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderExtractedTable = () => {
    if (!jsonContent) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No extracted data available
          </Typography>
        </Box>
      );
    }

    const tableData = Object.entries(jsonContent).map(([category, data]) => {
      return (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            {formatFieldName(category)}
          </Typography>
          {renderNestedTable(data)}
        </Box>
      );
    });

    return <>{tableData}</>;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PdfIcon />
          <Typography variant="h6" component="div">
            Document Comparison: {doc?.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => setZoomLevel(prev => Math.max(prev - 10, 50))} size="small">
            <ZoomOutIcon />
          </IconButton>
          <Typography variant="body2">{zoomLevel}%</Typography>
          <IconButton onClick={() => setZoomLevel(prev => Math.min(prev + 10, 200))} size="small">
            <ZoomInIcon />
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Left Panel - PDF Viewer */}
          <Box sx={{ width: '50%', borderRight: 1, borderColor: 'divider', minWidth: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Original Document
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Size: {doc?.size} • Uploaded: {doc?.uploadDate}
                </Typography>
              </Box>
              {error ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="error" gutterBottom>
                    {error}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleDownload(pdfUrl, `${doc.name}`)}
                    startIcon={<DownloadIcon />}
                  >
                    Download Instead
                  </Button>
                </Box>
              ) : (
                renderPdfViewer()
              )}
            </Box>
          </Box>

          {/* Right Panel - Extracted Content */}
          <Box sx={{ width: '50%', p: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Extracted Content
            </Typography>
            {loading ? (
              <LinearProgress />
            ) : (
              renderExtractedTable()
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(doc?.originalUrl || doc?.url || '', `${doc?.name}-original`)}
          >
            Download Original
          </Button>
          {doc?.extractedUrl && (
            <Button
              startIcon={<PdfIcon />}
              onClick={() => handleDownload(doc.extractedUrl!, `${doc?.name}-extracted`)}
            >
              Download Extracted
            </Button>
          )}
          {doc?.jsonUrl && (
            <Button
              startIcon={<JsonIcon />}
              onClick={() => handleDownload(doc.jsonUrl!, `${doc?.name}-structured`)}
            >
              Download Structured Data
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentComparisonViewer;
 // http://localhost:3001/sample-documents/cases/case-006-rebecca-hardin/prior-auth-form-extracted.json