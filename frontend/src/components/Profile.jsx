import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Brightness4,
  Brightness7,
  Person,
  LocationOn,
  Phone,
  Info,
  EmojiEvents,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CancelIcon from "@mui/icons-material/Cancel";

// ---------------------- CreatedEventRow Component ---------------------- //
function CreatedEventRow({ event, onDelete }) {
  const [registrationCount, setRegistrationCount] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/events/${event.id}/registration_count/`)
      .then((response) => {
        setRegistrationCount(response.data.registration_count);
      })
      .catch((error) => {
        console.error("Error fetching registration count:", error);
        setRegistrationCount(0);
      });
  }, [event.id]);

  if (registrationCount === null) {
    return (
      <TableRow>
        <TableCell align="center">{event.title}</TableCell>
        <TableCell align="center">{event.capacity}</TableCell>
        <TableCell align="center" colSpan={3}>
          <CircularProgress size={20} />
        </TableCell>
        <TableCell align="center">
          <IconButton onClick={() => onDelete(event.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  const regCount = Number(registrationCount);
  const slotsRemaining = event.capacity - regCount;
  const progress =
    event.capacity > 0 ? Math.round((regCount / event.capacity) * 100) : 0;

  return (
    <TableRow>
      <TableCell align="center">{event.title}</TableCell>
      <TableCell align="center">{event.capacity}</TableCell>
      <TableCell align="center">{regCount}</TableCell>
      <TableCell align="center">{slotsRemaining}</TableCell>
      <TableCell align="center">
        <Box sx={{ position: "relative", width: "100%" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 30,
              borderRadius: 5,
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  progress < 50 ? "#4caf50" : progress < 80 ? "#ff9800" : "#f44336",
                transition: "background-color 0.5s ease",
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: "bold",
              color: "black",
            }}
          >
            {progress}%
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <IconButton onClick={() => onDelete(event.id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

// ---------------------- Main Profile Component ---------------------- //
function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Deterministic gradient generator based on username
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const generateGradientFromUsername = (username) => {
    const baseHash = hashCode(username);
    const getColor = (offset) => {
      let colorInt = (baseHash + offset) % 16777215;
      if (colorInt < 0) colorInt += 16777215;
      return "#" + colorInt.toString(16).padStart(6, "0");
    };
    const color1 = getColor(0);
    const color2 = getColor(100);
    const color3 = getColor(200);
    return `linear-gradient(45deg, ${color1}, ${color2}, ${color3})`;
  };

  // Create a theme with a glass-like feel
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#64ffda" : "#2196F3" },
      secondary: { main: darkMode ? "#ff6b6b" : "#f44336" },
      background: {
        default: darkMode ? "#0c0a21" : "#e0eafc",
        paper: darkMode ? "rgba(29, 29, 50, 0.5)" : "rgba(255, 255, 255, 0.5)",
      },
    },
    typography: {
      fontFamily: '"Orbitron", sans-serif',
      h3: { fontWeight: "bold" },
    },
  });

  // Fetch profile with current token
  const fetchProfile = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (err) {
      setError("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_picture", file);
      try {
        const token = localStorage.getItem("access");
        const response = await axios.patch(
          "http://127.0.0.1:8000/api/profile/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.patch(
        "http://127.0.0.1:8000/api/profile/",
        { profile_picture: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem("access");
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${eventId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUnregisterEvent = async (eventId) => {
    const token = localStorage.getItem("access");
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/events/${eventId}/register/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProfile();
    } catch (error) {
      console.error("Error unregistering from event:", error);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            background: darkMode
              ? "linear-gradient(135deg, #0c0a21, #26224f, #1d1d32)"
              : "linear-gradient(135deg, #e0eafc, #cfdef3)",
            height: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            background: darkMode
              ? "linear-gradient(135deg, #0c0a21, #26224f, #1d1d32)"
              : "linear-gradient(135deg, #e0eafc, #cfdef3)",
            height: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // For profile, we assume profile.created_events and profile.registered_events are available.
  const createdEvents = profile.created_events || [];
  const registeredEvents = profile.registered_events || [];

  return (
    <ThemeProvider theme={theme}>
      {/* Outer container fills the viewport with no scrolling */}
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          background: darkMode
            ? "linear-gradient(135deg, #0c0a21, #26224f, #1d1d32)"
            : "linear-gradient(135deg, #e0eafc, #cfdef3)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header: Home Button and Theme Toggle (scrolls with content) */}
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            p: 1,
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: darkMode ? "#64ffda" : "#2196F3",
              backgroundColor: theme.palette.background.paper,
              padding: "8px 16px",
              borderRadius: "4px",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
              fontWeight: "bold",
              marginRight: "16px",
            }}
          >
            Home
          </Link>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              "&:hover": { backgroundColor: "grey.600" },
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        {/* Main content fills remaining space and scrolls internally if needed */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
          }}
        >
          <Box sx={{ display: { xs: "block", md: "flex" }, gap: 4 }}>
            {/* Left Side: Profile Details */}
            <Box sx={{ width: { xs: "100%", md: "30%" } }}>
              <Typography
                variant="h3"
                sx={{ color: "text.primary", mb: 2, textAlign: "left" }}
              >
                <Person sx={{ mr: 1, color: "primary.main" }} /> My Profile
              </Typography>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1px solid rgba(255, 255, 255, 0.3)`,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                  borderRadius: 2,
                  p: 2,
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", p: 2 }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: 150,
                      height: 150,
                      mb: 1,
                      "&:hover .overlay": {
                        opacity: 1,
                        backdropFilter: "blur(4px)",
                      },
                    }}
                  >
                    <Avatar
                      src={profile.profile_picture || ""}
                      alt="Profile Picture"
                      sx={{
                        width: 150,
                        height: 150,
                        boxSizing: "border-box",
                        border: `3px solid ${theme.palette.primary.main}`,
                        cursor: "pointer",
                        background: profile.profile_picture
                          ? "none"
                          : generateGradientFromUsername(profile.username),
                        color: profile.profile_picture ? "inherit" : "white",
                        fontSize: 64,
                      }}
                      onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                      }
                    >
                      {!profile.profile_picture &&
                        profile.username &&
                        profile.username[0].toUpperCase()}
                    </Avatar>
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        top: 3,
                        left: 3,
                        width: "calc(100% - 6px)",
                        height: "calc(100% - 6px)",
                        borderRadius: "50%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 1,
                        opacity: 0,
                        transition: "opacity 0.5s ease-in-out, backdrop-filter 0.5s ease-in-out",
                      }}
                    >
                      {profile.profile_picture ? (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                            onClick={() =>
                              fileInputRef.current && fileInputRef.current.click()
                            }
                          >
                            <EditIcon sx={{ fontSize: 20, mr: 0.5 }} />
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                              Edit
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                            onClick={handleDeleteImage}
                          >
                            <DeleteIcon sx={{ fontSize: 20, mr: 0.5 }} />
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                              Delete
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          onClick={() =>
                            fileInputRef.current && fileInputRef.current.click()
                          }
                        >
                          <AddAPhotoIcon sx={{ fontSize: 20, mr: 0.5 }} />
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            Add Profile Picture
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2, bgcolor: theme.palette.primary.main }} />
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Person sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="body1" sx={{ color: "text.primary" }}>
                        <strong>Username:</strong> {profile.username}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Info sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="body1" sx={{ color: "text.primary" }}>
                        <strong>Bio:</strong> {profile.bio || "No bio provided"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOn sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="body1" sx={{ color: "text.primary" }}>
                        <strong>Location:</strong> {profile.location || "Not specified"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Phone sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="body1" sx={{ color: "text.primary" }}>
                        <strong>Phone:</strong> {profile.phone_number || "N/A"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <EmojiEvents sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="body1" sx={{ color: "text.primary" }}>
                        <strong>Interests:</strong> {profile.interests || "No interests added"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </Box>

            {/* Right Side: Created Events Table */}
            <Box sx={{ width: { xs: "100%", md: "70%" } }}>
              <Typography variant="h4" sx={{ color: "text.primary", mb: 2, textAlign: "center" }}>
                Created Events
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  mb: 4,
                  maxHeight: 400,
                  width: "100%",
                  overflow: "auto",
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center"><strong>Title</strong></TableCell>
                      <TableCell align="center"><strong>Capacity</strong></TableCell>
                      <TableCell align="center"><strong>Registered</strong></TableCell>
                      <TableCell align="center"><strong>Slots Remaining</strong></TableCell>
                      <TableCell align="center"><strong>Progress</strong></TableCell>
                      <TableCell align="center"><strong>Action</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {createdEvents.length > 0 ? (
                      createdEvents.map((event) => (
                        <CreatedEventRow key={event.id} event={event} onDelete={handleDeleteEvent} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No created events.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          {/* Registered Events Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ color: "text.primary", mb: 2, textAlign: "center" }}>
              Registered Events
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 400,
                width: "100%",
                overflow: "auto",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><strong>Title</strong></TableCell>
                    <TableCell align="center"><strong>Date</strong></TableCell>
                    <TableCell align="center"><strong>Time</strong></TableCell>
                    <TableCell align="center"><strong>Location</strong></TableCell>
                    <TableCell align="center"><strong>Type</strong></TableCell>
                    <TableCell align="center"><strong>Organizer</strong></TableCell>
                    <TableCell align="center"><strong>Capacity</strong></TableCell>
                    <TableCell align="center"><strong>Event Code</strong></TableCell>
                    <TableCell align="center"><strong>Description</strong></TableCell>
                    <TableCell align="center"><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registeredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell align="center">{event.title}</TableCell>
                      <TableCell align="center">{event.date}</TableCell>
                      <TableCell align="center">{event.time}</TableCell>
                      <TableCell align="center">{event.location}</TableCell>
                      <TableCell align="center">{event.event_type}</TableCell>
                      <TableCell align="center">{event.organizer}</TableCell>
                      <TableCell align="center">{event.capacity}</TableCell>
                      <TableCell align="center">{event.event_code}</TableCell>
                      <TableCell align="center">{event.description}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleUnregisterEvent(event.id)}>
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {registeredEvents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No registered events.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Profile;
