import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Container,
  IconButton,
  Grid,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";

function AddEvent() {
  // Dark/light mode toggle state
  const [darkMode, setDarkMode] = useState(true);

  // Theme matching Home.jsx (using the same color format, font family, etc.)
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

  // API base from Vite .env (fallback to Render hosted URL if missing)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://events-1-amk2.onrender.com/api";

  // Form state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [customEventType, setCustomEventType] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const predefinedEventTypes = [
    "Conference",
    "Workshop",
    "Networking Event",
    "Webinar",
    "Concert",
    "Sports Event",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalEventType = eventType === "Other" ? customEventType : eventType;
    const newEvent = {
      title,
      description,
      date,
      time,
      location,
      event_type: finalEventType,
      organizer,
      capacity,
    };

    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      setError("You need to be logged in to add an event.");
      return;
    }

    axios
      .post(`${API_BASE_URL}/events/`, newEvent, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => navigate("/"))
      .catch(() => setError("Error creating event. Please try again."));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Dark/Light toggle button in top-right */}
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1300,
          // small box so it won't cause overflow
          p: 0.5,
          borderRadius: 1,
        }}
      >
        <IconButton
          onClick={() => setDarkMode(!darkMode)}
          color="inherit"
          aria-label="toggle theme"
          size="medium"
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      {/* Root wrapper — use width:100% (not 100vw) and hide horizontal overflow to avoid wiggle */}
      <Box
        sx={{
          // Use the same gradient background as Home.jsx with a smooth transition
          background: darkMode
            ? "linear-gradient(135deg, #0f0c29, #302b63, #24243e)"
            : "linear-gradient(135deg, #e0eafc, #cfdef3)",
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 4 },
          transition: "all 0.5s ease",
          boxSizing: "border-box",
          overflowX: "hidden", // prevents horizontal wiggle
        }}
      >
        <Container
          maxWidth="md"
          disableGutters
          sx={{
            background: "background.paper",
            border: "2px solid",
            borderColor: "primary.main",
            boxShadow: "0 0 15px rgba(100, 255, 218, 0.8)",
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            textAlign: "center",
            width: "100%",
            maxWidth: 820, // allow wider layout for desktop but still constrained
            transition: "all 0.5s ease",
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "primary.main", fontWeight: "bold", mb: 3 }}
          >
            Add New Event
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              // grid layout: single column on small screens, two-column on md+
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "start",
            }}
          >
            {/* Left column */}
            <Box sx={{ gridColumn: { xs: "1", md: "1 / 2" } }}>
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                variant="standard"
                sx={{
                  mb: 2,
                  "& .MuiInputBase-input": { color: "text.primary" },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />

              <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                variant="standard"
                multiline
                rows={4}
                sx={{
                  mb: 2,
                  "& .MuiInputBase-input": { color: "text.primary" },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiInputBase-input": { color: "text.primary" },
                      "& .MuiInputLabel-root": { color: "text.secondary" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Time"
                    type="time"
                    fullWidth
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiInputBase-input": { color: "text.primary" },
                      "& .MuiInputLabel-root": { color: "text.secondary" },
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Location"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                variant="standard"
                sx={{
                  mb: 2,
                  "& .MuiInputBase-input": { color: "text.primary" },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />
            </Box>

            {/* Right column */}
            <Box sx={{ gridColumn: { xs: "1", md: "2 / 3" } }}>
              <TextField
                select
                label="Event Type"
                fullWidth
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
                variant="standard"
                sx={{
                  mb: 2,
                  "& .MuiInputBase-input": { color: "text.primary" },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              >
                {predefinedEventTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              {eventType === "Other" && (
                <TextField
                  label="Custom Event Type"
                  fullWidth
                  value={customEventType}
                  onChange={(e) => setCustomEventType(e.target.value)}
                  required
                  variant="standard"
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": { color: "text.primary" },
                    "& .MuiInputLabel-root": { color: "text.secondary" },
                  }}
                />
              )}

              <TextField
                label="Organizer"
                fullWidth
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                required
                variant="standard"
                sx={{
                  mb: 2,
                  "& .MuiInputBase-input": { color: "text.primary" },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />
              <TextField
                label="Capacity"
                type="number"
                fullWidth
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                variant="standard"
                sx={{
                  mb: 3,
                  "& .MuiInputBase-input": { color: "text.primary" },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
                inputProps={{ min: 0 }}
              />

              {/* On small screens, ensure submit appears below everything */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  sx={{
                    backgroundColor: "primary.main",
                    color: "background.default",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: darkMode ? "#52e0c4" : "#1976d2",
                    },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>

            {/* On md+ screens, place Submit spanning both columns at bottom-right */}
            <Box
              sx={{
                gridColumn: "1 / -1",
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "primary.main",
                  color: "background.default",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.25,
                  "&:hover": {
                    backgroundColor: darkMode ? "#52e0c4" : "#1976d2",
                  },
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AddEvent;
