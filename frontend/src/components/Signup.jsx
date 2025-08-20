import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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

// API base URL from environment variables (Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

function Signup() {
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

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    full_name: "",
    phone_number: "",
    bio: "",
    location: "",
    interests: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      await axios.post(`${API_BASE_URL}/register/`, userData);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      setError(error.response?.data?.error || "Signup failed");
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
            maxWidth: "500px",
            transition: "all 0.5s ease",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              mb: 3,
              fontFamily: '"Orbitron", sans-serif',
            }}
          >
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              onChange={handleChange}
              required
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "text.secondary",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "primary.main",
                },
              }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              onChange={handleChange}
              required
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "text.secondary",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "primary.main",
                },
              }}
            />

            <TextField
              label="Full Name"
              name="full_name"
              fullWidth
              onChange={handleChange}
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "text.secondary",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "primary.main",
                },
              }}
            />

            <TextField
              label="Phone Number"
              name="phone_number"
              fullWidth
              onChange={handleChange}
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "text.secondary",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "primary.main",
                },
              }}
            />

            <TextField
              label="Bio"
              name="bio"
              fullWidth
              multiline
              rows={2}
              onChange={handleChange}
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "text.secondary",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "primary.main",
                },
              }}
            />

            <TextField
              label="Location"
              name="location"
              fullWidth
              onChange={handleChange}
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "text.secondary",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "primary.main",
                },
              }}
            />

            <TextField
              label="Interests"
              name="interests"
              placeholder="e.g., Tech, Music, Sports"
              fullWidth
              onChange={handleChange}
              variant="standard"
              sx={{
                mb: 3,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "text.secondary",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "primary.main",
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
              Sign Up
            </Button>
          </form>

          <Typography
            sx={{
              mt: 3,
              color: "text.secondary",
              fontFamily: '"Orbitron", sans-serif',
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: darkMode ? "#64ffda" : "#2196F3",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Login here
            </Link>
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Signup;
