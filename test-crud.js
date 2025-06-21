import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/users';

// Helper function to make requests
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    console.log(`${options.method || 'GET'} ${url}`);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('---'.repeat(20));
    return data;
  } catch (error) {
    console.error('Request failed:', error.message);
  }
};

const testCRUD = async () => {
  console.log('🧪 Testing CRUD Operations\n');
  
  try {
    // 1. CREATE - Add new users
    console.log('1️⃣ CREATE Operations:');
    const user1 = await makeRequest(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      })
    });

    const user2 = await makeRequest(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 30
      })
    });

    // 2. READ - Get all users
    console.log('2️⃣ READ Operations:');
    console.log('📋 Getting all users:');
    await makeRequest(BASE_URL);

    // Get user by ID (if we have one)
    if (user1.data && user1.data._id) {
      console.log('👤 Getting user by ID:');
      await makeRequest(`${BASE_URL}/${user1.data._id}`);
    }

    // 3. UPDATE - Update a user
    if (user1.data && user1.data._id) {
      console.log('3️⃣ UPDATE Operations:');
      await makeRequest(`${BASE_URL}/${user1.data._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: 'John Updated',
          age: 26
        })
      });
    }

    // 4. DELETE - Delete a user
    if (user2.data && user2.data._id) {
      console.log('4️⃣ DELETE Operations:');
      await makeRequest(`${BASE_URL}/${user2.data._id}`, {
        method: 'DELETE'
      });
    }

    // Final check - Get all users again
    console.log('📋 Final state - All users:');
    await makeRequest(BASE_URL);

  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

// Run the test
testCRUD();