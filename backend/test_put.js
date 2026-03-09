import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

const testEditFood = async () => {
    try {
        // 1. Login as admin
        console.log('Logging in as admin...');
        const loginRes = await api.post('/auth/login', {
            email: 'admin@gmail.com',
            password: 'adminpassword' // I am assuming this is the password based on typical test setups, or I might need to check.
            // Wait, I don't know the password.
        });

        const token = loginRes.data.token;
        console.log('Login successful. Token acquired.');

        // 2. Try to update a food item
        // Use the ID from the user's terminal: 699f4906e77a61b9922c4f43
        const foodId = '699f4906e77a61b9922c4f43';
        console.log(`Attempting to update food item ${foodId}...`);

        const updateRes = await api.put(`/foods/${foodId}`, {
            name: 'Sushi Updated',
            price: 15,
            category: 'Mains',
            image: 'https://i.pinimg.com/736x/9d/bd/9e/9dbd9e57882c54314b9922c4f43.jpg'
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Update result:', updateRes.data);
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testEditFood();
