import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// MUI Components & Icons
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
  Fade,
  Slide,
} from "@mui/material";

import {
  LocationOn,
  Event,
  AccessTime,
  Person,
  Info,
  AddCircleOutline,
  ExitToApp,
  RocketLaunch,
  HowToReg,
  Email,
  Phone,
  EventAvailable,
  ContactPhone,
  Visibility,
  QrCode,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Define a Slide transition component for the Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

// ---------------------- CAPACITY INDICATOR ---------------------- //
function CapacityIndicator({ eventId, capacity }) {
  const [registrationCount, setRegistrationCount] = useState(0);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/events/${eventId}/registration_count/`)
      .then((response) => {
        setRegistrationCount(response.data.registration_count);
      })
      .catch((error) => {
        console.error("Error fetching registration count:", error);
      });
  }, [eventId]);

  const slotsRemaining = capacity - registrationCount;
  const percentage = Math.min((registrationCount / capacity) * 100, 100);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Capacity: {capacity} | Slots Remaining: {slotsRemaining}
      </Typography>
      <Box sx={{ position: "relative", mt: 0.5 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 20,
            borderRadius: 1,
            backgroundColor: "#ddd",
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                percentage < 50 ? "#4caf50" : percentage < 80 ? "#ff9800" : "#f44336",
              transition: "background-color 0.5s ease",
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
            color: "black",
            textShadow: "0px 0px 4px rgba(0,0,0,0.7)",
          }}
        >
          {`${Math.round(percentage)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

// ---------------------- LOGIN PROMPT MODAL ---------------------- //
function LoginPrompt({ open, onClose, onLogin }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <Fade in={open} timeout={1500}>
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, 0)",
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            You need to be logged in to use this feature.
          </Typography>
          <Button
            variant="contained"
            onClick={onLogin}
            sx={{
              backgroundColor: "primary.main",
              color: "#fff",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            Login
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}

// ---------------------- FUTURISTIC EVENT CARD ---------------------- //
function EventCard({ event, onRegister, onViewDetails }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          background: "transparent",
          border: 2,
          borderColor: "primary.main",
          borderRadius: 3,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.5)",
          },
          height: 350,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardContent sx={{ p: 3, color: "text.primary" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: "primary.main",
              mb: 1,
            }}
          >
            {event.title}
          </Typography>
          <Divider
            sx={{
              bgcolor: "primary.main",
              mb: 2,
              width: "60%",
              mx: "auto",
            }}
          />
          <Box sx={{ mb: 1, height: 140, overflow: "hidden" }}>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <LocationOn sx={{ mr: 1, color: "success.main" }} /> {event.location}
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <AccessTime sx={{ mr: 1, color: "warning.main" }} /> {event.date} | {event.time}
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Person sx={{ mr: 1, color: "secondary.main" }} /> {event.organizer}
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Event sx={{ mr: 1, color: "primary.main" }} /> {event.event_type}{" "}
              <Info sx={{ ml: 1, mr: 1, color: "error.main" }} /> Capacity: {event.capacity}
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <QrCode sx={{ mr: 1, color: "info.main" }} /> Code: {event.event_code}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.85rem", mt: 1 }}>
              {event.description.length > 100
                ? event.description.substring(0, 100) + "..."
                : event.description}
            </Typography>
            <CapacityIndicator eventId={event.id} capacity={event.capacity} />
          </Box>
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-around", p: 2, pt: 0 }}>
          <Button
            variant="contained"
            onClick={() => onRegister(event)}
            startIcon={<HowToReg />}
            sx={{
              backgroundColor: "primary.main",
              color: "#fff",
              textTransform: "none",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            Get QR
          </Button>
          <Button
            variant="outlined"
            onClick={() => onViewDetails(event)}
            startIcon={<Visibility />}
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              textTransform: "none",
              "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.1)" },
            }}
          >
            View Details
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}

// ---------------------- REGISTRATION MODAL ---------------------- //
function RegistrationModal({
  open,
  onClose,
  event,
  onSubmit,
  registrationData,
  onChange,
  isSubmitting,
  feedbackMessage,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: 24,
          p: 4,
          width: { xs: "90%", sm: "60%", md: "40%" },
          color: "white",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", display: "flex", alignItems: "center" }}>
          <HowToReg sx={{ mr: 1 }} /> Register for{" "}
          <span style={{ color: "white", marginLeft: 4 }}>{event?.title}</span>
        </Typography>

        <TextField
          fullWidth
          name="full_name"
          label="Full Name"
          value={registrationData.full_name}
          onChange={onChange}
          variant="filled"
          sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.1)" }}
          InputProps={{
            style: { color: "white" },
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ mr: 1, color: "success.main" }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <TextField
          fullWidth
          name="email"
          label="Email"
          value={registrationData.email}
          onChange={onChange}
          variant="filled"
          sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.1)" }}
          InputProps={{
            style: { color: "white" },
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ mr: 1, color: "warning.main" }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <TextField
          fullWidth
          name="phone_number"
          label="Phone Number"
          value={registrationData.phone_number}
          onChange={onChange}
          variant="filled"
          sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.1)" }}
          InputProps={{
            style: { color: "white" },
            startAdornment: (
              <InputAdornment position="start">
                <Phone sx={{ mr: 1, color: "secondary.main" }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Email sx={{ color: "warning.main", mr: 1 }} />
          <FormControl fullWidth variant="filled">
            <InputLabel sx={{ color: "white" }}>Preferred Contact Method</InputLabel>
            <Select
              name="preferred_contact_method"
              value={registrationData.preferred_contact_method}
              onChange={onChange}
              label="Preferred Contact Method"
              sx={{ color: "white" }}
            >
              <MenuItem value="Email">Email</MenuItem>
              <MenuItem value="Phone">Phone</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          name="city"
          label="City"
          value={registrationData.city}
          onChange={onChange}
          variant="filled"
          sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.1)" }}
          InputProps={{
            style: { color: "white" },
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn sx={{ mr: 1, color: "success.main" }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <EventAvailable sx={{ color: "primary.main", mr: 1 }} />
          <FormControl fullWidth variant="filled">
            <InputLabel sx={{ color: "white" }}>Event Attendance Mode</InputLabel>
            <Select
              name="event_attendance_mode"
              value={registrationData.event_attendance_mode}
              onChange={onChange}
              label="Event Attendance Mode"
              sx={{ color: "white" }}
            >
              <MenuItem value="In-Person">In-Person</MenuItem>
              <MenuItem value="Virtual">Virtual</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          name="emergency_contact"
          label="Emergency Contact"
          value={registrationData.emergency_contact}
          onChange={onChange}
          variant="filled"
          sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.1)" }}
          InputProps={{
            style: { color: "white" },
            startAdornment: (
              <InputAdornment position="start">
                <ContactPhone sx={{ mr: 1, color: "info.main" }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        {feedbackMessage && (
          <Typography
            variant="body2"
            sx={{ mb: 2, color: isSubmitting ? "warning.main" : "white", fontWeight: "bold" }}
          >
            {feedbackMessage}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={onSubmit}
          startIcon={<RocketLaunch />}
          sx={{
            backgroundColor: "primary.main",
            color: "#fff",
            width: "100%",
            textTransform: "none",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </Button>
      </Box>
    </Modal>
  );
}

// ---------------------- EVENT DETAILS MODAL ---------------------- //
function EventDetailsModal({ open, onClose, event }) {
  if (!event) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: 24,
          p: 4,
          width: { xs: "90%", sm: "60%", md: "40%" },
          maxHeight: "80vh",
          overflowY: "auto",
          color: "white",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", display: "flex", alignItems: "center" }}
        >
          <Info sx={{ mr: 1 }} /> {event.title}
        </Typography>
        <Divider sx={{ bgcolor: "primary.main", mb: 2 }} />
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOn sx={{ mr: 1, color: "success.main" }} />
            <strong>Location:</strong>&nbsp; {event.location}
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccessTime sx={{ mr: 1, color: "warning.main" }} />
            <strong>Date & Time:</strong>&nbsp; {event.date} | {event.time}
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Person sx={{ mr: 1, color: "secondary.main" }} />
            <strong>Organizer:</strong>&nbsp; {event.organizer}
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Event sx={{ mr: 1, color: "primary.main" }} />
            <strong>Type:</strong>&nbsp; {event.event_type}
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <QrCode sx={{ mr: 1, color: "info.main" }} />
            <strong>Code:</strong>&nbsp; {event.event_code}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {event.description}
          </Typography>
          <CapacityIndicator eventId={event.id} capacity={event.capacity} />
        </Box>
        <Button
          variant="contained"
          onClick={onClose}
          startIcon={<ExitToApp />}
          sx={{
            backgroundColor: "primary.main",
            color: "#fff",
            mt: 2,
            textTransform: "none",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}

// ---------------------- MAIN HOME COMPONENT ---------------------- //
function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [registrationInProgress, setRegistrationInProgress] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#64ffda" : "#2196F3" },
      secondary: { main: darkMode ? "#ff6b6b" : "#f44336" },
      background: { default: darkMode ? "#0c0a21" : "#e0eafc", paper: darkMode ? "#1d1d32" : "#ffffff" },
    },
    typography: {
      fontFamily: '"Orbitron", sans-serif',
      h3: { fontWeight: "bold" },
    },
  });

  // State variables for events, modals, registration, etc.
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  // Snackbar for messages
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Registration Modal state
  const [openRegModal, setOpenRegModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    preferred_contact_method: "Email",
    city: "",
    event_attendance_mode: "In-Person",
    emergency_contact: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Event Details Modal state
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [detailsEvent, setDetailsEvent] = useState(null);

  // New state for the login prompt modal
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access");

  // Fetch events from the API
  useEffect(() => {
    setLoadingEvents(true);
    const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
    axios
      .get("http://127.0.0.1:8000/api/events/", config)
      .then((response) => {
        setEvents(response.data);
        setLoadingEvents(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setEventsError("Failed to load events. Please try again later.");
        setLoadingEvents(false);
      });
  }, [accessToken]);

  const handleAddEventClick = () => {
    if (!accessToken) {
      setLoginPromptOpen(true);
      return;
    } else {
      navigate("/add-event");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const handleOpenRegModal = (event) => {
    if (!accessToken) {
      setLoginPromptOpen(true);
      return;
    }
    setSelectedEvent(event);
    setOpenRegModal(true);
    setFeedbackMessage("");
  };

  const handleCloseRegModal = () => {
    setOpenRegModal(false);
    setRegistrationData({
      full_name: "",
      email: "",
      phone_number: "",
      preferred_contact_method: "Email",
      city: "",
      event_attendance_mode: "In-Person",
      emergency_contact: "",
    });
    setFeedbackMessage("");
    setIsSubmitting(false);
  };

  const handleViewDetails = (event) => {
    setDetailsEvent(event);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setDetailsEvent(null);
  };

  const handleRegistrationInputChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegistrationSubmit = async () => {
    if (!selectedEvent) return;
    setIsSubmitting(true);
    setRegistrationInProgress(true);
    setFeedbackMessage("Submitting your registration... Please wait.");
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/events/${selectedEvent.id}/register/`,
        registrationData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // Registration succeeded: set success messages and open the Snackbar.
      setFeedbackMessage("Registration successful! Your QR code invitation has been sent.");
      setSnackbarMessage("Registration QR Successfully Sent To Email Address");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setIsSubmitting(false);
      // After 5 seconds, hide progress, close modal, and navigate back to home.
      setTimeout(() => {
        setRegistrationInProgress(false);
        handleCloseRegModal();
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error("Error during registration:", error);
      setIsSubmitting(false);
      setRegistrationInProgress(false);
      if (error.response && error.response.data) {
        let errMsg = "";
        if (
          error.response.data.detail &&
          error.response.data.detail.toLowerCase().includes("email")
        ) {
          errMsg =
            "Registration is unique, but an error occurred while sending the confirmation email. Please try again later.";
        } else {
          errMsg = Object.values(error.response.data).flat().join("\n");
        }
        setFeedbackMessage(errMsg || "Registration failed. Please try again.");
      } else {
        setFeedbackMessage("Registration failed. Please check your input and try again.");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Global Progress Bar for Registration */}
      {registrationInProgress && (
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 2000,
          }}
        />
      )}

      {/* Fixed Theme Toggle Button */}
      <IconButton
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1300,
          backgroundColor: "background.paper",
          "&:hover": { backgroundColor: "grey.600" },
        }}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      {/* Login Prompt Modal */}
      <LoginPrompt
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        onLogin={() => {
          setLoginPromptOpen(false);
          navigate("/login");
        }}
      />

      <Box
        sx={{
          background: darkMode
            ? "linear-gradient(135deg, #0c0a21, #26224f, #1d1d32)"
            : "linear-gradient(135deg, #e0eafc, #cfdef3)",
          minHeight: "100vh",
          width: "100vw",
          p: 0,
          m: 0,
        }}
      >
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h3" sx={{ color: "text.primary" }}>
              <RocketLaunch sx={{ mr: 1, color: "primary.main" }} /> Upcoming Events
            </Typography>
            <Box>
              <Button
                variant="contained"
                onClick={handleAddEventClick}
                startIcon={<AddCircleOutline />}
                sx={{
                  backgroundColor: "primary.main",
                  color: "#fff",
                  mr: 2,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                Add Event
              </Button>
              {accessToken && (
                <>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/profile")}
                    startIcon={<Person />}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "#fff",
                      mr: 2,
                      textTransform: "none",
                      "&:hover": { backgroundColor: "primary.dark" },
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleLogout}
                    startIcon={<ExitToApp />}
                    sx={{
                      backgroundColor: "secondary.main",
                      color: "#fff",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "secondary.dark" },
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Event List */}
          {loadingEvents ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          ) : eventsError ? (
            <Typography variant="h6" align="center" sx={{ color: "error.main" }}>
              {eventsError}
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={handleOpenRegModal}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="h6" align="center" sx={{ color: "text.secondary" }}>
                    No events available
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}

          {/* Registration Modal */}
          <RegistrationModal
            open={openRegModal}
            onClose={handleCloseRegModal}
            event={selectedEvent}
            onSubmit={handleRegistrationSubmit}
            registrationData={registrationData}
            onChange={handleRegistrationInputChange}
            isSubmitting={isSubmitting}
            feedbackMessage={feedbackMessage}
          />

          {/* Event Details Modal */}
          <EventDetailsModal
            open={openDetailsModal}
            onClose={handleCloseDetailsModal}
            event={detailsEvent}
          />

          {/* Snackbar for Success Message */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            TransitionComponent={SlideTransition}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
