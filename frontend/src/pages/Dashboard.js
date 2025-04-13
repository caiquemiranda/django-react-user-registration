import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import {
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/beneficiaries/');
            const beneficiaries = response.data;

            const stats = {
                total: beneficiaries.length,
                approved: beneficiaries.filter(b => b.status === 'approved').length,
                rejected: beneficiaries.filter(b => b.status === 'rejected').length,
                pending: beneficiaries.filter(b => b.status === 'pending').length,
            };

            setStats(stats);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {icon}
                    <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ color }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Dashboard
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total de Beneficiários"
                        value={stats.total}
                        icon={<PeopleIcon sx={{ color: 'primary.main' }} />}
                        color="primary.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Aprovados"
                        value={stats.approved}
                        icon={<CheckCircleIcon sx={{ color: 'success.main' }} />}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Rejeitados"
                        value={stats.rejected}
                        icon={<CancelIcon sx={{ color: 'error.main' }} />}
                        color="error.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pendentes"
                        value={stats.pending}
                        icon={<PendingIcon sx={{ color: 'warning.main' }} />}
                        color="warning.main"
                    />
                </Grid>
            </Grid>

            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Resumo
                </Typography>
                <Typography variant="body1" paragraph>
                    Bem-vindo ao Sistema de Cadastro Social. Aqui você pode gerenciar os cadastros
                    de beneficiários, acompanhar o status das solicitações e gerar relatórios.
                </Typography>
                <Typography variant="body1" paragraph>
                    Atualmente, o sistema possui {stats.total} beneficiários cadastrados,
                    sendo {stats.approved} aprovados, {stats.rejected} rejeitados e {stats.pending}
                    {' '}pendentes de análise.
                </Typography>
            </Paper>
        </Container>
    );
}

export default Dashboard; 