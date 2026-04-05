const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gvjmtgvfpbssqlvklski.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2am10Z3ZmcGJzc3Fsdmtsc2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzgyMjcsImV4cCI6MjA5MDI1NDIyN30.OZ7RZcXcykNJVY7hhGLthTVLpCeDr3ftRYNTJin8oKg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const email = `huisdirect.demo.${Date.now()}@gmail.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'securepassword123'
  });
  
  if (authError || !authData?.user?.id) {
    return console.error('no user, auth error:', authError);
  }
  const userId = authData.user.id;
  
  // Let's try to insert using the old schema.sql columns to see if they exist
  const listing = {
    user_id: userId,
    title: 'Test House',
    price: 500000,
    location: 'Test Street 1',
    city: 'Amsterdam',
    description: 'A test house',
    property_type: 'house',
    status: 'active',
    is_featured: true
  };
  
  const { data, error } = await supabase.from('listings').insert(listing).select();
  if (error) {
    console.error("Insert error:", error.message, error.details);
  } else {
    console.log("Inserted! Returned columns:", Object.keys(data[0]));
  }
}

main();
