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
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";

// API base URL from environment variables (Vite) with safe fallback
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

function Signup() {
  // Dark/light mode toggle state
  const [darkMode, setDarkMode] = useState(true);

  // Theme matching AddEvent.jsx and Home.jsx (keeps consistent look)
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
        default: darkMode ? "#0c0a21" : "#e0eafc",
        paper: darkMode ? "#131224" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#e6f7f1" : "#0f1724",
        secondary: darkMode ? "rgba(230,247,241,0.75)" : "rgba(15,23,36,0.7)",
      },
    },
    typography: {
      fontFamily: '"Orbitron", sans-serif',
      h3: { fontWeight: "bold" },
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const parseErrorMessage = (err) => {
    const resp = err?.response?.data;
    if (!resp) return "Network or server error. Please try again.";
    if (typeof resp === "string") return resp;
    if (resp.detail) return resp.detail;
    if (resp.error) return resp.error;
    try {
      // Combine field errors (e.g. { username: ["..."], password: ["..."] })
      const values = Object.values(resp)
        .flat()
        .map((v) => (typeof v === "string" ? v : JSON.stringify(v)));
      if (values.length) return values.join(" ");
    } catch {}
    return "Signup failed. Please check your input.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Minimal client-side validation (keeps everything you had)
    if (!userData.username || !userData.password) {
      setError("Username and password are required.");
      setLoading(false);
      return;
    }

    try {
      // Post to your backend register endpoint
      await axios.post(`${API_BASE_URL}/register/`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      setLoading(false);
      // On success, go to login page
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(parseErrorMessage(err));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* theme toggle (fixed, small, won't cause overflow) */}
      <Box
        sx={{
          position: "fixed",
          top: { xs: 12, sm: 16 },
          right: { xs: 12, sm: 16 },
          zIndex: 1400,
        }}
      >
        <IconButton
          onClick={() => setDarkMode((s) => !s)}
          aria-label="toggle theme"
          size="medium"
          sx={{ color: "text.primary" }}
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      {/* Root wrapper — use width:100% (not 100vw) to avoid horizontal wiggle */}
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 3 },
          boxSizing: "border-box",
          background: darkMode
            ? "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
            : "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
          overflowX: "hidden",
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            width: "100%",
            maxWidth: 520,
            bgcolor: "background.paper",
            border: "2px solid",
            borderColor: "primary.main",
            boxShadow: darkMode
              ? "0 8px 30px rgba(0,0,0,0.55)"
              : "0 8px 30px rgba(33,150,243,0.08)",
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
            }}
          >
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
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
                "& .MuiFormLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": { borderBottomColor: "text.secondary" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "primary.main" },
              }}
              inputProps={{ "aria-label": "username" }}
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
                "& .MuiFormLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": { borderBottomColor: "text.secondary" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "primary.main" },
              }}
              inputProps={{ "aria-label": "password" }}
            />

            <TextField
              label="Full Name"
              name="full_name"
              fullWidth
              onChange={handleChange}
              variant="standard"
              sx={{ mb: 2, "& .MuiInputBase-input": { color: "text.primary" } }}
            />

            <TextField
              label="Phone Number"
              name="phone_number"
              fullWidth
              onChange={handleChange}
              variant="standard"
              sx={{ mb: 2, "& .MuiInputBase-input": { color: "text.primary" } }}
            />

            <TextField
              label="Bio"
              name="bio"
              fullWidth
              multiline
              rows={2}
              onChange={handleChange}
              variant="standard"
              sx={{ mb: 2, "& .MuiInputBase-input": { color: "text.primary" } }}
            />

            <TextField
              label="Location"
              name="location"
              fullWidth
              onChange={handleChange}
              variant="standard"
              sx={{ mb: 2, "& .MuiInputBase-input": { color: "text.primary" } }}
            />

            <TextField
              label="Interests"
              name="interests"
              placeholder="e.g., Tech, Music, Sports"
              fullWidth
              onChange={handleChange}
              variant="standard"
              sx={{ mb: 3, "& .MuiInputBase-input": { color: "text.primary" } }}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: "primary.main",
                color: "background.default",
                fontWeight: 700,
                py: 1.25,
                mb: 1.5,
                "&:hover": {
                  backgroundColor: darkMode ? "#52e0c4" : "#1976d2",
                  boxShadow: "0 0 8px rgba(100,255,218,0.25)",
                },
                transition: "all 0.2s ease",
              }}
              aria-label="signup"
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Sign Up"}
            </Button>
          </Box>

          <Typography
            sx={{
              mt: 2,
              color: "text.secondary",
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: darkMode ? "#64ffda" : "#2196F3",
                textDecoration: "none",
                fontWeight: 700,
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
