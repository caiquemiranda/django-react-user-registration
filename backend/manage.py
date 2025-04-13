#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from django.core.management.commands.migrate import Command as MigrateCommand


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_registration.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
        
    # Adiciona comando personalizado para criar admin
    if len(sys.argv) > 1 and sys.argv[1] == 'createadmin':
        from django.contrib.auth import get_user_model
        from django.core.management.base import BaseCommand
        
        User = get_user_model()
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')
        
        if not User.objects.filter(username=username).exists():
            print('Criando superusuário...')
            User.objects.create_superuser(username=username, email=email, password=password, is_admin=True)
            print(f'Superusuário {username} criado com sucesso!')
        else:
            print(f'Superusuário {username} já existe!')
        sys.exit(0)
    
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
