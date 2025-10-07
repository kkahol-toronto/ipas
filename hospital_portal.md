# Hospital Portal - EMR Integration Verification

## 🏥 Hospital Portal Access

**URL**: `http://localhost:3000/hospital-portal`

## 📋 Purpose

The Hospital Portal provides a sample hospital EMR system to verify the EPIC EMR integration and order placement workflow. This allows you to see the hospital's perspective when receiving authorizations from the IPAS system.

## 🔄 How to Test the EMR Integration

### Step 1: Complete a Case in IPAS
1. Go to the main IPAS system
2. Navigate to **Cases** → Select a case (e.g., PA-2024-001)
3. Complete the workflow until **Provider Notification** step
4. Watch for EMR notifications next to the "Download Letter" button:
   - ✅ "Sent to EPIC" 
   - ✅ "Hospital Notified"
   - ✅ "Order Placed"

### Step 2: Verify in Hospital Portal
1. Open the Hospital Portal: `http://localhost:3000/hospital-portal`
2. You should see:
   - **EMR Integration Status** dashboard with order counts
   - **Recent EMR Notifications** showing authorization received
   - **Prior Authorization Orders** table with the new order

### Step 3: Place Hospital Order
1. In the Hospital Portal, find the received authorization
2. Click **"Place Order"** button
3. Watch the status change from "Received" to "Order Placed"
4. Verify the order appears in the orders table

## 🎯 Key Features to Verify

### Provider Side (IPAS System)
- ✅ **EPIC Transmission**: Authorization sent to EPIC EMR
- ✅ **Real-time Status**: EMR notifications appear next to Download Letter
- ✅ **Persistent Display**: Notifications don't disappear quickly

### Hospital Side (Hospital Portal)
- ✅ **Authorization Reception**: Hospital receives notification from EPIC
- ✅ **Order Management**: Hospital can view and place orders
- ✅ **Status Tracking**: Complete audit trail of authorization → order placement
- ✅ **Real-time Updates**: Both systems update simultaneously

## 📊 Hospital Portal Features

### Dashboard Overview
- **Total Orders**: Count of all received authorizations
- **Orders Placed**: Count of completed order placements
- **Pending Orders**: Count of received but not yet placed orders

### Order Management
- **Patient Information**: Patient name, ID, provider details
- **Authorization Details**: Case ID, authorization number, procedure
- **Status Timeline**: Complete history of status changes
- **Order Placement**: Hospital staff can place orders for received authorizations

### Real-time Integration
- **Auto-refresh**: Updates every 3 seconds
- **Live Notifications**: Real-time EMR notifications
- **Status Updates**: Immediate status changes across both systems

## 🔧 Technical Details

### EMR Integration Flow
1. **IPAS System** → Completes case workflow
2. **EPIC EMR** → Receives authorization data
3. **Hospital Portal** → Shows received authorization
4. **Hospital Staff** → Places order in hospital system
5. **Status Update** → Both systems reflect completed workflow

### Data Persistence
- All EMR notifications are stored in localStorage
- Integration status is tracked per case
- Real-time updates between provider and hospital systems

## 🚀 Quick Start

1. **Start the application**: `npm start`
2. **Access Hospital Portal**: Navigate to `http://localhost:3000/hospital-portal`
3. **Complete a case** in the main IPAS system
4. **Watch the integration** happen in real-time
5. **Verify the workflow** from both provider and hospital perspectives

## 📝 Notes

- The Hospital Portal is a simulation of a real hospital EMR system
- All data is stored locally and resets when the browser is refreshed
- The integration demonstrates the complete prior authorization workflow
- Both systems show real-time updates during the EMR integration process
