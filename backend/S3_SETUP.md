# Configuração AWS S3 - GameHub

Este documento descreve como configurar o AWS S3 para armazenamento de arquivos no projeto GameHub.

## 📋 Pré-requisitos

1. Conta AWS ativa
2. Bucket S3 criado
3. Credenciais AWS (Access Key ID e Secret Access Key)

## 🔧 Configuração

### 1. Criar Bucket S3

1. Acesse o console da AWS S3
2. Crie um novo bucket com um nome único (ex: `gamehub-uploads`)
3. Configure as permissões do bucket:
   - **Bloquear acesso público**: Desative se quiser URLs públicas
   - **Versionamento**: Opcional
   - **Criptografia**: Recomendado (SSE-S3 ou SSE-KMS)

### 2. Configurar CORS (para uploads do frontend)

No bucket, vá em **Permissions > CORS** e adicione:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:5173", "https://seu-dominio.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 3. Configurar Política do Bucket (para acesso público)

Se precisar de URLs públicas, adicione esta política em **Permissions > Bucket Policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::seu-bucket-name/uploads/*"
    }
  ]
}
```

### 4. Criar IAM User e Credenciais

1. Acesse IAM > Users > Create User
2. Adicione as seguintes políticas:
   - `AmazonS3FullAccess` (ou uma política customizada mais restritiva)
3. Crie Access Keys para o usuário
4. **Salve as credenciais com segurança!**

### 5. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` com:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=sua_access_key_id
AWS_SECRET_ACCESS_KEY=sua_secret_access_key
S3_BUCKET=seu-bucket-name
S3_PUBLIC_PREFIX=uploads/teams/
S3_PUBLIC_URL=https://seu-bucket-name.s3.us-east-1.amazonaws.com
SIGNED_URL_EXPIRES=3600
```

**⚠️ IMPORTANTE:** Nunca commite o arquivo `.env` no Git!

## 📝 Estrutura de Pastas no S3

Os arquivos são organizados da seguinte forma:

```
uploads/teams/
  └── YYYY/
      └── MM/
          └── uuid.ext
```

Exemplo: `uploads/teams/2024/12/a1b2c3d4-e5f6-7890-abcd-ef1234567890.png`

## 🚀 Migração de Dados Existentes

Se você já tem logos armazenados no banco de dados:

1. Crie um script de migração para:
   - Ler os buffers do banco
   - Fazer upload para o S3
   - Atualizar os registros com a `logoS3Key`

2. Execute o script uma única vez para migrar os dados existentes

## 🔍 Funcionalidades Implementadas

### Upload Direto

- Upload de buffers diretamente para o S3
- Suporte a imagens (PNG, JPG, WEBP, GIF, AVIF)
- Tamanho máximo: 5MB

### URLs Públicas

- URLs públicas para acesso direto aos arquivos
- Cache configurado para 1 ano

### Presigned URLs

- Geração de URLs assinadas para upload/leitura temporária
- Expiração configurável

### Delete

- Deletar arquivos do S3 quando necessário

## 📚 Rotas da API

### Upload de Logo de Time

```
POST /team
Content-Type: multipart/form-data
Body: { name: string, logo: File }
```

### Obter Logo de Time

```
GET /team/:id/logo
```

Retorna um redirect 302 para a URL pública do S3

### Gerar URL de Upload Assinada

```
POST /s3/presign-upload
Authorization: Bearer <token>
Body: { contentType: string, extension?: string }
```

### Gerar URL de Leitura Assinada

```
GET /s3/presign-read?key=<s3-key>&ttl=<seconds>
```

### Deletar Objeto

```
DELETE /s3/object
Body: { key: string }
```

## 🐛 Troubleshooting

### Erro: "Access Denied"

- Verifique se as credenciais estão corretas
- Verifique as permissões do IAM user
- Verifique a política do bucket

### Erro: "CORS policy"

- Verifique a configuração CORS do bucket
- Adicione o domínio do frontend nas origens permitidas

### URLs não funcionam

- Verifique se `S3_PUBLIC_URL` está correto
- Verifique se os objetos têm ACL `public-read`
- Verifique a política do bucket

## 📖 Referências

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
