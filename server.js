const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.set('trust proxy', true);

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'World';
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '8.8.8.8';

    try {
        // Get location
        const locationRes = await axios.get(`http://ip-api.com/json/${clientIp}`);
        const locationData = locationRes.data;

        const city = locationData.city || 'Unknown';

        // Get weather
        const weatherApiKey = '23092dd14d11904dd6b08d5b8eb7c418';
        const weatherRes = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);
        const weatherData = weatherRes.data;

        const temperature = weatherData.main.temp;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

module.exports = app;
