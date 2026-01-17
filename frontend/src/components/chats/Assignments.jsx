import { Box, Typography, Paper, Button } from "@mui/material";
import ForwardIcon from "@mui/icons-material/Forward";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

/**
 * Assignments - Renders MOS instruction blocks ("To X:") with forward buttons.
 *
 * assignments: Array<{ target_ai_id: string, target_label: string, content: string }>
 */
const Assignments = ({ assignments = [], aiColor = "#1976d2", onForwardAssignment }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!Array.isArray(assignments) || assignments.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        backgroundColor: colors.primary[500],
        borderRadius: 2,
        border: `2px solid ${aiColor}30`,
        borderLeft: `4px solid ${aiColor}`,
        mb: 2,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, color: aiColor, mb: 1 }}>
        MOS Assignments
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
        Forward tasks to the right specialist.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {assignments.map((a, idx) => (
          <Paper
            key={`${a.target_ai_id || a.target_label || "unknown"}-${idx}`}
            sx={{
              p: 2,
              backgroundColor: colors.primary[400],
              border: `1px solid ${aiColor}20`,
              borderRadius: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.grey[100] }}>
                  To {a.target_label}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Target: {a.target_ai_id || "(unmapped)"}
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<ForwardIcon />}
                disabled={!a.target_ai_id || !onForwardAssignment}
                onClick={() => onForwardAssignment(a)}
                sx={{
                  backgroundColor: aiColor,
                  '&:hover': { backgroundColor: `${aiColor}dd` },
                }}
              >
                Forward
              </Button>
            </Box>

            <Typography
              variant="body1"
              sx={{
                mt: 1.5,
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                color: colors.grey[200],
              }}
            >
              {a.content}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
};

export default Assignments;
