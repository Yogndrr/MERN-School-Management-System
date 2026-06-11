const http = require('http');

function post(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(resBody) });
        } catch (e) {
          resolve({ status: res.statusCode, data: resBody });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function testAuth() {
  const baseUrl = 'http://localhost:5001';
  const timestamp = Date.now();
  const email = `admin${timestamp}@example.com`;
  const password = 'Password123!';

  console.log('--- Testing Registration ---');
  console.log('Email:', email);
  try {
    const regRes = await post(`${baseUrl}/AdminReg`, {
      email,
      password,
      name: 'Test Admin',
      schoolName: 'Test School ' + timestamp
    });
    console.log('Registration Status:', regRes.status);
    console.log('Registration Data:', regRes.data);

    if (regRes.status === 200 || regRes.status === 201) {
      console.log('\n--- Testing Login ---');
      const loginRes = await post(`${baseUrl}/AdminLogin`, { email, password });
      console.log('Login Status:', loginRes.status);
      console.log('Login Data:', loginRes.data);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testAuth();
