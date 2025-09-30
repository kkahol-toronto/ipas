import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import {
  Description as DocumentIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocIcon,
  CloudDownload as CloudDownloadIcon,
  Folder as FolderIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';

interface CaseDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'other';
  category: 'prior-auth' | 'medical-records' | 'imaging' | 'insurance' | 'clinical-notes';
  size: string;
  uploadDate: string;
  status: 'uploaded' | 'processing' | 'ready' | 'error';
  url: string;
}

interface CaseDocumentsProps {
  caseId: string;
}

const CaseDocuments: React.FC<CaseDocumentsProps> = ({ caseId }) => {
  // Get case-specific documents based on caseId
  const getCaseDocuments = (caseId: string): CaseDocument[] => {
    const caseFolder = `case-${caseId.padStart(3, '0')}`;
    
    // Map case IDs to specific case folders and documents
    const caseDocumentMap: Record<string, CaseDocument[]> = {
      '001': [
        {
          id: '1',
          name: 'Prior Authorization Request Form',
          type: 'pdf',
          category: 'prior-auth',
          size: '245 KB',
          uploadDate: '2024-12-15',
          status: 'ready',
          url: '/sample-documents/cases/case-001-john-doe/prior-auth-request-form.pdf'
        },
        {
          id: '2',
          name: 'Patient Medical History - John Doe',
          type: 'pdf',
          category: 'medical-records',
          size: '1.2 MB',
          uploadDate: '2024-12-15',
          status: 'ready',
          url: '/sample-documents/cases/case-001-john-doe/patient-medical-history.pdf'
        },
        {
          id: '3',
          name: 'MRI Brain Report',
          type: 'pdf',
          category: 'imaging',
          size: '890 KB',
          uploadDate: '2024-12-10',
          status: 'ready',
          url: '/sample-documents/cases/case-001-john-doe/mri-brain-report.pdf'
        },
        {
          id: '4',
          name: 'Insurance Card - BCBS',
          type: 'pdf',
          category: 'insurance',
          size: '156 KB',
          uploadDate: '2024-12-15',
          status: 'ready',
          url: '/sample-documents/cases/case-001-john-doe/insurance-card.pdf'
        },
        {
          id: '5',
          name: 'Physician Clinical Notes',
          type: 'pdf',
          category: 'clinical-notes',
          size: '678 KB',
          uploadDate: '2024-12-15',
          status: 'ready',
          url: '/sample-documents/cases/case-001-john-doe/physician-notes.pdf'
        }
      ],
      '002': [
        {
          id: '1',
          name: 'Prior Authorization Request Form',
          type: 'pdf',
          category: 'prior-auth',
          size: '267 KB',
          uploadDate: '2024-12-18',
          status: 'ready',
          url: '/sample-documents/cases/case-002-jane-smith/prior-auth-request-form.pdf'
        },
        {
          id: '2',
          name: 'Patient Medical History - Jane Smith',
          type: 'pdf',
          category: 'medical-records',
          size: '1.4 MB',
          uploadDate: '2024-12-18',
          status: 'ready',
          url: '/sample-documents/cases/case-002-jane-smith/patient-medical-history.pdf'
        },
        {
          id: '3',
          name: 'Stress Test Results',
          type: 'pdf',
          category: 'imaging',
          size: '1.1 MB',
          uploadDate: '2024-12-10',
          status: 'ready',
          url: '/sample-documents/cases/case-002-jane-smith/stress-test-results.pdf'
        },
        {
          id: '4',
          name: 'Insurance Card - Aetna',
          type: 'pdf',
          category: 'insurance',
          size: '189 KB',
          uploadDate: '2024-12-18',
          status: 'ready',
          url: '/sample-documents/cases/case-002-jane-smith/insurance-card.pdf'
        },
        {
          id: '5',
          name: 'Cardiology Consultation Notes',
          type: 'pdf',
          category: 'clinical-notes',
          size: '756 KB',
          uploadDate: '2024-12-18',
          status: 'ready',
          url: '/sample-documents/cases/case-002-jane-smith/cardiology-notes.pdf'
        }
      ],
      '003': [
        {
          id: '1',
          name: 'Prior Authorization Request Form',
          type: 'pdf',
          category: 'prior-auth',
          size: '289 KB',
          uploadDate: '2024-12-20',
          status: 'ready',
          url: '/sample-documents/cases/case-003-mike-johnson/prior-auth-request-form.pdf'
        },
        {
          id: '2',
          name: 'Patient Medical History - Mike Johnson',
          type: 'pdf',
          category: 'medical-records',
          size: '1.6 MB',
          uploadDate: '2024-12-20',
          status: 'ready',
          url: '/sample-documents/cases/case-003-mike-johnson/patient-medical-history.pdf'
        },
        {
          id: '3',
          name: 'MRI Knee Report',
          type: 'pdf',
          category: 'imaging',
          size: '1.3 MB',
          uploadDate: '2024-12-05',
          status: 'ready',
          url: '/sample-documents/cases/case-003-mike-johnson/mri-knee-report.pdf'
        },
        {
          id: '4',
          name: 'Insurance Card - UHC',
          type: 'pdf',
          category: 'insurance',
          size: '198 KB',
          uploadDate: '2024-12-20',
          status: 'ready',
          url: '/sample-documents/cases/case-003-mike-johnson/insurance-card.pdf'
        },
        {
          id: '5',
          name: 'Physical Therapy Notes',
          type: 'pdf',
          category: 'clinical-notes',
          size: '892 KB',
          uploadDate: '2024-12-20',
          status: 'ready',
          url: '/sample-documents/cases/case-003-mike-johnson/pt-notes.pdf'
        }
      ]
    };

    return caseDocumentMap[caseId] || caseDocumentMap['001']; // Default to case 001 if not found
  };

  const documents = getCaseDocuments(caseId);

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon color="error" />;
      case 'image':
        return <ImageIcon color="primary" />;
      case 'doc':
        return <DocIcon color="info" />;
      default:
        return <AttachFileIcon color="action" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prior-auth':
        return <DocumentIcon color="primary" />;
      case 'medical-records':
        return <FolderIcon color="success" />;
      case 'imaging':
        return <ImageIcon color="info" />;
      case 'insurance':
        return <CloudDownloadIcon color="warning" />;
      case 'clinical-notes':
        return <DocumentIcon color="secondary" />;
      default:
        return <AttachFileIcon color="action" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'processing':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'prior-auth':
        return 'Prior Authorization';
      case 'medical-records':
        return 'Medical Records';
      case 'imaging':
        return 'Imaging';
      case 'insurance':
        return 'Insurance';
      case 'clinical-notes':
        return 'Clinical Notes';
      default:
        return 'Other';
    }
  };

  const handleDownload = (caseDocument: CaseDocument) => {
    const link = document.createElement('a');
    link.href = caseDocument.url;
    link.download = caseDocument.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (caseDocument: CaseDocument) => {
    window.open(caseDocument.url, '_blank');
  };

  // Group documents by category
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, CaseDocument[]>);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Case Documents - #{caseId}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        All documents related to this prior authorization case. Click to view or download.
      </Typography>

      {Object.entries(groupedDocuments).map(([category, docs]) => (
        <Card key={category} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {getCategoryIcon(category)}
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                {getCategoryName(category)}
              </Typography>
              <Chip 
                label={`${docs.length} document${docs.length > 1 ? 's' : ''}`} 
                size="small" 
                color="primary" 
                sx={{ ml: 2 }}
              />
            </Box>
            
            <List>
              {docs.map((doc, index) => (
                <React.Fragment key={doc.id}>
                  <ListItem
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1
                      }
                    }}
                  >
                    <ListItemIcon>
                      {getDocumentIcon(doc.type)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {doc.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Size: {doc.size} • Uploaded: {doc.uploadDate}
                          </Typography>
                          <Chip
                            label={doc.status.toUpperCase()}
                            size="small"
                            color={getStatusColor(doc.status)}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleView(doc)}
                          title="View Document"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleDownload(doc)}
                          title="Download Document"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  {index < docs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}

      {/* Upload New Document Section */}
      <Card sx={{ mt: 3, border: '2px dashed #e0e0e0' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CloudDownloadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Upload Additional Documents
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add more supporting documents to this case
          </Typography>
          <Button
            variant="contained"
            startIcon={<AttachFileIcon />}
            sx={{ mr: 2 }}
          >
            Choose Files
          </Button>
          <Button variant="outlined">
            Drag & Drop
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CaseDocuments;
