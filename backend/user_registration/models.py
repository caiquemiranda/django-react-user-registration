from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    is_beneficiary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Beneficiary(models.Model):
    GENDER_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Feminino'),
        ('O', 'Outro'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='beneficiary')
    full_name = models.CharField(max_length=255)
    birth_date = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    cpf = models.CharField(max_length=11, unique=True)
    rg = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=8)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    family_income = models.DecimalField(max_digits=10, decimal_places=2)
    family_members = models.IntegerField(validators=[MinValueValidator(1)])
    monthly_expenses = models.DecimalField(max_digits=10, decimal_places=2)
    education_level = models.CharField(max_length=100)
    occupation = models.CharField(max_length=100)
    is_employed = models.BooleanField(default=False)
    has_disability = models.BooleanField(default=False)
    disability_type = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, default='pending')  # pending, approved, rejected

    def __str__(self):
        return self.full_name

class Document(models.Model):
    beneficiary = models.ForeignKey(Beneficiary, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=100)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.beneficiary.full_name} - {self.document_type}" 