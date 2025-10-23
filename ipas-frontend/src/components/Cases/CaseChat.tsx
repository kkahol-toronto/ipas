import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  AttachFile as AttachFileIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface CaseChatProps {
  caseId: string;
  patientName: string;
  extractedData: any;
  documents: any[];
}

const CaseChat: React.FC<CaseChatProps> = ({ caseId, patientName, extractedData, documents }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize session
  useEffect(() => {
    const newSessionId = `case-${caseId}-${Date.now()}`;
    setSessionId(newSessionId);
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: `Hello! I'm your AI assistant for Case #${caseId} - ${patientName}. I have access to all the extracted data from your documents including medical records, prior authorization forms, clinical notes, and diagnostic reports. How can I help you analyze this case?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [caseId, patientName]);

  const prepareContext = () => {
    const context = {
      case_info: {
        case_id: caseId,
        patient_name: patientName,
        documents_available: documents.map(doc => ({
          name: doc.name,
          type: doc.type,
          category: doc.category,
          extracted: doc.isExtracted
        }))
      },
      patient_history: extractedData || {},
      available_documents: documents.filter(doc => doc.isExtracted).map(doc => ({
        name: doc.name,
        category: doc.category,
        extracted_data: doc.extractedData || {}
      }))
    };
    return context;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const context = prepareContext();
      
      const response = await fetch('http://localhost:8001/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputMessage,
          session_id: sessionId,
          user_id: 'case-user',
          user_info: {
            role: 'physician',
            specialty: 'prior_authorization'
          },
          patient_history: context.patient_history,
          case_info: context.case_info
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsLoading(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'chunk' && parsed.content) {
                assistantMessage.content += parsed.content;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantMessage.content }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to get response from AI. Please try again.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    const newSessionId = `case-${caseId}-${Date.now()}`;
    setSessionId(newSessionId);
    
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: `Hello! I'm your AI assistant for Case #${caseId} - ${patientName}. I have access to all the extracted data from your documents. How can I help you analyze this case?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const downloadTranscript = () => {
    if (messages.length === 0) return;

    const transcript = generateTranscript();
    const blob = new Blob([transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-transcript-${caseId}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateTranscript = () => {
    const header = `# Chat Transcript - Case #${caseId} - ${patientName}
Generated on: ${new Date().toLocaleString()}
Session ID: ${sessionId}

---

`;
    
    const messagesText = messages.map((message, index) => {
      const timestamp = message.timestamp.toLocaleString();
      const role = message.role === 'user' ? '👤 User' : '🤖 AI Assistant';
      return `## ${role} (${timestamp})

${message.content}

---`;
    }).join('\n\n');

    return header + messagesText;
  };

  const getDocumentContext = () => {
    const availableDocs = documents.filter(doc => doc.isExtracted);
    return availableDocs.map(doc => (
      <Chip
        key={doc.id}
        label={doc.name}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ mr: 1, mb: 1 }}
      />
    ));
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BotIcon color="primary" />
            Chat with Case #{caseId}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Download Chat Transcript">
              <IconButton 
                onClick={downloadTranscript} 
                size="small"
                disabled={messages.length <= 1} // Only allow download if there are actual messages beyond welcome
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Chat">
              <IconButton onClick={clearChat} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          AI Assistant for {patientName} - Analyzing extracted document data
        </Typography>
        
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Available Document Context:
          </Typography>
          {getDocumentContext()}
        </Box>
      </Paper>

      {/* Messages */}
      <Paper sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BotIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Start a conversation about this case
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ask about medical records, prior authorization details, or clinical findings
              </Typography>
            </Box>
          ) : (
            <List>
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem sx={{ alignItems: 'flex-start', py: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                      mr: 2,
                      mt: 0.5
                    }}>
                      {message.role === 'user' ? <PersonIcon /> : <BotIcon />}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box>
                          <Box sx={{ 
                            '& h1, & h2, & h3, & h4, & h5, & h6': {
                              fontSize: '1.1em',
                              fontWeight: 'bold',
                              margin: '8px 0 4px 0',
                              color: 'primary.main'
                            },
                            '& p': {
                              margin: '4px 0',
                              lineHeight: 1.5
                            },
                            '& ul, & ol': {
                              margin: '8px 0',
                              paddingLeft: '20px'
                            },
                            '& li': {
                              margin: '2px 0'
                            },
                            '& strong': {
                              fontWeight: 'bold'
                            },
                            '& em': {
                              fontStyle: 'italic'
                            },
                            '& code': {
                              backgroundColor: '#f5f5f5',
                              padding: '2px 4px',
                              borderRadius: '3px',
                              fontFamily: 'monospace',
                              fontSize: '0.9em'
                            },
                            '& pre': {
                              backgroundColor: '#f5f5f5',
                              padding: '8px',
                              borderRadius: '4px',
                              overflow: 'auto',
                              margin: '8px 0'
                            },
                            '& blockquote': {
                              borderLeft: '4px solid #e0e0e0',
                              paddingLeft: '16px',
                              margin: '8px 0',
                              fontStyle: 'italic',
                              color: 'text.secondary'
                            },
                            '& table': {
                              borderCollapse: 'collapse',
                              width: '100%',
                              margin: '8px 0'
                            },
                            '& th, & td': {
                              border: '1px solid #e0e0e0',
                              padding: '8px',
                              textAlign: 'left'
                            },
                            '& th': {
                              backgroundColor: '#f5f5f5',
                              fontWeight: 'bold'
                            }
                          }}>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {message.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {isLoading && (
                <ListItem>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <BotIcon />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          AI is thinking...
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              )}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {/* Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask about medical records, clinical findings, or authorization details..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{ alignSelf: 'flex-end' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            💡 Try asking: "What are the key findings in the medical records?" or "Summarize the clinical notes"
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default CaseChat;
