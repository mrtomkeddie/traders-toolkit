import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/submit-enquiry' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body);
                  console.log('🚀 [API Proxy] Submitting to Airtable:', data.email);
                  
                  const fields: any = {
                    'Business Name': data.businessName,
                    'Trade': data.trade,
                    'Location': data.location,
                    'Package': data.package,
                    'Email': data.email,
                    'Submitted At': new Date().toISOString(),
                    'Status': 'New'
                  };

                  if (data.currentSite) fields['Current Website'] = data.currentSite;

                  const response = await fetch(`https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID || 'appkAMJ5sYFWNkfyq'}/${env.AIRTABLE_TABLE_ID || 'tbl5jBdshlYo8I0yN'}`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${env.AIRTABLE_TOKEN}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ records: [{ fields }] })
                  });

                  const result: any = await response.json();
                  if (response.ok) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true }));
                  } else {
                    res.statusCode = response.status || 500;
                    res.end(JSON.stringify({ error: result.error || 'Airtable error' }));
                  }
                } catch (err) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      port: 3000,
    },
  };
});
