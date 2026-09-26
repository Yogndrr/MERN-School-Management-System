const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const mongoSanitize = require("express-mongo-sanitize")
const securityHeaders = require("./middleware/securityHeaders.js")
const app = express()
const Routes = require("./routes/route.js")

dotenv.config();

const PORT = process.env.PORT || 5000

app.use(securityHeaders)
app.use(express.json({ limit: '10mb' }))
app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`[SECURITY] Stripped forbidden NoSQL query operator key '${key}' from ${req.ip}`);
    }
}))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    exposedHeaders: [
        'X-XSS-Input-Sanitized',
        'Content-Security-Policy',
        'Retry-After',
        'RateLimit-Limit',
        'RateLimit-Remaining',
        'RateLimit-Reset',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
    ],
}))

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})
