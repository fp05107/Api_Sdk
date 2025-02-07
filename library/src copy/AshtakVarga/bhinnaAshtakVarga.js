import swisseph from 'react-native-swisseph';
import { DateTime } from 'luxon';
// const { DateTime } = require('luxon');


// Set the ayanamsa to Lahiri (default Vedic option)
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0.0, 0.0);

const iflag = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;

// Zodiac and Nakshatra definitions (as provided in your code)
const zodiacSigns = {
    'Aries': [0, 30], 'Taurus': [30, 60], 'Gemini': [60, 90], 'Cancer': [90, 120],
    'Leo': [120, 150], 'Virgo': [150, 180], 'Libra': [180, 210], 'Scorpio': [210, 240],
    'Sagittarius': [240, 270], 'Capricorn': [270, 300], 'Aquarius': [300, 330], 'Pisces': [330, 360]
};

function getZodiacSign(degree) {
    for (const sign in zodiacSigns) {
        if (degree >= zodiacSigns[sign][0] && degree < zodiacSigns[sign][1]) {
            return sign;
        }
    }
}

function getDetails(degree, speed, planetName, ascendantDegree, sunDegree) {
    const zodiacSign = getZodiacSign(degree);
    const zodiacSignStartDegree = zodiacSigns[zodiacSign][0];
    const normalDegree = degree - zodiacSignStartDegree;

    return {
        degree: degree,
        normalDegree: normalDegree,
        zodiacSign: zodiacSign,
    };
}

const planets = [
    swisseph.SE_SUN,
    swisseph.SE_MOON,
    swisseph.SE_MARS,
    swisseph.SE_MERCURY,
    swisseph.SE_JUPITER,
    swisseph.SE_VENUS,
    swisseph.SE_SATURN,
];

const planetNames = {
    [swisseph.SE_SUN]: 'Sun',
    [swisseph.SE_MOON]: 'Moon',
    [swisseph.SE_MARS]: 'Mars',
    [swisseph.SE_MERCURY]: 'Mercury',
    [swisseph.SE_JUPITER]: 'Jupiter',
    [swisseph.SE_VENUS]: 'Venus',
    [swisseph.SE_SATURN]: 'Saturn'
};

let sunDegree;

function formatPlanetDetails(planetId, planetName, details) {
    return {
        "id": planetId,
        "name": planetName,
        "fullDegree": details.degree,
        "normDegree": details.normalDegree,
        "sign": details.zodiacSign,
    };
}

function calculatePlanetDetails(year, month, day, hour, minute, second, latitude, longitude, timezone) {
    return new Promise(async (resolve, reject) => {

        const localDateTime = DateTime.fromObject({ year, month, day, hour, minute, second }, { zone: timezone });
        const utcDateTime = localDateTime.toUTC();

        // const julianDay = swisseph.swe_julday(utcDateTime.year, utcDateTime.month, utcDateTime.day, utcDateTime.hour + utcDateTime.minute / 60 + utcDateTime.second / 3600, swisseph.SE_GREG_CAL);
        const [julianDay] = await Promise.all([
            swisseph.swe_julday(
                utcDateTime.year,
                utcDateTime.month,
                utcDateTime.day,
                utcDateTime.hour + utcDateTime.minute / 60 + utcDateTime.second / 3600,
                swisseph.SE_GREG_CAL,
            ),
            swisseph.swe_julday(
                utcDateTime.year,
                utcDateTime.month,
                utcDateTime.day,
                utcDateTime.hour + utcDateTime.minute / 60 + utcDateTime.second / 3600,
                swisseph.SE_GREG_CAL,
            ),
        ]);

        let planetDetailsArray = [];


        swisseph.swe_houses(julianDay, iflag, latitude, longitude, "E",).then(
            async (houseCuspsResult) => {
                if (houseCuspsResult.error) {

                    return;
                }

                const ascendantDegree = houseCuspsResult.cusp[1];

                const ascendantDetails = getDetails(ascendantDegree, '0', 'Ascendant', ascendantDegree);

                // const sunData = swisseph.swe_calc_ut(julianDay, swisseph.SE_SUN, swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED);
                const [sunData] = await Promise.all([
                    swisseph.swe_calc_ut(julianDay, swisseph.SE_SUN, swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED)
                ]);

                if (sunData.error) {
                } else {
                    sunDegree = sunData.longitude;
                }

                let planetId = 1;

                for (let planet of planets) {
                    // const planetData = swisseph.swe_calc_ut(julianDay, planet, swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED);
                    const [planetData] = await Promise.all([
                        swisseph.swe_calc_ut(julianDay, planet, swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED)
                    ]);
                    if (planetData.error) {

                        continue;
                    }

                    const planetDegree = planetData.longitude;
                    const planetSpeed = planetData.longitudeSpeed || '0';
                    const planetName = planetNames[planet] ? planetNames[planet] : swisseph.swe_get_planet_name(planet);

                    if (planet === swisseph.SE_SUN) {
                        sunDegree = planetDegree;
                    }

                    const details = getDetails(planetDegree, planetSpeed.toString(), planetName, ascendantDegree, sunDegree);
                    planetDetailsArray.push(formatPlanetDetails(planetId++, planetName, details));
                }
                planetDetailsArray.push(formatPlanetDetails(0, "Ascendant", ascendantDetails));


                resolve(planetDetailsArray);
            });
    });
}

const zodiacSignsList = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];


const bhinnaAshtakVargaMappings = {
    sun: {
        sun: [1, 2, 4, 7, 8, 9, 10, 11],
        moon: [3, 6, 10, 11],
        mars: [1, 2, 4, 7, 8, 9, 10, 11],
        mercury: [3, 5, 6, 9, 10, 11, 12],
        jupiter: [5, 6, 9, 11],
        venus: [6, 7, 12],
        saturn: [1, 2, 4, 7, 8, 9, 10, 11],
        ascendant: [3, 4, 6, 10, 11, 12]
    },
    moon: {
        sun: [3, 6, 7, 8, 10, 11],
        moon: [1, 3, 6, 7, 10, 11],
        mars: [2, 3, 5, 6, 9, 10, 11],
        mercury: [1, 3, 4, 5, 7, 8, 10, 11],
        jupiter: [1, 4, 7, 8, 10, 11, 12],
        venus: [3, 4, 5, 7, 9, 10, 11],
        saturn: [3, 5, 6, 11],
        ascendant: [3, 6, 10, 11]
    },
    mars: {
        sun: [3, 5, 6, 10, 11],
        moon: [3, 6, 11],
        mars: [1, 2, 4, 7, 8, 10, 11],
        mercury: [3, 5, 6, 11],
        jupiter: [6, 10, 11, 12],
        venus: [6, 8, 11, 12],
        saturn: [1, 4, 7, 8, 9, 10, 11],
        ascendant: [1, 3, 6, 10, 11]
    },
    mercury: {
        sun: [5, 6, 9, 11, 12],
        moon: [2, 4, 6, 8, 10, 11],
        mars: [1, 2, 4, 7, 8, 9, 10, 11],
        mercury: [1, 3, 5, 6, 9, 10, 11, 12],
        jupiter: [6, 8, 11, 12],
        venus: [1, 2, 3, 4, 5, 8, 9, 11],
        saturn: [1, 2, 4, 7, 8, 9, 10, 11],
        ascendant: [1, 2, 4, 6, 8, 10, 11]
    },
    jupiter: {
        sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
        moon: [2, 5, 7, 9, 11],
        mars: [1, 2, 4, 7, 8, 10, 11],
        mercury: [1, 2, 4, 5, 6, 9, 10, 11],
        jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
        venus: [2, 5, 6, 9, 10, 11],
        saturn: [3, 5, 6, 12],
        ascendant: [1, 2, 4, 5, 6, 9, 10, 11]
    },
    venus: {
        sun: [8, 11, 12],
        moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
        mars: [3, 5, 6, 9, 11, 12],
        mercury: [3, 5, 6, 9, 11],
        jupiter: [5, 8, 9, 10, 11],
        venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
        saturn: [3, 4, 5, 8, 9, 10, 11],
        ascendant: [1, 2, 3, 4, 5, 8, 9, 11]
    },
    saturn: {
        sun: [1, 2, 4, 7, 8, 10, 11],
        moon: [3, 6, 11],
        mars: [3, 5, 6, 10, 11, 12],
        mercury: [6, 8, 9, 10, 11, 12],
        jupiter: [5, 6, 11, 12],
        venus: [6, 11, 12],
        saturn: [3, 5, 6, 11],
        ascendant: [1, 3, 4, 6, 10, 11]
    }
};


function processBhinnaAshtakVarga(planetDetails, planetInput) {
    const ashtakPoints = {};
    let zodiacSignOfPlanetInput;

    planetDetails.forEach(planet => {
        const planetName = planet.name.toLowerCase();
        const planetSignIndex = zodiacSignsList.indexOf(planet.sign.toLowerCase()) + 1; // 1-indexed

        // Process Ashtakvarga points for all planets
        if (bhinnaAshtakVargaMappings[planetInput][planetName]) {
            ashtakPoints[planetName] = calculateAshtakPoints(planetSignIndex, bhinnaAshtakVargaMappings[planetInput][planetName]);
        }

        // Identify the zodiac sign of the passed planet input
        if (planetName === planetInput.toLowerCase()) {
            zodiacSignOfPlanetInput = planet.sign;
        }
    });

    // Add the zodiac sign field
    ashtakPoints.zodiacSign = zodiacSignOfPlanetInput || 'Unknown';

    return ashtakPoints;
}


function calculateAshtakPoints(zodiacSignIndex, positions) {
    const pointsMap = zodiacSignsList.reduce((acc, sign) => ({ ...acc, [sign]: 0 }), {});
    let totalPoints = 0; // All signs initially have 1 point each

    positions.forEach(position => {
        let adjustedPosition = (zodiacSignIndex + position - 1) % 12;
        if (adjustedPosition === 0) adjustedPosition = 12;
        const sign = zodiacSignsList[adjustedPosition - 1];
        pointsMap[sign] = 1;
        totalPoints += 1;
    });

    pointsMap.total = totalPoints;
    return pointsMap;
}

async function getAshtakvarga(year, month, day, hour, minute, second, latitude, longitude, planetInput) {
    const timezone = "Asia/Kolkata";
    const planetDetails = await calculatePlanetDetails(year, month, day, hour, minute, second, latitude, longitude, timezone);

    // Assume you have the `planetDetailsArray` from the previous code snippet
    const ashtakPoints = processBhinnaAshtakVarga(planetDetails, planetInput);

    return ashtakPoints
}

export default getAshtakvarga;
