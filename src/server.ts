import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config';
import { supabaseClient, supabaseAdmin } from './config/database';
import propertyRoutes from './routes/propertyRoutes';
import applicationRoutes from './routes/applicationRoutes';
import messageRoutes from './routes/messageRoutes';
import brokerAuthRoutes from './routes/brokerAuthRoutes';
import passwordResetRoutes from './routes/passwordResetRoutes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv 
  });
});

// Database connection test endpoint
app.get('/api/test-db', async (_req, res) => {
  try {
    const { data, error } = await supabaseClient.from('properties').select('count', { count: 'exact', head: true });
    
    if (error) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database connection failed',
        details: error.message 
      });
    }

    return res.json({ 
      success: true, 
      message: 'Database connection successful',
      count: data 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// List tables endpoint for debugging
app.get('/api/list-tables', async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to list tables',
        details: error.message 
      });
      return;
    }

    res.json({ 
      success: true,
      tables: data?.map(t => t.table_name) || []
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list tables',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API routes
app.use('/api/properties', propertyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/brokers', brokerAuthRoutes);
app.use('/api/password-reset', passwordResetRoutes);

app.get('/api', (_req, res) => {
  res.json({ 
    message: 'Online Land Agency API',
    version: '1.0.0',
    endpoints: {
      properties: '/api/properties',
      applications: '/api/applications',
      messages: '/api/messages',
      brokers: '/api/brokers',
      auth: '/api/auth'
    }
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`CORS origin: ${config.cors.origin}`);
});

export default app;
