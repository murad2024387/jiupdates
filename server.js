// server.js - Render Compatible Version
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://ji-updates.onrender.com', // Your Render URL
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());

// Serve static files from root directory (for your HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Import models safely for mock data
let ProcessedEvent;
try {
    ProcessedEvent = require('./models/ProcessedEvent');
    console.log('✅ Database models loaded');
} catch (error) {
    console.log('⚠️ Models not available, using mock data only');
}

// Mock data function
function getMockEvents() {
    return [
        {
            _id: '1',
            title_ur: 'کراچی میں جماعت اسلامی کا مرکزی اجتماع',
            summary_ur: 'کراچی میں جماعت اسلامی کا سالانہ مرکزی اجتماع منعقد ہوا جس میں ہزاروں کارکنان نے شرکت کی۔ اس اجتماع میں اہم فیصلے اور مستقبل کی حکمت عملی پر بات چیت ہوئی۔',
            datetime: new Date().toISOString(),
            level: 'Central',
            category: 'Ijtima',
            location: 'کراچی',
            hashtags: ['اجتماع', 'کراچی', 'مرکزی', 'جماعت اسلامی'],
            sourceUrl: '#',
            status: 'published'
        },
        {
            _id: '2',
            title_ur: 'لاہور میں طلبہ تنظیم کا تعلیمی سیمینار',
            summary_ur: 'لاہور یونیورسٹی میں طلبہ تنظیم کے زیر اہتمام تعلیمی سیمینار کا انعقاد جس میں تعلیمی اصلاحات اور نوجوانوں کے مسائل پر بات چیت ہوئی۔',
            datetime: new Date(Date.now() - 86400000).toISOString(),
            level: 'District',
            category: 'Seminar',
            location: 'لاہور',
            hashtags: ['سیمینار', 'طلبہ', 'تعلیم', 'یونیورسٹی'],
            sourceUrl: '#',
            status: 'published'
        },
        {
            _id: '3',
            title_ur: 'اسلام آباد میں پریس کانفرنس',
            summary_ur: 'جماعت اسلامی کے ترجمان کی جانب سے اہم پریس کانفرنس کا انعقاد جس میں موجودہ سیاسی صورتحال اور جماعت کے موقف پر روشنی ڈالی گئی۔',
            datetime: new Date(Date.now() - 172800000).toISOString(),
            level: 'Central',
            category: 'Conference',
            location: 'اسلام آباد',
            hashtags: ['پریس', 'کانفرنس', 'بیان', 'سیاسی'],
            sourceUrl: '#',
            status: 'published'
        },
        {
            _id: '4',
            title_ur: 'پشاور میں فلاحی سرگرمیاں',
            summary_ur: 'جماعت اسلامی کے رضاکاروں کی جانب سے پشاور میں فلاحی سرگرمیاں انجام دی گئیں جن میں ضرورت مند خاندانوں کی مدد شامل تھی۔',
            datetime: new Date(Date.now() - 259200000).toISOString(),
            level: 'Local',
            category: 'Community',
            location: 'پشاور',
            hashtags: ['فلاحی', 'رضاکار', 'خدمات', 'مدد'],
            sourceUrl: '#',
            status: 'published'
        },
        {
            _id: '5',
            title_ur: 'ملتان میں مذہبی اجتماع',
            summary_ur: 'ملتان میں جماعت اسلامی کے زیر اہتمام مذہبی اجتماع کا انعقاد جس میں معاشرتی اصلاح اور دینی تعلیمات پر روشنی ڈالی گئی۔',
            datetime: new Date(Date.now() - 345600000).toISOString(),
            level: 'Provincial',
            category: 'Ijtima',
            location: 'ملتان',
            hashtags: ['مذہبی', 'اجتماع', 'ملتان', 'دینی'],
            sourceUrl: '#',
            status: 'published'
        },
        {
            _id: '6',
            title_ur: 'فیصل آباد میں کسان کانفرنس',
            summary_ur: 'فیصل آباد میں کسانوں کے مسائل پر خصوصی کانفرنس کا انعقاد جس میں زرعی پالیسیوں اور کسانوں کے حقوق پر بات چیت ہوئی۔',
            datetime: new Date(Date.now() - 432000000).toISOString(),
            level: 'District',
            category: 'Conference',
            location: 'فیصل آباد',
            hashtags: ['کانفرنس', 'کسان', 'زراعت', 'فیصل آباد'],
            sourceUrl: '#',
            status: 'published'
        }
    ];
}

// API Routes
app.get('/api/events', async (req, res) => {
    try {
        const { level, category, limit = 20 } = req.query;
        
        // Use mock data for now (comment out database connection)
        let events = getMockEvents();
        
        // Apply filters to mock data
        if (level && level !== 'all') {
            events = events.filter(event => event.level === level);
        }
        
        if (category && category !== 'all') {
            events = events.filter(event => event.category === category);
        }
        
        // Apply limit
        events = events.slice(0, parseInt(limit));
        
        console.log(`📊 Serving ${events.length} mock events`);
        
        res.json({
            success: true,
            data: events,
            count: events.length,
            message: "Using demonstration data"
        });
        
    } catch (error) {
        console.error('❌ Events API Error:', error);
        res.json({
            success: true,
            data: getMockEvents().slice(0, 4),
            count: 4,
            message: "Using fallback data due to error"
        });
    }
});

app.get('/api/events/detail/:id', async (req, res) => {
    try {
        const events = getMockEvents();
        const event = events.find(e => e._id === req.params.id) || events[0];
        
        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('❌ Detail API Error:', error);
        res.json({
            success: true,
            data: getMockEvents()[0]
        });
    }
});

app.post('/api/subscribe', async (req, res) => {
    try {
        const { name, email, phone, levels } = req.body;
        
        console.log('📧 New subscription received:', { 
            name, 
            email: email ? 'provided' : 'not provided', 
            phone: phone ? 'provided' : 'not provided',
            levels 
        });
        
        res.json({
            success: true,
            message: 'Subscription successful. Thank you for your interest! We will contact you soon.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint (required for Render)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        service: 'Jamaat-e-Islami Updates API'
    });
});

// Serve your main HTML file for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Jamaat-e-Islami Updates Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Website: http://localhost:${PORT}`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 API Events: http://localhost:${PORT}/api/events`);
});

module.exports = app;