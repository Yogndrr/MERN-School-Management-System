const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { helmet, apiLimiter, sanitizeInput } = require("./middleware/security");

dotenv.config();

const app = express();
const Routes = require("./routes/route.js");
const EnhancedRoutes = require("./routes/enhanced-routes.js");

const PORT = process.env.PORT || 5001;

// Security Middleware
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.includes(allowed))) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Input Sanitization
app.use(sanitizeInput);

// Rate Limiting
app.use('/api/', apiLimiter);

// Root route
app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'BIS NOC School Management System API (Supabase)',
        timestamp: new Date().toISOString()
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'BIS NOC School Management System is running on Supabase',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/', Routes);
app.use('/api', EnhancedRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 BIS NOC School Server running on port ${PORT} (Supabase Mode)`);
});

module.exports = app;
