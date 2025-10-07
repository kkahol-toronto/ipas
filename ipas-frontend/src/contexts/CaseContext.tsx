import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PriorAuthRequest, DashboardStats, Notification } from '../types';
import { emrNotificationService } from '../services/emrNotificationService';

interface CaseContextType {
  cases: PriorAuthRequest[];
  stats: DashboardStats;
  notifications: Notification[];
  selectedCase: PriorAuthRequest | null;
  setSelectedCase: (caseItem: PriorAuthRequest | null) => void;
  updateCase: (caseId: string, updates: Partial<PriorAuthRequest>) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  getEMRNotificationCount: () => number;
  isLoading: boolean;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

interface CaseProviderProps {
  children: ReactNode;
}

export const CaseProvider: React.FC<CaseProviderProps> = ({ children }) => {
  const [cases, setCases] = useState<PriorAuthRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCases: 0,
    pendingReview: 0,
    autoApproved: 0,
    humanReviewed: 0,
    averageProcessingTime: 0,
    approvalRate: 0,
    appealRate: 0,
    casesByStatus: {},
    casesByPriority: {}
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedCase, setSelectedCase] = useState<PriorAuthRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading - replace with actual API calls
    loadMockData();
  }, []);

  const loadMockData = async () => {
    setIsLoading(true);
    
    // Mock cases data
    const mockCases: PriorAuthRequest[] = [
      {
        id: '1001',
        caseId: 'PA-2024-001',
        patient: {
          id: 'p1',
          name: 'John Smith',
          dateOfBirth: '1965-03-15',
          memberId: 'M123456789',
          insurancePlan: 'Premium Plus',
          eligibilityStatus: 'active',
          coverageDetails: {
            planType: 'PPO',
            deductible: 1000,
            copay: 50,
            coverageLimits: {},
            exclusions: []
          }
        },
        provider: {
          id: 'prov1',
          name: 'Dr. Sarah Wilson',
          npi: '1234567890',
          specialty: 'Internal Medicine',
          credentials: ['MD'],
          networkStatus: 'in_network',
          qualityRating: 4.8
        },
        requestedService: {
          serviceType: 'hospitalization',
          procedureCode: '99223',
          diagnosisCode: 'J18.9',
          requestedLength: 3,
          unit: 'days',
          justification: 'Patient presents with severe pneumonia requiring inpatient care',
          clinicalNotes: 'Patient has low oxygen saturation and requires IV antibiotics'
        },
        clinicalData: {
          vitalSigns: {
            temperature: 101.2,
            bloodPressure: '140/90',
            heartRate: 95,
            respiratoryRate: 24,
            oxygenSaturation: 85
          },
          labResults: [],
          imagingResults: [],
          medications: [],
          allergies: ['Penicillin'],
          comorbidities: ['Diabetes', 'Hypertension'],
          chiefComplaint: 'Shortness of breath and fever',
          historyOfPresentIllness: '3-day history of worsening respiratory symptoms'
        },
        documents: [],
        status: 'approved',
        priority: 'medium',
        submittedDate: '2024-01-15T10:30:00Z',
        dueDate: '2024-01-18T10:30:00Z',
        aiRecommendation: {
          decision: 'approve',
          confidence: 0.95,
          rationale: 'Patient meets criteria for inpatient care due to hypoxia and pneumonia',
          criteria: [
            {
              criterion: 'Oxygen saturation < 90%',
              status: 'met',
              evidence: 'O2 sat 85% on room air',
              guideline: 'MCG Pneumonia Guidelines'
            }
          ],
          riskFactors: [],
          requiresHumanReview: false
        },
        humanReviewRequired: false,
        decision: {
          id: 'dec1',
          decision: 'approve',
          approvedBy: 'AI System',
          decisionDate: '2024-01-15T10:35:00Z',
          rationale: 'Meets criteria for inpatient hospitalization',
          validUntil: '2024-01-18T10:30:00Z'
        }
      },
      {
        id: '1002',
        caseId: 'PA-2024-002',
        patient: {
          id: 'p2',
          name: 'Jane Doe',
          dateOfBirth: '1978-07-22',
          memberId: 'M987654321',
          insurancePlan: 'Standard',
          eligibilityStatus: 'active',
          coverageDetails: {
            planType: 'HMO',
            deductible: 2000,
            copay: 100,
            coverageLimits: {},
            exclusions: []
          }
        },
        provider: {
          id: 'prov2',
          name: 'Dr. Michael Brown',
          npi: '0987654321',
          specialty: 'Cardiology',
          credentials: ['MD', 'FACC'],
          networkStatus: 'in_network',
          qualityRating: 4.9
        },
        requestedService: {
          serviceType: 'hospitalization',
          procedureCode: '99223',
          diagnosisCode: 'I25.10',
          requestedLength: 5,
          unit: 'days',
          justification: 'Patient requires cardiac monitoring post-MI',
          clinicalNotes: 'Recent myocardial infarction with ongoing monitoring needs'
        },
        clinicalData: {
          vitalSigns: {
            temperature: 98.6,
            bloodPressure: '120/80',
            heartRate: 72,
            respiratoryRate: 16,
            oxygenSaturation: 98
          },
          labResults: [],
          imagingResults: [],
          medications: [],
          allergies: [],
          comorbidities: ['Coronary Artery Disease'],
          chiefComplaint: 'Chest pain',
          historyOfPresentIllness: 'Acute MI 2 days ago, stable but requires monitoring'
        },
        documents: [],
        status: 'under_review',
        priority: 'high',
        submittedDate: '2024-01-16T14:20:00Z',
        dueDate: '2024-01-19T14:20:00Z',
        aiRecommendation: {
          decision: 'approve',
          confidence: 0.78,
          rationale: 'Patient meets criteria but requires human review due to complexity',
          criteria: [
            {
              criterion: 'Recent MI requiring monitoring',
              status: 'met',
              evidence: 'MI 2 days ago, stable vitals',
              guideline: 'Cardiology Guidelines'
            }
          ],
          riskFactors: ['Recent MI'],
          requiresHumanReview: true
        },
        humanReviewRequired: true
      }
    ];

    setCases(mockCases);

    // Mock stats
    const mockStats: DashboardStats = {
      totalCases: 150,
      pendingReview: 25,
      autoApproved: 89,
      humanReviewed: 36,
      averageProcessingTime: 2.5,
      approvalRate: 0.78,
      appealRate: 0.12,
      casesByStatus: {
        approved: 89,
        denied: 15,
        pending: 25,
        under_review: 21
      },
      casesByPriority: {
        low: 45,
        medium: 78,
        high: 22,
        urgent: 5
      }
    };

    setStats(mockStats);

    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: 'n0',
        type: 'case_assigned',
        title: 'Approval Letter Generated',
        message: 'Approval letter for Case PA-2024-001 (John Smith) has been generated and is ready for download',
        priority: 'high',
        timestamp: new Date().toISOString(),
        read: false,
        actionRequired: false,
        caseId: '1001'
      },
      {
        id: 'n1',
        type: 'decision_required',
        title: 'High Priority Case Requires Review',
        message: 'Case PA-2024-002 needs physician review',
        priority: 'high',
        timestamp: '2024-01-16T15:30:00Z',
        read: false,
        actionRequired: true,
        caseId: '1002'
      },
      {
        id: 'n2',
        type: 'case_assigned',
        title: 'New Case Assigned',
        message: 'Case PA-2024-003 has been assigned to you',
        priority: 'medium',
        timestamp: '2024-01-16T14:15:00Z',
        read: true,
        actionRequired: false,
        caseId: '1003'
      }
    ];

    setNotifications(mockNotifications);
    setIsLoading(false);
  };

  const updateCase = (caseId: string, updates: Partial<PriorAuthRequest>) => {
    setCases(prevCases => 
      prevCases.map(caseItem => 
        caseItem.id === caseId ? { ...caseItem, ...updates } : caseItem
      )
    );
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getEMRNotificationCount = () => {
    return emrNotificationService.getNotificationCount();
  };

  return (
    <CaseContext.Provider value={{
      cases,
      stats,
      notifications,
      selectedCase,
      setSelectedCase,
      updateCase,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      getEMRNotificationCount,
      isLoading
    }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCases = (): CaseContextType => {
  const context = useContext(CaseContext);
  if (context === undefined) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
};
