#!/bin/bash

# Gerar a chave privada RSA
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# Gerar a chave pública a partir da chave privada
openssl rsa -pubout -in private_key.pem -out public_key.pem

# Codificar a chave pública em base64 e salvar em um arquivo
base64 -w 0 public_key.pem > public_key_base64.txt

# Codificar a chave privada em base64 e salvar em um arquivo
base64 -w 0 private_key.pem > private_key_base64.txt

# Exibir mensagem de conclusão
echo "Chaves geradas e codificadas em base64 com sucesso."
