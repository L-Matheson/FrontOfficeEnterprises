import { Box, Typography, TextField, Button, Paper, CircularProgress, IconButton, Chip, Tooltip, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import ForwardIcon from '@mui/icons-material/Forward';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import GavelIcon from '@mui/icons-material/Gavel';
import CreateIcon from '@mui/icons-material/Create';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ArchiveIcon from '@mui/icons-material/Archive';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ImageIcon from '@mui/icons-material/Image';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import Header from "../../components/Header";

/*

Note, make a string parser to look for

Copy/Paste into Into studio THE KEY FOR THE AI WILL BE HERE
*/



function AiBoxs() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Markdown components customization
  const markdownComponents = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code 
          style={{
            backgroundColor: colors.primary[600],
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }} 
          {...props}
        >
          {children}
        </code>
      );
    },
    p: ({children}) => (
      <Typography sx={{ mb: 1, lineHeight: 1.7 }}>
        {children}
      </Typography>
    ),
    h1: ({children}) => (
      <Typography variant="h4" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
        {children}
      </Typography>
    ),
    h2: ({children}) => (
      <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
        {children}
      </Typography>
    ),
    h3: ({children}) => (
      <Typography variant="h6" sx={{ mt: 1.5, mb: 0.5, fontWeight: 'bold' }}>
        {children}
      </Typography>
    ),
    ul: ({children}) => (
      <Box component="ul" sx={{ pl: 3, my: 1 }}>
        {children}
      </Box>
    ),
    ol: ({children}) => (
      <Box component="ol" sx={{ pl: 3, my: 1 }}>
        {children}
      </Box>
    ),
    li: ({children}) => (
      <Typography component="li" sx={{ mb: 0.5 }}>
        {children}
      </Typography>
    ),
    blockquote: ({children}) => (
      <Box
        sx={{
          borderLeft: `4px solid ${colors.primary[300]}`,
          pl: 2,
          py: 0.5,
          my: 1,
          fontStyle: 'italic',
          opacity: 0.9
        }}
      >
        {children}
      </Box>
    ),
    a: ({children, href}) => (
      <Typography
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: colors.blueAccent[400],
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        }}
      >
        {children}
      </Typography>
    ),
    strong: ({children}) => (
      <Typography component="strong" sx={{ fontWeight: 'bold' }}>
        {children}
      </Typography>
    ),
    em: ({children}) => (
      <Typography component="em" sx={{ fontStyle: 'italic' }}>
        {children}
      </Typography>
    )
  };
  
  const ais = [
    { 
      id: "assistant_dean", 
      name: "Assistant Dean", 
      color: "#1976d2",
      icon: <AdminPanelSettingsOutlinedIcon />,
      description: "Strategic partner & Chief of Staff"
    },
    { 
      id: "auditor", 
      name: "The Auditor", 
      color: "#d32f2f",
      icon: <GavelIcon />,
      description: "NTSB Investigator - Just Culture enforcer"
    },
    { 
      id: "creative_writing_fellow", 
      name: "Creative Writing Fellow", 
      color: "#9c27b0",
      icon: <CreateIcon />,
      description: "Financial thriller writer"
    },
    { 
      id: "research_librarian", 
      name: "Research Librarian", 
      color: "#2e7d32",
      icon: <LocalLibraryIcon />,
      description: "Forensic fact sheet provider"
    },
    { 
      id: "the_archivist", 
      name: "The Archivist", 
      color: "#ed6c02",
      icon: <ArchiveIcon />,
      description: "Visual technician - Shot lists"
    },
    { 
      id: "the_social_media_intern", 
      name: "Social Media Intern", 
      color: "#7b1fa2",
      icon: <InstagramIcon />,
      description: "60-second flight log creator"
    },
    { 
      id: "the_music_supervisor", 
      name: "Music Supervisor", 
      color: "#0288d1",
      icon: <MusicNoteIcon />,
      description: "Sonic identity curator"
    },
    { 
      id: "the_title_thumbnail_specialist", 
      name: "Title/Thumbnail Specialist", 
      color: "#c62828",
      icon: <ImageIcon />,
      description: "Trojan Horse architect"
    }
  ];

  const [focusedAI, setFocusedAI] = useState('assistant_dean');
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [tokenCount, setTokenCount] = useState(0);
  const [forwardMenuAnchor, setForwardMenuAnchor] = useState(null);
  const [messageToForward, setMessageToForward] = useState(null);

  const focused = ais.find((ai) => ai.id === focusedAI);
  const unfocused = ais.filter((ai) => ai.id !== focusedAI);
  const currentMessages = messages[focusedAI] || [];

  function handleSwitch(newFocusAI) {
    setFocusedAI(newFocusAI);
    fetchTokenCount(newFocusAI);
  }

  async function fetchTokenCount(aiId) {
    try {
      const response = await fetch(`http://localhost:5000/api/token-count/${aiId}`);
      const data = await response.json();
      setTokenCount(data.token_count || 0);
    } catch (error) {
      console.error('Error fetching token count:', error);
    }
  }

  async function handleResetChat() {
    if (!window.confirm(`Reset conversation with ${focused.name}?`)) return;
    
    try {
      await fetch(`http://localhost:5000/api/reset-chat/${focusedAI}`, {
        method: 'POST'
      });
      
      setMessages(prev => ({
        ...prev,
        [focusedAI]: []
      }));
      setTokenCount(0);
    } catch (error) {
      console.error('Error resetting chat:', error);
    }
  }

  function handleOpenForwardMenu(event, message, fromAI) {
    setForwardMenuAnchor(event.currentTarget);
    setMessageToForward({ content: message, fromAI: fromAI });
  }

  function handleCloseForwardMenu() {
    setForwardMenuAnchor(null);
    setMessageToForward(null);
  }

  async function handleForwardToAI(targetAI) {
    if (!messageToForward) return;

    const fromAI = ais.find(ai => ai.id === messageToForward.fromAI);
    
    // Create the forwarded message with context
    const forwardedMessage = `[Forwarded from ${fromAI.name}]:\n\n${messageToForward.content}`;

    // Add the forwarded message to the target AI's conversation
    const forwardedUserMessage = {
      role: 'user',
      content: forwardedMessage,
      timestamp: new Date().toISOString(),
      isForwarded: true,
      forwardedFrom: fromAI.name,
      forwardedFromId: fromAI.id
    };

    handleCloseForwardMenu();

    // Set loading for the target AI only
    setIsLoading(prev => ({ ...prev, [targetAI]: true }));
    
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ai_id: targetAI,
          message: forwardedMessage,
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        const aiMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString()
        };

        // Add both the forwarded message and the response at once
        setMessages(prev => ({
          ...prev,
          [targetAI]: [...(prev[targetAI] || []), forwardedUserMessage, aiMessage]
        }));

        // Show notification
        alert(`Message forwarded to ${ais.find(ai => ai.id === targetAI).name}!`);
      }
    } catch (error) {
      console.error('Error forwarding message:', error);
      // Still add the forwarded message even if there's an error
      setMessages(prev => ({
        ...prev,
        [targetAI]: [...(prev[targetAI] || []), forwardedUserMessage]
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [targetAI]: false }));
    }
  }

  async function handleSendMessage() {
    if (!inputText.trim() || isLoading[focusedAI]) return;

    const userMessage = {
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [focusedAI]: [...(prev[focusedAI] || []), userMessage]
    }));
    
    setInputText('');
    setIsLoading(prev => ({ ...prev, [focusedAI]: true }));

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ai_id: focusedAI,
          message: inputText,
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        const aiMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => ({
          ...prev,
          [focusedAI]: [...(prev[focusedAI] || []), aiMessage]
        }));
        
        fetchTokenCount(focusedAI);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: `❌ Error: ${error.message}\n\nMake sure:\n1. Backend server is running (python app.py)\n2. Server is on http://localhost:5000\n3. All Python dependencies are installed`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => ({
        ...prev,
        [focusedAI]: [...(prev[focusedAI] || []), errorMessage]
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [focusedAI]: false }));
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2,
      }}
    >
      {/* Focused AI Section */}
      <Box
        sx={{
          height: '60vh',
          transition: 'all 0.4s ease-in-out',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            height: '100%',
            padding: 3,
            backgroundColor: colors.primary[400],
            borderRadius: 2,
            border: `2px solid ${focused.color}`,
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ color: focused.color, display: 'flex' }}>
                  {focused.icon}
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: focused.color }}>
                  {focused.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
                {focused.description}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {tokenCount > 0 && (
                <Chip 
                  label={`${tokenCount.toLocaleString()} tokens`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: colors.primary[300],
                    fontWeight: 'bold'
                  }}
                />
              )}
              <Tooltip title="Reset conversation">
                <IconButton 
                  onClick={handleResetChat}
                  sx={{ color: focused.color }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: colors.primary[500],
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: colors.primary[300],
                borderRadius: '4px',
              },
            }}
          >
            {currentMessages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, opacity: 0.6 }}>
                <Box sx={{ color: focused.color, mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {focused.icon && <Box sx={{ fontSize: 48 }}>{focused.icon}</Box>}
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {focused.name}
                </Typography>
                <Typography variant="body2">
                  {focused.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.5 }}>
                  Start a conversation to begin
                </Typography>
              </Box>
            ) : (
              currentMessages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    animation: 'fadeIn 0.3s ease-in',
                    '@keyframes fadeIn': {
                      '0%': { opacity: 0, transform: 'translateY(10px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  {msg.role === 'user' ? (
                    <PersonIcon sx={{ color: colors.greenAccent[500], mt: 0.5, flexShrink: 0 }} />
                  ) : (
                    <Box sx={{ color: focused.color, mt: 0.5, display: 'flex', flexShrink: 0 }}>
                      {focused.icon}
                    </Box>
                  )}
                  <Paper
                    sx={{
                      padding: 1.5,
                      maxWidth: '80%',
                      backgroundColor: msg.role === 'user' 
                        ? colors.primary[300] 
                        : msg.isError 
                        ? colors.redAccent[700] 
                        : colors.primary[500],
                      borderLeft: msg.role === 'assistant' ? `3px solid ${focused.color}` : 
                                  msg.isForwarded ? `3px solid ${ais.find(ai => ai.id === msg.forwardedFromId)?.color}` : 'none',
                      position: 'relative'
                    }}
                  >
                    {msg.isForwarded && (
                      <Chip 
                        label={`Forwarded from ${msg.forwardedFrom}`}
                        size="small"
                        sx={{ 
                          mb: 1, 
                          backgroundColor: ais.find(ai => ai.id === msg.forwardedFromId)?.color,
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    <Box sx={{ 
                      '& > *:last-child': { mb: 0 },
                      wordBreak: 'break-word'
                    }}>
                      <ReactMarkdown components={markdownComponents}>
                        {msg.content}
                      </ReactMarkdown>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" sx={{ opacity: 0.6 }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </Typography>
                      {msg.role === 'assistant' && !msg.isError && (
                        <Tooltip title="Forward to another AI">
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleOpenForwardMenu(e, msg.content, focusedAI)}
                            sx={{ ml: 1, opacity: 0.6, '&:hover': { opacity: 1 } }}
                          >
                            <ForwardIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Paper>
                </Box>
              ))
            )}
            {isLoading[focusedAI] && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: focused.color, display: 'flex' }}>
                  {focused.icon}
                </Box>
                <CircularProgress size={20} sx={{ color: focused.color }} />
                <Typography sx={{ opacity: 0.6 }}>Processing...</Typography>
              </Box>
            )}
          </Box>

          {/* Input Area */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder={`Message ${focused.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading[focusedAI]}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: focused.color,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading[focusedAI]}
              sx={{
                minWidth: '60px',
                backgroundColor: focused.color,
                '&:hover': {
                  backgroundColor: `${focused.color}dd`,
                },
                '&.Mui-disabled': {
                  backgroundColor: colors.primary[300],
                }
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Unfocused AI Section */}
      <Box
        sx={{
          height: '15vh',
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          transition: 'all 0.3s ease-in-out',
          flexWrap: 'wrap',
        }}
      >
        {unfocused.map((ai, index) => (
          <Tooltip key={ai.id} title={ai.description} arrow>
            <Paper
              onClick={() => handleSwitch(ai.id)}
              elevation={2}
              sx={{
                height: '100%',
                padding: 2,
                backgroundColor: colors.primary[400],
                borderRadius: 2,
                flex: '1 1 calc(14.28% - 16px)',
                minWidth: '120px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 1,
                transform: 'translateY(0)',
                border: `1px solid ${ai.color}40`,
                animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                },
                '&:hover': {
                  transform: 'translateY(-5px)',
                  backgroundColor: colors.primary[300],
                  borderColor: ai.color,
                  boxShadow: `0 8px 16px ${ai.color}40`,
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <Box sx={{ color: ai.color, display: 'flex', fontSize: 28 }}>
                {ai.icon}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: ai.color, 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: '0.85rem'
                }}
              >
                {ai.name}
              </Typography>
            </Paper>
          </Tooltip>
        ))}
      </Box>

      {/* Forward Menu */}
      <Menu
        anchorEl={forwardMenuAnchor}
        open={Boolean(forwardMenuAnchor)}
        onClose={handleCloseForwardMenu}
      >
        <MenuItem disabled sx={{ opacity: 1, fontWeight: 'bold' }}>
          Forward to:
        </MenuItem>
        {ais.filter(ai => ai.id !== focusedAI).map(ai => (
          <MenuItem 
            key={ai.id} 
            onClick={() => handleForwardToAI(ai.id)}
            sx={{
              '&:hover': {
                backgroundColor: `${ai.color}20`
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: ai.color, display: 'flex' }}>
                {ai.icon}
              </Box>
              <Typography>{ai.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

const Team = () => {
  return (
    <Box m="20px">
      <Header 
        title="HARDWOOD ACADEMY" 
        subtitle="Front Office Enterprises - AI Team Interface" 
      />
      <AiBoxs />
    </Box>
  );
};

export default Team;