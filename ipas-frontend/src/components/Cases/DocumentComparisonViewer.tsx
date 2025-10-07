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
  Paper,
  Divider,
  Chip,
  Tooltip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Compare as CompareIcon,
  Description as DocumentIcon,
  DataObject as JsonIcon,
  PictureAsPdf as PdfIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { Document, Page } from 'react-pdf';
import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

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
  const [originalContent, setOriginalContent] = useState<string>('');
  const [extractedContent, setExtractedContent] = useState<string>('');
  const [jsonContent, setJsonContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'original' | 'extracted' | 'json'>('extracted');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pageWidth, setPageWidth] = useState(600);

  useEffect(() => {
    if (open && doc) {
      loadDocumentContent();
    }
  }, [open, doc]);

  useEffect(() => {
    const updatePageWidth = () => {
      const availableWidth = window.innerWidth * 0.45; // Slightly more width
      setPageWidth(Math.min(500, availableWidth));
    };
    
    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);
    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  const loadDocumentContent = async () => {
    setLoading(true);
    try {
      // Load the actual JSON data from the file
      if (doc?.jsonUrl) {
        const response = await fetch(doc.jsonUrl);
        if (response.ok) {
          const jsonData = await response.json();
          setJsonContent(jsonData);
          
          // Generate extracted content from JSON
          const extractedText = `
            EXTRACTED DATA:
            
            Patient: ${jsonData.patient?.name || 'N/A'}
            DOB: ${jsonData.patient?.dateOfBirth || 'N/A'}
            Member ID: ${jsonData.patient?.memberId || 'N/A'}
            Plan: ${jsonData.patient?.insurancePlan || 'N/A'}
            
            Provider: ${jsonData.provider?.name || 'N/A'}
            NPI: ${jsonData.provider?.npi || 'N/A'}
            Specialty: ${jsonData.provider?.specialty || 'N/A'}
            Facility: ${jsonData.provider?.facility || 'N/A'}
            
            Service: ${jsonData.requestedService?.procedure || 'N/A'}
            Code: ${jsonData.requestedService?.code || 'N/A'}
            Diagnosis: ${jsonData.requestedService?.diagnosis?.description || 'N/A'}
            Setting: ${jsonData.requestedService?.setting || 'N/A'}
          `;
          setExtractedContent(extractedText);
        }
      }
      
      // Set original content placeholder
      setOriginalContent(`
        PRIOR AUTHORIZATION REQUEST FORM
        
        This is the original PDF document that has been processed
        and the data extracted into the structured format shown
        in the extracted content panel.
      `);
    } catch (error) {
      console.error('Error loading document content:', error);
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
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    console.error('PDF URL:', doc?.originalUrl || doc?.url);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    setPdfLoading(false);
  };

  const onDocumentLoadStart = () => {
    console.log('Starting to load PDF:', doc?.originalUrl || doc?.url);
    console.log('PDF.js version:', pdfjs.version);
    console.log('Worker source:', pdfjs.GlobalWorkerOptions.workerSrc);
    setPdfLoading(true);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const formatJsonContent = (json: any) => {
    return JSON.stringify(json, null, 2);
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

    // Dynamic table generation based on document type
    const generateTableData = () => {
      const tableData = [];

      // Document Type
      if (jsonContent.documentType) {
        tableData.push({
          category: 'Document Information',
          fields: [
            { label: 'Document Type', value: jsonContent.documentType }
          ]
        });
      }

      // Patient Information (if available)
      if (jsonContent.patientInformation || jsonContent.patient) {
        const patientData = jsonContent.patientInformation || jsonContent.patient;
        const patientFields = [];
        if (patientData.patientName || patientData.name) patientFields.push({ label: 'Name', value: patientData.patientName || patientData.name });
        if (patientData.dateOfBirth) patientFields.push({ label: 'Date of Birth', value: patientData.dateOfBirth });
        if (patientData.patientId || patientData.memberId) patientFields.push({ label: 'Patient ID', value: patientData.patientId || patientData.memberId });
        if (patientData.gender) patientFields.push({ label: 'Gender', value: patientData.gender });
        if (patientData.phoneNumber || patientData.phone) patientFields.push({ label: 'Phone', value: patientData.phoneNumber || patientData.phone });
        if (patientData.email) patientFields.push({ label: 'Email', value: patientData.email });
        if (patientData.address) patientFields.push({ label: 'Address', value: patientData.address });
        
        if (patientFields.length > 0) {
          tableData.push({ category: 'Patient Information', fields: patientFields });
        }
      }

      // Provider Information (if available)
      if (jsonContent.providerInformation || jsonContent.provider) {
        const providerData = jsonContent.providerInformation || jsonContent.provider;
        const providerFields = [];
        if (providerData.providerName || providerData.name) providerFields.push({ label: 'Name', value: providerData.providerName || providerData.name });
        if (providerData.npi) providerFields.push({ label: 'NPI', value: providerData.npi });
        if (providerData.specialty) providerFields.push({ label: 'Specialty', value: providerData.specialty });
        if (providerData.hospital || providerData.facility) providerFields.push({ label: 'Hospital/Facility', value: providerData.hospital || providerData.facility });
        if (providerData.phoneNumber || providerData.phone) providerFields.push({ label: 'Phone', value: providerData.phoneNumber || providerData.phone });
        if (providerData.fax) providerFields.push({ label: 'Fax', value: providerData.fax });
        if (providerData.signatureDate) providerFields.push({ label: 'Signature Date', value: providerData.signatureDate });
        
        if (providerFields.length > 0) {
          tableData.push({ category: 'Provider Information', fields: providerFields });
        }
      }

      // Insurance Information (if available)
      if (jsonContent.insuranceInformation) {
        const insuranceFields = [];
        if (jsonContent.insuranceInformation.insuranceCompany) insuranceFields.push({ label: 'Insurance Company', value: jsonContent.insuranceInformation.insuranceCompany });
        if (jsonContent.insuranceInformation.policyNumber) insuranceFields.push({ label: 'Policy Number', value: jsonContent.insuranceInformation.policyNumber });
        if (jsonContent.insuranceInformation.groupNumber) insuranceFields.push({ label: 'Group Number', value: jsonContent.insuranceInformation.groupNumber });
        if (jsonContent.insuranceInformation.memberId) insuranceFields.push({ label: 'Member ID', value: jsonContent.insuranceInformation.memberId });
        if (jsonContent.insuranceInformation.effectiveDate) insuranceFields.push({ label: 'Effective Date', value: jsonContent.insuranceInformation.effectiveDate });
        if (jsonContent.insuranceInformation.coverageType) insuranceFields.push({ label: 'Coverage Type', value: jsonContent.insuranceInformation.coverageType });
        
        if (insuranceFields.length > 0) {
          tableData.push({ category: 'Insurance Information', fields: insuranceFields });
        }
      }

      // Requested Service (if available)
      if (jsonContent.requestedService) {
        const serviceFields = [];
        if (jsonContent.requestedService.procedureCode) serviceFields.push({ label: 'Procedure Code', value: jsonContent.requestedService.procedureCode });
        if (jsonContent.requestedService.procedureName) serviceFields.push({ label: 'Procedure Name', value: jsonContent.requestedService.procedureName });
        if (jsonContent.requestedService.diagnosisCode) serviceFields.push({ label: 'Diagnosis Code', value: jsonContent.requestedService.diagnosisCode });
        if (jsonContent.requestedService.diagnosisDescription) serviceFields.push({ label: 'Diagnosis Description', value: jsonContent.requestedService.diagnosisDescription });
        if (jsonContent.requestedService.requestedDate) serviceFields.push({ label: 'Requested Date', value: jsonContent.requestedService.requestedDate });
        if (jsonContent.requestedService.urgency) serviceFields.push({ label: 'Urgency', value: jsonContent.requestedService.urgency });
        if (jsonContent.requestedService.estimatedCost) serviceFields.push({ label: 'Estimated Cost', value: `$${jsonContent.requestedService.estimatedCost}` });
        
        if (serviceFields.length > 0) {
          tableData.push({ category: 'Requested Service', fields: serviceFields });
        }
      }

      // Medical History (if available)
      if (jsonContent.medicalHistory) {
        const medicalFields = [];
        if (jsonContent.medicalHistory.chiefComplaint) medicalFields.push({ label: 'Chief Complaint', value: jsonContent.medicalHistory.chiefComplaint });
        if (jsonContent.medicalHistory.historyOfPresentIllness) medicalFields.push({ label: 'History of Present Illness', value: jsonContent.medicalHistory.historyOfPresentIllness });
        
        if (jsonContent.medicalHistory.pastMedicalHistory && Array.isArray(jsonContent.medicalHistory.pastMedicalHistory)) {
          medicalFields.push({ label: 'Past Medical History', value: jsonContent.medicalHistory.pastMedicalHistory.join('; ') });
        }
        
        if (jsonContent.medicalHistory.pastSurgicalHistory && Array.isArray(jsonContent.medicalHistory.pastSurgicalHistory)) {
          medicalFields.push({ label: 'Past Surgical History', value: jsonContent.medicalHistory.pastSurgicalHistory.join('; ') });
        }
        
        if (jsonContent.medicalHistory.familyHistory && Array.isArray(jsonContent.medicalHistory.familyHistory)) {
          medicalFields.push({ label: 'Family History', value: jsonContent.medicalHistory.familyHistory.join('; ') });
        }
        
        if (jsonContent.medicalHistory.socialHistory) {
          const social = jsonContent.medicalHistory.socialHistory;
          if (social.smoking) medicalFields.push({ label: 'Smoking History', value: social.smoking });
          if (social.alcohol) medicalFields.push({ label: 'Alcohol Use', value: social.alcohol });
          if (social.exercise) medicalFields.push({ label: 'Exercise', value: social.exercise });
          if (social.occupation) medicalFields.push({ label: 'Occupation', value: social.occupation });
        }
        
        if (medicalFields.length > 0) {
          tableData.push({ category: 'Medical History', fields: medicalFields });
        }
      }

      // Current Medications (if available)
      if (jsonContent.currentMedications && Array.isArray(jsonContent.currentMedications)) {
        const medicationFields: Array<{ label: string; value: string }> = [];
        jsonContent.currentMedications.forEach((med: any, index: number) => {
          const medText = `${med.medication} ${med.dosage} ${med.frequency} - ${med.indication}`;
          medicationFields.push({ label: `Medication ${index + 1}`, value: medText });
        });
        
        if (medicationFields.length > 0) {
          tableData.push({ category: 'Current Medications', fields: medicationFields });
        }
      }

      // Allergies (if available)
      if (jsonContent.allergies && Array.isArray(jsonContent.allergies)) {
        const allergyFields: Array<{ label: string; value: string }> = [];
        jsonContent.allergies.forEach((allergy: any, index: number) => {
          const allergyText = `${allergy.allergen} (${allergy.reaction}) - ${allergy.severity} severity`;
          allergyFields.push({ label: `Allergy ${index + 1}`, value: allergyText });
        });
        
        if (allergyFields.length > 0) {
          tableData.push({ category: 'Allergies', fields: allergyFields });
        }
      }

      // Vital Signs (if available)
      if (jsonContent.vitalSigns) {
        const vitalFields = [];
        if (jsonContent.vitalSigns.bloodPressure) vitalFields.push({ label: 'Blood Pressure', value: jsonContent.vitalSigns.bloodPressure });
        if (jsonContent.vitalSigns.heartRate) vitalFields.push({ label: 'Heart Rate', value: jsonContent.vitalSigns.heartRate });
        if (jsonContent.vitalSigns.temperature) vitalFields.push({ label: 'Temperature', value: jsonContent.vitalSigns.temperature });
        if (jsonContent.vitalSigns.respiratoryRate) vitalFields.push({ label: 'Respiratory Rate', value: jsonContent.vitalSigns.respiratoryRate });
        if (jsonContent.vitalSigns.oxygenSaturation) vitalFields.push({ label: 'Oxygen Saturation', value: jsonContent.vitalSigns.oxygenSaturation });
        if (jsonContent.vitalSigns.weight) vitalFields.push({ label: 'Weight', value: jsonContent.vitalSigns.weight });
        if (jsonContent.vitalSigns.height) vitalFields.push({ label: 'Height', value: jsonContent.vitalSigns.height });
        if (jsonContent.vitalSigns.bmi) vitalFields.push({ label: 'BMI', value: jsonContent.vitalSigns.bmi });
        
        if (vitalFields.length > 0) {
          tableData.push({ category: 'Vital Signs', fields: vitalFields });
        }
      }

      // Physical Examination (if available)
      if (jsonContent.physicalExamination) {
        const examFields = [];
        if (jsonContent.physicalExamination.general) examFields.push({ label: 'General', value: jsonContent.physicalExamination.general });
        if (jsonContent.physicalExamination.cardiovascular) examFields.push({ label: 'Cardiovascular', value: jsonContent.physicalExamination.cardiovascular });
        if (jsonContent.physicalExamination.respiratory) examFields.push({ label: 'Respiratory', value: jsonContent.physicalExamination.respiratory });
        if (jsonContent.physicalExamination.abdomen) examFields.push({ label: 'Abdomen', value: jsonContent.physicalExamination.abdomen });
        if (jsonContent.physicalExamination.extremities) examFields.push({ label: 'Extremities', value: jsonContent.physicalExamination.extremities });
        
        if (examFields.length > 0) {
          tableData.push({ category: 'Physical Examination', fields: examFields });
        }
      }

      // Assessment and Plan (if available)
      if (jsonContent.assessmentAndPlan) {
        const planFields = [];
        if (jsonContent.assessmentAndPlan.assessment) planFields.push({ label: 'Assessment', value: jsonContent.assessmentAndPlan.assessment });
        if (jsonContent.assessmentAndPlan.plan && Array.isArray(jsonContent.assessmentAndPlan.plan)) {
          planFields.push({ label: 'Plan', value: jsonContent.assessmentAndPlan.plan.join('; ') });
        }
        
        if (planFields.length > 0) {
          tableData.push({ category: 'Assessment and Plan', fields: planFields });
        }
      }

      // Clinical Data (if available) - for backward compatibility
      if (jsonContent.clinicalData) {
        const clinicalFields = [];
        if (jsonContent.clinicalData.clinicalSummary) clinicalFields.push({ label: 'Clinical Summary', value: jsonContent.clinicalData.clinicalSummary });
        
        if (jsonContent.clinicalData.vitalSigns) {
          const vitalSigns = jsonContent.clinicalData.vitalSigns;
          if (vitalSigns.bloodPressure) clinicalFields.push({ label: 'Blood Pressure', value: vitalSigns.bloodPressure });
          if (vitalSigns.heartRate) clinicalFields.push({ label: 'Heart Rate', value: vitalSigns.heartRate });
          if (vitalSigns.temperature) clinicalFields.push({ label: 'Temperature', value: vitalSigns.temperature });
          if (vitalSigns.oxygenSaturation) clinicalFields.push({ label: 'Oxygen Saturation', value: vitalSigns.oxygenSaturation });
        }
        
        if (jsonContent.clinicalData.medications && Array.isArray(jsonContent.clinicalData.medications)) {
          clinicalFields.push({ label: 'Medications', value: jsonContent.clinicalData.medications.join(', ') });
        }
        
        if (jsonContent.clinicalData.allergies && Array.isArray(jsonContent.clinicalData.allergies)) {
          clinicalFields.push({ label: 'Allergies', value: jsonContent.clinicalData.allergies.join(', ') });
        }
        
        if (jsonContent.clinicalData.comorbidities && Array.isArray(jsonContent.clinicalData.comorbidities)) {
          clinicalFields.push({ label: 'Comorbidities', value: jsonContent.clinicalData.comorbidities.join(', ') });
        }
        
        if (clinicalFields.length > 0) {
          tableData.push({ category: 'Clinical Data', fields: clinicalFields });
        }
      }

      // Cardiology Notes / Clinical Notes specific fields
      if (jsonContent.documentType === 'Cardiology Notes' || jsonContent.documentType === 'Physician Notes') {
        // Visit Information
        if (jsonContent.visitInformation) {
          const visitFields = [];
          if (jsonContent.visitInformation.visitDate) visitFields.push({ label: 'Visit Date', value: jsonContent.visitInformation.visitDate });
          if (jsonContent.visitInformation.physician) visitFields.push({ label: 'Physician', value: jsonContent.visitInformation.physician });
          if (jsonContent.visitInformation.specialty) visitFields.push({ label: 'Specialty', value: jsonContent.visitInformation.specialty });
          if (jsonContent.visitInformation.visitType) visitFields.push({ label: 'Visit Type', value: jsonContent.visitInformation.visitType });
          if (jsonContent.visitInformation.chiefComplaint) visitFields.push({ label: 'Chief Complaint', value: jsonContent.visitInformation.chiefComplaint });
          
          if (visitFields.length > 0) {
            tableData.push({ category: 'Visit Information', fields: visitFields });
          }
        }

        // Clinical Assessment
        if (jsonContent.clinicalAssessment) {
          const assessmentFields = [];
          if (jsonContent.clinicalAssessment.historyOfPresentIllness) assessmentFields.push({ label: 'History of Present Illness', value: jsonContent.clinicalAssessment.historyOfPresentIllness });
          
          if (jsonContent.clinicalAssessment.reviewOfSystems) {
            const ros = jsonContent.clinicalAssessment.reviewOfSystems;
            if (ros.cardiovascular) assessmentFields.push({ label: 'ROS - Cardiovascular', value: ros.cardiovascular });
            if (ros.respiratory) assessmentFields.push({ label: 'ROS - Respiratory', value: ros.respiratory });
            if (ros.gastrointestinal) assessmentFields.push({ label: 'ROS - Gastrointestinal', value: ros.gastrointestinal });
            if (ros.neurological) assessmentFields.push({ label: 'ROS - Neurological', value: ros.neurological });
          }
          
          if (jsonContent.clinicalAssessment.physicalExamination) {
            const pe = jsonContent.clinicalAssessment.physicalExamination;
            if (pe.vitalSigns) assessmentFields.push({ label: 'Vital Signs', value: pe.vitalSigns });
            if (pe.cardiovascular) assessmentFields.push({ label: 'PE - Cardiovascular', value: pe.cardiovascular });
            if (pe.respiratory) assessmentFields.push({ label: 'PE - Respiratory', value: pe.respiratory });
            if (pe.extremities) assessmentFields.push({ label: 'PE - Extremities', value: pe.extremities });
          }
          
          if (assessmentFields.length > 0) {
            tableData.push({ category: 'Clinical Assessment', fields: assessmentFields });
          }
        }

        // Diagnostic Workup
        if (jsonContent.diagnosticWorkup) {
          const diagnosticFields = [];
          if (jsonContent.diagnosticWorkup.eKG) diagnosticFields.push({ label: 'EKG', value: jsonContent.diagnosticWorkup.eKG });
          if (jsonContent.diagnosticWorkup.stressTest) diagnosticFields.push({ label: 'Stress Test', value: jsonContent.diagnosticWorkup.stressTest });
          if (jsonContent.diagnosticWorkup.echocardiogram) diagnosticFields.push({ label: 'Echocardiogram', value: jsonContent.diagnosticWorkup.echocardiogram });
          if (jsonContent.diagnosticWorkup.laboratory) diagnosticFields.push({ label: 'Laboratory', value: jsonContent.diagnosticWorkup.laboratory });
          if (jsonContent.diagnosticWorkup.imaging) diagnosticFields.push({ label: 'Imaging', value: jsonContent.diagnosticWorkup.imaging });
          
          if (diagnosticFields.length > 0) {
            tableData.push({ category: 'Diagnostic Workup', fields: diagnosticFields });
          }
        }

        // Assessment and Plan (clinical notes version)
        if (jsonContent.assessmentAndPlan && jsonContent.assessmentAndPlan.primaryDiagnosis) {
          const planFields = [];
          if (jsonContent.assessmentAndPlan.primaryDiagnosis) planFields.push({ label: 'Primary Diagnosis', value: jsonContent.assessmentAndPlan.primaryDiagnosis });
          
          if (jsonContent.assessmentAndPlan.differentialDiagnosis && Array.isArray(jsonContent.assessmentAndPlan.differentialDiagnosis)) {
            jsonContent.assessmentAndPlan.differentialDiagnosis.forEach((diagnosis: any, index: number) => {
              planFields.push({ label: `Differential Diagnosis ${index + 1}`, value: diagnosis });
            });
          }
          
          if (jsonContent.assessmentAndPlan.treatmentPlan && Array.isArray(jsonContent.assessmentAndPlan.treatmentPlan)) {
            jsonContent.assessmentAndPlan.treatmentPlan.forEach((treatment: any, index: number) => {
              planFields.push({ label: `Treatment ${index + 1}`, value: treatment });
            });
          }
          
          if (jsonContent.assessmentAndPlan.prognosis) planFields.push({ label: 'Prognosis', value: jsonContent.assessmentAndPlan.prognosis });
          if (jsonContent.assessmentAndPlan.followUp) planFields.push({ label: 'Follow Up', value: jsonContent.assessmentAndPlan.followUp });
          
          if (planFields.length > 0) {
            tableData.push({ category: 'Assessment and Plan', fields: planFields });
          }
        }

        // Risk Stratification
        if (jsonContent.riskStratification) {
          const riskFields = [];
          if (jsonContent.riskStratification.timiRiskScore) riskFields.push({ label: 'TIMI Risk Score', value: jsonContent.riskStratification.timiRiskScore });
          if (jsonContent.riskStratification.graceScore) riskFields.push({ label: 'GRACE Score', value: jsonContent.riskStratification.graceScore });
          
          if (jsonContent.riskStratification.riskFactors && Array.isArray(jsonContent.riskStratification.riskFactors)) {
            jsonContent.riskStratification.riskFactors.forEach((factor: any, index: number) => {
              riskFields.push({ label: `Risk Factor ${index + 1}`, value: factor });
            });
          }
          
          if (riskFields.length > 0) {
            tableData.push({ category: 'Risk Stratification', fields: riskFields });
          }
        }

        // Patient Education
        if (jsonContent.patientEducation) {
          const educationFields = [];
          
          if (jsonContent.patientEducation.discussed && Array.isArray(jsonContent.patientEducation.discussed)) {
            jsonContent.patientEducation.discussed.forEach((topic: any, index: number) => {
              educationFields.push({ label: `Topic ${index + 1}`, value: topic });
            });
          }
          
          if (jsonContent.patientEducation.questionsAnswered) educationFields.push({ label: 'Questions Answered', value: jsonContent.patientEducation.questionsAnswered });
          if (jsonContent.patientEducation.patientUnderstanding) educationFields.push({ label: 'Patient Understanding', value: jsonContent.patientEducation.patientUnderstanding });
          
          if (educationFields.length > 0) {
            tableData.push({ category: 'Patient Education', fields: educationFields });
          }
        }
      }

      // Stress Test Results specific fields
      if (jsonContent.documentType === 'Stress Test Results') {
        // Test Information
        if (jsonContent.testInformation) {
          const testInfoFields = [];
          if (jsonContent.testInformation.testType) testInfoFields.push({ label: 'Test Type', value: jsonContent.testInformation.testType });
          if (jsonContent.testInformation.testDate) testInfoFields.push({ label: 'Test Date', value: jsonContent.testInformation.testDate });
          if (jsonContent.testInformation.orderingPhysician) testInfoFields.push({ label: 'Ordering Physician', value: jsonContent.testInformation.orderingPhysician });
          if (jsonContent.testInformation.facility) testInfoFields.push({ label: 'Facility', value: jsonContent.testInformation.facility });
          if (jsonContent.testInformation.technician) testInfoFields.push({ label: 'Technician', value: jsonContent.testInformation.technician });
          
          if (testInfoFields.length > 0) {
            tableData.push({ category: 'Test Information', fields: testInfoFields });
          }
        }

        // Test Protocol
        if (jsonContent.testProtocol) {
          const protocolFields = [];
          if (jsonContent.testProtocol.protocol) protocolFields.push({ label: 'Protocol', value: jsonContent.testProtocol.protocol });
          if (jsonContent.testProtocol.startingStage) protocolFields.push({ label: 'Starting Stage', value: jsonContent.testProtocol.startingStage });
          if (jsonContent.testProtocol.targetHeartRate) protocolFields.push({ label: 'Target Heart Rate', value: jsonContent.testProtocol.targetHeartRate });
          if (jsonContent.testProtocol.duration) protocolFields.push({ label: 'Duration', value: jsonContent.testProtocol.duration });
          
          if (protocolFields.length > 0) {
            tableData.push({ category: 'Test Protocol', fields: protocolFields });
          }
        }

        // Test Results
        if (jsonContent.results) {
          const resultsFields = [];
          if (jsonContent.results.baselineEKG) resultsFields.push({ label: 'Baseline EKG', value: jsonContent.results.baselineEKG });
          if (jsonContent.results.exerciseEKG) resultsFields.push({ label: 'Exercise EKG', value: jsonContent.results.exerciseEKG });
          if (jsonContent.results.maxHeartRate) resultsFields.push({ label: 'Max Heart Rate', value: jsonContent.results.maxHeartRate });
          if (jsonContent.results.maxBloodPressure) resultsFields.push({ label: 'Max Blood Pressure', value: jsonContent.results.maxBloodPressure });
          if (jsonContent.results.exerciseDuration) resultsFields.push({ label: 'Exercise Duration', value: jsonContent.results.exerciseDuration });
          if (jsonContent.results.reasonForTermination) resultsFields.push({ label: 'Reason for Termination', value: jsonContent.results.reasonForTermination });
          if (jsonContent.results.symptoms) resultsFields.push({ label: 'Symptoms', value: jsonContent.results.symptoms });
          
          if (resultsFields.length > 0) {
            tableData.push({ category: 'Test Results', fields: resultsFields });
          }
        }

        // Interpretation
        if (jsonContent.interpretation) {
          const interpretationFields = [];
          if (jsonContent.interpretation.overallResult) interpretationFields.push({ label: 'Overall Result', value: jsonContent.interpretation.overallResult });
          if (jsonContent.interpretation.clinicalSignificance) interpretationFields.push({ label: 'Clinical Significance', value: jsonContent.interpretation.clinicalSignificance });
          
          if (jsonContent.interpretation.findings && Array.isArray(jsonContent.interpretation.findings)) {
            jsonContent.interpretation.findings.forEach((finding: any, index: number) => {
              interpretationFields.push({ label: `Finding ${index + 1}`, value: finding });
            });
          }
          
          if (jsonContent.interpretation.recommendations && Array.isArray(jsonContent.interpretation.recommendations)) {
            jsonContent.interpretation.recommendations.forEach((recommendation: any, index: number) => {
              interpretationFields.push({ label: `Recommendation ${index + 1}`, value: recommendation });
            });
          }
          
          if (interpretationFields.length > 0) {
            tableData.push({ category: 'Interpretation', fields: interpretationFields });
          }
        }

        // Quality Indicators
        if (jsonContent.qualityIndicators) {
          const qualityFields = [];
          if (jsonContent.qualityIndicators.testQuality) qualityFields.push({ label: 'Test Quality', value: jsonContent.qualityIndicators.testQuality });
          if (jsonContent.qualityIndicators.patientEffort) qualityFields.push({ label: 'Patient Effort', value: jsonContent.qualityIndicators.patientEffort });
          if (jsonContent.qualityIndicators.eKGQuality) qualityFields.push({ label: 'EKG Quality', value: jsonContent.qualityIndicators.eKGQuality });
          if (jsonContent.qualityIndicators.artifacts) qualityFields.push({ label: 'Artifacts', value: jsonContent.qualityIndicators.artifacts });
          
          if (qualityFields.length > 0) {
            tableData.push({ category: 'Quality Indicators', fields: qualityFields });
          }
        }

        // Follow Up
        if (jsonContent.followUp) {
          const followUpFields = [];
          if (jsonContent.followUp.nextSteps) followUpFields.push({ label: 'Next Steps', value: jsonContent.followUp.nextSteps });
          if (jsonContent.followUp.urgent !== undefined) followUpFields.push({ label: 'Urgent', value: jsonContent.followUp.urgent ? 'Yes' : 'No' });
          if (jsonContent.followUp.contactInformation) followUpFields.push({ label: 'Contact Information', value: jsonContent.followUp.contactInformation });
          
          if (followUpFields.length > 0) {
            tableData.push({ category: 'Follow Up', fields: followUpFields });
          }
        }
      }

      // Document-specific fields based on document type
      if (jsonContent.documentType === 'Prior Authorization Request Form') {
        // Handle case-006 specific structure with priorAuthorizationRequest
        if (jsonContent.priorAuthorizationRequest) {
          const authRequest = jsonContent.priorAuthorizationRequest;
          
          // Metadata
          if (authRequest.metadata) {
            const metadataFields = [];
            if (authRequest.metadata.formType) metadataFields.push({ label: 'Form Type', value: authRequest.metadata.formType });
            if (authRequest.metadata.source) metadataFields.push({ label: 'Source', value: authRequest.metadata.source });
            if (authRequest.metadata.submissionDate) metadataFields.push({ label: 'Submission Date', value: authRequest.metadata.submissionDate });
            if (authRequest.metadata.faxNumber) metadataFields.push({ label: 'Fax Number', value: authRequest.metadata.faxNumber });
            if (authRequest.metadata.standardRequest !== undefined) metadataFields.push({ label: 'Standard Request', value: authRequest.metadata.standardRequest ? 'Yes' : 'No' });
            if (authRequest.metadata.urgentRequest !== undefined) metadataFields.push({ label: 'Urgent Request', value: authRequest.metadata.urgentRequest ? 'Yes' : 'No' });
            
            if (metadataFields.length > 0) {
              tableData.push({ category: 'Form Metadata', fields: metadataFields });
            }
          }

          // Member Information
          if (authRequest.memberInformation) {
            const memberFields = [];
            if (authRequest.memberInformation.memberId) memberFields.push({ label: 'Member ID', value: authRequest.memberInformation.memberId });
            if (authRequest.memberInformation.firstName && authRequest.memberInformation.lastName) {
              memberFields.push({ label: 'Name', value: `${authRequest.memberInformation.firstName} ${authRequest.memberInformation.lastName}` });
            }
            if (authRequest.memberInformation.dateOfBirth) memberFields.push({ label: 'Date of Birth', value: authRequest.memberInformation.dateOfBirth });
            if (authRequest.memberInformation.address) memberFields.push({ label: 'Address', value: authRequest.memberInformation.address });
            if (authRequest.memberInformation.phone) memberFields.push({ label: 'Phone', value: authRequest.memberInformation.phone });
            if (authRequest.memberInformation.sex) memberFields.push({ label: 'Sex', value: authRequest.memberInformation.sex });
            if (authRequest.memberInformation.mrn) memberFields.push({ label: 'MRN', value: authRequest.memberInformation.mrn });
            if (authRequest.memberInformation.ssn) memberFields.push({ label: 'SSN', value: authRequest.memberInformation.ssn });
            
            if (authRequest.memberInformation.insurance) {
              const insurance = authRequest.memberInformation.insurance;
              if (insurance.payor) memberFields.push({ label: 'Insurance Payor', value: insurance.payor });
              if (insurance.plan) memberFields.push({ label: 'Plan', value: insurance.plan });
              if (insurance.groupNumber) memberFields.push({ label: 'Group Number', value: insurance.groupNumber });
              if (insurance.subscriberId) memberFields.push({ label: 'Subscriber ID', value: insurance.subscriberId });
            }
            
            if (memberFields.length > 0) {
              tableData.push({ category: 'Member Information', fields: memberFields });
            }
          }

          // Requesting Provider
          if (authRequest.requestingProvider) {
            const providerFields = [];
            if (authRequest.requestingProvider.name) providerFields.push({ label: 'Provider Name', value: authRequest.requestingProvider.name });
            if (authRequest.requestingProvider.npi) providerFields.push({ label: 'NPI', value: authRequest.requestingProvider.npi });
            if (authRequest.requestingProvider.tin) providerFields.push({ label: 'TIN', value: authRequest.requestingProvider.tin });
            if (authRequest.requestingProvider.phone) providerFields.push({ label: 'Phone', value: authRequest.requestingProvider.phone });
            if (authRequest.requestingProvider.fax) providerFields.push({ label: 'Fax', value: authRequest.requestingProvider.fax });
            if (authRequest.requestingProvider.specialty) providerFields.push({ label: 'Specialty', value: authRequest.requestingProvider.specialty });
            
            if (authRequest.requestingProvider.facility) {
              const facility = authRequest.requestingProvider.facility;
              if (facility.name) providerFields.push({ label: 'Facility Name', value: facility.name });
              if (facility.address) providerFields.push({ label: 'Facility Address', value: facility.address });
              if (facility.phone) providerFields.push({ label: 'Facility Phone', value: facility.phone });
              if (facility.fax) providerFields.push({ label: 'Facility Fax', value: facility.fax });
            }
            
            if (providerFields.length > 0) {
              tableData.push({ category: 'Requesting Provider', fields: providerFields });
            }
          }

          // Servicing Provider
          if (authRequest.servicingProvider) {
            const servicingFields = [];
            if (authRequest.servicingProvider.name) servicingFields.push({ label: 'Provider Name', value: authRequest.servicingProvider.name });
            if (authRequest.servicingProvider.facilityName) servicingFields.push({ label: 'Facility Name', value: authRequest.servicingProvider.facilityName });
            if (authRequest.servicingProvider.npi) servicingFields.push({ label: 'NPI', value: authRequest.servicingProvider.npi });
            if (authRequest.servicingProvider.tin) servicingFields.push({ label: 'TIN', value: authRequest.servicingProvider.tin });
            if (authRequest.servicingProvider.phone) servicingFields.push({ label: 'Phone', value: authRequest.servicingProvider.phone });
            if (authRequest.servicingProvider.fax) servicingFields.push({ label: 'Fax', value: authRequest.servicingProvider.fax });
            if (authRequest.servicingProvider.notificationEmail) servicingFields.push({ label: 'Email', value: authRequest.servicingProvider.notificationEmail });
            if (authRequest.servicingProvider.location) servicingFields.push({ label: 'Location', value: authRequest.servicingProvider.location });
            
            if (servicingFields.length > 0) {
              tableData.push({ category: 'Servicing Provider', fields: servicingFields });
            }
          }

          // Authorization Request
          if (authRequest.authorizationRequest) {
            const authFields = [];
            if (authRequest.authorizationRequest.primaryProcedure) {
              const primary = authRequest.authorizationRequest.primaryProcedure;
              if (primary.code) authFields.push({ label: 'Primary Procedure Code', value: primary.code });
              if (primary.description) authFields.push({ label: 'Primary Procedure Description', value: primary.description });
              if (primary.hcpcsCategory) authFields.push({ label: 'HCPCS Category', value: primary.hcpcsCategory });
            }
            
            if (authRequest.authorizationRequest.additionalProcedures && Array.isArray(authRequest.authorizationRequest.additionalProcedures)) {
              authRequest.authorizationRequest.additionalProcedures.forEach((proc: any, index: number) => {
                if (proc.code) authFields.push({ label: `Additional Procedure ${index + 1} Code`, value: proc.code });
                if (proc.description) authFields.push({ label: `Additional Procedure ${index + 1} Description`, value: proc.description });
                if (proc.hcpcsCategory) authFields.push({ label: `Additional Procedure ${index + 1} Category`, value: proc.hcpcsCategory });
              });
            }
            
            if (authRequest.authorizationRequest.diagnosis) {
              const diagnosis = authRequest.authorizationRequest.diagnosis;
              if (diagnosis.icd10) authFields.push({ label: 'Diagnosis Code', value: diagnosis.icd10 });
              if (diagnosis.description) authFields.push({ label: 'Diagnosis Description', value: diagnosis.description });
            }
            
            if (authRequest.authorizationRequest.startDate) authFields.push({ label: 'Start Date', value: authRequest.authorizationRequest.startDate });
            if (authRequest.authorizationRequest.endDate) authFields.push({ label: 'End Date', value: authRequest.authorizationRequest.endDate });
            if (authRequest.authorizationRequest.totalUnits) authFields.push({ label: 'Total Units', value: authRequest.authorizationRequest.totalUnits });
            if (authRequest.authorizationRequest.serviceTypeCode) authFields.push({ label: 'Service Type Code', value: authRequest.authorizationRequest.serviceTypeCode });
            if (authRequest.authorizationRequest.serviceTypeDescription) authFields.push({ label: 'Service Type Description', value: authRequest.authorizationRequest.serviceTypeDescription });
            if (authRequest.authorizationRequest.setting) authFields.push({ label: 'Setting', value: authRequest.authorizationRequest.setting });
            
            if (authFields.length > 0) {
              tableData.push({ category: 'Authorization Request', fields: authFields });
            }
          }

          // Patient Vitals
          if (authRequest.patientVitals) {
            const vitalsFields = [];
            if (authRequest.patientVitals.date) vitalsFields.push({ label: 'Date', value: authRequest.patientVitals.date });
            if (authRequest.patientVitals.weightKg) vitalsFields.push({ label: 'Weight (kg)', value: `${authRequest.patientVitals.weightKg} kg` });
            if (authRequest.patientVitals.weightLbs) vitalsFields.push({ label: 'Weight (lbs)', value: `${authRequest.patientVitals.weightLbs} lbs` });
            
            if (vitalsFields.length > 0) {
              tableData.push({ category: 'Patient Vitals', fields: vitalsFields });
            }
          }
        }
      }

      // Patient Medical History specific fields
      if (jsonContent.documentType === 'Patient Medical History') {
        if (jsonContent.chiefComplaint) {
          tableData.push({
            category: 'Chief Complaint',
            fields: [{ label: 'Chief Complaint', value: jsonContent.chiefComplaint }]
          });
        }

        if (jsonContent.historyOfPresentIllness) {
          const hpiFields = [];
          if (jsonContent.historyOfPresentIllness.duration) hpiFields.push({ label: 'Duration', value: jsonContent.historyOfPresentIllness.duration });
          if (jsonContent.historyOfPresentIllness.symptoms) hpiFields.push({ label: 'Symptoms', value: Array.isArray(jsonContent.historyOfPresentIllness.symptoms) ? jsonContent.historyOfPresentIllness.symptoms.join(', ') : jsonContent.historyOfPresentIllness.symptoms });
          if (jsonContent.historyOfPresentIllness.associatedFactors) hpiFields.push({ label: 'Associated Factors', value: Array.isArray(jsonContent.historyOfPresentIllness.associatedFactors) ? jsonContent.historyOfPresentIllness.associatedFactors.join(', ') : jsonContent.historyOfPresentIllness.associatedFactors });
          
          if (hpiFields.length > 0) {
            tableData.push({ category: 'History of Present Illness', fields: hpiFields });
          }
        }

        if (jsonContent.pastMedicalHistory && Array.isArray(jsonContent.pastMedicalHistory)) {
          const pmhFields = jsonContent.pastMedicalHistory.map((condition: any, index: number) => ({
            label: `Condition ${index + 1}`,
            value: `${condition.condition} (${condition.dateDiagnosed}) - ${condition.status} - Provider: ${condition.provider}`
          }));
          tableData.push({ category: 'Past Medical History', fields: pmhFields });
        }

        if (jsonContent.currentMedications && Array.isArray(jsonContent.currentMedications)) {
          const medFields = jsonContent.currentMedications.map((med: any, index: number) => ({
            label: `Medication ${index + 1}`,
            value: `${med.medication} ${med.dosage} ${med.frequency} - ${med.indication} (Started: ${med.startDate})`
          }));
          tableData.push({ category: 'Current Medications', fields: medFields });
        }

        if (jsonContent.familyHistory) {
          const familyFields = [];
          if (jsonContent.familyHistory.father) familyFields.push({ label: 'Father', value: jsonContent.familyHistory.father });
          if (jsonContent.familyHistory.mother) familyFields.push({ label: 'Mother', value: jsonContent.familyHistory.mother });
          if (jsonContent.familyHistory.siblings) familyFields.push({ label: 'Siblings', value: jsonContent.familyHistory.siblings });
          
          if (familyFields.length > 0) {
            tableData.push({ category: 'Family History', fields: familyFields });
          }
        }

        if (jsonContent.socialHistory) {
          const socialFields = [];
          if (jsonContent.socialHistory.smoking) socialFields.push({ label: 'Smoking', value: jsonContent.socialHistory.smoking });
          if (jsonContent.socialHistory.alcohol) socialFields.push({ label: 'Alcohol', value: jsonContent.socialHistory.alcohol });
          if (jsonContent.socialHistory.exercise) socialFields.push({ label: 'Exercise', value: jsonContent.socialHistory.exercise });
          if (jsonContent.socialHistory.occupation) socialFields.push({ label: 'Occupation', value: jsonContent.socialHistory.occupation });
          
          if (socialFields.length > 0) {
            tableData.push({ category: 'Social History', fields: socialFields });
          }
        }

        if (jsonContent.allergies) {
          const allergyFields = [];
          if (jsonContent.allergies.medications) allergyFields.push({ label: 'Medications', value: jsonContent.allergies.medications });
          if (jsonContent.allergies.food) allergyFields.push({ label: 'Food', value: jsonContent.allergies.food });
          if (jsonContent.allergies.environmental) allergyFields.push({ label: 'Environmental', value: jsonContent.allergies.environmental });
          
          if (allergyFields.length > 0) {
            tableData.push({ category: 'Allergies', fields: allergyFields });
          }
        }

        if (jsonContent.reviewOfSystems) {
          const rosFields = [];
          if (jsonContent.reviewOfSystems.constitutional) rosFields.push({ label: 'Constitutional', value: jsonContent.reviewOfSystems.constitutional });
          if (jsonContent.reviewOfSystems.neurological) rosFields.push({ label: 'Neurological', value: jsonContent.reviewOfSystems.neurological });
          if (jsonContent.reviewOfSystems.cardiovascular) rosFields.push({ label: 'Cardiovascular', value: jsonContent.reviewOfSystems.cardiovascular });
          if (jsonContent.reviewOfSystems.respiratory) rosFields.push({ label: 'Respiratory', value: jsonContent.reviewOfSystems.respiratory });
          if (jsonContent.reviewOfSystems.gastrointestinal) rosFields.push({ label: 'Gastrointestinal', value: jsonContent.reviewOfSystems.gastrointestinal });
          if (jsonContent.reviewOfSystems.genitourinary) rosFields.push({ label: 'Genitourinary', value: jsonContent.reviewOfSystems.genitourinary });
          
          if (rosFields.length > 0) {
            tableData.push({ category: 'Review of Systems', fields: rosFields });
          }
        }
      }

      // MRI Brain Report specific fields
      if (jsonContent.documentType === 'MRI Brain Report') {
        if (jsonContent.studyInfo) {
          const studyFields = [];
          if (jsonContent.studyInfo.studyType) studyFields.push({ label: 'Study Type', value: jsonContent.studyInfo.studyType });
          if (jsonContent.studyInfo.reportId) studyFields.push({ label: 'Report ID', value: jsonContent.studyInfo.reportId });
          if (jsonContent.studyInfo.referringPhysician) studyFields.push({ label: 'Referring Physician', value: jsonContent.studyInfo.referringPhysician });
          if (jsonContent.studyInfo.clinicalHistory) studyFields.push({ label: 'Clinical History', value: jsonContent.studyInfo.clinicalHistory });
          if (jsonContent.studyInfo.indication) studyFields.push({ label: 'Indication', value: jsonContent.studyInfo.indication });
          
          if (studyFields.length > 0) {
            tableData.push({ category: 'Study Information', fields: studyFields });
          }
        }

        if (jsonContent.technicalInfo) {
          const techFields = [];
          if (jsonContent.technicalInfo.scanner) techFields.push({ label: 'Scanner', value: jsonContent.technicalInfo.scanner });
          if (jsonContent.technicalInfo.protocol) techFields.push({ label: 'Protocol', value: jsonContent.technicalInfo.protocol });
          if (jsonContent.technicalInfo.contrastAgent) techFields.push({ label: 'Contrast Agent', value: jsonContent.technicalInfo.contrastAgent });
          if (jsonContent.technicalInfo.sequences) techFields.push({ label: 'Sequences', value: Array.isArray(jsonContent.technicalInfo.sequences) ? jsonContent.technicalInfo.sequences.join(', ') : jsonContent.technicalInfo.sequences });
          if (jsonContent.technicalInfo.fieldStrength) techFields.push({ label: 'Field Strength', value: jsonContent.technicalInfo.fieldStrength });
          
          if (techFields.length > 0) {
            tableData.push({ category: 'Technical Information', fields: techFields });
          }
        }

        if (jsonContent.findings) {
          const findingFields = [];
          if (jsonContent.findings.brainParenchyma) findingFields.push({ label: 'Brain Parenchyma', value: `${jsonContent.findings.brainParenchyma.status} - ${Array.isArray(jsonContent.findings.brainParenchyma.details) ? jsonContent.findings.brainParenchyma.details.join(', ') : jsonContent.findings.brainParenchyma.details}` });
          if (jsonContent.findings.whiteMatter) findingFields.push({ label: 'White Matter', value: `${jsonContent.findings.whiteMatter.status} - ${Array.isArray(jsonContent.findings.whiteMatter.details) ? jsonContent.findings.whiteMatter.details.join(', ') : jsonContent.findings.whiteMatter.details}` });
          if (jsonContent.findings.grayMatter) findingFields.push({ label: 'Gray Matter', value: `${jsonContent.findings.grayMatter.status} - ${Array.isArray(jsonContent.findings.grayMatter.details) ? jsonContent.findings.grayMatter.details.join(', ') : jsonContent.findings.grayMatter.details}` });
          if (jsonContent.findings.ventricularSystem) findingFields.push({ label: 'Ventricular System', value: `${jsonContent.findings.ventricularSystem.status} - ${Array.isArray(jsonContent.findings.ventricularSystem.details) ? jsonContent.findings.ventricularSystem.details.join(', ') : jsonContent.findings.ventricularSystem.details}` });
          if (jsonContent.findings.cerebellum) findingFields.push({ label: 'Cerebellum', value: `${jsonContent.findings.cerebellum.status} - ${Array.isArray(jsonContent.findings.cerebellum.details) ? jsonContent.findings.cerebellum.details.join(', ') : jsonContent.findings.cerebellum.details}` });
          if (jsonContent.findings.brainstem) findingFields.push({ label: 'Brainstem', value: `${jsonContent.findings.brainstem.status} - ${Array.isArray(jsonContent.findings.brainstem.details) ? jsonContent.findings.brainstem.details.join(', ') : jsonContent.findings.brainstem.details}` });
          
          if (findingFields.length > 0) {
            tableData.push({ category: 'Imaging Findings', fields: findingFields });
          }
        }

        if (jsonContent.impression && Array.isArray(jsonContent.impression)) {
          const impressionFields = jsonContent.impression.map((item: any, index: number) => ({
            label: `Impression ${index + 1}`,
            value: item
          }));
          tableData.push({ category: 'Impression', fields: impressionFields });
        }

        if (jsonContent.recommendations && Array.isArray(jsonContent.recommendations)) {
          const recFields = jsonContent.recommendations.map((item: any, index: number) => ({
            label: `Recommendation ${index + 1}`,
            value: item
          }));
          tableData.push({ category: 'Recommendations', fields: recFields });
        }

        if (jsonContent.radiologist) {
          const radFields = [];
          if (jsonContent.radiologist.name) radFields.push({ label: 'Radiologist', value: jsonContent.radiologist.name });
          if (jsonContent.radiologist.specialty) radFields.push({ label: 'Specialty', value: jsonContent.radiologist.specialty });
          if (jsonContent.radiologist.date) radFields.push({ label: 'Date', value: jsonContent.radiologist.date });
          
          if (radFields.length > 0) {
            tableData.push({ category: 'Radiologist', fields: radFields });
          }
        }
      }

      // Physician Notes specific fields
      if (jsonContent.documentType === 'Physician Notes') {
        if (jsonContent.visitInfo) {
          const visitFields = [];
          if (jsonContent.visitInfo.date) visitFields.push({ label: 'Date', value: jsonContent.visitInfo.date });
          if (jsonContent.visitInfo.provider) visitFields.push({ label: 'Provider', value: jsonContent.visitInfo.provider });
          if (jsonContent.visitInfo.visitId) visitFields.push({ label: 'Visit ID', value: jsonContent.visitInfo.visitId });
          if (jsonContent.visitInfo.notesId) visitFields.push({ label: 'Notes ID', value: jsonContent.visitInfo.notesId });
          
          if (visitFields.length > 0) {
            tableData.push({ category: 'Visit Information', fields: visitFields });
          }
        }

        if (jsonContent.clinicalAssessment) {
          const clinicalFields = [];
          if (jsonContent.clinicalAssessment.chiefComplaint) clinicalFields.push({ label: 'Chief Complaint', value: jsonContent.clinicalAssessment.chiefComplaint });
          if (jsonContent.clinicalAssessment.historyOfPresentIllness) clinicalFields.push({ label: 'History of Present Illness', value: jsonContent.clinicalAssessment.historyOfPresentIllness });
          
          if (jsonContent.clinicalAssessment.physicalExamination) {
            if (jsonContent.clinicalAssessment.physicalExamination.vitalSigns) clinicalFields.push({ label: 'Vital Signs', value: jsonContent.clinicalAssessment.physicalExamination.vitalSigns });
            if (jsonContent.clinicalAssessment.physicalExamination.general) clinicalFields.push({ label: 'General', value: jsonContent.clinicalAssessment.physicalExamination.general });
            if (jsonContent.clinicalAssessment.physicalExamination.heent) clinicalFields.push({ label: 'HEENT', value: jsonContent.clinicalAssessment.physicalExamination.heent });
            if (jsonContent.clinicalAssessment.physicalExamination.neurological) clinicalFields.push({ label: 'Neurological', value: jsonContent.clinicalAssessment.physicalExamination.neurological });
            if (jsonContent.clinicalAssessment.physicalExamination.cardiovascular) clinicalFields.push({ label: 'Cardiovascular', value: jsonContent.clinicalAssessment.physicalExamination.cardiovascular });
            if (jsonContent.clinicalAssessment.physicalExamination.respiratory) clinicalFields.push({ label: 'Respiratory', value: jsonContent.clinicalAssessment.physicalExamination.respiratory });
          }
          
          if (clinicalFields.length > 0) {
            tableData.push({ category: 'Clinical Assessment', fields: clinicalFields });
          }
        }

        if (jsonContent.clinicalReasoning) {
          const reasoningFields = [];
          if (jsonContent.clinicalReasoning.differentialDiagnosis) reasoningFields.push({ label: 'Differential Diagnosis', value: Array.isArray(jsonContent.clinicalReasoning.differentialDiagnosis) ? jsonContent.clinicalReasoning.differentialDiagnosis.join(', ') : jsonContent.clinicalReasoning.differentialDiagnosis });
          if (jsonContent.clinicalReasoning.riskFactors) reasoningFields.push({ label: 'Risk Factors', value: Array.isArray(jsonContent.clinicalReasoning.riskFactors) ? jsonContent.clinicalReasoning.riskFactors.join(', ') : jsonContent.clinicalReasoning.riskFactors });
          if (jsonContent.clinicalReasoning.redFlags) reasoningFields.push({ label: 'Red Flags', value: Array.isArray(jsonContent.clinicalReasoning.redFlags) ? jsonContent.clinicalReasoning.redFlags.join(', ') : jsonContent.clinicalReasoning.redFlags });
          
          if (reasoningFields.length > 0) {
            tableData.push({ category: 'Clinical Reasoning', fields: reasoningFields });
          }
        }

        if (jsonContent.assessment && Array.isArray(jsonContent.assessment)) {
          const assessmentFields = jsonContent.assessment.map((item: any, index: number) => ({
            label: `Assessment ${index + 1}`,
            value: item
          }));
          tableData.push({ category: 'Assessment', fields: assessmentFields });
        }

        if (jsonContent.plan && Array.isArray(jsonContent.plan)) {
          const planFields = jsonContent.plan.map((item: any, index: number) => ({
            label: `Plan ${index + 1}`,
            value: item
          }));
          tableData.push({ category: 'Plan', fields: planFields });
        }
      }

      // Insurance Card specific fields
      if (jsonContent.insuranceCompany) {
        const insuranceFields = [];
        if (jsonContent.insuranceCompany) insuranceFields.push({ label: 'Insurance Company', value: jsonContent.insuranceCompany });
        if (jsonContent.memberInfo) {
          if (jsonContent.memberInfo.name) insuranceFields.push({ label: 'Member Name', value: jsonContent.memberInfo.name });
          if (jsonContent.memberInfo.memberId) insuranceFields.push({ label: 'Member ID', value: jsonContent.memberInfo.memberId });
          if (jsonContent.memberInfo.groupNumber) insuranceFields.push({ label: 'Group Number', value: jsonContent.memberInfo.groupNumber });
          if (jsonContent.memberInfo.policyNumber) insuranceFields.push({ label: 'Policy Number', value: jsonContent.memberInfo.policyNumber });
        }
        if (jsonContent.planInfo) {
          if (jsonContent.planInfo.planType) insuranceFields.push({ label: 'Plan Type', value: jsonContent.planInfo.planType });
          if (jsonContent.planInfo.effectiveDate) insuranceFields.push({ label: 'Effective Date', value: jsonContent.planInfo.effectiveDate });
          if (jsonContent.planInfo.terminationDate) insuranceFields.push({ label: 'Termination Date', value: jsonContent.planInfo.terminationDate });
        }
        
        if (insuranceFields.length > 0) {
          tableData.push({ category: 'Insurance Information', fields: insuranceFields });
        }
      }

      // Case-006 specific document types
      if (jsonContent.documentType === 'Doctor Notes' || jsonContent.documentType === 'Clinical Notes') {
        // Handle FHIR Bundle structure for doctor notes - COMPREHENSIVE EXTRACTION
        if (jsonContent.entry && Array.isArray(jsonContent.entry)) {
          
          // Patient Information
          const patient = jsonContent.entry.find((entry: any) => entry.resource?.resourceType === 'Patient');
          if (patient && patient.resource) {
            const patientFields = [];
            if (patient.resource.id) patientFields.push({ label: '🆔 Patient ID', value: patient.resource.id });
            if (patient.resource.name && Array.isArray(patient.resource.name)) {
              const name = patient.resource.name[0];
              if (name.family && name.given) {
                patientFields.push({ label: '👤 Patient Name', value: `${name.given.join(' ')} ${name.family}` });
              }
            }
            if (patient.resource.gender) patientFields.push({ label: '⚧ Gender', value: patient.resource.gender });
            if (patient.resource.birthDate) patientFields.push({ label: '🎂 Date of Birth', value: patient.resource.birthDate });
            if (patient.resource.address && Array.isArray(patient.resource.address)) {
              const address = patient.resource.address[0];
              if (address.line && address.city && address.state) {
                patientFields.push({ label: '🏠 Address', value: `${address.line.join(' ')}, ${address.city}, ${address.state} ${address.postalCode}` });
              }
            }
            if (patient.resource.telecom && Array.isArray(patient.resource.telecom)) {
              patient.resource.telecom.forEach((tel: any, idx: number) => {
                if (tel.value) {
                  const useLabel = tel.use ? ` (${tel.use})` : '';
                  patientFields.push({ label: `📞 ${tel.system || 'Contact'} ${idx + 1}${useLabel}`, value: tel.value });
                }
              });
            }
            
            if (patientFields.length > 0) {
              tableData.push({ category: '👤 Patient Information', fields: patientFields });
            }
          }

          // Practitioner Information
          const practitioners = jsonContent.entry.filter((entry: any) => entry.resource?.resourceType === 'Practitioner');
          if (practitioners.length > 0) {
            const practitionerFields: Array<{ label: string; value: string }> = [];
            practitioners.forEach((practitioner: any, index: number) => {
              if (practitioner.resource?.id) practitionerFields.push({ label: `👨‍⚕️ Practitioner ${index + 1} ID`, value: practitioner.resource.id });
              if (practitioner.resource?.name && Array.isArray(practitioner.resource.name)) {
                const name = practitioner.resource.name[0];
                const fullName = `${name.given?.join(' ') || ''} ${name.family || ''} ${name.suffix?.join(', ') || ''}`.trim();
                practitionerFields.push({ label: `Practitioner ${index + 1} Name`, value: fullName });
              }
              if (practitioner.resource?.identifier && Array.isArray(practitioner.resource.identifier)) {
                practitioner.resource.identifier.forEach((id: any, idIdx: number) => {
                  const systemName = id.system?.includes('npi') ? 'NPI' : id.system?.includes('dea') ? 'DEA' : 'ID';
                  if (id.value) practitionerFields.push({ label: `${systemName} ${index + 1}.${idIdx + 1}`, value: id.value });
                });
              }
            });
            
            if (practitionerFields.length > 0) {
              tableData.push({ category: '👨‍⚕️ Healthcare Provider', fields: practitionerFields });
            }
          }

          // Clinical Notes Composition - MAIN DOCUMENT
          const composition = jsonContent.entry.find((entry: any) => entry.resource?.resourceType === 'Composition');
          if (composition && composition.resource) {
            const comp = composition.resource;
            
            // Document Information
            const docFields = [];
            if (comp.id) docFields.push({ label: '🆔 Document ID', value: comp.id });
            if (comp.title) docFields.push({ label: '📄 Title', value: comp.title });
            if (comp.date) docFields.push({ label: '📅 Date', value: comp.date });
            if (comp.status) docFields.push({ label: '📊 Status', value: comp.status.toUpperCase() });
            if (comp.type?.text) docFields.push({ label: '📋 Note Type', value: comp.type.text });
            if (comp.type?.coding && Array.isArray(comp.type.coding)) {
              comp.type.coding.forEach((coding: any, codIdx: number) => {
                if (coding.system && coding.code && coding.display) {
                  const systemName = coding.system.includes('loinc') ? 'LOINC' : 'Code';
                  docFields.push({ 
                    label: `🏷️ ${systemName} Code ${codIdx + 1}`, 
                    value: `[${coding.code}] ${coding.display}` 
                  });
                }
              });
            }
            if (comp.subject?.reference) docFields.push({ label: '👤 Patient Reference', value: comp.subject.reference });
            if (comp.author && Array.isArray(comp.author)) {
              comp.author.forEach((author: any, authIdx: number) => {
                if (author.reference) docFields.push({ label: `👨‍⚕️ Author ${authIdx + 1}`, value: author.reference });
              });
            }
            
            if (docFields.length > 0) {
              tableData.push({ category: '📄 Clinical Note Information', fields: docFields });
            }

            // Clinical Sections (SOAP notes) - DETAILED EXTRACTION
            if (comp.section && Array.isArray(comp.section)) {
              comp.section.forEach((section: any, index: number) => {
                if (section.title && section.text?.div) {
                  const sectionFields = [];
                  // Clean HTML tags from the text
                  const cleanText = section.text.div.replace(/<[^>]*>/g, '').trim();
                  sectionFields.push({ label: section.title, value: cleanText });
                  
                  // Also check for any nested entries in the section
                  if (section.entry && Array.isArray(section.entry)) {
                    section.entry.forEach((entry: any, entryIndex: number) => {
                      if (entry.resource) {
                        const resource = entry.resource;
                        if (resource.resourceType === 'Observation' && resource.code?.coding) {
                          const coding = Array.isArray(resource.code.coding) ? resource.code.coding[0] : resource.code.coding;
                          if (coding.display) {
                            sectionFields.push({ 
                              label: `🔬 Observation ${entryIndex + 1}`, 
                              value: coding.display 
                            });
                          }
                          if (resource.valueString) {
                            sectionFields.push({ 
                              label: `📈 Value ${entryIndex + 1}`, 
                              value: resource.valueString 
                            });
                          }
                        }
                      }
                    });
                  }
                  
                  if (sectionFields.length > 0) {
                    tableData.push({ category: `📋 ${section.title}`, fields: sectionFields });
                  }
                }
              });
            }
          }

          // Medical Conditions
          const conditions = jsonContent.entry.filter((entry: any) => entry.resource?.resourceType === 'Condition');
          if (conditions.length > 0) {
            conditions.forEach((condition: any, index: number) => {
              const conditionFields: Array<{ label: string; value: string }> = [];
              const res = condition.resource;
              
              if (res?.id) conditionFields.push({ label: '🆔 Condition ID', value: res.id });
              
              // Clinical Status
              if (res?.clinicalStatus?.coding) {
                const statusCoding = Array.isArray(res.clinicalStatus.coding) ? res.clinicalStatus.coding[0] : res.clinicalStatus.coding;
                if (statusCoding.code) conditionFields.push({ label: '📊 Clinical Status', value: statusCoding.code.toUpperCase() });
              }
              
              // Diagnosis Codes - CLEARLY SHOWN
              if (res?.code?.coding && Array.isArray(res.code.coding)) {
                res.code.coding.forEach((coding: any, codIdx: number) => {
                  if (coding.system && coding.code && coding.display) {
                    const systemName = coding.system.includes('icd-10') ? 'ICD-10' : coding.system.includes('snomed') ? 'SNOMED' : 'Code System';
                    conditionFields.push({ 
                      label: `🏷️ ${systemName} Code ${codIdx + 1}`, 
                      value: `[${coding.code}] ${coding.display}` 
                    });
                  }
                });
              }
              
              // Onset Date
              if (res?.onsetDateTime) conditionFields.push({ label: '📅 Onset Date', value: res.onsetDateTime });
              
              if (conditionFields.length > 0) {
                tableData.push({ category: `🩺 Medical Condition ${index + 1}`, fields: conditionFields });
              }
            });
          }

          // Device Requests (DME Orders)
          const deviceRequests = jsonContent.entry.filter((entry: any) => entry.resource?.resourceType === 'DeviceRequest');
          if (deviceRequests.length > 0) {
            deviceRequests.forEach((device: any, index: number) => {
              const deviceFields: Array<{ label: string; value: string }> = [];
              const res = device.resource;
              
              if (res?.id) deviceFields.push({ label: '🆔 Request ID', value: res.id });
              if (res?.status) deviceFields.push({ label: '📊 Status', value: res.status.toUpperCase() });
              if (res?.intent) deviceFields.push({ label: 'Intent', value: res.intent.toUpperCase() });
              
              // Device Code - CLEARLY SHOWN
              if (res?.codeCodeableConcept) {
                if (res.codeCodeableConcept.text) deviceFields.push({ label: '🏥 Device Description', value: res.codeCodeableConcept.text });
                if (res.codeCodeableConcept.coding && Array.isArray(res.codeCodeableConcept.coding)) {
                  res.codeCodeableConcept.coding.forEach((coding: any, codIdx: number) => {
                    if (coding.system && coding.code && coding.display) {
                      const systemName = coding.system.includes('HCPCS') ? 'HCPCS' : 'Code';
                      deviceFields.push({ 
                        label: `🏷️ ${systemName} Code ${codIdx + 1}`, 
                        value: `[${coding.code}] ${coding.display}` 
                      });
                    }
                  });
                }
              }
              
              // Parameters (device settings and supplies)
              if (res?.parameter && Array.isArray(res.parameter)) {
                res.parameter.forEach((param: any, paramIdx: number) => {
                  if (param.code?.text) {
                    let paramValue = '';
                    if (param.valueCodeableConcept?.coding && Array.isArray(param.valueCodeableConcept.coding)) {
                      const codingArray = param.valueCodeableConcept.coding;
                      const codeValues = codingArray.map((coding: any) => {
                        if (coding.code) return `[${coding.code}]`;
                        return '';
                      }).filter(Boolean);
                      if (codeValues.length > 0) {
                        paramValue = codeValues.join(', ');
                      }
                    } else if (param.valueInteger) {
                      paramValue = param.valueInteger.toString();
                    } else if (param.valueString) {
                      paramValue = param.valueString;
                    }
                    if (paramValue) {
                      deviceFields.push({ 
                        label: `⚙️ ${param.code.text}`, 
                        value: paramValue 
                      });
                    }
                  }
                });
              }
              
              // Reason for Request
              if (res?.reasonReference && Array.isArray(res.reasonReference)) {
                res.reasonReference.forEach((reason: any, reasonIdx: number) => {
                  if (reason.reference) deviceFields.push({ label: `Clinical Justification ${reasonIdx + 1}`, value: reason.reference });
                });
              }
              
              // Dates
              if (res?.authoredOn) deviceFields.push({ label: '📅 Order Date', value: res.authoredOn });
              
              // Requester
              if (res?.requester?.reference) deviceFields.push({ label: '👨‍⚕️ Ordering Provider', value: res.requester.reference });
              
              if (deviceFields.length > 0) {
                tableData.push({ category: `🛠️ Device Request ${index + 1}`, fields: deviceFields });
              }
            });
          }
        }
      }

      if (jsonContent.documentType === 'Polysomnography Report' || jsonContent.documentType === 'Sleep Study') {
        // Handle FHIR Bundle structure for polysomnography - COMPREHENSIVE EXTRACTION
        if (jsonContent.entry && Array.isArray(jsonContent.entry)) {
          
          // Patient Information
          const patient = jsonContent.entry.find((entry: any) => entry.resource?.resourceType === 'Patient');
          if (patient && patient.resource) {
            const patientFields = [];
            if (patient.resource.id) patientFields.push({ label: '🆔 Patient ID', value: patient.resource.id });
            if (patient.resource.name && Array.isArray(patient.resource.name)) {
              const name = patient.resource.name[0];
              if (name.family && name.given) {
                patientFields.push({ label: '👤 Patient Name', value: `${name.given.join(' ')} ${name.family}` });
              }
            }
            if (patient.resource.gender) patientFields.push({ label: '⚧ Gender', value: patient.resource.gender });
            if (patient.resource.birthDate) patientFields.push({ label: '🎂 Date of Birth', value: patient.resource.birthDate });
            if (patient.resource.address && Array.isArray(patient.resource.address)) {
              const address = patient.resource.address[0];
              if (address.line && address.city && address.state) {
                patientFields.push({ label: '🏠 Address', value: `${address.line.join(' ')}, ${address.city}, ${address.state} ${address.postalCode}` });
              }
            }
            if (patient.resource.telecom && Array.isArray(patient.resource.telecom)) {
              patient.resource.telecom.forEach((tel: any, idx: number) => {
                if (tel.value) {
                  const useLabel = tel.use ? ` (${tel.use})` : '';
                  patientFields.push({ label: `📞 ${tel.system || 'Contact'} ${idx + 1}${useLabel}`, value: tel.value });
                }
              });
            }
            if (patient.resource.identifier && Array.isArray(patient.resource.identifier)) {
              patient.resource.identifier.forEach((id: any) => {
                const systemName = id.system?.includes('mrn') ? 'MRN' : 'Identifier';
                if (id.value) patientFields.push({ label: `🆔 ${systemName}`, value: id.value });
              });
            }
            
            if (patientFields.length > 0) {
              tableData.push({ category: '👤 Patient Information', fields: patientFields });
            }
          }

          // Coverage Information
          const coverage = jsonContent.entry.find((entry: any) => entry.resource?.resourceType === 'Coverage');
          if (coverage && coverage.resource) {
            const coverageFields = [];
            if (coverage.resource.id) coverageFields.push({ label: '🆔 Coverage ID', value: coverage.resource.id });
            if (coverage.resource.status) coverageFields.push({ label: '🟢 Status', value: coverage.resource.status.toUpperCase() });
            if (coverage.resource.payor && Array.isArray(coverage.resource.payor)) {
              coverage.resource.payor.forEach((payor: any, idx: number) => {
                if (payor.display) coverageFields.push({ label: `🏥 Insurance Payor ${idx + 1}`, value: payor.display });
              });
            }
            if (coverage.resource.subscriberId) coverageFields.push({ label: '🔢 Subscriber ID', value: coverage.resource.subscriberId });
            if (coverage.resource.class && Array.isArray(coverage.resource.class)) {
              coverage.resource.class.forEach((cls: any, idx: number) => {
                if (cls.type?.text && cls.value) {
                  coverageFields.push({ label: `${cls.type.text} ${idx + 1}`.toUpperCase(), value: cls.value });
                }
              });
            }
            
            if (coverageFields.length > 0) {
              tableData.push({ category: '🏥 Insurance Coverage', fields: coverageFields });
            }
          }

          // Practitioners
          const practitioners = jsonContent.entry.filter((entry: any) => entry.resource?.resourceType === 'Practitioner');
          if (practitioners.length > 0) {
            const practitionerFields: Array<{ label: string; value: string }> = [];
            practitioners.forEach((practitioner: any, index: number) => {
              if (practitioner.resource?.id) practitionerFields.push({ label: `👨‍⚕️ Practitioner ${index + 1} ID`, value: practitioner.resource.id });
              if (practitioner.resource?.name && Array.isArray(practitioner.resource.name)) {
                const name = practitioner.resource.name[0];
                const fullName = `${name.given?.join(' ') || ''} ${name.family || ''} ${name.suffix?.join(', ') || ''}`.trim();
                practitionerFields.push({ label: `Practitioner ${index + 1} Name`, value: fullName });
              }
              if (practitioner.resource?.identifier && Array.isArray(practitioner.resource.identifier)) {
                practitioner.resource.identifier.forEach((id: any, idIdx: number) => {
                  const systemName = id.system?.includes('npi') ? 'NPI' : id.system?.includes('dea') ? 'DEA' : 'ID';
                  if (id.value) practitionerFields.push({ label: `${systemName} ${index + 1}.${idIdx + 1}`, value: id.value });
                });
              }
            });
            
            if (practitionerFields.length > 0) {
              tableData.push({ category: '👨‍⚕️ Healthcare Providers', fields: practitionerFields });
            }
          }

          // Polysomnography Observation - MAIN SLEEP STUDY DATA
          const observation = jsonContent.entry.find((entry: any) => entry.resource?.resourceType === 'Observation');
          if (observation && observation.resource) {
            const obs = observation.resource;
            
            // Test Information
            const testFields = [];
            if (obs.id) testFields.push({ label: '🆔 Study ID', value: obs.id });
            if (obs.status) testFields.push({ label: '📊 Status', value: obs.status.toUpperCase() });
            if (obs.code?.text) testFields.push({ label: '🔬 Test Type', value: obs.code.text });
            if (obs.code?.coding && Array.isArray(obs.code.coding)) {
              obs.code.coding.forEach((coding: any, codIdx: number) => {
                if (coding.system && coding.code && coding.display) {
                  const systemName = coding.system.includes('loinc') ? 'LOINC' : 'Code';
                  testFields.push({ 
                    label: `🏷️ ${systemName} Code ${codIdx + 1}`, 
                    value: `[${coding.code}] ${coding.display}` 
                  });
                }
              });
            }
            if (obs.effectiveDateTime) testFields.push({ label: '📅 Study Date', value: obs.effectiveDateTime });
            if (obs.performer && Array.isArray(obs.performer)) {
              obs.performer.forEach((perf: any, perfIdx: number) => {
                if (perf.reference) testFields.push({ label: `👨‍⚕️ Performer ${perfIdx + 1}`, value: perf.reference });
              });
            }
            if (obs.category && Array.isArray(obs.category)) {
              obs.category.forEach((cat: any, catIdx: number) => {
                if (cat.coding && Array.isArray(cat.coding)) {
                  cat.coding.forEach((catCoding: any) => {
                    if (catCoding.code) testFields.push({ label: `Category ${catIdx + 1}`, value: catCoding.code });
                    if (catCoding.display) testFields.push({ label: `Category Display ${catIdx + 1}`, value: catCoding.display });
                  });
                }
              });
            }
            
            if (testFields.length > 0) {
              tableData.push({ category: '🔬 Sleep Study Information', fields: testFields });
            }

            // Study Summary
            if (obs.valueString) {
              const resultsFields = [];
              resultsFields.push({ label: '📈 Study Summary', value: obs.valueString });
              
              if (resultsFields.length > 0) {
                tableData.push({ category: '📊 Study Results Summary', fields: resultsFields });
              }
            }

            // Component Results - DETAILED SLEEP METRICS
            if (obs.component && Array.isArray(obs.component)) {
              const componentFields: Array<{ label: string; value: string }> = [];
              obs.component.forEach((comp: any, index: number) => {
                if (comp.code?.text && comp.valueQuantity) {
                  componentFields.push({ 
                    label: `📊 ${comp.code.text}`, 
                    value: `${comp.valueQuantity.value} ${comp.valueQuantity.unit || ''}`.trim() 
                  });
                } else if (comp.code?.coding && Array.isArray(comp.code.coding)) {
                  comp.code.coding.forEach((coding: any, codIdx: number) => {
                    if (coding.display && comp.valueQuantity) {
                      componentFields.push({ 
                        label: `📊 ${coding.display}`, 
                        value: `${comp.valueQuantity.value} ${comp.valueQuantity.unit || ''}`.trim() 
                      });
                    }
                  });
                }
              });
              
              if (componentFields.length > 0) {
                tableData.push({ category: '📊 Sleep Study Metrics', fields: componentFields });
              }
            }

            // Interpretation - CLINICAL ASSESSMENT
            if (obs.interpretation && Array.isArray(obs.interpretation)) {
              const interpretationFields: Array<{ label: string; value: string }> = [];
              obs.interpretation.forEach((interp: any, interpIdx: number) => {
                if (interp.text) interpretationFields.push({ label: `💡 Clinical Interpretation ${interpIdx + 1}`, value: interp.text });
                if (interp.coding && Array.isArray(interp.coding)) {
                  interp.coding.forEach((coding: any, codIdx: number) => {
                    if (coding.code && coding.display) {
                      interpretationFields.push({ 
                        label: `🏷️ Interpretation Code ${interpIdx + 1}.${codIdx + 1}`, 
                        value: `[${coding.code}] ${coding.display}` 
                      });
                    }
                  });
                }
              });
              
              if (interpretationFields.length > 0) {
                tableData.push({ category: '💡 Clinical Interpretation', fields: interpretationFields });
              }
            }
          }

          // Device Request - CPAP PRESCRIPTION
          const deviceRequests = jsonContent.entry.filter((entry: any) => entry.resource?.resourceType === 'DeviceRequest');
          if (deviceRequests.length > 0) {
            deviceRequests.forEach((device: any, index: number) => {
              const deviceFields: Array<{ label: string; value: string }> = [];
              const res = device.resource;
              
              if (res?.id) deviceFields.push({ label: '🆔 Prescription ID', value: res.id });
              if (res?.status) deviceFields.push({ label: '📊 Status', value: res.status.toUpperCase() });
              if (res?.intent) deviceFields.push({ label: 'Intent', value: res.intent.toUpperCase() });
              if (res?.priority) deviceFields.push({ label: 'Priority', value: res.priority.toUpperCase() });
              
              // Device Code - CLEARLY SHOWN
              if (res?.codeCodeableConcept) {
                if (res.codeCodeableConcept.text) deviceFields.push({ label: '🏥 Device Description', value: res.codeCodeableConcept.text });
                if (res.codeCodeableConcept.coding && Array.isArray(res.codeCodeableConcept.coding)) {
                  res.codeCodeableConcept.coding.forEach((coding: any, codIdx: number) => {
                    if (coding.system && coding.code && coding.display) {
                      const systemName = coding.system.includes('HCPCS') ? 'HCPCS' : 'Code';
                      deviceFields.push({ 
                        label: `🏷️ ${systemName} Code ${codIdx + 1}`, 
                        value: `[${coding.code}] ${coding.display}` 
                      });
                    }
                  });
                }
              }
              
              // Quantity
              if (res?.quantityQuantity) {
                deviceFields.push({ 
                  label: 'Quantity', 
                  value: `${res.quantityQuantity.value} ${res.quantityQuantity.unit || ''}`.trim() 
                });
              }
              
              // Parameters (device settings)
              if (res?.parameter && Array.isArray(res.parameter)) {
                res.parameter.forEach((param: any, paramIdx: number) => {
                  if (param.code?.text) {
                    let paramValue = '';
                    if (param.valueCodeableConcept?.coding && Array.isArray(param.valueCodeableConcept.coding)) {
                      const coding = param.valueCodeableConcept.coding[0];
                      if (coding.code && coding.display) {
                        paramValue = `[${coding.code}] ${coding.display}`;
                      }
                    } else if (param.valueInteger) {
                      paramValue = param.valueInteger.toString();
                    } else if (param.valueString) {
                      paramValue = param.valueString;
                    }
                    if (paramValue) {
                      deviceFields.push({ 
                        label: `⚙️ ${param.code.text}`, 
                        value: paramValue 
                      });
                    }
                  }
                });
              }
              
              // Reason for Request - DIAGNOSIS CODES
              if (res?.reasonCode && Array.isArray(res.reasonCode)) {
                res.reasonCode.forEach((reason: any, reasonIdx: number) => {
                  if (reason.coding && Array.isArray(reason.coding)) {
                    reason.coding.forEach((coding: any, codIdx: number) => {
                      if (coding.system && coding.code && coding.display) {
                        const systemName = coding.system.includes('icd-10') ? 'ICD-10' : 'Code';
                        deviceFields.push({ 
                          label: `🏷️ ${systemName} Diagnosis ${reasonIdx + 1}.${codIdx + 1}`, 
                          value: `[${coding.code}] ${coding.display}` 
                        });
                      }
                    });
                  }
                });
              }
              
              // Dates
              if (res?.authoredOn) deviceFields.push({ label: '📅 Prescription Date', value: res.authoredOn });
              
              // Requester
              if (res?.requester?.reference) deviceFields.push({ label: '👨‍⚕️ Prescribing Provider', value: res.requester.reference });
              
              if (deviceFields.length > 0) {
                tableData.push({ category: `🛠️ CPAP Prescription ${index + 1}`, fields: deviceFields });
              }
            });
          }
        }
      }

      if (jsonContent.documentType === 'Medical Records' || jsonContent.documentType === 'FHIR Bundle') {
        // Handle FHIR Bundle structure for medical records
        if (jsonContent.entry && Array.isArray(jsonContent.entry)) {
          // Patient Demographics
          const patient = jsonContent.entry.find((entry: any) => entry.resource?.resourceType === 'Patient');
          if (patient && patient.resource) {
            const patientFields = [];
            if (patient.resource.id) patientFields.push({ label: 'Patient ID', value: patient.resource.id });
            if (patient.resource.name && Array.isArray(patient.resource.name)) {
              const name = patient.resource.name[0];
              if (name.family && name.given) {
                patientFields.push({ label: 'Name', value: `${name.given.join(' ')} ${name.family}` });
              }
            }
            if (patient.resource.gender) patientFields.push({ label: 'Gender', value: patient.resource.gender });
            if (patient.resource.birthDate) patientFields.push({ label: 'Date of Birth', value: patient.resource.birthDate });
            if (patient.resource.address && Array.isArray(patient.resource.address)) {
              const address = patient.resource.address[0];
              if (address.line && address.city && address.state) {
                patientFields.push({ label: 'Address', value: `${address.line.join(' ')}, ${address.city}, ${address.state} ${address.postalCode}` });
              }
            }
            if (patient.resource.telecom && Array.isArray(patient.resource.telecom)) {
              patient.resource.telecom.forEach((tel: any, idx: number) => {
                if (tel.value) {
                  const useLabel = tel.use ? ` (${tel.use})` : '';
                  patientFields.push({ label: `${tel.system || 'Contact'} ${idx + 1}${useLabel}`, value: tel.value });
                }
              });
            }
            if (patient.resource.identifier && Array.isArray(patient.resource.identifier)) {
              patient.resource.identifier.forEach((id: any) => {
                const systemName = id.system?.includes('mrn') ? 'MRN' : 'Identifier';
                if (id.value) patientFields.push({ label: systemName, value: id.value });
              });
            }
            
            if (patientFields.length > 0) {
              tableData.push({ category: '📋 Patient Demographics', fields: patientFields });
            }
          }

          // Coverage Information
          const coverage = jsonContent.entry.find((entry: any) => entry.resource?.resourceType === 'Coverage');
          if (coverage && coverage.resource) {
            const coverageFields = [];
            if (coverage.resource.id) coverageFields.push({ label: 'Coverage ID', value: coverage.resource.id });
            if (coverage.resource.status) coverageFields.push({ label: '🟢 Status', value: coverage.resource.status.toUpperCase() });
            if (coverage.resource.payor && Array.isArray(coverage.resource.payor)) {
              coverage.resource.payor.forEach((payor: any, idx: number) => {
                if (payor.display) coverageFields.push({ label: `Insurance Payor ${idx + 1}`, value: payor.display });
              });
            }
            if (coverage.resource.subscriberId) coverageFields.push({ label: '🔢 Subscriber ID', value: coverage.resource.subscriberId });
            if (coverage.resource.class && Array.isArray(coverage.resource.class)) {
              coverage.resource.class.forEach((cls: any, idx: number) => {
                if (cls.type?.text && cls.value) {
                  coverageFields.push({ label: `${cls.type.text} ${idx + 1}`.toUpperCase(), value: cls.value });
                }
              });
            }
            
            if (coverageFields.length > 0) {
              tableData.push({ category: '🏥 Coverage Information', fields: coverageFields });
            }
          }

          // Practitioners
          const practitioners = jsonContent.entry.filter((entry: any) => entry.resource?.resourceType === 'Practitioner');
          if (practitioners.length > 0) {
            const practitionerFields: Array<{ label: string; value: string }> = [];
            practitioners.forEach((practitioner: any, index: number) => {
              if (practitioner.resource?.id) practitionerFields.push({ label: `👨‍⚕️ Practitioner ${index + 1} ID`, value: practitioner.resource.id });
              if (practitioner.resource?.name && Array.isArray(practitioner.resource.name)) {
                const name = practitioner.resource.name[0];
                const fullName = `${name.given?.join(' ') || ''} ${name.family || ''} ${name.suffix?.join(', ') || ''}`.trim();
                practitionerFields.push({ label: `Practitioner ${index + 1} Name`, value: fullName });
              }
              if (practitioner.resource?.identifier && Array.isArray(practitioner.resource.identifier)) {
                practitioner.resource.identifier.forEach((id: any, idIdx: number) => {
                  const systemName = id.system?.includes('npi') ? 'NPI' : id.system?.includes('dea') ? 'DEA' : 'ID';
                  if (id.value) practitionerFields.push({ label: `${systemName} ${index + 1}.${idIdx + 1}`, value: id.value });
                });
              }
            });
            
            if (practitionerFields.length > 0) {
              tableData.push({ category: '👨‍⚕️ Healthcare Practitioners', fields: practitionerFields });
            }
          }

          // Conditions (Diagnoses)
          const conditions = jsonContent.entry.filter((entry: any) => entry.resource?.resourceType === 'Condition');
          if (conditions.length > 0) {
            conditions.forEach((condition: any, index: number) => {
              const conditionFields: Array<{ label: string; value: string }> = [];
              const res = condition.resource;
              
              if (res?.id) conditionFields.push({ label: '🆔 Condition ID', value: res.id });
              
              // Clinical Status
              if (res?.clinicalStatus?.coding) {
                const statusCoding = Array.isArray(res.clinicalStatus.coding) ? res.clinicalStatus.coding[0] : res.clinicalStatus.coding;
                if (statusCoding.code) conditionFields.push({ label: '📊 Clinical Status', value: statusCoding.code.toUpperCase() });
              }
              
              // Verification Status
              if (res?.verificationStatus?.coding) {
                const verCoding = Array.isArray(res.verificationStatus.coding) ? res.verificationStatus.coding[0] : res.verificationStatus.coding;
                if (verCoding.code) conditionFields.push({ label: '✓ Verification', value: verCoding.code.toUpperCase() });
              }
              
              // Category
              if (res?.category && Array.isArray(res.category)) {
                res.category.forEach((cat: any, catIdx: number) => {
                  if (cat.coding && Array.isArray(cat.coding)) {
                    cat.coding.forEach((catCoding: any) => {
                      if (catCoding.code) conditionFields.push({ label: `Category ${catIdx + 1}`, value: catCoding.code });
                    });
                  }
                });
              }
              
              // Diagnosis Codes - CLEARLY SHOWN
              if (res?.code?.coding && Array.isArray(res.code.coding)) {
                res.code.coding.forEach((coding: any, codIdx: number) => {
                  if (coding.system && coding.code && coding.display) {
                    const systemName = coding.system.includes('icd-10') ? 'ICD-10' : coding.system.includes('snomed') ? 'SNOMED' : 'Code System';
                    conditionFields.push({ 
                      label: `🏷️ ${systemName} Code ${codIdx + 1}`, 
                      value: `[${coding.code}] ${coding.display}` 
                    });
                  }
                });
              }
              
              // Onset Date
              if (res?.onsetDateTime) conditionFields.push({ label: '📅 Onset Date', value: res.onsetDateTime });
              if (res?.recordedDate) conditionFields.push({ label: '📅 Recorded Date', value: res.recordedDate });
              
              if (conditionFields.length > 0) {
                tableData.push({ category: `🩺 Medical Condition ${index + 1}`, fields: conditionFields });
              }
            });
          }

          // Observations (Lab Results, Vitals, Sleep Studies)
          const observations = jsonContent.entry.filter((entry: any) => entry.resource?.resourceType === 'Observation');
          if (observations.length > 0) {
            observations.forEach((observation: any, index: number) => {
              const observationFields: Array<{ label: string; value: string }> = [];
              const res = observation.resource;
              
              if (res?.id) observationFields.push({ label: '🆔 Observation ID', value: res.id });
              if (res?.status) observationFields.push({ label: '📊 Status', value: res.status.toUpperCase() });
              
              // Category
              if (res?.category && Array.isArray(res.category)) {
                res.category.forEach((cat: any, catIdx: number) => {
                  if (cat.coding && Array.isArray(cat.coding)) {
                    cat.coding.forEach((catCoding: any) => {
                      if (catCoding.code) observationFields.push({ label: `Category ${catIdx + 1}`, value: catCoding.code });
                      if (catCoding.display) observationFields.push({ label: `Category Display ${catIdx + 1}`, value: catCoding.display });
                    });
                  }
                });
              }
              
              // Observation Code - CLEARLY SHOWN
              if (res?.code) {
                if (res.code.text) observationFields.push({ label: '🔬 Test Name', value: res.code.text });
                if (res.code.coding && Array.isArray(res.code.coding)) {
                  res.code.coding.forEach((coding: any, codIdx: number) => {
                    if (coding.system && coding.code && coding.display) {
                      const systemName = coding.system.includes('loinc') ? 'LOINC' : coding.system.includes('snomed') ? 'SNOMED' : 'Code';
                      observationFields.push({ 
                        label: `🏷️ ${systemName} Code ${codIdx + 1}`, 
                        value: `[${coding.code}] ${coding.display}` 
                      });
                    }
                  });
                }
              }
              
              // Observation Date
              if (res?.effectiveDateTime) observationFields.push({ label: '📅 Date', value: res.effectiveDateTime });
              
              // Performer
              if (res?.performer && Array.isArray(res.performer)) {
                res.performer.forEach((perf: any, perfIdx: number) => {
                  if (perf.reference) observationFields.push({ label: `Performer ${perfIdx + 1}`, value: perf.reference });
                });
              }
              
              // Value
              if (res?.valueString) observationFields.push({ label: '📈 Result Summary', value: res.valueString });
              if (res?.valueQuantity) {
                observationFields.push({ 
                  label: '📈 Result Value', 
                  value: `${res.valueQuantity.value} ${res.valueQuantity.unit || ''}`.trim() 
                });
              }
              
              // Components (for multi-part observations like vitals)
              if (res?.component && Array.isArray(res.component)) {
                res.component.forEach((comp: any, compIdx: number) => {
                  if (comp.code?.text) {
                    let compValue = '';
                    if (comp.valueQuantity) {
                      compValue = `${comp.valueQuantity.value} ${comp.valueQuantity.unit || ''}`.trim();
                    } else if (comp.valueString) {
                      compValue = comp.valueString;
                    }
                    if (compValue) {
                      observationFields.push({ 
                        label: `📊 ${comp.code.text}`, 
                        value: compValue 
                      });
                    }
                  }
                });
              }
              
              // Interpretation
              if (res?.interpretation && Array.isArray(res.interpretation)) {
                res.interpretation.forEach((interp: any, interpIdx: number) => {
                  if (interp.text) observationFields.push({ label: `💡 Interpretation ${interpIdx + 1}`, value: interp.text });
                  if (interp.coding && Array.isArray(interp.coding)) {
                    interp.coding.forEach((coding: any, codIdx: number) => {
                      if (coding.code && coding.display) {
                        observationFields.push({ 
                          label: `🏷️ Interpretation Code ${interpIdx + 1}.${codIdx + 1}`, 
                          value: `[${coding.code}] ${coding.display}` 
                        });
                      }
                    });
                  }
                });
              }
              
              if (observationFields.length > 0) {
                const obsTitle = res?.code?.text || `Observation ${index + 1}`;
                tableData.push({ category: `🔬 ${obsTitle}`, fields: observationFields });
              }
            });
          }

          // Device Requests (DME Orders)
          const deviceRequests = jsonContent.entry.filter((entry: any) => entry.resource?.resourceType === 'DeviceRequest');
          if (deviceRequests.length > 0) {
            deviceRequests.forEach((device: any, index: number) => {
              const deviceFields: Array<{ label: string; value: string }> = [];
              const res = device.resource;
              
              if (res?.id) deviceFields.push({ label: '🆔 Request ID', value: res.id });
              if (res?.status) deviceFields.push({ label: '📊 Status', value: res.status.toUpperCase() });
              if (res?.intent) deviceFields.push({ label: 'Intent', value: res.intent.toUpperCase() });
              if (res?.priority) deviceFields.push({ label: 'Priority', value: res.priority.toUpperCase() });
              
              // Device Code - CLEARLY SHOWN
              if (res?.codeCodeableConcept) {
                if (res.codeCodeableConcept.text) deviceFields.push({ label: '🏥 Device Description', value: res.codeCodeableConcept.text });
                if (res.codeCodeableConcept.coding && Array.isArray(res.codeCodeableConcept.coding)) {
                  res.codeCodeableConcept.coding.forEach((coding: any, codIdx: number) => {
                    if (coding.system && coding.code && coding.display) {
                      const systemName = coding.system.includes('HCPCS') ? 'HCPCS' : 'Code';
                      deviceFields.push({ 
                        label: `🏷️ ${systemName} Code ${codIdx + 1}`, 
                        value: `[${coding.code}] ${coding.display}` 
                      });
                    }
                  });
                }
              }
              
              // Quantity
              if (res?.quantityQuantity) {
                deviceFields.push({ 
                  label: 'Quantity', 
                  value: `${res.quantityQuantity.value} ${res.quantityQuantity.unit || ''}`.trim() 
                });
              }
              
              // Parameters (device settings)
              if (res?.parameter && Array.isArray(res.parameter)) {
                res.parameter.forEach((param: any, paramIdx: number) => {
                  if (param.code?.text) {
                    let paramValue = '';
                    if (param.valueCodeableConcept?.coding && Array.isArray(param.valueCodeableConcept.coding)) {
                      const coding = param.valueCodeableConcept.coding[0];
                      if (coding.code && coding.display) {
                        paramValue = `[${coding.code}] ${coding.display}`;
                      }
                    } else if (param.valueInteger) {
                      paramValue = param.valueInteger.toString();
                    } else if (param.valueString) {
                      paramValue = param.valueString;
                    }
                    if (paramValue) {
                      deviceFields.push({ 
                        label: `⚙️ ${param.code.text}`, 
                        value: paramValue 
                      });
                    }
                  }
                });
              }
              
              // Reason for Request
              if (res?.reasonReference && Array.isArray(res.reasonReference)) {
                res.reasonReference.forEach((reason: any, reasonIdx: number) => {
                  if (reason.reference) deviceFields.push({ label: `Clinical Justification ${reasonIdx + 1}`, value: reason.reference });
                });
              }
              
              // Dates
              if (res?.authoredOn) deviceFields.push({ label: '📅 Order Date', value: res.authoredOn });
              
              // Requester
              if (res?.requester?.reference) deviceFields.push({ label: '👨‍⚕️ Ordering Provider', value: res.requester.reference });
              
              if (deviceFields.length > 0) {
                tableData.push({ category: `🛠️ Device Request ${index + 1}`, fields: deviceFields });
              }
            });
          }
        }
      }

      // Insurance Card specific handling
      if (jsonContent.documentType === 'Insurance Card') {
        if (jsonContent.insuranceCard) {
          const card = jsonContent.insuranceCard;
          
          // Insurance Company Information
          const companyFields = [];
          if (card.insuranceCompany) companyFields.push({ label: 'Insurance Company', value: card.insuranceCompany });
          if (card.planName) companyFields.push({ label: 'Plan Name', value: card.planName });
          if (card.groupNumber) companyFields.push({ label: 'Group Number', value: card.groupNumber });
          
          if (companyFields.length > 0) {
            tableData.push({ category: 'Insurance Company', fields: companyFields });
          }

          // Member Information
          if (card.memberInformation) {
            const memberFields = [];
            if (card.memberInformation.memberName) memberFields.push({ label: 'Member Name', value: card.memberInformation.memberName });
            if (card.memberInformation.memberId) memberFields.push({ label: 'Member ID', value: card.memberInformation.memberId });
            if (card.memberInformation.dateOfBirth) memberFields.push({ label: 'Date of Birth', value: card.memberInformation.dateOfBirth });
            if (card.memberInformation.address) memberFields.push({ label: 'Address', value: card.memberInformation.address });
            if (card.memberInformation.phoneNumber) memberFields.push({ label: 'Phone Number', value: card.memberInformation.phoneNumber });
            
            if (memberFields.length > 0) {
              tableData.push({ category: 'Member Information', fields: memberFields });
            }
          }

          // Provider Information
          if (card.providerInformation) {
            const providerFields = [];
            if (card.providerInformation.customerService) providerFields.push({ label: 'Customer Service', value: card.providerInformation.customerService });
            if (card.providerInformation.claimsFax) providerFields.push({ label: 'Claims Fax', value: card.providerInformation.claimsFax });
            
            if (providerFields.length > 0) {
              tableData.push({ category: 'Provider Information', fields: providerFields });
            }
          }

          // Medical Information
          if (card.medicalInformation) {
            const medicalFields = [];
            if (card.medicalInformation.primaryDiagnosis) medicalFields.push({ label: 'Primary Diagnosis', value: card.medicalInformation.primaryDiagnosis });
            
            if (medicalFields.length > 0) {
              tableData.push({ category: 'Medical Information', fields: medicalFields });
            }
          }

          // Metadata
          if (card.metadata) {
            const metadataFields = [];
            if (card.metadata.mrn) metadataFields.push({ label: 'MRN', value: card.metadata.mrn });
            if (card.metadata.ssn) metadataFields.push({ label: 'SSN', value: card.metadata.ssn });
            if (card.metadata.sampleDisclaimer) metadataFields.push({ label: 'Disclaimer', value: card.metadata.sampleDisclaimer });
            if (card.metadata.barcode !== undefined) metadataFields.push({ label: 'Barcode', value: card.metadata.barcode ? 'Yes' : 'No' });
            
            if (metadataFields.length > 0) {
              tableData.push({ category: 'Metadata', fields: metadataFields });
            }
          }
        }
      }

      return tableData;
    };

    const tableData = generateTableData();

    return (
      <TableContainer component={Paper} sx={{ maxHeight: '500px', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Field</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((section: any, sectionIndex: number) => (
              section.fields.map((field: any, fieldIndex: number) => (
                <TableRow key={`${sectionIndex}-${fieldIndex}`}>
                  {fieldIndex === 0 && (
                    <TableCell 
                      rowSpan={section.fields.length}
                      sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#e3f2fd',
                        verticalAlign: 'top',
                        borderRight: '2px solid #2196f3'
                      }}
                    >
                      {section.category}
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 'medium' }}>{field.label}</TableCell>
                  <TableCell>{field.value}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderLeftPanel = () => {
    if (loading) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading document content...</Typography>
        </Box>
      );
    }

    return (
      <Paper sx={{ 
        p: 0, 
        height: '500px', 
        overflow: 'auto', 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        minWidth: 0,
        position: 'relative'
      }}>
        {pdfLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <LinearProgress sx={{ width: '50%' }} />
          </Box>
        )}
        <Document
          file={`${window.location.origin}${doc?.originalUrl || doc?.url}`}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          onLoadStart={onDocumentLoadStart}
          options={{
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
            cMapPacked: true,
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
            disableFontFace: false,
            useSystemFonts: false,
            disableRange: false,
            disableStream: false,
            disableAutoFetch: false,
            isEvalSupported: false,
            maxImageSize: 16777216,
            useWorkerFetch: false,
            isOffscreenCanvasSupported: false,
            verbosity: 0
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-start', 
            flexGrow: 1,
            width: '100%',
            overflow: 'auto',
            p: 2,
            minHeight: '400px',
            position: 'relative'
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-start',
              width: '100%',
              maxWidth: '100%'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                width: '100%'
              }}>
                <Page
                  pageNumber={pageNumber}
                  scale={zoomLevel / 100}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  renderForms={true}
                  width={pageWidth}
                  canvasBackground="white"
                />
              </Box>
            </Box>
          </Box>
        </Document>
        {numPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 2 }}>
            <IconButton
              size="small"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <Typography variant="body2">
              Page {pageNumber} of {numPages}
            </Typography>
            <IconButton
              size="small"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        )}
      </Paper>
    );
  };

  const renderRightPanel = () => {
    if (loading) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading extracted content...</Typography>
        </Box>
      );
    }

    switch (activeTab) {
      case 'extracted':
        return (
          <Box sx={{ height: '500px', overflow: 'auto' }}>
            {renderExtractedTable()}
          </Box>
        );
      case 'json':
        return (
          <Paper sx={{ p: 2, height: '500px', overflow: 'auto', fontSize: `${zoomLevel}%` }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {formatJsonContent(jsonContent)}
            </Typography>
          </Paper>
        );
      default:
        return (
          <Box sx={{ height: '500px', overflow: 'auto' }}>
            {renderExtractedTable()}
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DocumentIcon />
            <Typography variant="h6">
              Document Comparison: {doc?.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Zoom In">
              <IconButton size="small" onClick={() => setZoomLevel(prev => Math.min(prev + 10, 200))}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton size="small" onClick={() => setZoomLevel(prev => Math.max(prev - 10, 50))}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ ml: 1 }}>
              {zoomLevel}%
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Left Panel - Document Tabs */}
          <Box sx={{ width: '50%', borderRight: 1, borderColor: 'divider', minWidth: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Original Document
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Size: {doc?.size} • Uploaded: {doc?.uploadDate}
              </Typography>
              <Chip
                label={doc?.status.toUpperCase()}
                size="small"
                color="success"
                sx={{ mt: 1 }}
              />
            </Box>
            <Box sx={{ p: 2 }}>
              {renderLeftPanel()}
            </Box>
          </Box>

          {/* Right Panel - Extracted Content */}
          <Box sx={{ width: '50%', minWidth: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Extracted Content
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant={activeTab === 'extracted' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('extracted')}
                    startIcon={<CompareIcon />}
                  >
                    Table
                  </Button>
                  <Button
                    size="small"
                    variant={activeTab === 'json' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('json')}
                    startIcon={<JsonIcon />}
                  >
                    JSON
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              {renderRightPanel()}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(doc?.originalUrl || doc?.url || '', `${doc?.name}-original`)}
            variant="outlined"
          >
            Download Original
          </Button>
          {doc?.extractedUrl && (
            <Button
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload(doc.extractedUrl!, `${doc?.name}-extracted`)}
              variant="outlined"
            >
              Download Table
            </Button>
          )}
          {doc?.jsonUrl && (
            <Button
              startIcon={<JsonIcon />}
              onClick={() => handleDownload(doc.jsonUrl!, `${doc?.name}-structured`)}
              variant="outlined"
            >
              Download JSON
            </Button>
          )}
        </Box>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentComparisonViewer;
