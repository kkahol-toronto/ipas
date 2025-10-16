/**
 * EMR Notification Service
 * Handles notifications for EMR integration and hospital order entry
 */

export interface EMRNotification {
  id: string;
  caseId: string;
  type: 'provider_sent' | 'hospital_received' | 'order_placed' | 'order_failed';
  timestamp: string;
  status: 'pending' | 'sent' | 'received' | 'failed';
  message: string;
  details: {
    providerName?: string;
    hospitalName?: string;
    orderId?: string;
    EMRPatientId?: string;
    authorizationNumber?: string;
    procedureCode?: string;
    errorMessage?: string;
  };
}

export interface EMRIntegrationStatus {
  caseId: string;
  providerNotification: {
    sent: boolean;
    timestamp?: string;
    status: 'pending' | 'sent' | 'failed';
  };
  hospitalNotification: {
    received: boolean;
    timestamp?: string;
    orderPlaced: boolean;
    orderId?: string;
    status: 'pending' | 'received' | 'order_placed' | 'failed';
  };
}

class EMRNotificationService {
  private readonly STORAGE_KEY = 'ipas_emr_notifications';
  private readonly INTEGRATION_STATUS_KEY = 'ipas_emr_integration_status';

  // Get all EMR notifications
  getAllNotifications(): EMRNotification[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading EMR notifications:', error);
      return [];
    }
  }

  // Get notifications for a specific case
  getCaseNotifications(caseId: string): EMRNotification[] {
    return this.getAllNotifications().filter(notification => notification.caseId === caseId);
  }

  // Add a new EMR notification
  addNotification(notification: Omit<EMRNotification, 'id' | 'timestamp'>): EMRNotification {
    const newNotification: EMRNotification = {
      ...notification,
      id: `emr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    const allNotifications = this.getAllNotifications();
    allNotifications.push(newNotification);
    this.saveNotifications(allNotifications);

    return newNotification;
  }

  // Simulate sending authorization to EMR
  sendToEMR(caseId: string, providerName: string, authorizationNumber: string, procedureCode: string): Promise<EMRNotification> {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        try {
          const notification = this.addNotification({
            caseId,
            type: 'provider_sent',
            status: 'sent',
            message: `Authorization sent to EMR for ${providerName}`,
            details: {
              providerName,
              authorizationNumber,
              procedureCode,
              EMRPatientId: `EMR_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
            }
          });

          // Update integration status
          this.updateIntegrationStatus(caseId, 'provider', 'sent');

          resolve(notification);
        } catch (error) {
          reject(error);
        }
      }, 1000); // Reduced delay to 1 second for faster response
    });
  }

  // Simulate hospital receiving notification from EMR
  simulateHospitalNotification(caseId: string, hospitalName: string, delay: number = 2000): Promise<EMRNotification> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = this.addNotification({
          caseId,
          type: 'hospital_received',
          status: 'received',
          message: `Hospital ${hospitalName} received authorization notification from EMR`,
          details: {
            hospitalName,
            authorizationNumber: `AUTH_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
          }
        });

        // Update integration status
        this.updateIntegrationStatus(caseId, 'hospital', 'received');

        resolve(notification);
      }, delay);
    });
  }

  // Simulate order placement in hospital system
  simulateOrderPlacement(caseId: string, hospitalName: string, delay: number = 2000): Promise<EMRNotification> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = `ORD_${Math.random().toString(36).substr(2, 10).toUpperCase()}`;
        const notification = this.addNotification({
          caseId,
          type: 'order_placed',
          status: 'received',
          message: `Order placed successfully in ${hospitalName} system`,
          details: {
            hospitalName,
            orderId,
            authorizationNumber: `AUTH_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
          }
        });

        // Update integration status
        this.updateIntegrationStatus(caseId, 'hospital', 'order_placed', orderId);

        resolve(notification);
      }, delay);
    });
  }

  // Get integration status for a case
  getIntegrationStatus(caseId: string): EMRIntegrationStatus | null {
    try {
      const stored = localStorage.getItem(this.INTEGRATION_STATUS_KEY);
      const allStatuses = stored ? JSON.parse(stored) : {};
      return allStatuses[caseId] || null;
    } catch (error) {
      console.error('Error loading EMR integration status:', error);
      return null;
    }
  }

  // Update integration status
  private updateIntegrationStatus(
    caseId: string, 
    side: 'provider' | 'hospital', 
    status: 'sent' | 'received' | 'order_placed' | 'failed',
    orderId?: string
  ): void {
    try {
      const stored = localStorage.getItem(this.INTEGRATION_STATUS_KEY);
      const allStatuses = stored ? JSON.parse(stored) : {};
      
      if (!allStatuses[caseId]) {
        allStatuses[caseId] = {
          caseId,
          providerNotification: { sent: false, status: 'pending' },
          hospitalNotification: { received: false, orderPlaced: false, status: 'pending' }
        };
      }

      if (side === 'provider') {
        allStatuses[caseId].providerNotification = {
          sent: status === 'sent',
          timestamp: new Date().toISOString(),
          status
        };
      } else if (side === 'hospital') {
        allStatuses[caseId].hospitalNotification = {
          received: status === 'received' || status === 'order_placed',
          timestamp: new Date().toISOString(),
          orderPlaced: status === 'order_placed',
          orderId: orderId || allStatuses[caseId].hospitalNotification.orderId,
          status
        };
      }

      localStorage.setItem(this.INTEGRATION_STATUS_KEY, JSON.stringify(allStatuses));
    } catch (error) {
      console.error('Error updating EMR integration status:', error);
    }
  }

  // Save notifications to localStorage
  private saveNotifications(notifications: EMRNotification[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving EMR notifications:', error);
    }
  }

  // Clear all notifications (for testing)
  clearAllNotifications(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.INTEGRATION_STATUS_KEY);
  }

  // Get notification count for dashboard
  getNotificationCount(): number {
    return this.getAllNotifications().filter(n => n.status === 'pending' || n.status === 'sent').length;
  }
}

// Export singleton instance
export const emrNotificationService = new EMRNotificationService();
export default emrNotificationService;
