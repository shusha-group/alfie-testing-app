#!/usr/bin/env node
/**
 * Gmail OAuth2 Authorization Script
 * Simple script to get refresh token for Gmail API
 */

const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

// Read credentials file
const credentialsPath = process.argv[2] || './gmail-credentials.json';

if (!fs.existsSync(credentialsPath)) {
  console.error('Credentials file not found:', credentialsPath);
  console.log('\nUsage: node gmail-auth.js [path/to/credentials.json]');
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
const { client_id, client_secret } = credentials.installed;

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${client_id}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.modify')}&` +
  `access_type=offline&` +
  `response_type=code&` +
  `prompt=consent`;

console.log('\n=== Gmail OAuth Authorization ===\n');
console.log('1. Open this URL in your browser:');
console.log('\x1b[34m%s\x1b[0m', authUrl);
console.log('\n   Sign in with: alfie.spence.ai@gmail.com');
console.log('\n2. Authorize the app');
console.log("3. You'll be redirected to localhost — the code will be captured automatically\n");
console.log('Waiting for authorization...\n');

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  
  if (parsed.pathname === '/oauth2callback') {
    const code = parsed.query.code;
    
    if (code) {
      try {
        // Exchange code for tokens
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id,
            client_secret,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
          })
        });
        
        const tokens = await tokenRes.json();
        
        if (tokens.error) {
          throw new Error(tokens.error_description || tokens.error);
        }
        
        // Save tokens
        const tokenPath = './gmail-token.json';
        fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
        
        console.log('\n✓ Authorization successful!\n');
        console.log('Token saved to:', tokenPath);
        console.log('\n=== REFRESH TOKEN ===');
        console.log(tokens.refresh_token);
        console.log('\nSave this in your OpenClaw config as GMAIL_REFRESH_TOKEN');
        console.log('Also save: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET\n');
        
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>✓ Authorization Complete</h1><p>Check the terminal for your refresh token.</p>');
        
      } catch (err) {
        console.error('Error:', err.message);
        res.writeHead(500);
        res.end('Error: ' + err.message);
      }
    } else {
      console.error('No authorization code received');
      res.writeHead(400);
      res.end('No authorization code');
    }
    
    server.close();
    process.exit(0);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
