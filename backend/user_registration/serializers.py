from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Beneficiary, Document

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_admin', 'is_beneficiary')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class BeneficiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at', 'status')

    def validate_cpf(self, value):
        if not value.isdigit() or len(value) != 11:
            raise serializers.ValidationError("CPF deve conter 11 dígitos numéricos")
        return value

    def validate_zip_code(self, value):
        if not value.isdigit() or len(value) != 8:
            raise serializers.ValidationError("CEP deve conter 8 dígitos numéricos")
        return value

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('uploaded_at',) 