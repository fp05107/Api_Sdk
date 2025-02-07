import swisseph from 'react-native-swisseph';
import { DateTime } from 'luxon';
// const { DateTime } = require('luxon');


// Set the ayanamsa to Lahiri (default Vedic option)
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0.0, 0.0);

async function getYogini_sub(year, month, day, hour, minute, second) {
    const timezone = "Asia/Kolkata";

    // Convert local time to UTC
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

    const nakshatras = [
        { name: 'Ashwini', start: 0, end: 13.3333, lord: 'Ketu', period: 7 },
        { name: 'Bharani', start: 13.3333, end: 26.6667, lord: 'Venus', period: 20 },
        { name: 'Krittika', start: 26.6667, end: 40, lord: 'Sun', period: 6 },
        { name: 'Rohini', start: 40, end: 53.3333, lord: 'Moon', period: 10 },
        { name: 'Mrigashira', start: 53.3333, end: 66.6667, lord: 'Mars', period: 7 },
        { name: 'Ardra', start: 66.6667, end: 80, lord: 'Rahu', period: 18 },
        { name: 'Punarvasu', start: 80, end: 93.3333, lord: 'Jupiter', period: 16 },
        { name: 'Pushya', start: 93.3333, end: 106.6667, lord: 'Saturn', period: 19 },
        { name: 'Ashlesha', start: 106.6667, end: 120, lord: 'Mercury', period: 17 },
        { name: 'Magha', start: 120, end: 133.3333, lord: 'Ketu', period: 7 },
        { name: 'Purva Phalguni', start: 133.3333, end: 146.6667, lord: 'Venus', period: 20 },
        { name: 'Uttara Phalguni', start: 146.6667, end: 160, lord: 'Sun', period: 6 },
        { name: 'Hasta', start: 160, end: 173.3333, lord: 'Moon', period: 10 },
        { name: 'Chitra', start: 173.3333, end: 186.6667, lord: 'Mars', period: 7 },
        { name: 'Swati', start: 186.6667, end: 200, lord: 'Rahu', period: 18 },
        { name: 'Vishakha', start: 200, end: 213.3333, lord: 'Jupiter', period: 16 },
        { name: 'Anuradha', start: 213.3333, end: 226.6667, lord: 'Saturn', period: 19 },
        { name: 'Jyeshtha', start: 226.6667, end: 240, lord: 'Mercury', period: 17 },
        { name: 'Mula', start: 240, end: 253.3333, lord: 'Ketu', period: 7 },
        { name: 'Purva Ashadha', start: 253.3333, end: 266.6667, lord: 'Venus', period: 20 },
        { name: 'Uttara Ashadha', start: 266.6667, end: 280, lord: 'Sun', period: 6 },
        { name: 'Shravana', start: 280, end: 293.3333, lord: 'Moon', period: 10 },
        { name: 'Dhanishta', start: 293.3333, end: 306.6667, lord: 'Mars', period: 7 },
        { name: 'Shatabhisha', start: 306.6667, end: 320, lord: 'Rahu', period: 18 },
        { name: 'Purva Bhadrapada', start: 320, end: 333.3333, lord: 'Jupiter', period: 16 },
        { name: 'Uttara Bhadrapada', start: 333.3333, end: 346.6667, lord: 'Saturn', period: 19 },
        { name: 'Revati', start: 346.6667, end: 360, lord: 'Mercury', period: 17 }
    ];

    const yoginiDashas = [
        { name: 'Mangala', lord: 'Moon', period: 1 },
        { name: 'Pingala', lord: 'Sun', period: 2 },
        { name: 'Dhanya', lord: 'Jupiter', period: 3 },
        { name: 'Bhramari', lord: 'Mars', period: 4 },
        { name: 'Bhadrika', lord: 'Mercury', period: 5 },
        { name: 'Ulka', lord: 'Saturn', period: 6 },
        { name: 'Siddha', lord: 'Venus', period: 7 },
        { name: 'Sankata', lord: 'Rahu', period: 8 }
    ];

    function findNakshatra(moonPosition) {
        return nakshatras.find(nakshatra => moonPosition >= nakshatra.start && moonPosition < nakshatra.end);
    }

    function findYoginiDashaAtBirth(moonNakshatraNumber) {
        const remainder = (moonNakshatraNumber + 3) % 8 || 8;  // Adjust for remainder 0 case
        return yoginiDashas[remainder - 1];
    }

    function calculateYoginiDashaSequence(birthDateTime, nakshatra, moonPosition, initialYoginiDasha) {
        const dashaSequence = [];
        let currentDateTime = birthDateTime;
        let currentYoginiDasha = initialYoginiDasha;

        // Calculate balance of first Dasha
        const nakshatraEnd = nakshatra.end;
        const differenceA = (nakshatraEnd - moonPosition) * 60; // Convert to minutes
        const balancePeriodInMinutes = Math.floor((currentYoginiDasha.period * 365.25 * differenceA) / 800) * 24 * 60; // Convert to days using 365.25 for leap years

        // Calculate full period of the Yogini Dasha in minutes
        const fullPeriodInMinutes = currentYoginiDasha.period * 365.25 * 24 * 60;

        // Calculate the number of minutes that have already passed
        const pastPeriod = fullPeriodInMinutes - balancePeriodInMinutes;

        // Convert pastPeriod into days, hours, and minutes
        const pastDays = Math.floor(pastPeriod / (24 * 60));
        const pastHours = Math.floor((pastPeriod % (24 * 60)) / 60);
        const pastMinutes = Math.floor(pastPeriod % 60);

        // Calculate the actual start date of the first Yogini Dasha
        const firstDashaStart = currentDateTime.minus({ days: pastDays, hours: pastHours, minutes: pastMinutes });

        // Calculate balance days (converted from minutes to days)
        const balanceDays = Math.floor(balancePeriodInMinutes / (24 * 60));

        // Calculate first Dasha details
        const firstDashaEnd = currentDateTime.plus({ days: balanceDays }).minus({ minutes: 1 });

        dashaSequence.push({
            yogini: currentYoginiDasha.name,
            lord: currentYoginiDasha.lord,
            start: firstDashaStart.toFormat('dd-MM-yyyy, hh:mm a'),
            end: firstDashaEnd.toFormat('dd-MM-yyyy, hh:mm a'),
            duration: { years: currentYoginiDasha.period }
        });

        currentDateTime = firstDashaEnd.plus({ minutes: 1 });

        // Calculate subsequent Yogini Dashas for 3 complete cycles (24 dashas)
        const totalDashas = yoginiDashas.length * 3; // 3 cycles of 8 dashas each
        for (let i = 1; i < totalDashas; i++) {
            currentYoginiDasha = yoginiDashas[(yoginiDashas.indexOf(initialYoginiDasha) + i) % 8];
            const dashaEnd = currentDateTime.plus({ years: currentYoginiDasha.period });

            // Adjust the end date to be one day less if the start and end dates are the same
            const adjustedDashaEnd = dashaEnd.minus({ minutes: 1 });

            dashaSequence.push({
                yogini: currentYoginiDasha.name,
                lord: currentYoginiDasha.lord,
                start: currentDateTime.toFormat('dd-MM-yyyy, hh:mm a'),
                end: adjustedDashaEnd.toFormat('dd-MM-yyyy, hh:mm a'),
                duration: { years: currentYoginiDasha.period }
            });

            currentDateTime = adjustedDashaEnd.plus({ minutes: 1 }); // Move start date to the next day
        }

        return dashaSequence;
    }

    // function calculateYoginiDashaSequence(birthDateTime, nakshatra, moonPosition, initialYoginiDasha) {
    //     const dashaSequence = [];
    //     let currentDateTime = birthDateTime;
    //     let currentYoginiDasha = initialYoginiDasha;

    //     // Calculate balance of first Dasha
    //     const nakshatraEnd = nakshatra.end;
    //     const differenceA = (nakshatraEnd - moonPosition) * 60; // Convert to minutes
    //     const balanceDays = Math.floor((currentYoginiDasha.period * 365.25 * differenceA) / 800); // Convert to days using 365.25 for leap years

    //     // Calculate full period of the Yogini Dasha in days
    //     const fullPeriodDays = currentYoginiDasha.period * 365.25;

    //     // Calculate the number of days that have already passed
    //     const passedDays = fullPeriodDays - balanceDays;

    //     // Calculate the actual start date of the first Yogini Dasha
    //     const firstDashaStart = currentDateTime.minus({ days: passedDays });

    //     // Calculate first Dasha details
    //     const firstDashaEnd = currentDateTime.plus({ days: balanceDays - 1});
    //     dashaSequence.push({
    //         yogini: currentYoginiDasha.name,
    //         lord: currentYoginiDasha.lord,
    //         start: firstDashaStart.toFormat('dd-MM-yyyy'),
    //         end: firstDashaEnd.toFormat('dd-MM-yyyy'),
    //         duration: { years: currentYoginiDasha.period, months: 0, days: balanceDays }
    //     });

    //     currentDateTime = firstDashaEnd;

    //     // Calculate subsequent Yogini Dashas for 3 complete cycles (24 dashas)
    //     const totalDashas = yoginiDashas.length * 3; // 3 cycles of 8 dashas each
    //     for (let i = 1; i < totalDashas; i++) {
    //         currentYoginiDasha = yoginiDashas[(yoginiDashas.indexOf(initialYoginiDasha) + i) % 8];
    //         const dashaEnd = currentDateTime.plus({ years: currentYoginiDasha.period });

    //         dashaSequence.push({
    //             yogini: currentYoginiDasha.name,
    //             lord: currentYoginiDasha.lord,
    //             start: currentDateTime.toFormat('dd-MM-yyyy'),
    //             end: dashaEnd.toFormat('dd-MM-yyyy'),
    //             duration: { years: currentYoginiDasha.period }
    //         });

    //         currentDateTime = dashaEnd.plus({ days: 1 }); // Move start date to the next day
    //     }

    //     return dashaSequence;
    // }

    // Function to calculate sub-dashas
    // function calculateSubYoginiDashas(utcDateTime, nakshatra, moonPosition, yoginiDashaAtBirth, mahaDashaInput) {

    //     const yoginiDasha = calculateYoginiDashaSequence(utcDateTime, nakshatra, moonPosition, yoginiDashaAtBirth);
    //     console.log("Major Dasha Input", mahaDashaInput)

    //     const mahaDasha = yoginiDasha.find(dasha => dasha.yogini === mahaDashaInput);
    //     console.log("Major Dasha", mahaDasha)


    //     if (!mahaDasha) {
    //         throw new Error('Maha Dasha input not found in Yogini Dasha');
    //     }

    //     let mahaDashaStart = DateTime.fromFormat(mahaDasha.start, "dd-MM-yyyy");
    //     const mahaDashaEnd = DateTime.fromFormat(mahaDasha.end, "dd-MM-yyyy");

    //     const mahaDashaDurationInDays = mahaDashaEnd.diff(mahaDashaStart, 'days').days;

    //     const subDashaPeriods = [
    //         { name: 'Mangala', lord: 'Moon', period: 1 },
    //         { name: 'Pingala', lord: 'Sun', period: 2 },
    //         { name: 'Dhanya', lord: 'Jupiter', period: 3 },
    //         { name: 'Bhramari', lord: 'Mars', period: 4 },
    //         { name: 'Bhadrika', lord: 'Mercury', period: 5 },
    //         { name: 'Ulka', lord: 'Saturn', period: 6 },
    //         { name: 'Siddha', lord: 'Venus', period: 7 },
    //         { name: 'Sankata', lord: 'Rahu', period: 8 }
    //     ];

    //     const subDashas = [];
    //     const mahaDashaIndex = subDashaPeriods.findIndex(dasha => dasha.name === mahaDashaInput);

    //     for (let i = 0; i < subDashaPeriods.length; i++) {
    //         const dasha = subDashaPeriods[(mahaDashaIndex + i) % subDashaPeriods.length];
    //         const dashaPeriodInDays = Math.round((mahaDashaDurationInDays * dasha.period) / 36); // 36 because sum of all periods in subDashaPeriods is 36 years

    //         let subDashaEndDate = mahaDashaStart.plus({ days: dashaPeriodInDays - 1 });

    //         if (subDashaEndDate > mahaDashaEnd) {
    //             subDashaEndDate = mahaDashaEnd;
    //         }

    //         const duration = subDashaEndDate.diff(mahaDashaStart, ['years', 'months', 'days']).toObject();

    //         subDashas.push({
    //             subDasha: dasha.name,
    //             lord: dasha.lord,
    //             start: mahaDashaStart.toFormat("dd-MM-yyyy"),
    //             end: subDashaEndDate.toFormat("dd-MM-yyyy"),
    //             duration: {
    //                 years: Math.floor(duration.years),
    //                 months: Math.floor(duration.months),
    //                 days: Math.floor(duration.days)
    //             }
    //         });

    //         mahaDashaStart = subDashaEndDate.plus({ days: 1 });

    //         if (mahaDashaStart > mahaDashaEnd) {
    //             break;
    //         }
    //     }

    //     return subDashas;
    // }

    // function calculateSubYoginiDashas(utcDateTime, nakshatra, moonPosition, yoginiDashaAtBirth) {
    //     // Get the sequence of Yogini Dashas
    //     const yoginiDashas = calculateYoginiDashaSequence(utcDateTime, nakshatra, moonPosition, yoginiDashaAtBirth);

    //     // Define the sub-Dasha periods
    //     const subDashaPeriods = [
    //         { name: 'Mangala', lord: 'Moon', period: 1 },
    //         { name: 'Pingala', lord: 'Sun', period: 2 },
    //         { name: 'Dhanya', lord: 'Jupiter', period: 3 },
    //         { name: 'Bhramari', lord: 'Mars', period: 4 },
    //         { name: 'Bhadrika', lord: 'Mercury', period: 5 },
    //         { name: 'Ulka', lord: 'Saturn', period: 6 },
    //         { name: 'Siddha', lord: 'Venus', period: 7 },
    //         { name: 'Sankata', lord: 'Rahu', period: 8 }
    //     ];

    //     // Array to hold the entire sequence of major and sub-Dashas
    //     const allDashas = [];

    //     // Loop through each Yogini Dasha to calculate its sub-Dashas
    //     for (let mahaDasha of yoginiDashas) {
    //         let mahaDashaStart = DateTime.fromFormat(mahaDasha.start, "dd-MM-yyyy");
    //         const mahaDashaEnd = DateTime.fromFormat(mahaDasha.end, "dd-MM-yyyy");

    //         const mahaDashaDurationInDays = mahaDashaEnd.diff(mahaDashaStart, 'days').days;

    //         // Find the index of the current major Dasha in the subDashaPeriods list
    //         const mahaDashaIndex = subDashaPeriods.findIndex(dasha => dasha.name === mahaDasha.yogini);

    //         const subDashas = [];

    //         for (let i = 0; i < subDashaPeriods.length; i++) {
    //             const dasha = subDashaPeriods[(mahaDashaIndex + i) % subDashaPeriods.length];
    //             const dashaPeriodInDays = Math.round((mahaDashaDurationInDays * dasha.period) / 36); // 36 because sum of all periods in subDashaPeriods is 36 years

    //             let subDashaEndDate = mahaDashaStart.plus({ days: dashaPeriodInDays - 1 });

    //             if (subDashaEndDate > mahaDashaEnd) {
    //                 subDashaEndDate = mahaDashaEnd;
    //             }

    //             const duration = subDashaEndDate.diff(mahaDashaStart, ['years', 'months', 'days']).toObject();

    //             subDashas.push({
    //                 subDasha: dasha.name,
    //                 lord: dasha.lord,
    //                 start: mahaDashaStart.toFormat("dd-MM-yyyy"),
    //                 end: subDashaEndDate.toFormat("dd-MM-yyyy"),
    //                 duration: {
    //                     years: Math.floor(duration.years),
    //                     months: Math.floor(duration.months),
    //                     days: Math.floor(duration.days)
    //                 }
    //             });

    //             mahaDashaStart = subDashaEndDate.plus({ days: 1 });

    //             if (mahaDashaStart > mahaDashaEnd) {
    //                 break;
    //             }
    //         }

    //         // Include the major Dasha and its corresponding sub-Dashas in the final result
    //         allDashas.push({
    //             majorDasha: mahaDasha.yogini,
    //             lord: mahaDasha.lord,
    //             start: mahaDasha.start,
    //             end: mahaDasha.end,
    //             duration: mahaDasha.duration,
    //             subDashas: subDashas
    //         });
    //     }

    //     return allDashas;
    // }


    function calculateSubYoginiDashas(utcDateTime, nakshatra, moonPosition, yoginiDashaAtBirth) {
        // Get the sequence of Yogini Dashas
        const yoginiDashas = calculateYoginiDashaSequence(utcDateTime, nakshatra, moonPosition, yoginiDashaAtBirth);

        // Define the sub-Dasha periods
        const subDashaPeriods = [
            { name: 'Mangala', lord: 'Moon', period: 1 },
            { name: 'Pingala', lord: 'Sun', period: 2 },
            { name: 'Dhanya', lord: 'Jupiter', period: 3 },
            { name: 'Bhramari', lord: 'Mars', period: 4 },
            { name: 'Bhadrika', lord: 'Mercury', period: 5 },
            { name: 'Ulka', lord: 'Saturn', period: 6 },
            { name: 'Siddha', lord: 'Venus', period: 7 },
            { name: 'Sankata', lord: 'Rahu', period: 8 }
        ];

        // Array to hold the entire sequence of major and sub-Dashas
        const allDashas = [];

        // Loop through each Yogini Dasha to calculate its sub-Dashas
        for (let mahaDasha of yoginiDashas) {
            let mahaDashaStart = DateTime.fromFormat(mahaDasha.start, "dd-MM-yyyy, hh:mm a");
            const mahaDashaEnd = DateTime.fromFormat(mahaDasha.end, "dd-MM-yyyy, hh:mm a");

            const mahaDashaInMinutes = Math.round(mahaDasha.duration.years * 365.25 * 24 * 60);

            // Find the index of the current major Dasha in the subDashaPeriods list
            const mahaDashaIndex = subDashaPeriods.findIndex(dasha => dasha.name === mahaDasha.yogini);

            const subDashas = [];

            for (let i = 0; i < subDashaPeriods.length; i++) {
                const dasha = subDashaPeriods[(mahaDashaIndex + i) % subDashaPeriods.length];
                const antarDashaPeriodInMinutes = Math.round((mahaDashaInMinutes * dasha.period) / 36); // 36 because sum of all periods in subDashaPeriods is 36 years

                // Convert minutes to years, months, days, hours, minutes
                let remainingMinutes = antarDashaPeriodInMinutes;

                const years = Math.floor(remainingMinutes / (365.25 * 24 * 60));
                remainingMinutes -= years * (365.25 * 24 * 60);

                const months = Math.floor(remainingMinutes / (30.44 * 24 * 60));
                remainingMinutes -= months * (30.44 * 24 * 60);

                const days = Math.floor(remainingMinutes / (24 * 60));
                remainingMinutes -= days * (24 * 60);

                const hours = Math.floor(remainingMinutes / 60);
                const minutes = remainingMinutes % 60;

                let subDashaEndDate = mahaDashaStart.plus({
                    years,
                    months,
                    days,
                    hours,
                    minutes
                });

                if (subDashaEndDate > mahaDashaEnd) {
                    subDashaEndDate = mahaDashaEnd;
                }

                subDashas.push({
                    subDasha: dasha.name,
                    lord: dasha.lord,
                    start: mahaDashaStart.toFormat("dd-MM-yyyy, hh:mm a"),
                    end: subDashaEndDate.toFormat("dd-MM-yyyy, hh:mm a"),
                    duration: {
                        years: years,
                        months: months,
                        days: days,
                        hours: hours,
                        minutes: Math.floor(minutes)
                    }
                });

                mahaDashaStart = subDashaEndDate.plus({ minutes: 1 });

                if (mahaDashaStart > mahaDashaEnd) {
                    break;
                }
            }

            // Include the major Dasha and its corresponding sub-Dashas in the final result
            allDashas.push({
                majorDasha: mahaDasha.yogini,
                lord: mahaDasha.lord,
                start: mahaDasha.start,
                end: mahaDasha.end,
                duration: mahaDasha.duration,
                subDashas: subDashas
            });
        }

        return allDashas;
    }

    let moonPosition = 0;
    let data = [];

    const [planetData] = await Promise.all([
        swisseph.swe_calc_ut(
            julianDay,
            swisseph.SE_MOON,
            swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED
        ),

    ]);

    // swisseph.swe_calc_ut(julianDay, swisseph.SE_MOON, swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED, (planetData) => {
    moonPosition = planetData.longitude;

    const nakshatra = findNakshatra(moonPosition);
    // console.log(moonPosition)
    const nakshatraNumber = nakshatras.indexOf(nakshatra) + 1;
    // console.log("Nakshatra Number", nakshatra, nakshatraNumber)
    const yoginiDashaAtBirth = findYoginiDashaAtBirth(nakshatraNumber);

    // 

    // const mahaDashaInput = 'Pingala';

    const yoginiSubDasha = calculateSubYoginiDashas(utcDateTime, nakshatra, moonPosition, yoginiDashaAtBirth);

    //  // The "2" adds indentation for readability
    let a = yoginiSubDasha
    data.push(a);
    // });
    return data;
}

export default getYogini_sub;
