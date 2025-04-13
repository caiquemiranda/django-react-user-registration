import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';

function BeneficiaryList() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/beneficiaries/');
      setBeneficiaries(response.data);
    } catch (error) {
      console.error('Erro ao carregar beneficiários:', error);
    }
  };

  const handleMenuClick = (event, beneficiary) => {
    setAnchorEl(event.currentTarget);
    setSelectedBeneficiary(beneficiary);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBeneficiary(null);
  };

  const handleEdit = () => {
    if (selectedBeneficiary) {
      navigate(`/beneficiaries/${selectedBeneficiary.id}`);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedBeneficiary) {
      try {
        await axios.delete(`http://localhost:8000/api/beneficiaries/${selectedBeneficiary.id}/`);
        fetchBeneficiaries();
      } catch (error) {
        console.error('Erro ao deletar beneficiário:', error);
      }
    }
    handleMenuClose();
  };

  const handleGeneratePDF = async () => {
    if (selectedBeneficiary) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/beneficiaries/${selectedBeneficiary.id}/generate_pdf/`,
          { responseType: 'blob' }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `cadastro_${selectedBeneficiary.cpf}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
      }
    }
    handleMenuClose();
  };

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) =>
    beneficiary.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    beneficiary.cpf.includes(searchTerm)
  );

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Beneficiários
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/beneficiaries/new')}
          >
            Novo Beneficiário
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por nome ou CPF"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBeneficiaries.map((beneficiary) => (
                <TableRow key={beneficiary.id}>
                  <TableCell>{beneficiary.full_name}</TableCell>
                  <TableCell>{beneficiary.cpf}</TableCell>
                  <TableCell>{beneficiary.email}</TableCell>
                  <TableCell>{beneficiary.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={beneficiary.status}
                      color={
                        beneficiary.status === 'approved'
                          ? 'success'
                          : beneficiary.status === 'rejected'
                          ? 'error'
                          : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuClick(e, beneficiary)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Editar</MenuItem>
          <MenuItem onClick={handleGeneratePDF}>Gerar PDF</MenuItem>
          <MenuItem onClick={handleDelete}>Excluir</MenuItem>
        </Menu>
      </Paper>
    </Container>
  );
}

export default BeneficiaryList; 