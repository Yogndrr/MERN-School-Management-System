const supabase = require('./supabase');

async function testConnection() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('schools').select('*').limit(1);

  if (error) {
    console.error('❌ Connection failed:', error.message);
  } else {
    console.log('✅ Connection successful! Data:', data);
  }
}

testConnection();
