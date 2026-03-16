require('isomorphic-fetch');

const express = require('express');
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');

const router = express.Router();

function validateBody(body) {
  const errors = [];

  if (!body.displayName || body.displayName.trim().length < 2) {
    errors.push('displayName invalide');
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('email invalide');
  }

  if (!body.password || body.password.length < 12) {
    errors.push('password trop court (12 caractères min)');
  }

  return errors;
}

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

router.post('/', async (req, res) => {
  try {
    const { displayName, email, password } = req.body;
    const errors = validateBody(req.body);

    if (errors.length) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const domain = process.env.AZURE_PRIMARY_DOMAIN;
    if (!domain) {
      return res.status(500).json({
        message: 'AZURE_PRIMARY_DOMAIN manquant dans le .env'
      });
    }

    const alias = email.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '') || 'user';

    const userPayload = {
      accountEnabled: true,
      displayName,
      mailNickname: alias,
      userPrincipalName: `${alias}@${domain}`,
      passwordProfile: {
        password,
        forceChangePasswordNextSignIn: true
      }
    };

    const graphClient = await getGraphClient();
    const createdUser = await graphClient.api('/users').post(userPayload);

    return res.status(201).json({
      message: 'Utilisateur créé dans Entra ID',
      data: {
        id: createdUser.id,
        displayName: createdUser.displayName,
        userPrincipalName: createdUser.userPrincipalName,
        email
      }
    });
  } catch (error) {
    console.error('Erreur Graph:', error);

    return res.status(500).json({
      message:
        error?.body?.error?.message ||
        error?.message ||
        'Erreur lors de la création du compte'
    });
  }
});

module.exports = router;