// frontend/src/pages/AdminDashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    TrendingUp,
    People,
    MenuBook,
    RateReview,
    Comment,
    Flag
} from '@mui/icons-material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import API from '../../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h4" component="div">
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        color: color,
                        backgroundColor: `${color}20`,
                        borderRadius: '50%',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [contentStats, setContentStats] = useState(null);
    const [period, setPeriod] = useState('7days');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        fetchContentStats();
    }, [period]);

    const fetchDashboardData = async () => {
        try {
            const response = await API.get('/admin/analytics/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const fetchContentStats = async () => {
        try {
            const response = await API.get('/admin/analytics/content-stats', {
                params: { period }
            });
            setContentStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching content stats:', error);
            setLoading(false);
        }
    };

    const userGrowthData = {
        labels: dashboardData?.userGrowth.map(item => item._id) || [],
        datasets: [
            {
                label: 'User Growth',
                data: dashboardData?.userGrowth.map(item => item.count) || [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const categoryDistributionData = {
        labels: dashboardData?.popularCategories.map(item => item._id) || [],
        datasets: [
            {
                label: 'Manga Count',
                data: dashboardData?.popularCategories.map(item => item.count) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)',
                    'rgba(83, 102, 255, 0.7)',
                    'rgba(40, 159, 64, 0.7)',
                    'rgba(210, 99, 132, 0.7)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const contentStatsData = {
        labels: ['Manga', 'Users', 'Reviews'],
        datasets: [
            {
                label: 'Average Rating',
                data: [
                    contentStats?.mangaStats.avgRating || 0,
                    0, // Users don't have rating
                    contentStats?.reviewStats.avgRating || 0
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Total Count',
                data: [
                    contentStats?.mangaStats.total || 0,
                    contentStats?.userStats.total || 0,
                    contentStats?.reviewStats.total || 0
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography>Loading dashboard data...</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Admin Dashboard
            </Typography>

            {/* Stats Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Total Users"
                        value={dashboardData?.stats.totalUsers || 0}
                        icon={<People />}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Total Manga"
                        value={dashboardData?.stats.totalMangas || 0}
                        icon={<MenuBook />}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Total Reviews"
                        value={dashboardData?.stats.totalReviews || 0}
                        icon={<RateReview />}
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Total Comments"
                        value={dashboardData?.stats.totalComments || 0}
                        icon={<Comment />}
                        color="#9c27b0"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Pending Reports"
                        value={dashboardData?.stats.pendingReports || 0}
                        icon={<Flag />}
                        color="#d32f2f"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="New Users (Week)"
                        value={dashboardData?.stats.newUsersThisWeek || 0}
                        icon={<TrendingUp />}
                        color="#0288d1"
                    />
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                {/* User Growth Chart */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            User Growth (Last 30 Days)
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Line
                                data={userGrowthData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Category Distribution */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Category Distribution
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Doughnut
                                data={categoryDistributionData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Content Statistics */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">
                                Content Statistics
                            </Typography>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Period</InputLabel>
                                <Select
                                    value={period}
                                    label="Period"
                                    onChange={(e) => setPeriod(e.target.value)}
                                >
                                    <MenuItem value="7days">Last 7 Days</MenuItem>
                                    <MenuItem value="30days">Last 30 Days</MenuItem>
                                    <MenuItem value="90days">Last 90 Days</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ height: 400 }}>
                            <Bar
                                data={contentStatsData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;