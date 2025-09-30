# IPAS Frontend - Intelligent Prior Authorization System

## Overview

The IPAS Frontend is a React.js-based web application that provides an intuitive interface for the Intelligent Prior Authorization System. It enables healthcare professionals to interact with AI-powered prior authorization decisions through a modern, responsive interface.

## Features

### 🏥 **Core Functionality**
- **AI-Powered Case Analysis**: Interactive chat interface with AI assistant for case analysis
- **Document Upload & Processing**: Drag-and-drop document upload with OCR and parsing
- **Case Management**: Comprehensive case queue with filtering and priority management
- **Real-time Dashboard**: Analytics and statistics with interactive charts
- **Role-based Access**: Different interfaces for reviewers, providers, and administrators

### 🤖 **AI Integration**
- **Interactive Chat**: Natural language interface with AI assistant
- **Simulation Mode**: Visual decision process analysis and what-if scenarios
- **Decision Explanation**: Detailed rationale for AI recommendations
- **Criteria Verification**: Step-by-step criteria checking and validation

### 📊 **Analytics & Reporting**
- **Dashboard Metrics**: Real-time statistics and performance indicators
- **Case Analytics**: Approval rates, processing times, and trend analysis
- **Audit Trail**: Complete decision history and compliance logging
- **Visual Charts**: Interactive graphs and data visualizations

### 🔐 **Security & Compliance**
- **Role-based Authentication**: Secure login with different user roles
- **HIPAA Compliance**: Secure handling of patient health information
- **Audit Logging**: Complete audit trail for regulatory compliance
- **Data Encryption**: Secure data transmission and storage

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: React Context API
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **File Upload**: React Dropzone
- **Styling**: Emotion (CSS-in-JS)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication components
│   ├── Chat/            # AI chat interface
│   ├── Dashboard/       # Dashboard components
│   ├── Layout/          # Layout components
│   ├── Cases/           # Case management
│   └── Upload/          # Document upload
├── contexts/            # React Context providers
├── pages/               # Page components
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ipas-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Demo Credentials

The application includes demo users for testing:

- **Medical Reviewer**: `sarah.johnson@insurer.com` / `password`
- **Physician**: `michael.chen@insurer.com` / `password`  
- **Provider**: `emily.rodriguez@hospital.com` / `password`
- **Administrator**: `admin@insurer.com` / `password`

## User Roles & Permissions

### 🩺 **Medical Reviewer**
- Review and approve/deny prior authorization requests
- Access to AI chat for case analysis
- View case queue and analytics
- Override AI recommendations when needed

### 👨‍⚕️ **Physician**
- Full access to clinical decision making
- Override AI recommendations
- Access to detailed case information
- Review complex cases requiring medical expertise

### 🏥 **Provider**
- Submit prior authorization requests
- Upload clinical documents
- View status of submitted requests
- Limited access to case details

### ⚙️ **Administrator**
- System configuration and user management
- Access to all analytics and reports
- Audit trail and compliance monitoring
- System settings and maintenance

## Key Components

### Dashboard
- **Statistics Cards**: Key metrics and performance indicators
- **Recent Cases**: Latest case activity and status
- **Analytics Charts**: Visual representation of data trends
- **Quick Actions**: Fast access to common tasks

### Case Queue
- **Filtering & Search**: Find cases by various criteria
- **Priority Indicators**: Visual priority and status indicators
- **Bulk Actions**: Process multiple cases efficiently
- **Real-time Updates**: Live case status updates

### AI Chat Interface
- **Natural Language Processing**: Conversational AI interaction
- **Case Analysis**: AI-powered case evaluation
- **Simulation Mode**: Visual decision process analysis
- **Decision Explanation**: Detailed rationale for recommendations

### Document Upload
- **Drag & Drop**: Intuitive file upload interface
- **OCR Processing**: Automatic text extraction from documents
- **Document Parsing**: Structured data extraction
- **File Management**: Organize and manage uploaded documents

## API Integration

The frontend is designed to integrate with the IPAS backend API:

- **Authentication**: JWT-based authentication
- **Case Management**: CRUD operations for prior auth cases
- **AI Integration**: Real-time AI analysis and recommendations
- **Document Processing**: File upload and parsing services
- **Analytics**: Data aggregation and reporting endpoints

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Material-UI**: Consistent design system

## Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

Create a `.env` file with:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_AI_SERVICE_URL=http://localhost:8000/ai
REACT_APP_UPLOAD_URL=http://localhost:8000/upload
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or questions:

- **Documentation**: Check the project wiki
- **Issues**: Create a GitHub issue
- **Email**: support@ipas-system.com

## Roadmap

### Phase 1 (Current)
- ✅ Basic React application structure
- ✅ Authentication and role-based access
- ✅ Dashboard and case management
- ✅ AI chat interface
- ✅ Document upload system

### Phase 2 (Next)
- 🔄 Advanced analytics and reporting
- 🔄 Mobile-responsive design
- 🔄 Real-time notifications
- 🔄 Advanced AI features

### Phase 3 (Future)
- 📋 Integration with EHR systems
- 📋 Advanced simulation capabilities
- 📋 Machine learning model integration
- 📋 Advanced compliance features

---

**IPAS Frontend** - Transforming Prior Authorization with AI-Powered Intelligence