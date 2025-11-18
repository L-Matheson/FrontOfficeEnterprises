import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useState } from "react";



function AiBoxs() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const ais = [
    { id: "general_manager" },
    { id: "creative_writing_fellow" },
    { id: "research_librarian" },
    { id: "the_archivist" },
    { id: "the_devils_advocate" },
    { id: "the_music_supervisor" },
    { id: "the_social_media_intern" },
    { id: "the_title_thumbnail_specialist" }
  ];

  const [focusedAI, setFocusedAI] = useState('general_manager');

  const focused = ais.filter((ai) => ai.id === focusedAI);
  const unfocused = ais.filter((ai) => ai.id !== focusedAI);

  function handleSwitch(newFocusAI) {
    setFocusedAI(newFocusAI);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2
      }}
    >
      {/* Focused AI Section */}
      <Box
        sx={{
          height: '60vh',
          transition: 'all 0.4s ease-in-out',
          width: '100%'
        }}
      >
        {focused.map((ai) => (
          <Box
            key={ai.id}
            sx={{
              height: '100%',
              padding: 3,
              backgroundColor: colors.primary[400],
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)',
              opacity: 1,
              animation: 'fadeInScale 0.4s ease-out',
              '@keyframes fadeInScale': {
                '0%': {
                  opacity: 0,
                  transform: 'scale(0.95) translateY(10px)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'scale(1) translateY(0)'
                }
              },
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: `0 4px 20px ${colors.primary[300]}40`
              }
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Focused: {ai.id.replace(/_/g, ' ')}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Unfocused AI Section */}
      <Box
        sx={{
          height: '15vh',
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          transition: 'all 0.3s ease-in-out',


        }}
      >
        {unfocused.map((ai, index) => (
          <Box
            key={ai.id}
            onClick={() => handleSwitch(ai.id)}
            sx={{
              height: '100%',
              padding: 2,
              backgroundColor: colors.primary[400],
              borderRadius: 2,
              width: (100 / (ais.length - 1)) + '%',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: 1,
              transform: 'translateY(0)',
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
                boxShadow: `0 8px 16px ${colors.primary[700]}40`
              }
            }}
          >
            <Typography variant="h6">
              {ai.id.replace(/_/g, ' ')}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <AiBoxs />
      {/* Your DataGrid and other components */}
    </Box>
  );
};

export default Team;