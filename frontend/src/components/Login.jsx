import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  IconButton,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";

function Login() {
  // Dark/light mode toggle state
  const [darkMode, setDarkMode] = useState(true);

  // Theme matching AddEvent.jsx and Home.jsx
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#64ffda" : "#2196F3",
      },
      secondary: {
        main: darkMode ? "#ff6b6b" : "#f44336",
      },
      background: {
        default: darkMode ? "#121212" : "#e0eafc",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Orbitron", sans-serif',
      h3: {
        fontWeight: "bold",
      },
    },
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", { 
        username, 
        password 
      });

      // Store tokens in localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Redirect user to home page
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Dark/Light toggle button in top-right */}
      <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1300 }}>
        <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      <Box
        sx={{
          // Same gradient background as AddEvent and Home
          background: darkMode
            ? "linear-gradient(135deg, #0f0c29, #302b63, #24243e)"
            : "linear-gradient(135deg, #e0eafc, #cfdef3)",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          transition: "all 0.5s ease",
        }}
      >
        <Container
          maxWidth="sm"
          disableGutters
          sx={{
            background: "background.paper",
            border: "2px solid",
            borderColor: "primary.main",
            boxShadow: "0 0 15px rgba(100, 255, 218, 0.8)",
            p: 4,
            borderRadius: 2,
            textAlign: "center",
            width: "100%",
            maxWidth: "400px",
            transition: "all 0.5s ease",
          }}
        >
          <Typography
            variant="h4"
            sx={{ 
              color: "primary.main", 
              fontWeight: "bold", 
              mb: 3,
              fontFamily: '"Orbitron", sans-serif'
            }}
          >
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": { 
                  borderBottomColor: "text.secondary" 
                },
                "& .MuiInput-underline:hover:before": { 
                  borderBottomColor: "primary.main" 
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="standard"
              sx={{
                mb: 3,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": { 
                  borderBottomColor: "text.secondary" 
                },
                "& .MuiInput-underline:hover:before": { 
                  borderBottomColor: "primary.main" 
                },
              }}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                backgroundColor: "primary.main",
                color: "background.default",
                fontWeight: "bold",
                fontFamily: '"Orbitron", sans-serif',
                py: 1.5,
                "&:hover": {
                  backgroundColor: darkMode ? "#52e0c4" : "#1976d2",
                  boxShadow: "0 0 10px rgba(100, 255, 218, 0.6)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Login
            </Button>
          </form>

          <Typography 
            sx={{ 
              mt: 3, 
              color: "text.secondary",
              fontFamily: '"Orbitron", sans-serif'
            }}
          >
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              style={{ 
                color: darkMode ? "#64ffda" : "#2196F3",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Login;