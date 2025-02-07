import getYogini_maha from "./Yogini_Dasha/yogini_maha";
import getYogini_sub from "./Yogini_Dasha/yogini_sub";
import getLifeRhythm from "./bio_rythm/liferythm";
import getAshtakvarga from "./AshtakVarga/bhinnaAshtakVarga";
import getSarvashtakvarga from "./AshtakVarga/sarvashtakvarga";
import { trackUsage } from "./middleware/TrackApiCall";
import { getApiKey, initializeValidation, validatePackageName } from "./middleware/Validation";

export const userId = '66ea90b1bb88affa7930e6ff'

// Initialize validation during app startup
initializeValidation(userId)
    .then(() => console.log('Validation initialized successfully'))
    .catch((error) => console.error('Validation initialization failed:', error));

const withUsageTracking = (func, functionName) => {
    return async (...args) => {
        // Validate the package name (use cached value)
        const isPackageValid = await validatePackageName();
        if (!isPackageValid) {
            throw new Error('Access denied: Package name does not match.');
        }

        // Get the client ID (use cached value)
        const apiKey = await getApiKey();

        // Track the API call
        await trackUsage(apiKey, functionName);

        // Call the original function
        return func(...args);
    };
};

export const getYogini_maha_with_tracking = withUsageTracking(getYogini_maha, 'getYogini_maha');
export const getYogini_sub_with_tracking = withUsageTracking(getYogini_sub, 'getYogini_sub');
export const getLifeRhythm_with_tracking = withUsageTracking(getLifeRhythm, 'getLifeRhythm');
export const getAshtakvarga_with_tracking = withUsageTracking(getAshtakvarga, 'getAshtakvarga');
export const getSarvashtakvarga_with_tracking = withUsageTracking(getSarvashtakvarga, 'getSarvashtakvarga');

export {
    getYogini_maha_with_tracking as getYogini_maha,
    getYogini_sub_with_tracking as getYogini_sub,
    getLifeRhythm_with_tracking as getLifeRhythm,
    getAshtakvarga_with_tracking as getAshtakvarga,
    getSarvashtakvarga_with_tracking as getSarvashtakvarga,
};