import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import chatHandler from './api/chat.js'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-chat-dev-middleware',
      configureServer(server) {
        server.middlewares.use('/api/chat', async (req, res) => {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {}
            } catch (e) {
              req.body = {}
            }
            res.status = (code) => { res.statusCode = code; return res }
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
              return res
            }
            try {
              await chatHandler(req, res)
            } catch (err) {
              console.error('API Error:', err)
              res.status(500).json({ error: err.message })
            }
          })
        })
      }
    }
  ],
})
