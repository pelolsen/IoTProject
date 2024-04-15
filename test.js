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
function calculateCumulativePeopleInside(data, simpleTimestamps) {
    let cumulativeCount = 0; // Initialize cumulative count
    const counts = simpleTimestamps.map(time => {
        // Convert "HH:MM" back to a Date object for comparison
        const [hours, minutes] = time.split(':').map(Number);
        const startTime = new Date(Date.UTC(2024, 2, 28, hours, minutes)); // Assuming date from sample
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

// Assuming the current time is 2024-03-28T21:12:07.711Z for the base time
const baseTime = new Date("2024-03-28T21:12:07.711Z");
const pastHoursSimpleTimestamps = generatePastHoursSimpleTimestamps(baseTime);

// Calculate cumulative people inside for each timestamp
const peopleInsideCounts = calculateCumulativePeopleInside(data, pastHoursSimpleTimestamps);

console.log(pastHoursSimpleTimestamps); // Log the timestamps
console.log(peopleInsideCounts); // Log cumulative counts of people inside at each timestamp

/*
// Function to generate timestamps for the past 5 hours
function generatePastHoursTimestamps(baseTime) {
    const timestamps = [];
    for (let i = 5; i > 0; i--) {
        const d = new Date(baseTime);
        d.setHours(d.getHours() - i);
        // Adjust below to your needs if you want to set minutes and seconds to 0
        d.setMinutes(0, 0, 0);
        const formatted = d.toISOString().substring(11, 16);
        timestamps.push(formatted);
    }
    return timestamps;
}

const array = generatePastHoursTimestamps(new Date());
console.log(new Date());

console.log(array);
*/

/*
// Function to generate timestamps for the past 5 hours
function generatePastHoursTimestamps(baseTime) {
    const timestamps = [];
    for (let i = 5; i > 0; i--) {
        const d = new Date(baseTime);
        d.setHours(d.getHours() - i);
        // Adjust below to your needs if you want to set minutes and seconds to 0
        d.setMinutes(0, 0, 0);
        timestamps.push(d);
    }
    return timestamps;
}

// Function to count people inside for each timestamp
function countPeopleInsideForEachTimestamp(data, timestamps) {
    return timestamps.map((timestamp, index) => {
        // Filter data for each time range
        const startTime = timestamp;
        const endTime = new Date(timestamp);
        endTime.setHours(endTime.getHours() + 1);

        // Count how many people were inside in each hour
        const count = data.reduce((acc, item) => {
            const itemTime = new Date(item.TimeStamp);
            if (itemTime >= startTime && itemTime < endTime) {
                return acc + (item.Direction === 'In' ? 1 : -1);
            }
            return acc;
        }, 0);

        return count;
    });
}

// Assuming the current time is 2024-03-28T21:12:07.711Z for the base time
const baseTime = new Date("2024-03-28T21:12:07.711Z");
const pastHoursTimestamps = generatePastHoursTimestamps(baseTime);

// Now calculate people inside for each timestamp
const peopleInsideCount = countPeopleInsideForEachTimestamp(data, pastHoursTimestamps);
for(let i = 0; i < pastHoursTimestamps.length; i++){

    const formatted = pastHoursTimestamps[i].toISOString().substring(11, 16);
    console.log(formatted + " " + peopleInsideCount[i]);
}

console.log(peopleInsideCount);*/