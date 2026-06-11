const supabase = require('./supabase');

async function testAuth() {
  const email = 'direct' + Date.now() + '@example.com';
  const password = 'Password123!';

  console.log('Testing direct Supabase Auth signUp for:', email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error('❌ Supabase Auth error:', error.message);
  } else {
    console.log('✅ Supabase Auth success:', data.user.email);
  }
}

testAuth();
