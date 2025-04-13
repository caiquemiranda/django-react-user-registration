# Sistema de Cadastro Social

Sistema web para cadastro e gerenciamento de beneficiários de programas sociais.

## Tecnologias Utilizadas

### Backend
- Python 3.8+
- Django 4.2
- Django REST Framework
- MySQL
- JWT Authentication

### Frontend
- React 18
- Material-UI
- React Router
- Axios

## Requisitos

- Python 3.8+
- Node.js 14+
- MySQL 8.0+
- pip (gerenciador de pacotes Python)
- npm (gerenciador de pacotes Node.js)

## Instalação

### Backend

1. Clone o repositório:
```bash
git clone https://github.com/caiquemiranda/sistema-cadastro-social.git
cd sistema-cadastro-social/backend
```

2. Crie um ambiente virtual Python:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure o banco de dados MySQL:
- Crie um banco de dados chamado `user_registration`
- Atualize as configurações no arquivo `settings.py` com suas credenciais

5. Execute as migrações:
```bash
python manage.py migrate
```

6. Crie um superusuário:
```bash
python manage.py createsuperuser
```

7. Inicie o servidor:
```bash
python manage.py runserver
```

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd ../frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Uso

1. Acesse o frontend em `http://localhost:3000`
2. Faça login com as credenciais do superusuário criado
3. Comece a cadastrar e gerenciar beneficiários

## Funcionalidades

- Cadastro de usuários (administradores e beneficiários)
- Cadastro de beneficiários com informações pessoais e socioeconômicas
- Geração de PDF com dados do beneficiário
- Dashboard com estatísticas
- Listagem e busca de beneficiários
- Edição e exclusão de cadastros

## Segurança

- Autenticação JWT
- Proteção contra CSRF
- Validação de dados
- Permissões baseadas em roles

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
