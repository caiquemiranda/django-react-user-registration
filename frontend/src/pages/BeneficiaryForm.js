import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Box,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Alert,
} from '@mui/material';
import axios from 'axios';

function BeneficiaryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        birth_date: '',
        gender: '',
        cpf: '',
        rg: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        phone: '',
        email: '',
        family_income: '',
        family_members: '',
        monthly_expenses: '',
        education_level: '',
        occupation: '',
        is_employed: false,
        has_disability: false,
        disability_type: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchBeneficiary = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/beneficiaries/${id}/`);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Erro ao carregar beneficiário:', error);
                }
            };
            fetchBeneficiary();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Você precisa estar autenticado. Faça login novamente.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            if (id) {
                await axios.put(`http://localhost:8000/api/beneficiaries/${id}/`, formData, config);
            } else {
                await axios.post('http://localhost:8000/api/beneficiaries/', formData, config);
            }
            navigate('/beneficiaries');
        } catch (error) {
            console.error('Erro detalhado:', error);
            setError(`Erro ao salvar beneficiário: ${error.message}`);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {id ? 'Editar Beneficiário' : 'Novo Beneficiário'}
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Nome Completo"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Data de Nascimento"
                                name="birth_date"
                                type="date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Gênero"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <MenuItem value="M">Masculino</MenuItem>
                                <MenuItem value="F">Feminino</MenuItem>
                                <MenuItem value="O">Outro</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="CPF"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="RG"
                                name="rg"
                                value={formData.rg}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Endereço"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Cidade"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Estado"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="CEP"
                                name="zip_code"
                                value={formData.zip_code}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Telefone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Renda Familiar"
                                name="family_income"
                                type="number"
                                value={formData.family_income}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Número de Membros da Família"
                                name="family_members"
                                type="number"
                                value={formData.family_members}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Despesas Mensais"
                                name="monthly_expenses"
                                type="number"
                                value={formData.monthly_expenses}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Nível de Escolaridade"
                                name="education_level"
                                value={formData.education_level}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Ocupação"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.is_employed}
                                        onChange={handleChange}
                                        name="is_employed"
                                    />
                                }
                                label="Está Empregado"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.has_disability}
                                        onChange={handleChange}
                                        name="has_disability"
                                    />
                                }
                                label="Possui Deficiência"
                            />
                        </Grid>
                        {formData.has_disability && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tipo de Deficiência"
                                    name="disability_type"
                                    value={formData.disability_type}
                                    onChange={handleChange}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/beneficiaries')}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained">
                                    Salvar
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default BeneficiaryForm; 