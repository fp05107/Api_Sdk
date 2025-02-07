// const moment = require('moment');
import moment from 'moment';
// Constants for cycle lengths
const PHYSICAL_CYCLE = 23;
const EMOTIONAL_CYCLE = 28;
const INTELLECTUAL_CYCLE = 33;

// Helper function to calculate the cycle phase and interpretation
function calculatePhase(days, cycleLength) {
    const dayInCycle = days % cycleLength;
    let phase, interpretation;

    if (cycleLength === PHYSICAL_CYCLE) {
        if (dayInCycle === 12 || dayInCycle === 23) {
            phase = 'Critical';
            interpretation = 'Physical: Take extra care, avoid strenuous activities.';
        } else if (dayInCycle <= 11) {
            phase = 'Positive';
            interpretation = 'Physical: High energy and strength.';
        } else {
            phase = 'Negative';
            interpretation = 'Physical: Lower energy, take it easy.';
        }
    } else if (cycleLength === EMOTIONAL_CYCLE) {
        if (dayInCycle === 15 || dayInCycle === 28) {
            phase = 'Critical';
            interpretation = 'Emotional: Be cautious of mood swings and emotions.';
        } else if (dayInCycle <= 14) {
            phase = 'Positive';
            interpretation = 'Emotional: Feeling happy and stable.';
        } else {
            phase = 'Negative';
            interpretation = 'Emotional: Possible mood swings, stay calm.';
        }
    } else if (cycleLength === INTELLECTUAL_CYCLE) {
        if (dayInCycle === 17 || dayInCycle === 33) {
            phase = 'Critical';
            interpretation = 'Intellectual: Focus on routine tasks, avoid new challenges.';
        } else if (dayInCycle <= 16) {
            phase = 'Positive';
            interpretation = 'Intellectual: Sharp and clear thinking.';
        } else {
            phase = 'Negative';
            interpretation = 'Intellectual: Mental fatigue, take breaks.';
        }
    }

    return { phase, interpretation, dayInCycle };
}

// Helper function to calculate biorhythm percentage
function calculateBiorhythm(days, cycleLength) {
    return Math.sin((2 * Math.PI * days) / cycleLength) * 100;
}

// Main function to get LifeRhythm details
async function getLifeRhythm(dob) {
    const birthDate = moment(dob);
    const today = moment();
    const daysAlive = today.diff(birthDate, 'days');

    const physicalPhase = calculatePhase(daysAlive, PHYSICAL_CYCLE);
    const emotionalPhase = calculatePhase(daysAlive, EMOTIONAL_CYCLE);
    const intellectualPhase = calculatePhase(daysAlive, INTELLECTUAL_CYCLE);

    const physicalPercentage = calculateBiorhythm(daysAlive, PHYSICAL_CYCLE);
    const emotionalPercentage = calculateBiorhythm(daysAlive, EMOTIONAL_CYCLE);
    const intellectualPercentage = calculateBiorhythm(daysAlive, INTELLECTUAL_CYCLE);

    const averagePercentage = (physicalPercentage + emotionalPercentage + intellectualPercentage) / 3;

    return {
        DaysAlive: daysAlive,
        LifeRhythm: {
            Physical: {
                phase: physicalPhase.phase,
                interpretation: physicalPhase.interpretation,
                daysInCycle: `${physicalPhase.dayInCycle}`
            },
            Emotional: {
                phase: emotionalPhase.phase,
                interpretation: emotionalPhase.interpretation,
                daysInCycle: `${emotionalPhase.dayInCycle}`
            },
            Intellectual: {
                phase: intellectualPhase.phase,
                interpretation: intellectualPhase.interpretation,
                daysInCycle: `${intellectualPhase.dayInCycle}`
            }
        },
        PhysicalPercentage: physicalPercentage,
        EmotionalPercentage: emotionalPercentage,
        IntellectualPercentage: intellectualPercentage,
        AveragePercentage: averagePercentage
    };
}

export default getLifeRhythm;