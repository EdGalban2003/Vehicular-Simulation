function runSimulation() {
    const startTime = new Date(document.getElementById('start').value);
    const endTime = new Date(document.getElementById('end').value);

    if (isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
        alert('Por favor, ingrese fechas y horas válidas.');
        return;
    }

    const CHANGE_DIRECTION_TIME = 120 * 60 * 1000;
    const VEHICLE_CAPACITY = 125; 

    const trafficData = {
        weekdays: {
            "Norte-Sur": { peakHours: [6, 11, 17], vehicles: [119, 105, 120], delay: 18 },
            "Sur-Norte": { peakHours: [6, 11, 17], vehicles: [117, 98, 76], delay: 6 }
        },
        weekends: {
            "Norte-Sur": { peakHours: [13, 6], vehicles: [107, 80], delay: 8 },
            "Sur-Norte": { peakHours: [7, 4], vehicles: [105, 54], delay: 0 }
        },
        holidays: VEHICLE_CAPACITY
    };

    const interruptions = {
        "Norte-Sur": 350,
        "Sur-Norte": 197
    };

    let result = '';
    let currentTime = startTime;
    let currentDirection = 'Norte-Sur';
    const isHoliday = checkIfHoliday(startTime);

    while (currentTime < endTime) {
        const trafficFlow = getTrafficFlow(currentTime, currentDirection, trafficData, isHoliday);
        const delay = getDelay(currentTime, currentDirection, trafficData, isHoliday);
        result += `<p>${currentDirection} - ${currentTime.toLocaleString()}: ${trafficFlow} vehículos, ${delay} minutos de demora</p>`;
        currentTime = new Date(currentTime.getTime() + CHANGE_DIRECTION_TIME);
        currentDirection = currentDirection === 'Norte-Sur' ? 'Sur-Norte' : 'Norte-Sur';
    }

    document.getElementById('result').innerHTML = result;
}

function getTrafficFlow(time, direction, data, isHoliday) {
    const day = time.getDay();
    const hour = time.getHours();

    if (isHoliday) {
        return data.holidays;
    }

    if (day >= 1 && day <= 5) {
        return data.weekdays[direction].vehicles[getPeakHourIndex(hour, data.weekdays[direction].peakHours)];
    } else {
        return data.weekends[direction].vehicles[getPeakHourIndex(hour, data.weekends[direction].peakHours)];
    }
}

function getDelay(time, direction, data, isHoliday) {
    const day = time.getDay();

    if (isHoliday) {
        return 0; 
    }

    if (day >= 1 && day <= 5) {
        return data.weekdays[direction].delay;
    } else {
        return data.weekends[direction].delay;
    }
}

function getPeakHourIndex(hour, peakHours) {
    if (hour >= peakHours[0] && hour < peakHours[0] + 3) return 0;
    if (hour >= peakHours[1] && hour < peakHours[1] + 2) return 1;
    if (hour >= peakHours[2] && hour < peakHours[2] + 2.5) return 2;
    return 1;
}

function checkIfHoliday(date) {
    const holidays = [
        new Date(date.getFullYear(), 11, 24),
        new Date(date.getFullYear(), 11, 31)
    ];

    return holidays.some(holiday => holiday.toDateString() === date.toDateString());
}
