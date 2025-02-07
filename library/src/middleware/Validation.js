import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

// Check if the device is online
const isOnline = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
};

// Fetch and store the allowed package names
const fetchAndStorePackageNames = async (userId) => {
    try {
        const response = await axios.get(`https://service.astrochalit.com/api/sdk/packages/${userId}`);
        const packageNames = response.data.packageNames || []; // Ensure it's an array
        await AsyncStorage.setItem('allowedPackageNames', JSON.stringify(packageNames));
        return packageNames;
    } catch (error) {
        console.error('Failed to fetch package names:', error);
        throw error;
    }
};

// Fetch and store the API key
export const fetchAndStoreApiKey = async (userId) => {
    try {
        const response = await axios.get(`https://service.astrochalit.com/api/sdk/apikey/${userId}`);
        const apiKey = response.data.apiKey;
        await AsyncStorage.setItem('apiKey', apiKey);
        return apiKey;
    } catch (error) {
        console.error('Failed to fetch API key:', error);
        throw error;
    }
};

// Validate if the current package name is allowed
export const validatePackageName = async (userId) => {
    try {
        const storedPackageNames = await AsyncStorage.getItem('allowedPackageNames');
        const allowedPackageNames = storedPackageNames ? JSON.parse(storedPackageNames) : [];
        const currentPackageName = await DeviceInfo.getBundleId();
        
        console.log("🚀 ~ validatePackageName ~ storedPackageNames:", storedPackageNames)
        console.log("🚀 ~ validatePackageName ~ allowedPackageNames:", allowedPackageNames)
        console.log("🚀 ~ validatePackageName ~ currentPackageName:", currentPackageName)

        if (allowedPackageNames.includes(currentPackageName)) {
            return true;
        }

        if (!(await isOnline())) {
            return false; // If offline, rely on stored data only
        }

        // Fetch and update allowed package names
        const latestPackageNames = await fetchAndStorePackageNames(userId);
        return latestPackageNames.includes(currentPackageName);
    } catch (error) {
        console.error('Failed to validate package name:', error);
        return false;
    }
};

// Get the API key (cached or fetched)
export const getApiKey = async (userId) => {
    try {
        let apiKey = await AsyncStorage.getItem('apiKey');

        if (!apiKey) {
            apiKey = await fetchAndStoreApiKey(userId);
        }

        return apiKey;
    } catch (error) {
        console.error('Failed to get API key:', error);
        throw error;
    }
};

// Initialize validation and caching
export const initializeValidation = async (userId) => {
    try {
        await validatePackageName(userId);
        await getApiKey(userId);
    } catch (error) {
        console.error('Initialization failed:', error);
        throw error;
    }
};
