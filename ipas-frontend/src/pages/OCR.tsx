import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Box, Button, Typography, Paper, Tabs, Tab } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';



const OCR: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(0);
  const [jsonData, setJsonData] = useState<object | null>(null);
  const [pdfjsondata, setpdfjsondata] = useState(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    if (file.type === 'application/pdf') {
     const casedata=getCaseData(file.name);
    
        setpdfjsondata(casedata);
      // Add PDF processing logic here
    } else if (file.type.startsWith('image/')) {
      processImage(file);
    } else {
      alert('Unsupported file type. Please upload an image or PDF.');
    }
  };

  const processImage = async (image: File | Blob) => {
    try {
      const { data: { text } } = await Tesseract.recognize(
        image,
        'eng',
        { logger: (m) => console.log(m) }
      );
      setOcrText(text);
      const jsonObject = parseTextToJson(text);
      setJsonData(jsonObject);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const parseTextToJson = (text: string): object => {
    const lines = text.split('\n');
    const jsonObject: { [key: string]: string } = {};
    lines.forEach(line => {
      const [key, ...value] = line.split(':');
      if (key && value) {
        jsonObject[key.trim()] = value.join(':').trim();
      }
    });
    return jsonObject;
  };


  // Dynamic case data based on docId
  const getCaseData = (docId: string) => {
    const jsonDataMap: { [key: string]: any } = {
      '20250425110402_HW': {
        key_values: {
          FormType: 'OUTPATIENT AUTHORIZATION FORM',
          'Member ID': 'U9541367801',
          'Last Name': 'DE LOS SANTOS MARIN',
          'First Name': 'DANIEL',
          'Date Of Birth': '08011947',
          'Requesting Provider NPI': '1366496937',
          'Requesting Provider TIN': '621768106',
          'Requesting Provider Contact Name': 'Amanda R',
          'Requesting Provider Name': 'Trident MedicalCenter',
          'Requesting Provider Phone Number': '8439705021',
          'Requesting Provider Fax': '8438325118',
          'Servicing Provider NPI': '1366496937',
          'Servicing Provider TIN': '621768106',
          'Servicing Provider Contact Name': 'Amanda R',
          'Servicing Provider Name': 'Trident MedicalCenter',
          'Servicing Provider Phone Number': '8439705021',
          'Servicing Provider Fax': '8438325118',
          'Primary Procedure Code': '93798',
          'Admission Date': '05142025',
          'Total Units/Visits/Days': '36',
          'OUTPATIENT SERVICE TYPE': '794',
          'Diagnosis Code': 'I214',
          AuthPriority: [
            {
              'Standard requests': true,
              'Urgent requests': false,
            },
          ],
          'Additional Procedure Code1': null,
          'Additional Procedure Code2': null,
          'Additional Procedure Code3': null,
          'Discharge Date': null,
          'Service Provider Same as Requesting Provider': true,
        },
      },
      '20250425121731_1': {
        'key_values': {
          'FormType': 'OUTPATIENT AUTHORIZATION FORM',
          'Member ID': 'U7131533302',
          'Last Name': 'HARDIN',
          'First Name': 'REBECCA',
          'Date Of Birth': '08-25-1976',
          'Requesting NPI': '1578173555',
          'Requesting TIN': '474914917',
          'Requesting Provider Contact Name': 'AMY KELLY',
          'Requesting Provider Name': 'AMY KELLY',
          'Requesting Provider Phone Number': '8037749787',
          'Requesting Provider Fax': '8037748890',
          'Servicing NPI': '1124566716',
          'Servicing TIN': '593758015',
          'Servicing Provider Contact Name': 'MARIA GRIFFIN',
          'Servicing Provider Name': 'AEROCARE',
          'Servicing Provider Phone Number': '8035724391',
          'Servicing Provider Fax': '8037019115',
          'Primary Procedure Code': 'E0601',
          'Additional Procedure Code2': 'E0562',
          'Admission Date': '04-25-2025',
          'OUTPATIENT SERVICE TYPE': '417',
          'Diagnosis Code': 'G4733',
          'AuthPriority': [
            {
              'Standard requests': true,
              'Urgent requests': false
            }
          ],
          'Additional Procedure Code1': null,
          'Additional Procedure Code3': null,
          'Discharge Date': null,
          'Total Units/Visits/Days': null
        }
      },
      '20250425122624_1': {
        'key_values': {
          'FormType': 'INPATIENT AUTHORIZATION FORM',
          'Member ID': 'U7183854101',
          'Last Name': 'WILLIAMS',
          'First Name': ', AMANDA',
          'Date Of Birth': '03-05-1987',
          'Requesting Provider NPI': '1083063507',
          'Requesting Provider Name': 'BENJAMIN VELKY',
          'Requesting Provider Phone Number': '8647254865',
          'Servicing Provider NPI': '1023046612',
          'Servicing Provider Contact Name': 'UR DEPT',
          'Servicing Provider Name': 'SELF REGIONAL HE',
          'Servicing Provider Phone Number': '8647255039',
          'Servicing Provider Fax': '8647255044',
          'Admission Date': '04-24-2025',
          'INPATIENT SERVICE TYPE': '970',
          'Diagnosis Code': 'K5792',
          'Servicing Provider TIN': '570331865',
          'Authpriority': [
            {
              'Standard requests': false,
              'Urgent requests': true
            }
          ],
          'Requesting Provider TIN': null,
          'Requesting Provider Contact Name': null,
          'Requesting Provider Fax': null,
          'Discharge Date': null,
          'Additional Procedure Code1': null,
          'Additional Procedure Code2': null,
          'Additional Procedure Code3': null,
          'Primary Procedure Code': null,
          'Additional Diagnosis Code': null
        }
      }
    };

    // Check if the docId exists in the jsonDataMap
    if (!jsonDataMap[docId]) {
      console.warn(`No data found for docId: ${docId}`);
      return null; // Or return an appropriate default value
    }

    return jsonDataMap[docId];
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: 3, maxWidth: '100%', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Smart Auth OCR
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2 }}>
        <input
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Choose File
          </Button>
        </label>
        <Typography variant="body1">{fileName}</Typography>
        <Button variant="contained" color="secondary" onClick={handleFileUpload}>
          Digitize
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 3, minHeight: '70vh' }}>
        {/* Left column with file viewer */}
        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {fileUrl ? (
              file?.type === 'application/pdf' ? (
                <iframe
                  src={fileUrl}
                  title="PDF Viewer"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <img
                  src={fileUrl}
                  alt="Uploaded File"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              )
            ) : (
              <Typography variant="body1">No file selected</Typography>
            )}
          </Paper>
        </Box>
        {/* Right column with tab content */}
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="data tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {/* <Tab label="Automated data extraction" sx={{ fontSize: '1.2rem' }} /> */}
            <Tab label="JSON" sx={{ fontSize: '1.2rem' }} />
          </Tabs>
          <Paper elevation={3} sx={{ flex: 1, overflow: 'auto' }}>
            <Box sx={{ padding: 2 }}>
              {/* {tabValue === 0 && (
                <Typography variant="body1">
                  {ocrText || 'Automated data extraction will appear here after processing.'}
                </Typography>
              )} */}
              {tabValue === 0 && (
                <Box
                  component="pre"
                  sx={{ whiteSpace: 'pre-wrap', height: '100%', overflow: 'auto' }}
                >
                  {                
                   pdfjsondata
                    ? JSON.stringify(pdfjsondata, null, 2)
                    : 'No JSON data available for the provided document ID.'}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default OCR;
