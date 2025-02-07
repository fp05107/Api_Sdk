import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { userId } from '..';
import { fetchAndStoreApiKey } from './Validation';

export const trackUsage = async (apiKey, functionName) => {
    try {
        // Fetch the latest clientId from the API
        const latestApiKey = await fetchAndStoreApiKey(userId);

        // If the stored clientId doesn't match the latest one, update it
        if (apiKey !== latestApiKey) {
            apiKey = latestApiKey;
            await AsyncStorage.setItem('apiKey', apiKey);
        }

        // Create a usage object
        const usage = {
            apiKey,
            functionName,
            timestamp: new Date().toISOString(),
        };

        // Check if the user is online
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            // If online, send the usage data to the server
            await axios.post('https://service.astrochalit.com/api/sdk/track/usage', { userId, apiKey });
        } else {
            // If offline, store the usage data in AsyncStorage
            await storeUsageLocally(usage);
        }
    } catch (error) {
        console.error('Failed to track usage:', error);
        throw error;
    }
};

const storeUsageLocally = async (usage) => {
    try {
        // Get the existing usage data from AsyncStorage
        const existingUsage = await AsyncStorage.getItem('usageData');
        let usageData = existingUsage ? JSON.parse(existingUsage) : [];

        // Add the new usage data
        usageData.push(usage);

        // Save the updated usage data
        await AsyncStorage.setItem('usageData', JSON.stringify(usageData));
    } catch (error) {
        console.error('Failed to store usage data locally:', error);
    }
};

const syncUsageData = async () => {
    try {
        // Get the locally stored usage data
        const existingUsage = await AsyncStorage.getItem('usageData');
        if (existingUsage) {
            const usageData = JSON.parse(existingUsage);

            // Send all usage data to the server
            await axios.post('https://your-server.com/track-usage-batch', usageData);

            // Clear the local usage data
            await AsyncStorage.removeItem('usageData');
        }
    } catch (error) {
        console.error('Failed to sync usage data:', error);
    }
};

// Periodically sync usage data
// setInterval(syncUsageData, 60000); // Sync every 60 seconds
