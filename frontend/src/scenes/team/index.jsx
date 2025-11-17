import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

function AiBox() {
  return (


    
  )
}

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

// Possible new mandate button
  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header title="Team" subtitle="Manage your AI team" />
      </Box>
      <Box width={'100%'} height={'60vh'} bgcolor={colors.primary[400]} borderRadius={'16px'} padding={'25px'}>
        Da dean goes here

      </Box>
    </Box>
  );
};

export default Team;
