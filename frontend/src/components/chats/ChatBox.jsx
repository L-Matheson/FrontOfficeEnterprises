import { Box, Typography, TextField, Button, Paper, CircularProgress, IconButton, Chip, Tooltip } from "@mui/material";
import { cloneElement } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import ForwardIcon from '@mui/icons-material/Forward';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import Timeline from "./Timeline";
import Assignments from "./Assignments";

const ChatBox = ({
  ai,
  messages = [],
  inputText,
  onInputChange,
  onSendMessage,
  onKeyPress,
  onResetChat,
  onForwardMessage,
  onForwardAssignment,
  isLoading = false,
  tokenCount = 0,
  isFocused = true
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
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
            padding: '4px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '1rem'
          }} 
          {...props}
        >
          {children}
        </code>
      );
    },
    p: ({children}) => (
      <Typography sx={{ mb: 1, lineHeight: 1.7, fontSize: '1.1rem' }}>
        {children}
      </Typography>
    ),
    h1: ({children}) => (
      <Typography variant="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
        {children}
      </Typography>
    ),
    h2: ({children}) => (
      <Typography variant="h4" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
        {children}
      </Typography>
    ),
    h3: ({children}) => (
      <Typography variant="h5" sx={{ mt: 1.5, mb: 0.5, fontWeight: 'bold' }}>
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
      <Typography component="li" sx={{ mb: 0.5, fontSize: '1.1rem' }}>
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

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        padding: 3,
        backgroundColor: colors.primary[400],
        borderRadius: 2,
        border: `2px solid ${ai.color}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ color: ai.color, display: 'flex' }}>
              {ai.icon}
            </Box>
            <Typography variant="h3" fontWeight="bold" sx={{ color: ai.color }}>
              {ai.name}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
            {ai.description}
          </Typography>
        </Box>
        {isFocused && (
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
                onClick={onResetChat}
                sx={{ color: ai.color }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
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
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, opacity: 0.7 }}>
            <Box sx={{ color: ai.color, mb: 3, display: 'flex', justifyContent: 'center' }}>
              {cloneElement(ai.icon, { sx: { fontSize: 52 } })}
            </Box>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
              {ai.name}
            </Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {ai.description}
            </Typography>
            <Typography variant="h6" sx={{ mt: 3, opacity: 0.6 }}>
              Start a conversation to begin
            </Typography>
          </Box>
        ) : (
          messages.map((msg, idx) => (
            <Box
              key={msg.id || `${ai?.id || 'ai'}-${msg.timestamp || 'no-ts'}-${msg.role || 'role'}-${idx}`}
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
                <Box sx={{ color: ai.color, mt: 0.5, display: 'flex', flexShrink: 0 }}>
                  {ai.icon}
                </Box>
              )}
              {/* Render Timeline for modular messages, otherwise render normal Paper */}
              {msg.messageType === 'modular' && msg.role === 'assistant' ? (
                <Box sx={{ width: '100%', maxWidth: '90%' }}>
                  <Timeline modules={msg.content} aiColor={ai.color} />
                  <Typography variant="body2" sx={{ opacity: 0.6, fontSize: '0.9rem', mt: 1 }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              ) : msg.messageType === 'assignments' && msg.role === 'assistant' ? (
                <Box sx={{ width: '100%', maxWidth: '90%' }}>
                  <Assignments
                    assignments={msg.content}
                    aiColor={ai.color}
                    onForwardAssignment={onForwardAssignment}
                  />
                  <Typography variant="body2" sx={{ opacity: 0.6, fontSize: '0.9rem', mt: 1 }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              ) : (
                <Paper
                  sx={{
                    padding: 1.5,
                    maxWidth: '80%',
                    backgroundColor: msg.role === 'user' 
                      ? colors.primary[300] 
                      : msg.isError 
                      ? colors.redAccent[700] 
                      : colors.primary[500],
                    borderLeft: msg.role === 'assistant' ? `3px solid ${ai.color}` : 
                                msg.isForwarded ? `3px solid ${msg.forwardedColor}` : 'none',
                    position: 'relative'
                  }}
                >
                  {msg.isForwarded && (
                    <Chip 
                      label={`Forwarded from ${msg.forwardedFrom}`}
                      size="small"
                      sx={{ 
                        mb: 1, 
                        backgroundColor: msg.forwardedColor,
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
                    <Typography variant="body2" sx={{ opacity: 0.6, fontSize: '0.9rem' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                    {msg.role === 'assistant' && !msg.isError && onForwardMessage && (
                      <Tooltip title="Forward to Assistant Dean">
                        <IconButton 
                          size="small" 
                          onClick={(e) => onForwardMessage(e, msg.content, ai.id)}
                          sx={{ ml: 1, opacity: 0.6, '&:hover': { opacity: 1 } }}
                        >
                          <ForwardIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Paper>
              )}
            </Box>
          ))
        )}
        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: ai.color, display: 'flex' }}>
              {ai.icon}
            </Box>
            <CircularProgress size={24} sx={{ color: ai.color }} />
            <Typography sx={{ opacity: 0.6, fontSize: '1.1rem' }}>Processing...</Typography>
          </Box>
        )}
      </Box>

      {/* Input Area - Only show if focused */}
      {isFocused && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder={`Message ${ai.name}...`}
            value={inputText}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: ai.color,
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={onSendMessage}
            disabled={!inputText.trim() || isLoading}
            sx={{
              minWidth: '60px',
              backgroundColor: ai.color,
              '&:hover': {
                backgroundColor: `${ai.color}dd`,
              },
              '&.Mui-disabled': {
                backgroundColor: colors.primary[300],
              }
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ChatBox;