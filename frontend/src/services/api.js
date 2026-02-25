import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add request interceptor for debugging and URL cleaning
API.interceptors.request.use(
    (config) => {
        // Clean the URL - remove any spaces or special characters
        config.url = config.url.replace(/\s+/g, '');  // Remove all spaces
        
        // Ensure URL ends with slash if needed (but don't add if it already has one)
        if (!config.url.endsWith('/') && !config.url.includes('?')) {
            config.url = config.url + '/';
        }
        
        console.log('='.repeat(50));
        console.log('🚀 REQUEST DETAILS:');
        console.log('📍 Full URL:', `${config.baseURL}${config.url}`);
        console.log('📌 Endpoint:', config.url);
        console.log('📦 Method:', config.method?.toUpperCase());
        console.log('📤 Data:', config.data);
        console.log('📋 Headers:', config.headers);
        console.log('='.repeat(50));
        
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
API.interceptors.response.use(
    (response) => {
        console.log('='.repeat(50));
        console.log('✅ RESPONSE DETAILS:');
        console.log('📍 URL:', response.config.url);
        console.log('📦 Status:', response.status);
        console.log('📊 Data:', response.data);
        console.log('='.repeat(50));
        
        return response;
    },
    (error) => {
        console.log('='.repeat(50));
        console.log('❌ ERROR RESPONSE:');
        
        if (error.code === 'ECONNABORTED') {
            console.error('⏰ Request Timeout');
        } else if (error.response) {
            // The request was made and the server responded with a status code
            console.error('📍 URL:', error.config?.url);
            console.error('📦 Status:', error.response.status);
            console.error('📊 Error Data:', error.response.data);
            console.error('📋 Headers:', error.response.headers);
            
            // Check for specific error patterns
            if (error.response.status === 404) {
                console.error('🔍 Endpoint not found! Check if URL is correct:', error.config?.url);
                console.error('💡 Expected URL should be something like: password-reset/send-otp/');
            } else if (error.response.status === 400) {
                console.error('⚠️ Bad Request - Check your data format');
            } else if (error.response.status === 500) {
                console.error('🔥 Server Error - Check Django backend');
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('📡 No Response from Server - Is the backend running?');
            console.error('💡 Make sure: python manage.py runserver');
        } else {
            // Something happened in setting up the request
            console.error('❌ Error:', error.message);
        }
        
        console.log('='.repeat(50));
        
        return Promise.reject(error);
    }
);

// Helper function to test connection
export const testConnection = async () => {
    try {
        const response = await API.get('test/');
        console.log('✅ Backend connection successful:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Backend connection failed:', error.message);
        return false;
    }
};

export default API;