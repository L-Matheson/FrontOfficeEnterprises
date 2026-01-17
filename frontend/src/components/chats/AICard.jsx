import { Box, Typography, Paper, Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const AICard = ({ ai, onClick, index = 0 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Tooltip title={ai.description} arrow>
      <Paper
        onClick={onClick}
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
        <Box sx={{ color: ai.color, display: 'flex' }}>
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
  );
};

export default AICard;
