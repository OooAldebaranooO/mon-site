require('dotenv').config();
require('isomorphic-fetch');

const express = require('express');
const cors = require('cors');
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');

const app = express();

app.use(cors());
app.use(express.json());

async function getGraphClient() {
  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID,
    process.env.AZURE_CLIENT_ID,
    process.env.AZURE_CLIENT_SECRET
  );

  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        const token = await credential.getToken('https://graph.microsoft.com/.default');
        return token.token;
      }
    }
  });
}

app.post('/api/customers', async (req, res) => {
  try {
    const { displayName, email, password } = req.body;

    if (!displayName || !email || !password) {
      return res.status(400).json({
        message: 'displayName, email et password sont requis'
      });
    }

    const domain = process.env.AZURE_PRIMARY_DOMAIN;
    if (!domain) {
      return res.status(500).json({
        message: 'AZURE_PRIMARY_DOMAIN manquant dans le .env'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const alias = normalizedEmail
      .replace('@', '_')
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    const userPrincipalName = `${alias}@${domain}`;

    const graphClient = await getGraphClient();

    try {
      const existingUser = await graphClient
        .api(`/users/${encodeURIComponent(userPrincipalName)}`)
        .select('id,displayName,userPrincipalName')
        .get();

      if (existingUser?.id) {
        return res.status(409).json({
          message: 'Un compte existe déjà avec cet email.'
        });
      }
    } catch (error) {
      const statusCode = error?.statusCode || error?.status;

      if (statusCode !== 404) {
        throw error;
      }
    }

    const userPayload = {
      accountEnabled: true,
      displayName,
      mailNickname: alias,
      userPrincipalName,
      passwordProfile: {
        password,
        forceChangePasswordNextSignIn: true
      }
    };

    const createdUser = await graphClient.api('/users').post(userPayload);

    return res.status(201).json({
      message: 'Utilisateur créé',
      data: {
        id: createdUser.id,
        displayName: createdUser.displayName,
        userPrincipalName: createdUser.userPrincipalName,
        email: normalizedEmail
      }
    });
  } catch (error) {
    console.error('Erreur Graph:', error);

    return res.status(500).json({
      message:
        error?.body?.error?.message ||
        error?.message ||
        'Erreur serveur'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Azure démarrée sur http://localhost:${PORT}`);
});