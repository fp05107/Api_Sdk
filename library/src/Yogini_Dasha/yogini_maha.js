import swisseph from 'react-native-swisseph';
import { DateTime } from 'luxon';

// Set the ayanamsa to Lahiri (default Vedic option)
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0.0, 0.0);

async function getYogini_maha(year, month, day, hour, minute, second) {
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

  let moonPosition = 0;
  let data = [];

  const [planetData] = await Promise.all([
    swisseph.swe_calc_ut(
      julianDay,
      swisseph.SE_MOON,
      swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED
    ),

  ]);
  moonPosition = planetData.longitude;
  const nakshatra = findNakshatra(moonPosition);
  const nakshatraNumber = nakshatras.indexOf(nakshatra) + 1;
  const yoginiDashaAtBirth = findYoginiDashaAtBirth(nakshatraNumber);
  const yoginiDashaSequence = calculateYoginiDashaSequence(utcDateTime, nakshatra, moonPosition, yoginiDashaAtBirth);
  let a = yoginiDashaSequence
  data.push(a);
  return data;
}

export default getYogini_maha;
