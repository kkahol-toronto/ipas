# Sample Documents Structure

This directory contains sample documents organized by case for the IPAS (Intelligent Prior Authorization System) demo.

## Folder Structure

```
public/sample-documents/
├── cases/
│   ├── case-001-john-doe/
│   │   ├── prior-auth-request-form.pdf
│   │   ├── patient-medical-history.pdf
│   │   ├── mri-brain-report.pdf
│   │   ├── insurance-card.pdf
│   │   └── physician-notes.pdf
│   ├── case-002-jane-smith/
│   │   ├── prior-auth-request-form.pdf
│   │   ├── patient-medical-history.pdf
│   │   ├── stress-test-results.pdf
│   │   ├── insurance-card.pdf
│   │   └── cardiology-notes.pdf
│   ├── case-003-mike-johnson/
│   │   ├── prior-auth-request-form.pdf
│   │   ├── patient-medical-history.pdf
│   │   ├── mri-knee-report.pdf
│   │   ├── insurance-card.pdf
│   │   └── pt-notes.pdf
│   └── case-004-sarah-wilson/
│       └── (additional cases can be added here)
└── README.md
```

## Case Information

### Case 001 - John Doe
- **Procedure**: MRI Brain with Contrast
- **Insurance**: Blue Cross Blue Shield
- **Provider**: Dr. Sarah Smith, MD (Neurology)
- **Documents**: Prior auth form, medical history, MRI report, insurance card, physician notes

### Case 002 - Jane Smith  
- **Procedure**: Cardiac Catheterization
- **Insurance**: Aetna Health Insurance
- **Provider**: Dr. Michael Chen, MD (Cardiology)
- **Documents**: Prior auth form, medical history, stress test results, insurance card, cardiology notes

### Case 003 - Mike Johnson
- **Procedure**: Arthroscopic Knee Surgery
- **Insurance**: UnitedHealthcare
- **Provider**: Dr. Lisa Rodriguez, MD (Orthopedics)
- **Documents**: Prior auth form, medical history, MRI knee report, insurance card, PT notes

## Document Categories

Each case contains documents in the following categories:

- **prior-auth**: Prior authorization request forms
- **medical-records**: Patient medical history and records
- **imaging**: MRI, CT, X-ray reports and results
- **insurance**: Insurance cards and coverage information
- **clinical-notes**: Physician notes and consultation reports

## Adding New Cases

To add a new case:

1. Create a new folder: `case-XXX-patient-name/`
2. Add the required documents for that case
3. Update the `CaseDocuments.tsx` component to include the new case in the `caseDocumentMap`
4. Ensure all PDFs are properly formatted without gibberish characters

## Document Format

All documents are PDF files with clean, readable formatting:
- No special characters or gibberish
- Professional medical document appearance
- Consistent formatting across all cases
- Proper file naming conventions

## Usage

The documents are automatically loaded based on the case ID when viewing case details in the IPAS application. The system will display the appropriate documents for each specific case.
