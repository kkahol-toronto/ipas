// Core types for IPAS system

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'reviewer' | 'provider' | 'admin' | 'physician';
  department?: string;
  permissions: string[];
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  memberId: string;
  insurancePlan: string;
  eligibilityStatus: 'active' | 'inactive' | 'pending';
  coverageDetails: CoverageDetails;
}

export interface CoverageDetails {
  planType: string;
  deductible: number;
  copay: number;
  coverageLimits: Record<string, any>;
  exclusions: string[];
}

export interface PriorAuthRequest {
  id: string;
  caseId: string;
  patient: Patient;
  provider: Provider;
  requestedService: ServiceRequest;
  clinicalData: ClinicalData;
  documents: Document[];
  status: 'pending' | 'approved' | 'denied' | 'partial' | 'under_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
  dueDate: string;
  aiRecommendation?: AIRecommendation;
  humanReviewRequired: boolean;
  decision?: Decision;
  extensions?: ExtensionRequest[];
}

export interface Provider {
  id: string;
  name: string;
  npi: string;
  specialty: string;
  credentials: string[];
  networkStatus: 'in_network' | 'out_of_network';
  qualityRating?: number;
}

export interface ServiceRequest {
  serviceType: 'hospitalization' | 'surgery' | 'imaging' | 'therapy' | 'medication';
  procedureCode: string;
  diagnosisCode: string;
  requestedLength: number;
  unit: 'days' | 'sessions' | 'units';
  justification: string;
  clinicalNotes: string;
}

export interface ClinicalData {
  vitalSigns: VitalSigns;
  labResults: LabResult[];
  imagingResults: ImagingResult[];
  medications: Medication[];
  allergies: string[];
  comorbidities: string[];
  chiefComplaint: string;
  historyOfPresentIllness: string;
}

export interface VitalSigns {
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

export interface LabResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  date: string;
  status: 'normal' | 'abnormal' | 'critical';
}

export interface ImagingResult {
  studyType: string;
  findings: string;
  date: string;
  radiologist: string;
  impression: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  indication: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'prior_auth_form' | 'clinical_note' | 'lab_result' | 'imaging' | 'discharge_summary';
  url: string;
  uploadedDate: string;
  parsedContent?: string;
  extractedData?: Record<string, any>;
}

export interface AIRecommendation {
  decision: 'approve' | 'deny' | 'partial' | 'request_info';
  confidence: number;
  rationale: string;
  criteria: CriteriaCheck[];
  riskFactors: string[];
  suggestedAlternatives?: string[];
  requiresHumanReview: boolean;
}

export interface CriteriaCheck {
  criterion: string;
  status: 'met' | 'not_met' | 'partial' | 'unknown';
  evidence: string;
  guideline: string;
}

export interface Decision {
  id: string;
  decision: 'approve' | 'deny' | 'partial';
  approvedBy: string;
  decisionDate: string;
  rationale: string;
  conditions?: string[];
  validUntil?: string;
  appealDeadline?: string;
}

export interface ExtensionRequest {
  id: string;
  originalRequestId: string;
  requestedDays: number;
  justification: string;
  clinicalUpdate: string;
  status: 'pending' | 'approved' | 'denied';
  submittedDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  type: 'text' | 'simulation' | 'analysis' | 'recommendation';
  metadata?: Record<string, any>;
}

export interface SimulationResult {
  id: string;
  scenario: string;
  decisionPath: DecisionNode[];
  confidence: number;
  outcome: string;
  alternatives: string[];
  visualizations: Visualization[];
}

export interface DecisionNode {
  id: string;
  name: string;
  type: 'criteria_check' | 'data_retrieval' | 'analysis' | 'decision';
  status: 'passed' | 'failed' | 'pending';
  details: string;
  children?: DecisionNode[];
}

export interface Visualization {
  type: 'flowchart' | 'timeline' | 'criteria_matrix' | 'confidence_graph';
  data: any;
  title: string;
}

export interface Notification {
  id: string;
  type: 'case_assigned' | 'decision_required' | 'urgent_review' | 'system_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  caseId?: string;
}

export interface AuditLog {
  id: string;
  caseId: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  changes?: Record<string, any>;
}

export interface DashboardStats {
  totalCases: number;
  pendingReview: number;
  autoApproved: number;
  humanReviewed: number;
  averageProcessingTime: number;
  approvalRate: number;
  appealRate: number;
  casesByStatus: Record<string, number>;
  casesByPriority: Record<string, number>;
}
