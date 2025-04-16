const axios = require('axios');
const { faker } = require('@faker-js/faker');

let maxRetries = 3;

let axiosConfig = {};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getDomains() {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const key = String.fromCharCode(97 + Math.floor(Math.random() * 26)) + 
                       String.fromCharCode(97 + Math.floor(Math.random() * 26));
            
            console.log(`[*] Fetching domains with key: ${key}`);
            const response = await axios.get(`https://generator.email/search.php?key=${key}`, axiosConfig);
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                return response.data;
            }
            attempt++;
            await delay(2000);
        } catch (error) {
            console.error(`[!] Error fetching domains: ${error.message}`);
            if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
                await getRandomProxy();
            }
            attempt++;
            await delay(2000);
        }
    }
    return [];
}

function randomEmail(domain) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const cleanFirstName = firstName.replace(/[^a-zA-Z]/g, ''); 
    const cleanLastName = lastName.replace(/[^a-zA-Z]/g, '');   

    const randomNum = Math.floor(Math.random() * 900) + 100;
    const emailName = `${cleanFirstName.toLowerCase()}${cleanLastName.toLowerCase()}${randomNum}`;

    return {
        name: emailName,
        email: `${emailName}@${domain}`
    };
}

module.exports = {
    getDomains,
    randomEmail
}
