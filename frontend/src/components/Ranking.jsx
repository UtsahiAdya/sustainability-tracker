import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  TextField,
  Box,
  Pagination,
  useMediaQuery,
  useTheme,
  Slide,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { styled } from "@mui/system";
import axios from "axios";
import "./Ranking.css";

const apiUrl = import.meta.env.VITE_API_URL;

const colors = {
  background: "#F0FFF0",
  text: "#013220",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: "900px",
  padding: theme.spacing(4),
  backgroundColor: colors.background,
  borderRadius: "16px",
  maxHeight: "85vh",
  overflowY: "auto",
}));

const getMedalColor = (rank) => {
  switch (rank) {
    case 1:
      return colors.gold;
    case 2:
      return colors.silver;
    case 3:
      return colors.bronze;
    default:
      return colors.text;
  }
};

const ITEMS_PER_PAGE = 10;

const Ranking = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const [leaderboardRes, rankRes] = await Promise.all([
          axios.get(`${apiUrl}/api/leaderboard`, { withCredentials: true }),
          axios.get(`${apiUrl}/api/leaderboard/rank`, { withCredentials: true }),
        ]);

        setLeaderboardData(leaderboardRes.data);
        setCurrentUserId(rankRes.data.userId || rankRes.data._id);
      } catch (error) {
        console.error("Error fetching ranking data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const handleChangePage = (_, value) => setPage(value);
  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());

  const filteredData = leaderboardData.filter((entry) =>
    entry.user.name.toLowerCase().includes(search)
  );

  const pageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) return <CircularProgress />;

  return (
    <Box className="ranking-container" display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={isMobile ? 2 : 4}>
      <StyledPaper elevation={4}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          fontWeight="bold"
          sx={{ color: colors.text }}
        >
        Sustainability Leadership
        </Typography>

        <TextField
          fullWidth
          label="Search by name"
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={handleSearch}
        />

        <List>
          {paginatedData.map((entry, index) => {
            const globalIndex = (page - 1) * ITEMS_PER_PAGE + index;
            const isUser = entry.user._id === currentUserId;
            const medalColor = getMedalColor(globalIndex + 1);
            return (
              <Slide in direction="up" key={entry.user._id}>
                <ListItem
                  sx={{
                    backgroundColor: isUser ? "#d0f5d0" : "transparent",
                    borderRadius: "12px",
                    mb: 1,
                  }}
                >
                  <Avatar sx={{ bgcolor: medalColor, mr: 2 }}>
                    {globalIndex + 1 <= 3 ? <EmojiEventsIcon /> : globalIndex + 1}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight={isUser ? "bold" : "normal"} sx={{ color: colors.text }}>
                        {entry.user.name} {isUser && "👈 You"}
                      </Typography>
                    }
                    secondary={`Points: ${entry.sustainabilityPoints.toFixed(2)}`}
                  />
                </ListItem>
              </Slide>
            );
          })}
        </List>

        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default Ranking;











































































































 






























































 