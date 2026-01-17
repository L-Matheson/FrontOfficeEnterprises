import { Box, Typography, Paper } from "@mui/material";
import { useState } from "react";

/**
 * ModularBox - Renders individual modules with optional click functionality
 * @param {object} module - The module data to display
 * @param {boolean} clickable - Whether the module should be clickable
 * @param {string} aiColor - Color theme from the AI
 */
const ModularBox = ({ module, clickable = false, aiColor = "#1976d2" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!clickable) return;

    // Save module details to an object
    const moduleDetails = {
      title: module.title || module.name || "Untitled",
      description: module.description || module.content || "",
      timestamp: new Date().toISOString(),
      moduleData: module,
    };

    console.log("Module clicked:", moduleDetails);
  };

  return (
    <Paper
      elevation={isHovered && clickable ? 8 : 2}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        p: 2,
        mb: 1,
        cursor: clickable ? "pointer" : "default",
        border: `2px solid ${aiColor}30`,
        borderLeft: `4px solid ${aiColor}`,
        transition: "all 0.3s ease",
        backgroundColor: isHovered && clickable ? `${aiColor}08` : "background.paper",
        transform: isHovered && clickable ? "translateX(4px)" : "translateX(0)",
        "&:hover": {
          borderColor: clickable ? `${aiColor}60` : `${aiColor}30`,
        },
      }}
    >
      <Box>
        {/* Module Title */}
        {(module.title || module.name) && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: aiColor,
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {module.title || module.name}
            {clickable && (
              <Typography
                component="span"
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  fontWeight: 400,
                }}
              >
                (click to select)
              </Typography>
            )}
          </Typography>
        )}

        {/* Module Description/Content */}
        {(module.description || module.content) && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {module.description || module.content}
          </Typography>
        )}

        {/* Additional module fields */}
        {module.details && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "text.secondary",
              fontStyle: "italic",
            }}
          >
            {module.details}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ModularBox;
