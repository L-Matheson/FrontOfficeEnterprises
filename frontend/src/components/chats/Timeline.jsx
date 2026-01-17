import { Box, Typography, Paper, Stepper, Step, StepLabel, StepContent } from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * Timeline - Displays video modules in a vertical timeline format
 * @param {Array} modules - Array of module objects with number, title, dates, body
 * @param {string} aiColor - Color theme from the AI
 */
const Timeline = ({ modules = [], aiColor = "#1976d2" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Safety check: ensure modules is an array
  if (!Array.isArray(modules)) {
    console.error('Timeline received non-array modules:', typeof modules, modules);
    return (
      <Box sx={{ textAlign: 'center', py: 2, opacity: 0.6 }}>
        <Typography variant="body2" color="error">
          Error: Expected array of modules but received {typeof modules}
        </Typography>
      </Box>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2, opacity: 0.6 }}>
        <Typography variant="body2">No modules to display</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        backgroundColor: colors.primary[500],
        borderRadius: 2,
        border: `2px solid ${aiColor}30`,
        borderLeft: `4px solid ${aiColor}`,
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <CheckCircleIcon sx={{ color: aiColor, fontSize: 28 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: aiColor }}>
          Course Syllabus
        </Typography>
      </Box>

      <Stepper orientation="vertical" sx={{ 
        '& .MuiStepConnector-line': {
          borderColor: `${aiColor}40`,
          borderLeftWidth: 2,
          minHeight: 20,
        }
      }}>
        {modules.map((module, index) => (
          <Step key={`${module.number ?? index}-${module.title ?? ''}`} active={true} expanded={true}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: aiColor,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                >
                  {module.number || index + 1}
                </Box>
              )}
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: colors.grey[100],
                }
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: aiColor }}>
                  {module.title}
                </Typography>
                {module.dates && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: colors.greenAccent[400],
                      fontStyle: 'italic',
                      mt: 0.5,
                    }}
                  >
                    {module.dates}
                  </Typography>
                )}
              </Box>
            </StepLabel>
            <StepContent
              sx={{
                borderLeft: `2px solid ${aiColor}40`,
                ml: 2,
                pl: 3,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: colors.primary[400],
                  border: `1px solid ${aiColor}20`,
                  mt: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.grey[200],
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {module.body}
                </Typography>
              </Paper>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default Timeline;
