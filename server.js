const express = require('express')
const app = express()
const session = require('express-session') 
const res = require('express/lib/response')
const methodOverride = require("method-override") 
const path = require('path');
const bodyParser = require('body-parser');

const port = 3000;

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


// Set EJS as templating engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(methodOverride('_method'))






app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

// Data storage
//let data = [];
let data = [
    {"TimeStamp": "2024-04-19T02:05:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T02:12:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T02:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T02:45:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T02:55:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T03:05:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T03:10:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T03:20:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T03:25:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T03:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T03:50:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T04:05:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T04:15:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T04:20:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T04:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T04:45:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T05:00:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T05:20:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T05:25:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T05:45:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T05:50:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T06:00:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T06:10:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T06:15:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T06:20:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T06:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T06:35:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T06:45:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T06:50:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T07:00:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T02:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T02:45:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T03:10:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T03:20:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T03:50:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T04:05:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T04:15:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T05:00:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T05:20:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T05:45:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-04-19T06:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-04-19T06:45:00.000Z", "Direction": "Out"}
];

const ambientData = [{"Temperature": "000", "Humidity": "000", "Preassure": "000"},{"Temperature": "000", "Humidity": "000", "Preassure": "000"} ];

// Routes


app.get('/', (req, res) => {
    // Function to generate past 5 hours timestamps in "HH:MM" format
    function generatePastHoursSimpleTimestamps(baseTime) {
        const simpleTimestamps = [];
        for (let i = 5; i > 0; i--) {
            const d = new Date(baseTime);
            d.setHours(d.getHours() - i, 0, 0, 0);
            const formatted = d.toISOString().substring(11, 16);
            simpleTimestamps.push(formatted);
        }
        return simpleTimestamps;
    }

    // Function to calculate cumulative count of people inside for each timestamp
    function calculateCumulativePeopleInside(data, simpleTimestamps, baseTime) {
        let cumulativeCount = 0; // Initialize cumulative count
        const baseDate = new Date(baseTime);
    
        const counts = simpleTimestamps.map(time => {
            // Convert "HH:MM" back to a Date object for comparison
            const [hours, minutes] = time.split(':').map(Number);
            const startTime = new Date(baseDate);
            startTime.setHours(hours, minutes, 0, 0);
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1);
    
            // Count for current hour
            let hourlyCount = 0;
            data.forEach(item => {
                const itemTime = new Date(item.TimeStamp);
                if (itemTime >= startTime && itemTime < endTime) {
                    hourlyCount += item.Direction === 'In' ? 1 : -1;
                }
            });
    
            cumulativeCount += hourlyCount;
            return cumulativeCount;
        });
    
        return counts;
    }
    
    function calculateCumulativePeopleEgress(data, simpleTimestamps, baseTime) {
        const baseDate = new Date(baseTime);
        return simpleTimestamps.map(time => {
            // Convert "HH:MM" back to a Date object for comparison
            const [hours, minutes] = time.split(':').map(Number);
            const startTime = new Date(baseDate); // Correctly using the base date now
            startTime.setHours(hours, minutes, 0, 0);
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1);
    
            // Filter and count for current hour
            return data.reduce((acc, item) => {
                const itemTime = new Date(item.TimeStamp);
                if (itemTime >= startTime && itemTime < endTime && item.Direction === 'Out') {
                    acc += 1;
                }
                return acc;
            }, 0);
        });
    }
    

    function calculateCumulativePeopleIngress(data, simpleTimestamps, baseTime) {
        const baseDate = new Date(baseTime);
        return simpleTimestamps.map(time => {
            // Convert "HH:MM" back to a Date object for comparison
            const [hours, minutes] = time.split(':').map(Number);
            const startTime = new Date(baseDate); 
            startTime.setHours(hours, minutes, 0, 0); 
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1);
    
            // Filter and count for current hour
            return data.reduce((acc, item) => {
                const itemTime = new Date(item.TimeStamp);
                if (itemTime >= startTime && itemTime < endTime && item.Direction === 'In') {
                    acc += 1;
                }
                return acc;
            }, 0);
        });
    }
    
    // Function to calculate the number of people who went out in the last hour
    function calculateActualLastHourPeopleEgress(data) {
        const currentTime = new Date();
        const endTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), 0, 0, 0);
        const startTime = new Date(endTime);
        startTime.setHours(startTime.getHours() - 1);
        endTime.setHours(endTime.getHours() + 1);

        return data.reduce((acc, item) => {
            const itemTime = new Date(item.TimeStamp);
            if (itemTime >= startTime && itemTime < endTime && item.Direction === 'Out') {
                acc += 1;
            }
            return acc;
        }, 0);
    }

    // Function to calculate the number of people who went in in the actual last hour
    function calculateActualLastHourPeopleIngress(data) {
        const currentTime = new Date(); 
        const endTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), 0, 0, 0);
        const startTime = new Date(endTime);
        startTime.setHours(startTime.getHours() - 1);
        endTime.setHours(endTime.getHours() + 1);

        return data.reduce((acc, item) => {
            const itemTime = new Date(item.TimeStamp);
            if (itemTime >= startTime && itemTime < endTime && item.Direction === 'In') {
                acc += 1;
            }
            return acc;
        }, 0);
    }



    

    // Assuming the current time is 2024-04-19T21:12:07.711Z for the base time
    const baseTime = new Date()
    console.log(baseTime);
    const pastHoursSimpleTimestamps = generatePastHoursSimpleTimestamps(baseTime);

    // Calculate cumulative people inside for each timestamp
    const peopleInsideCounts = calculateCumulativePeopleInside(data, pastHoursSimpleTimestamps, baseTime);
    const peopleEgressCounts = calculateCumulativePeopleEgress(data, pastHoursSimpleTimestamps, baseTime);
    const peopleIngressCounts = calculateCumulativePeopleIngress(data, pastHoursSimpleTimestamps, baseTime);
    const lastHourEgress = calculateActualLastHourPeopleEgress(data);
    const lastHourIngress = calculateActualLastHourPeopleIngress(data);

    console.log(lastHourEgress);
    console.log(lastHourIngress);
    console.log(pastHoursSimpleTimestamps);
    console.log(peopleInsideCounts);

    const counts = {
        in: data.filter(item => item.Direction === 'In').length,
        out: data.filter(item => item.Direction === 'Out').length,
        inside: data.filter(item => item.Direction === 'In').length - data.filter(item => item.Direction === 'Out').length,
        timestamps: pastHoursSimpleTimestamps,
        peopleCounts: peopleInsideCounts,
        egressCounts: peopleEgressCounts,
        ingressCounts: peopleIngressCounts,
        lastHourEgress: lastHourEgress,
        lastHourIngress: lastHourIngress,
        temperature: ambientData[ambientData.length - 1].Temperature,
        humidity: ambientData[ambientData.length - 1].Humidity,
        preassure: ambientData[ambientData.length - 1].Preassure,
        temperatureDif: ((ambientData[ambientData.length - 1].Temperature - ambientData[ambientData.length - 2].Temperature) / ambientData[ambientData.length - 2].Temperature) * 100,
        humidityDif: ((ambientData[ambientData.length - 1].Humidity - ambientData[ambientData.length - 2].Humidity) / ambientData[ambientData.length - 2].Humidity) * 100,
        preassureDif: ((ambientData[ambientData.length - 1].Preassure - ambientData[ambientData.length - 2].Preassure) / ambientData[ambientData.length - 2].Preassure) * 100
    };
    res.render('dashboard', { data, counts });
});

app.post('/data', (req, res) => {
    const { Direction } = req.body;
    if ( Direction) {
        const TimeStamp = new Date().toISOString();
        data.push({ TimeStamp, Direction });
        console.log("Data received successfully.");
        console.log({ TimeStamp, Direction });
        console.log(data);
        res.send({ message: 'Data received successfully.' });
    } else {
        console.log("Invalid data.");
        res.status(400).send({ message: 'Invalid data.' });
    }
});

app.post('/ambient', (req, res) => {
    const { Humidity, Temperature, Preassure } = req.body;
    if ( Temperature, Humidity, Preassure) {
        ambientData.push({ Temperature, Humidity, Preassure });
        console.log("Data received successfully.");
        console.log({ Temperature, Humidity, Preassure });
        res.send({ message: 'Data received successfully.' });
    } else {
        console.log("Invalid data.");
        res.status(400).send({ message: 'Invalid data.' });
    }
});

app.listen(port,'0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
