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
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";

/**
 * Login.jsx
 *
 * - Uses Vite env var VITE_API_BASE_URL (falls back to your Render URL if not set).
 * - Posts to `${API_BASE}/token/` instead of hardcoded 127.0.0.1.
 * - Includes CssBaseline and stable layout to avoid "wiggle" (no 100vw usage).
 * - Responsive for phone / tablet / desktop.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Login() {
  // Dark/light mode toggle state
  const [darkMode, setDarkMode] = useState(true);

  // Theme shared with other pages
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
    },
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/token/`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // store tokens and redirect
      if (res?.data?.access) localStorage.setItem("access", res.data.access);
      if (res?.data?.refresh) localStorage.setItem("refresh", res.data.refresh);

      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      // Friendly error parsing that covers common API shapes
      const resp = err?.response?.data;
      let msg = "Invalid credentials";
      if (!resp) {
        msg = "Network or server error. Please try again.";
      } else if (typeof resp === "string") {
        msg = resp;
      } else if (resp.detail) {
        msg = resp.detail;
      } else if (resp.error) {
        msg = resp.error;
      } else {
        // combine field errors if present
        try {
          const values = Object.values(resp).flat();
          if (values.length) msg = values.join(" ");
        } catch {
          msg = JSON.stringify(resp);
        }
      }
      setError(msg);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* root container - no 100vw to avoid horizontal wiggle */}
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 3 },
          boxSizing: "border-box",
          background:
            darkMode
              ? "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
              : "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
          overflowX: "hidden",
        }}
      >
        {/* Theme toggle - fixed but small and won't cause overflow */}
        <Box
          sx={{
            position: "fixed",
            top: { xs: 12, sm: 16 },
            right: { xs: 12, sm: 16 },
            zIndex: 1400,
            bgcolor: "transparent",
            borderRadius: 1,
          }}
        >
          <IconButton
            onClick={() => setDarkMode((s) => !s)}
            aria-label="toggle theme"
            size="medium"
            sx={{
              color: "text.primary",
              bgcolor: "transparent",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        <Container
          maxWidth="xs"
          sx={{
            width: "100%",
            maxWidth: 420,
            bgcolor: "background.paper",
            border: "2px solid",
            borderColor: "primary.main",
            boxShadow: (t) =>
              darkMode
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
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate>
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
                "& .MuiFormLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": { borderBottomColor: "text.secondary" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "primary.main" },
              }}
              inputProps={{ "aria-label": "username" }}
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
                "& .MuiFormLabel-root": { color: "text.secondary" },
                "& .MuiInput-underline:before": { borderBottomColor: "text.secondary" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "primary.main" },
              }}
              inputProps={{ "aria-label": "password" }}
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
              aria-label="login"
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Login"}
            </Button>
          </Box>

          <Typography
            sx={{
              mt: 2,
              color: "text.secondary",
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: darkMode ? "#64ffda" : "#2196F3",
                textDecoration: "none",
                fontWeight: 700,
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
