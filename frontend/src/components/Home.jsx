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
  useMediaQuery,
  CssBaseline,
  Menu,
  Tooltip,
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
  MoreVert,
} from "@mui/icons-material";

import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

// Use Vite env var for API base URL; keep as provided
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Define a Slide transition component for the Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

// ---------------------- CAPACITY INDICATOR ---------------------- //
function CapacityIndicator({ eventId, capacity }) {
  const [registrationCount, setRegistrationCount] = useState(0);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!API_BASE) return;
    axios
      .get(`${API_BASE}/events/${eventId}/registration_count/`)
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
      <Typography variant="body2" sx={{ color: "text.secondary", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
        Capacity: {capacity} | Slots Remaining: {slotsRemaining}
      </Typography>
      <Box sx={{ position: "relative", mt: 0.5 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: isXs ? 10 : 20,
            borderRadius: 1,
            backgroundColor: "#ddd",
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                percentage < 50 ? "success.main" : percentage < 80 ? "warning.main" : "error.main",
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
            color: "text.primary",
            fontSize: isXs ? "0.7rem" : "0.85rem",
            textShadow: "0px 0px 3px rgba(0,0,0,0.6)",
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
            top: { xs: "8%", sm: "10%" },
            left: "50%",
            transform: "translate(-50%, 0)",
            background: "rgba(0, 0, 0, 0.85)",
            borderRadius: 2,
            p: { xs: 2, sm: 4 },
            textAlign: "center",
            color: "white",
            width: { xs: "92%", sm: "60%", md: "40%" },
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
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
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

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
          height: { xs: "auto", sm: 350 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: { xs: 1, sm: 0 },
          boxSizing: "border-box",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 }, color: "text.primary" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: "primary.main",
              mb: 1,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            {event.title}
          </Typography>
          <Divider sx={{ bgcolor: "primary.main", mb: 2, width: "60%", mx: "auto" }} />
          <Box sx={{ mb: 1, height: { xs: "auto", sm: 140 }, overflow: "hidden" }}>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5, fontSize: { xs: "0.78rem", sm: "0.9rem" } }}>
              <LocationOn sx={{ mr: 1, color: "success.main", fontSize: { xs: 18, sm: 20 } }} /> {event.location}
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5, fontSize: { xs: "0.78rem", sm: "0.9rem" } }}>
              <AccessTime sx={{ mr: 1, color: "warning.main", fontSize: { xs: 18, sm: 20 } }} /> {event.date} | {event.time}
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5, fontSize: { xs: "0.78rem", sm: "0.9rem" } }}>
              <Person sx={{ mr: 1, color: "secondary.main", fontSize: { xs: 18, sm: 20 } }} /> {event.organizer}
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5, fontSize: { xs: "0.78rem", sm: "0.9rem" } }}>
              <Event sx={{ mr: 1, color: "primary.main", fontSize: { xs: 18, sm: 20 } }} /> {event.event_type}{" "}
              <Info sx={{ ml: 1, mr: 1, color: "error.main", fontSize: { xs: 16, sm: 18 } }} /> Capacity: {event.capacity}
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5, fontSize: { xs: "0.78rem", sm: "0.9rem" } }}>
              <QrCode sx={{ mr: 1, color: "info.main", fontSize: { xs: 18, sm: 20 } }} /> Code: {event.event_code}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" }, mt: 1 }}>
              {event.description.length > (isXs ? 80 : 100)
                ? event.description.substring(0, isXs ? 80 : 100) + "..."
                : event.description}
            </Typography>
            <CapacityIndicator eventId={event.id} capacity={event.capacity} />
          </Box>
        </CardContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            p: 2,
            pt: 0,
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <Button
            variant="contained"
            onClick={() => onRegister(event)}
            startIcon={<HowToReg />}
            sx={{
              backgroundColor: "primary.main",
              color: "#fff",
              textTransform: "none",
              "&:hover": { backgroundColor: "primary.dark" },
              width: { xs: "100%", sm: "auto" },
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
              "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.06)" },
              width: { xs: "100%", sm: "auto" },
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
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

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
          background: "rgba(0, 0, 0, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          width: { xs: "95%", sm: "70%", md: "55%", lg: "40%" },
          color: "white",
          maxHeight: "90vh",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", display: "flex", alignItems: "center", fontSize: { xs: "1rem", sm: "1.25rem" } }}>
          <HowToReg sx={{ mr: 1 }} /> Register for{" "}
          <span style={{ color: "white", marginLeft: 8 }}>{event?.title}</span>
        </Typography>

        <TextField
          fullWidth
          name="full_name"
          label="Full Name"
          value={registrationData.full_name}
          onChange={onChange}
          variant="filled"
          sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.06)" }}
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
          sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.06)" }}
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
          sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.06)" }}
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
          sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.06)" }}
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
          sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.06)" }}
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
  const theme = useTheme();

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
          background: "rgba(0, 0, 0, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          width: { xs: "95%", sm: "75%", md: "60%", lg: "50%" },
          maxHeight: "85vh",
          overflowY: "auto",
          color: "white",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: "bold", display: "flex", alignItems: "center", fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          <Info sx={{ mr: 1 }} /> {event.title}
        </Typography>
        <Divider sx={{ bgcolor: "primary.main", mb: 2 }} />
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
            <LocationOn sx={{ mr: 1, color: "success.main" }} />
            <strong>Location:</strong>&nbsp; {event.location}
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
            <AccessTime sx={{ mr: 1, color: "warning.main" }} />
            <strong>Date & Time:</strong>&nbsp; {event.date} | {event.time}
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
            <Person sx={{ mr: 1, color: "secondary.main" }} />
            <strong>Organizer:</strong>&nbsp; {event.organizer}
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
            <Event sx={{ mr: 1, color: "primary.main" }} />
            <strong>Type:</strong>&nbsp; {event.event_type}
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
            <QrCode sx={{ mr: 1, color: "info.main" }} />
            <strong>Code:</strong>&nbsp; {event.event_code}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
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
            width: { xs: "100%", sm: "auto" },
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

  const baseTheme = createTheme({
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

  const theme = baseTheme;
  const muiTheme = useTheme();
  const isXs = useMediaQuery(muiTheme.breakpoints.down("sm"));

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

  // Menu anchor for mobile menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access");

  // Fetch events from the API
  useEffect(() => {
    setLoadingEvents(true);
    const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
    if (!API_BASE) {
      console.error("VITE_API_BASE_URL is not set.");
      setEventsError("API base URL not configured.");
      setLoadingEvents(false);
      return;
    }
    axios
      .get(`${API_BASE}/events/`, config)
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
        `${API_BASE}/events/${selectedEvent.id}/register/`,
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

  // Mobile menu handlers
  const handleMenuOpen = (e) => setMenuAnchorEl(e.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);
  const onMenuAddEvent = () => {
    handleMenuClose();
    handleAddEventClick();
  };
  const onMenuProfile = () => {
    handleMenuClose();
    if (!accessToken) {
      setLoginPromptOpen(true);
      return;
    }
    navigate("/profile");
  };
  const onMenuLogout = () => {
    handleMenuClose();
    handleLogout();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          top: { xs: 8, sm: 16 },
          right: { xs: 8, sm: 16 },
          zIndex: 1300,
          backgroundColor: "background.paper",
          "&:hover": { backgroundColor: "grey.600" },
          p: { xs: 0.5, sm: 1 },
        }}
        onClick={() => setDarkMode(!darkMode)}
        aria-label="toggle-theme"
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
          width: "100%",
          p: { xs: 1, sm: 2, md: 4 },
          m: 0,
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Container maxWidth="lg" sx={{ pt: { xs: 2, sm: 4 }, pb: { xs: 2, sm: 4 } }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1.5, sm: 0 },
              mb: 4,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                fontSize: { xs: "1.1rem", sm: "1.6rem", md: "2rem" },
                fontWeight: 700,
              }}
            >
              <RocketLaunch sx={{ mr: 1, color: "primary.main", fontSize: { xs: 20, sm: 28 } }} /> Upcoming Events
            </Typography>

            {/* Right-side actions: show compact menu on xs, full buttons on sm+ */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "flex-end", sm: "flex-start" },
              }}
            >
              {/* Mobile: single More menu */}
              {isXs ? (
                <>
                  <Tooltip title="Actions">
                    <IconButton
                      aria-label="open actions"
                      aria-controls={menuOpen ? "actions-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={menuOpen ? "true" : undefined}
                      onClick={handleMenuOpen}
                      sx={{
                        backgroundColor: "background.paper",
                        "&:hover": { backgroundColor: "grey.600" },
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>

                  <Menu
                    id="actions-menu"
                    anchorEl={menuAnchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 180,
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid rgba(255,255,255,0.06)`,
                      },
                    }}
                  >
                    <MenuItem onClick={onMenuAddEvent} sx={{ gap: 1 }}>
                      <AddCircleOutline fontSize="small" /> Add Event
                    </MenuItem>
                    <MenuItem onClick={onMenuProfile} sx={{ gap: 1 }}>
                      <Person fontSize="small" /> Profile
                    </MenuItem>
                    <MenuItem onClick={onMenuLogout} sx={{ gap: 1 }}>
                      <ExitToApp fontSize="small" /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                // Desktop / Tablet: full buttons
                <>
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
                      minWidth: 120,
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
                          minWidth: 100,
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
                          minWidth: 100,
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  )}
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
            <Grid container spacing={{ xs: 2, sm: 4 }}>
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
