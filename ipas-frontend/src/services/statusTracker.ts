// Local NDJSON-like status tracking system
export interface StatusUpdate {
  caseId: string;
  status: 'pending' | 'approved' | 'partially-approved' | 'denied' | 'under_review';
  timestamp: string;
  updatedBy: string;
  reason?: string;
  notes?: string;
}

export interface CaseStatus {
  caseId: string;
  currentStatus: StatusUpdate['status'];
  statusHistory: StatusUpdate[];
  lastUpdated: string;
  isCompleted: boolean;
}

class StatusTracker {
  private readonly STORAGE_KEY = 'ipas_case_statuses';
  private readonly STATUS_LOG_KEY = 'ipas_status_log';

  // Initialize default statuses for cases
  initializeDefaultStatuses(): void {
    const defaultStatuses: { [caseId: string]: CaseStatus } = {
      'PA-2024-001': {
        caseId: 'PA-2024-001',
        currentStatus: 'pending',
        statusHistory: [{
          caseId: 'PA-2024-001',
          status: 'pending',
          timestamp: new Date().toISOString(),
          updatedBy: 'system',
          reason: 'Initial status'
        }],
        lastUpdated: new Date().toISOString(),
        isCompleted: false
      },
      'PA-2024-002': {
        caseId: 'PA-2024-002',
        currentStatus: 'pending',
        statusHistory: [{
          caseId: 'PA-2024-002',
          status: 'pending',
          timestamp: new Date().toISOString(),
          updatedBy: 'system',
          reason: 'Initial status'
        }],
        lastUpdated: new Date().toISOString(),
        isCompleted: false
      },
      'PA-2024-003': {
        caseId: 'PA-2024-003',
        currentStatus: 'pending',
        statusHistory: [{
          caseId: 'PA-2024-003',
          status: 'pending',
          timestamp: new Date().toISOString(),
          updatedBy: 'system',
          reason: 'Initial status'
        }],
        lastUpdated: new Date().toISOString(),
        isCompleted: false
      },
      'PA-2024-004': {
        caseId: 'PA-2024-004',
        currentStatus: 'pending',
        statusHistory: [{
          caseId: 'PA-2024-004',
          status: 'pending',
          timestamp: new Date().toISOString(),
          updatedBy: 'system',
          reason: 'Initial status'
        }],
        lastUpdated: new Date().toISOString(),
        isCompleted: false
      },
      'PA-2024-005': {
        caseId: 'PA-2024-005',
        currentStatus: 'pending',
        statusHistory: [{
          caseId: 'PA-2024-005',
          status: 'pending',
          timestamp: new Date().toISOString(),
          updatedBy: 'system',
          reason: 'Initial status'
        }],
        lastUpdated: new Date().toISOString(),
        isCompleted: false
      },
      'PA-2024-006': {
        caseId: 'PA-2024-006',
        currentStatus: 'pending',
        statusHistory: [{
          caseId: 'PA-2024-006',
          status: 'pending',
          timestamp: new Date().toISOString(),
          updatedBy: 'system',
          reason: 'Initial status'
        }],
        lastUpdated: new Date().toISOString(),
        isCompleted: false
      },
      'PA-2024-007': {
        caseId: 'PA-2024-007',
        currentStatus: 'pending',
        statusHistory: [{
          caseId: 'PA-2024-007',
          status: 'pending',
          timestamp: new Date().toISOString(),
          updatedBy: 'system',
          reason: 'Initial status'
        }],
        lastUpdated: new Date().toISOString(),
        isCompleted: false
      }
    };

    // Only initialize if no data exists or is empty
    const existingStatuses = this.getAllStatuses();
    if (!existingStatuses || Object.keys(existingStatuses).length === 0) {
      this.saveAllStatuses(defaultStatuses);
      console.log('✓ Initialized default case statuses');
    }
  }

  // Get all case statuses
  getAllStatuses(): { [caseId: string]: CaseStatus } {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading statuses from localStorage:', error);
      return {};
    }
  }

  // Save all case statuses
  private saveAllStatuses(statuses: { [caseId: string]: CaseStatus }): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(statuses));
    } catch (error) {
      console.error('Error saving statuses to localStorage:', error);
    }
  }

  // Get status for a specific case
  getCaseStatus(caseId: string): CaseStatus | null {
    const allStatuses = this.getAllStatuses();
    return allStatuses[caseId] || null;
  }

  // Update case status
  updateCaseStatus(
    caseId: string, 
    newStatus: StatusUpdate['status'], 
    updatedBy: string = 'user',
    reason?: string,
    notes?: string
  ): void {
    const allStatuses = this.getAllStatuses();
    const currentStatus = allStatuses[caseId];

    if (!currentStatus) {
      console.warn(`⚠️ Case ${caseId} not found in status tracking - available cases:`, Object.keys(allStatuses));
      return;
    }

    console.log(`📝 Updating case ${caseId} from ${currentStatus.currentStatus} to ${newStatus}`);

    const statusUpdate: StatusUpdate = {
      caseId,
      status: newStatus,
      timestamp: new Date().toISOString(),
      updatedBy,
      reason,
      notes
    };

    const updatedStatus: CaseStatus = {
      ...currentStatus,
      currentStatus: newStatus,
      statusHistory: [...currentStatus.statusHistory, statusUpdate],
      lastUpdated: new Date().toISOString(),
      isCompleted: ['approved', 'denied', 'partially-approved'].includes(newStatus)
    };

    allStatuses[caseId] = updatedStatus;
    this.saveAllStatuses(allStatuses);
    console.log(`✅ Case ${caseId} status saved successfully. New status: ${newStatus}, isCompleted: ${updatedStatus.isCompleted}`);

    // Log the status update (NDJSON format)
    this.logStatusUpdate(statusUpdate);
  }

  // Log status update in NDJSON format
  private logStatusUpdate(update: StatusUpdate): void {
    try {
      const existingLog = localStorage.getItem(this.STATUS_LOG_KEY) || '';
      const newLogEntry = JSON.stringify(update) + '\n';
      localStorage.setItem(this.STATUS_LOG_KEY, existingLog + newLogEntry);
    } catch (error) {
      console.error('Error logging status update:', error);
    }
  }

  // Get status log (NDJSON format)
  getStatusLog(): StatusUpdate[] {
    try {
      const logData = localStorage.getItem(this.STATUS_LOG_KEY) || '';
      return logData
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
    } catch (error) {
      console.error('Error reading status log:', error);
      return [];
    }
  }

  // Simulate workflow progression (for demo purposes)
  simulateWorkflowProgression(caseId: string): void {
    const statuses: StatusUpdate['status'][] = ['pending', 'under_review', 'approved'];
    const currentStatus = this.getCaseStatus(caseId);
    
    if (!currentStatus) return;

    const currentIndex = statuses.indexOf(currentStatus.currentStatus);
    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      this.updateCaseStatus(
        caseId, 
        nextStatus, 
        'system',
        'Workflow progression',
        'Automated workflow advancement'
      );
    }
  }

  // Reset all statuses to pending
  resetAllStatuses(): void {
    const allStatuses = this.getAllStatuses();
    Object.keys(allStatuses).forEach(caseId => {
      this.updateCaseStatus(caseId, 'pending', 'system', 'Reset to initial status');
    });
  }

  // Get cases by status
  getCasesByStatus(status: StatusUpdate['status']): CaseStatus[] {
    const allStatuses = this.getAllStatuses();
    return Object.values(allStatuses).filter(caseStatus => caseStatus.currentStatus === status);
  }

  // Get completion statistics
  getCompletionStats(): {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    completionRate: number;
  } {
    const allStatuses = this.getAllStatuses();
    const cases = Object.values(allStatuses);
    const completed = cases.filter(c => c.isCompleted).length;
    const pending = cases.filter(c => c.currentStatus === 'pending').length;
    const inProgress = cases.filter(c => ['under_review'].includes(c.currentStatus)).length;

    return {
      total: cases.length,
      completed,
      pending,
      inProgress,
      completionRate: cases.length > 0 ? (completed / cases.length) * 100 : 0
    };
  }
}

// Export singleton instance
export const statusTracker = new StatusTracker();

// Initialize default statuses when module loads
statusTracker.initializeDefaultStatuses();
