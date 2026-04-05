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
  
  if (authError || !authData.user) {
    console.error("Auth error:", authError);
    return;
  }
  
  const userId = authData.user.id;
  
  const demoListings = [
    {
      user_id: userId,
      slug: 'charming-canal-house',
      title: 'Charming Canal House',
      asking_price: 850000,
      description: 'A beautiful canal house in the heart of Amsterdam.',
      street: 'Prinsengracht 123',
      city: 'Amsterdam',
      bedrooms: 3,
      living_area: 145,
      property_type: 'woning',
      status: 'active',
      is_featured: true,
      images: ['/images/house.jpg']
    },
    {
      user_id: userId,
      slug: 'modern-apartment',
      title: 'Modern Apartment',
      asking_price: 395000,
      description: 'Bright, modern apartment with balcony.',
      street: 'Overtoom 45',
      city: 'Amsterdam',
      bedrooms: 2,
      living_area: 78,
      property_type: 'appartement',
      status: 'active',
      is_featured: false,
      images: ['/images/house.jpg']
    }
  ];
  
  for (const listing of demoListings) {
    const { data, error } = await supabase.from('listings').insert(listing).select();
    if (error) {
      console.error("Insert error:", error.message, error.details);
    } else {
      console.log("Inserted:", data[0].title);
    }
  }
}

main();
