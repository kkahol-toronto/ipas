import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { ChatMessage, SimulationResult } from '../../types';

interface ChatInterfaceProps {
  caseId?: string;
  onSimulationRequest?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ caseId, onSimulationRequest }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: 'Hello! I\'m the IPAS AI assistant. I can help you analyze prior authorization cases, explain decisions, and run simulations. How can I assist you today?',
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('simulation') || lowerInput.includes('analyze')) {
      return 'I can run a detailed analysis simulation for this case. This will show you the decision process, criteria checks, and confidence levels. Would you like me to proceed with the simulation?';
    }
    
    if (lowerInput.includes('criteria') || lowerInput.includes('guideline')) {
      return 'Based on the clinical guidelines, I check several criteria including medical necessity, coverage eligibility, and clinical appropriateness. For this case, the key criteria are oxygen saturation levels, severity of symptoms, and response to outpatient treatment.';
    }
    
    if (lowerInput.includes('decision') || lowerInput.includes('recommendation')) {
      return 'My recommendation is based on a comprehensive analysis of the patient\'s clinical data, insurance coverage, and medical guidelines. I consider factors like severity of illness, treatment response, and alternative care options.';
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return 'I can help you with case analysis, decision explanations, criteria verification, simulation of different scenarios, and answering questions about prior authorization processes. What would you like to know?';
    }
    
    return 'I understand your question. Let me analyze the case data and provide you with a comprehensive response based on the available information and clinical guidelines.';
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSimulation = () => {
    if (onSimulationRequest) {
      onSimulationRequest();
    }
    
    const simulationMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      content: 'Running simulation analysis...',
      timestamp: new Date().toISOString(),
      type: 'simulation'
    };
    
    setMessages(prev => [...prev, simulationMessage]);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AIIcon sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            IPAS AI Assistant
          </Typography>
          {caseId && (
            <Chip
              label={`Case: ${caseId}`}
              size="small"
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Box>

        <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2, maxHeight: '60vh' }}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  maxWidth: '70%',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.sender === 'user' ? '#1976d2' : '#4caf50',
                    width: 32,
                    height: 32,
                    mx: 1
                  }}
                >
                  {message.sender === 'user' ? <PersonIcon /> : <AIIcon />}
                </Avatar>
                
                <Box>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Paper>
                  
                  {message.type === 'simulation' && (
                    <Box sx={{ mt: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AssessmentIcon />}
                        onClick={handleSimulation}
                      >
                        Run Simulation
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
          
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32, mx: 1 }}>
                <AIIcon />
              </Avatar>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  AI is thinking...
                </Typography>
                <LinearProgress sx={{ mt: 1 }} />
              </Paper>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={handleSimulation}
            size="small"
          >
            Analyze & Visualize
          </Button>
          <Button
            variant="outlined"
            startIcon={<PsychologyIcon />}
            size="small"
          >
            Explain Decision
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Ask me anything about this case..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={3}
            disabled={isTyping}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatInterface;
