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
      .post("http://127.0.0.1:8000/api/events/", newEvent, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => navigate("/"))
      .catch(() => setError("Error creating event. Please try again."));
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
          // Use the same gradient background as Home.jsx with a smooth transition
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
            sx={{ color: "primary.main", fontWeight: "bold", mb: 3 }}
          >
            Add New Event
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* All TextFields use nested selectors to apply theme-based colors */}
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
              rows={3}
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
              }}
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
              }}
            />
            <TextField
              label="Time"
              type="time"
              fullWidth
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "text.primary" },
                "& .MuiInputLabel-root": { color: "text.secondary" },
              }}
            />
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
            />

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
          </form>

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
