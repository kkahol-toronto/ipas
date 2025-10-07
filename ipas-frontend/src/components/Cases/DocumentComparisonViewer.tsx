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
        if (jsonContent.formData) {
          const formFields = [];
          if (jsonContent.formData.issuerName) formFields.push({ label: 'Issuer Name', value: jsonContent.formData.issuerName });
          if (jsonContent.formData.issuerPhone) formFields.push({ label: 'Issuer Phone', value: jsonContent.formData.issuerPhone });
          if (jsonContent.formData.issuerFax) formFields.push({ label: 'Issuer Fax', value: jsonContent.formData.issuerFax });
          if (jsonContent.formData.requestDate) formFields.push({ label: 'Request Date', value: jsonContent.formData.requestDate });
          if (jsonContent.formData.reviewType) formFields.push({ label: 'Review Type', value: jsonContent.formData.reviewType });
          if (jsonContent.formData.requestType) formFields.push({ label: 'Request Type', value: jsonContent.formData.requestType });
          
          if (formFields.length > 0) {
            tableData.push({ category: 'Form Data', fields: formFields });
          }
        }

        if (jsonContent.requestedService) {
          const serviceFields = [];
          if (jsonContent.requestedService.procedure) serviceFields.push({ label: 'Procedure', value: jsonContent.requestedService.procedure });
          if (jsonContent.requestedService.code) serviceFields.push({ label: 'Code', value: jsonContent.requestedService.code });
          if (jsonContent.requestedService.startDate) serviceFields.push({ label: 'Start Date', value: jsonContent.requestedService.startDate });
          if (jsonContent.requestedService.endDate) serviceFields.push({ label: 'End Date', value: jsonContent.requestedService.endDate });
          if (jsonContent.requestedService.diagnosis?.description) serviceFields.push({ label: 'Diagnosis', value: jsonContent.requestedService.diagnosis.description });
          if (jsonContent.requestedService.diagnosis?.code) serviceFields.push({ label: 'Diagnosis Code', value: jsonContent.requestedService.diagnosis.code });
          if (jsonContent.requestedService.setting) serviceFields.push({ label: 'Setting', value: jsonContent.requestedService.setting });
          if (jsonContent.requestedService.numberOfSessions) serviceFields.push({ label: 'Number of Sessions', value: jsonContent.requestedService.numberOfSessions });
          
          if (serviceFields.length > 0) {
            tableData.push({ category: 'Requested Service', fields: serviceFields });
          }
        }

        if (jsonContent.clinicalJustification) {
          const justificationFields = [];
          if (jsonContent.clinicalJustification.medicalNecessity) justificationFields.push({ label: 'Medical Necessity', value: jsonContent.clinicalJustification.medicalNecessity });
          if (jsonContent.clinicalJustification.clinicalFindings) justificationFields.push({ label: 'Clinical Findings', value: Array.isArray(jsonContent.clinicalJustification.clinicalFindings) ? jsonContent.clinicalJustification.clinicalFindings.join(', ') : jsonContent.clinicalJustification.clinicalFindings });
          if (jsonContent.clinicalJustification.priorTreatments) justificationFields.push({ label: 'Prior Treatments', value: Array.isArray(jsonContent.clinicalJustification.priorTreatments) ? jsonContent.clinicalJustification.priorTreatments.join(', ') : jsonContent.clinicalJustification.priorTreatments });
          
          if (justificationFields.length > 0) {
            tableData.push({ category: 'Clinical Justification', fields: justificationFields });
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
