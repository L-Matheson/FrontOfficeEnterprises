import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import GavelIcon from '@mui/icons-material/Gavel';
import CreateIcon from '@mui/icons-material/Create';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ArchiveIcon from '@mui/icons-material/Archive';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ImageIcon from '@mui/icons-material/Image';
import Header from "../../components/Header";
import ChatBox from "../../components/ChatBox";
import AICard from "../../components/AICard";

const Team = () => {
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

  const handleSwitch = (newFocusAI) => {
    setFocusedAI(newFocusAI);
    fetchTokenCount(newFocusAI);
  };

  const fetchTokenCount = async (aiId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/token-count/${aiId}`);
      const data = await response.json();
      setTokenCount(data.token_count || 0);
    } catch (error) {
      console.error('Error fetching token count:', error);
    }
  };

  const handleResetChat = async () => {
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
  };

  const handleOpenForwardMenu = (event, message, fromAI) => {
    setForwardMenuAnchor(event.currentTarget);
    setMessageToForward({ content: message, fromAI: fromAI });
  };

  const handleCloseForwardMenu = () => {
    setForwardMenuAnchor(null);
    setMessageToForward(null);
  };

  const handleForwardToAI = async (targetAI) => {
    if (!messageToForward) return;

    const fromAI = ais.find(ai => ai.id === messageToForward.fromAI);
    const forwardedMessage = `[Forwarded from ${fromAI.name}]:\n\n${messageToForward.content}`;

    const forwardedUserMessage = {
      role: 'user',
      content: forwardedMessage,
      timestamp: new Date().toISOString(),
      isForwarded: true,
      forwardedFrom: fromAI.name,
      forwardedFromId: fromAI.id,
      forwardedColor: fromAI.color
    };

    handleCloseForwardMenu();
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

        setMessages(prev => ({
          ...prev,
          [targetAI]: [...(prev[targetAI] || []), forwardedUserMessage, aiMessage]
        }));

        alert(`Message forwarded to ${ais.find(ai => ai.id === targetAI).name}!`);
      }
    } catch (error) {
      console.error('Error forwarding message:', error);
      setMessages(prev => ({
        ...prev,
        [targetAI]: [...(prev[targetAI] || []), forwardedUserMessage]
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [targetAI]: false }));
    }
  };

  const handleSendMessage = async () => {
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
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box m="20px">
      <Header 
        title="HARDWOOD ACADEMY" 
        subtitle="Front Office Enterprises - AI Team Interface" 
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
        {/* Focused AI ChatBox */}
        <Box sx={{ height: '60vh', width: '100%' }}>
          <ChatBox
            ai={focused}
            messages={currentMessages}
            inputText={inputText}
            onInputChange={(e) => setInputText(e.target.value)}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            onResetChat={handleResetChat}
            onForwardMessage={handleOpenForwardMenu}
            isLoading={isLoading[focusedAI]}
            tokenCount={tokenCount}
            isFocused={true}
          />
        </Box>

        {/* Unfocused AI Cards */}
        <Box
          sx={{
            height: '15vh',
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          {unfocused.map((ai, index) => (
            <AICard
              key={ai.id}
              ai={ai}
              onClick={() => handleSwitch(ai.id)}
              index={index}
            />
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
    </Box>
  );
};

export default Team;