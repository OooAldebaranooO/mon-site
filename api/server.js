const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let tokenCache = {
  accessToken: null,
  expiresAt: 0
};

function getConfig() {
  return {
    tokenUrl: process.env.M3_TOKEN_URL,
    baseUrl: process.env.M3_BASE_URL,
    conoDefault: process.env.M3_CONO_DEFAULT,
    clientId: process.env.M3_CLIENT_ID,
    clientSecret: process.env.M3_CLIENT_SECRET,
    grantType: process.env.M3_GRANT_TYPE || 'password',
    username: process.env.M3_USERNAME,
    password: process.env.M3_PASSWORD,
    authMethod: process.env.M3_AUTH_METHOD || 'basic'
  };
}

async function getM3Token() {
  const now = Date.now();

  if (tokenCache.accessToken && now < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  const cfg = getConfig();

  if (!cfg.tokenUrl) {
    throw new Error('M3_TOKEN_URL manquant dans les variables d’environnement');
  }

  const params = new URLSearchParams({
    grant_type: cfg.grantType,
    username: cfg.username,
    password: cfg.password
  });

  const response = await axios.post(cfg.tokenUrl, params, {
    auth: {
      username: cfg.clientId,
      password: cfg.clientSecret
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const accessToken = response.data.access_token;
  const expiresIn = Number(response.data.expires_in || 3600);

  tokenCache.accessToken = accessToken;
  tokenCache.expiresAt = now + (expiresIn - 60) * 1000;

  return accessToken;
}

app.get('/', async (req, res) => {
  try {
    const cfg = getConfig();
    const token = await getM3Token();

    res.json({
      ok: true,
      message: 'Connexion Azure + Key Vault + token M3 OK',
      config: {
        tokenUrl: !!cfg.tokenUrl,
        baseUrl: !!cfg.baseUrl,
        clientId: !!cfg.clientId,
        clientSecret: !!cfg.clientSecret,
        username: !!cfg.username,
        password: !!cfg.password
      },
      tokenReceived: !!token
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.response?.data || error.message
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});