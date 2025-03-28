import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const StyledAppBar = styled(AppBar)({
  flexGrow: 1,
});

const StyledToolbar = styled(Toolbar)({
  minHeight: "100px",
});

export default function Appbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username") || null);

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem("username"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUsername(null);
    window.dispatchEvent(new Event("storage")); // Trigger event for storage change
    navigate("/Login");
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Grid container alignItems="center">
          {/* Left: Menu Icon */}
          <Grid item xs={2}>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Grid>

          {/* Center: Title */}
          <Grid item xs={8} container justifyContent="center">
            <Typography variant="h5">Urban Grievance Portal</Typography>
          </Grid>

          {/* Right: Register/Login OR Username with Logout */}
          <Grid item xs={2} container justifyContent="flex-end">
            {username ? (
              <>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "blue",
                    mr: 1,
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                  onClick={() => navigate("/dashboard")}
                >
                  {username}
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": { backgroundColor: "#d32f2f" },
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "blue",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
                onClick={() => navigate("/Login")}
              >
                Register / Login
              </Button>
            )}
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledAppBar>
  );
}
