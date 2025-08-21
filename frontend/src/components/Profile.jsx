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
  CssBaseline,
  useMediaQuery,
  useTheme,
  Tooltip,
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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CancelIcon from "@mui/icons-material/Cancel";

// Use API base from Vite env; fallback to Render hosted URL if missing
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------------------- CreatedEventRow Component ---------------------- //
function CreatedEventRow({ event, onDelete }) {
  const [registrationCount, setRegistrationCount] = useState(null);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/events/${event.id}/registration_count/`)
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
              height: isXs ? 18 : 30,
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
              mt: isXs ? "2px" : "6px",
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
  const [localImage, setLocalImage] = useState(null); // base64 dataURL saved in localStorage
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const themeBreakpoints = useTheme();
  const isSm = useMediaQuery(themeBreakpoints.breakpoints.down("sm"));
  const isMd = useMediaQuery(themeBreakpoints.breakpoints.down("md"));

  // Deterministic gradient generator based on username
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const generateGradientFromUsername = (username) => {
    const baseHash = hashCode(username || "");
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

  // Helper: build absolute or fallback URL
  const getImageUrl = (url) => {
    if (!url) return "";
    try {
      new URL(url);
      return url; // absolute already
    } catch {
      // relative - prepend API base
      return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    }
  };

  // LocalStorage helpers (per-username key)
  const localKeyFor = (username) => `local_profile_${username || "unknown"}`;

  // Fetch profile with current token
  const fetchProfile = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);

      // Try to load localStorage image for this user if present
      const key = localKeyFor(response.data?.username);
      const stored = localStorage.getItem(key);
      if (stored) {
        setLocalImage(stored);
      } else {
        setLocalImage(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // First: convert to base64 and store in localStorage (so we have local copy)
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataUrl = e.target.result;
        try {
          const username = profile?.username || "unknown";
          const key = localKeyFor(username);
          localStorage.setItem(key, dataUrl);
          setLocalImage(dataUrl);
        } catch (err) {
          // localStorage might be full — still continue with upload
          console.warn("Could not save image to localStorage:", err);
        }
      };
      reader.readAsDataURL(file);

      // Then: upload to server as before
      const formData = new FormData();
      formData.append("profile_picture", file);
      try {
        const token = localStorage.getItem("access");
        const response = await axios.patch(`${API_BASE_URL}/profile/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        // if server returned image url, prefer server; but we keep localImage as a fallback
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.patch(
        `${API_BASE_URL}/profile/`,
        { profile_picture: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);

      // remove localStorage copy as well
      const username = profile?.username || "unknown";
      const key = localKeyFor(username);
      localStorage.removeItem(key);
      setLocalImage(null);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem("access");
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}/`, {
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
      await axios.delete(`${API_BASE_URL}/events/${eventId}/register/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile();
    } catch (error) {
      console.error("Error unregistering from event:", error);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            background: darkMode
              ? "linear-gradient(135deg, #0c0a21, #26224f, #1d1d32)"
              : "linear-gradient(135deg, #e0eafc, #cfdef3)",
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            overflowX: "hidden",
            p: 2,
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
        <CssBaseline />
        <Box
          sx={{
            background: darkMode
              ? "linear-gradient(135deg, #0c0a21, #26224f, #1d1d32)"
              : "linear-gradient(135deg, #e0eafc, #cfdef3)",
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            overflowX: "hidden",
            p: 2,
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

  // responsive avatar size
  const avatarSize = isSm ? 96 : isMd ? 120 : 150;

  // Decide which avatar source to use:
  // prefer server image, fallback to localImage (base64) if present
  const avatarSrc = profile?.profile_picture
    ? getImageUrl(profile.profile_picture)
    : localImage || "";

  // Show info icon when the avatar is coming from localStorage (no server image)
  const showingLocal = !!localImage && !profile?.profile_picture;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Outer container fills viewport; avoid 100vw to prevent horizontal wiggle */}
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
          background: darkMode
            ? "linear-gradient(135deg, #0c0a21, #26224f, #1d1d32)"
            : "linear-gradient(135deg, #e0eafc, #cfdef3)",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Header: Home Button and Theme Toggle (not fixed) */}
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            p: { xs: 1, sm: 1.5 },
            gap: 1,
            boxSizing: "border-box",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: darkMode ? "#64ffda" : "#2196F3",
              backgroundColor: theme.palette.background.paper,
              padding: "8px 12px",
              borderRadius: "6px",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.12)",
              fontWeight: "700",
              marginRight: "8px",
              fontSize: isSm ? "0.8rem" : "0.95rem",
            }}
          >
            Home
          </Link>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              "&:hover": { backgroundColor: "grey.600" },
              p: 1,
            }}
            aria-label="toggle-theme"
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        {/* Main content fills remaining space and scrolls internally if needed */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: { xs: 2, sm: 3 },
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, md: 4 },
              alignItems: "flex-start",
            }}
          >
            {/* Left Side: Profile Details */}
            <Box sx={{ width: { xs: "100%", md: "30%" }, boxSizing: "border-box" }}>
              <Typography
                variant="h5"
                sx={{ color: "text.primary", mb: 2, textAlign: "left", fontWeight: 700 }}
              >
                <Person sx={{ mr: 1, color: "primary.main" }} /> My Profile
              </Typography>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1px solid rgba(255, 255, 255, 0.12)`,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                  borderRadius: 2,
                  p: 2,
                  backdropFilter: "blur(6px)",
                  boxSizing: "border-box",
                }}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", p: 2 }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: avatarSize,
                      height: avatarSize,
                      mb: 1,
                      alignSelf: { xs: "center", md: "flex-start" },
                      "&:hover .overlay": {
                        opacity: 1,
                        backdropFilter: "blur(4px)",
                      },
                    }}
                  >
                    <Avatar
                      src={avatarSrc || ""}
                      alt="Profile Picture"
                      sx={{
                        width: avatarSize,
                        height: avatarSize,
                        boxSizing: "border-box",
                        border: `3px solid ${theme.palette.primary.main}`,
                        cursor: "pointer",
                        background: avatarSrc
                          ? "none"
                          : generateGradientFromUsername(profile?.username),
                        color: avatarSrc ? "inherit" : "white",
                        fontSize: avatarSize / 2.8,
                      }}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      {!avatarSrc && profile?.username && profile.username[0].toUpperCase()}
                    </Avatar>

                    {/* Info icon shown when image is from localStorage */}
                    {showingLocal && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -6,
                          right: -6,
                        }}
                      >
                        <Tooltip title="Image stored in browser localStorage">
                          <IconButton
                            size="small"
                            sx={{
                              bgcolor: theme.palette.background.paper,
                              border: `1px solid rgba(0,0,0,0.08)`,
                            }}
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        top: 3,
                        left: 3,
                        width: `calc(100% - 6px)`,
                        height: `calc(100% - 6px)`,
                        borderRadius: "50%",
                        backgroundColor: "rgba(0,0,0,0.55)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 1,
                        opacity: 0,
                        transition: "opacity 0.35s ease-in-out, backdrop-filter 0.35s ease-in-out",
                      }}
                    >
                      {profile?.profile_picture ? (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          >
                            <EditIcon sx={{ fontSize: 20, mr: 0.5 }} />
                            <Typography variant="body2" sx={{ fontWeight: "700" }}>
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
                            <Typography variant="body2" sx={{ fontWeight: "700" }}>
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
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                          <AddAPhotoIcon sx={{ fontSize: 20, mr: 0.5 }} />
                          <Typography variant="body2" sx={{ fontWeight: "700" }}>
                            Add Profile Picture
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2, bgcolor: theme.palette.primary.main }} />

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Person sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        <strong>Username:</strong> {profile?.username}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Info sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        <strong>Bio:</strong> {profile?.bio || "No bio provided"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        <strong>Location:</strong> {profile?.location || "Not specified"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        <strong>Phone:</strong> {profile?.phone_number || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmojiEvents sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        <strong>Interests:</strong> {profile?.interests || "No interests added"}
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
            <Box sx={{ width: { xs: "100%", md: "70%" }, boxSizing: "border-box" }}>
              <Typography
                variant="h5"
                sx={{ color: "text.primary", mb: 2, textAlign: "center", fontWeight: 700 }}
              >
                Created Events
              </Typography>

              <TableContainer
                component={Paper}
                sx={{
                  mb: 4,
                  maxHeight: { xs: 320, sm: 380, md: 420 },
                  width: "100%",
                  overflow: "auto",
                  boxSizing: "border-box",
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
            <Typography
              variant="h5"
              sx={{ color: "text.primary", mb: 2, textAlign: "center", fontWeight: 700 }}
            >
              Registered Events
            </Typography>

            <TableContainer
              component={Paper}
              sx={{
                maxHeight: { xs: 320, sm: 380, md: 420 },
                width: "100%",
                overflow: "auto",
                boxSizing: "border-box",
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
                      <TableCell align="center" sx={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {event.description}
                      </TableCell>
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
