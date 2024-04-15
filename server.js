const express = require('express')
const app = express()
const session = require('express-session') //Create a local-session
const res = require('express/lib/response')
const methodOverride = require("method-override") //To override Post method with Delete
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





// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // For serving static CSS files

// Data storage
//let data = [];
let data = [
    {"TimeStamp": "2024-03-28T16:05:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T16:12:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T16:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T16:45:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T16:55:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T17:05:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T17:10:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T17:20:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T17:25:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T17:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T17:50:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T18:05:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T18:15:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T18:20:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T18:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T18:45:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T19:00:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T19:20:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T19:25:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T19:45:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T19:50:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T20:00:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T20:10:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T20:15:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T20:20:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T20:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T20:35:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T20:45:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T20:50:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T21:00:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T16:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T16:45:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T17:10:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T17:20:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T17:50:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T18:05:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T18:15:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T19:00:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T19:20:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T19:45:00.000Z", "Direction": "Out"},
    {"TimeStamp": "2024-03-28T20:30:00.000Z", "Direction": "In"},
    {"TimeStamp": "2024-03-28T20:45:00.000Z", "Direction": "Out"}
];

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
        const counts = simpleTimestamps.map(time => {
            // Convert "HH:MM" back to a Date object for comparison
            const [hours, minutes] = time.split(':').map(Number);
            const startTime = new Date(baseTime); // Assuming date from sample
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1);
            
            // Filter and count for current hour
            data.forEach(item => {
                const itemTime = new Date(item.TimeStamp);
                if (itemTime >= startTime && itemTime < endTime) {
                    cumulativeCount += item.Direction === 'In' ? 1 : -1;
                }
            });
            
            return cumulativeCount;
        });
        
        return counts;
    }
    // Function to calculate the number of people who went out per hour
    function calculateCumulativePeopleEgress(data, simpleTimestamps, baseTime) {
        return simpleTimestamps.map(time => {
            // Convert "HH:MM" back to a Date object for comparison
            const [hours, minutes] = time.split(':').map(Number);
            const startTime = new Date(baseTime); // Assuming date from sample
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

    // Function to calculate the number of people who went in per hour
    function calculateCumulativePeopleIngress(data, simpleTimestamps, baseTime) {
        return simpleTimestamps.map(time => {
            // Convert "HH:MM" back to a Date object for comparison
            const [hours, minutes] = time.split(':').map(Number);
            //const startTime = new Date(Date.UTC(2024, 2, 28, hours, minutes)); // Assuming date from sample
            const startTime = new Date(baseTime);
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
        const currentTime = new Date(); // Get current time
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
        const currentTime = new Date(); // Get current time
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



    

    // Assuming the current time is 2024-03-28T21:12:07.711Z for the base time
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
    console.log(pastHoursSimpleTimestamps); // Log the timestamps
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
        lastHourIngress: lastHourIngress
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

app.listen(port,'0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
