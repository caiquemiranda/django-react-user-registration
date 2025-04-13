from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Beneficiary, Document
from .serializers import UserSerializer, BeneficiarySerializer, DocumentSerializer
from django.shortcuts import get_object_or_404
from django.http import FileResponse
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class BeneficiaryViewSet(viewsets.ModelViewSet):
    queryset = Beneficiary.objects.all()
    serializer_class = BeneficiarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin:
            return Beneficiary.objects.all()
        return Beneficiary.objects.filter(user=self.request.user)

    @action(detail=True, methods=['get'])
    def generate_pdf(self, request, pk=None):
        beneficiary = self.get_object()
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []

        # Título
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=30
        )
        elements.append(Paragraph(f"Ficha de Cadastro - {beneficiary.full_name}", title_style))
        elements.append(Spacer(1, 12))

        # Dados Pessoais
        data = [
            ['Dados Pessoais', ''],
            ['Nome Completo:', beneficiary.full_name],
            ['CPF:', beneficiary.cpf],
            ['RG:', beneficiary.rg],
            ['Data de Nascimento:', beneficiary.birth_date.strftime('%d/%m/%Y')],
            ['Gênero:', beneficiary.get_gender_display()],
            ['Email:', beneficiary.email],
            ['Telefone:', beneficiary.phone],
        ]

        # Endereço
        data.extend([
            ['Endereço', ''],
            ['Rua:', beneficiary.address],
            ['Cidade:', beneficiary.city],
            ['Estado:', beneficiary.state],
            ['CEP:', beneficiary.zip_code],
        ])

        # Dados Socioeconômicos
        data.extend([
            ['Dados Socioeconômicos', ''],
            ['Renda Familiar:', f'R$ {beneficiary.family_income:.2f}'],
            ['Número de Membros da Família:', str(beneficiary.family_members)],
            ['Despesas Mensais:', f'R$ {beneficiary.monthly_expenses:.2f}'],
            ['Nível de Escolaridade:', beneficiary.education_level],
            ['Ocupação:', beneficiary.occupation],
            ['Empregado:', 'Sim' if beneficiary.is_employed else 'Não'],
            ['Possui Deficiência:', 'Sim' if beneficiary.has_disability else 'Não'],
        ])

        if beneficiary.has_disability:
            data.append(['Tipo de Deficiência:', beneficiary.disability_type])

        # Criar tabela
        table = Table(data, colWidths=[200, 300])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        elements.append(table)
        doc.build(elements)

        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename=f'cadastro_{beneficiary.cpf}.pdf')

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin:
            return Document.objects.all()
        return Document.objects.filter(beneficiary__user=self.request.user)

    def perform_create(self, serializer):
        beneficiary = get_object_or_404(Beneficiary, user=self.request.user)
        serializer.save(beneficiary=beneficiary) 