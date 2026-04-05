const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gvjmtgvfpbssqlvklski.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2am10Z3ZmcGJzc3Fsdmtsc2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzgyMjcsImV4cCI6MjA5MDI1NDIyN30.OZ7RZcXcykNJVY7hhGLthTVLpCeDr3ftRYNTJin8oKg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('listings').select('*');
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Listings in DB:', data);
  }
}

main();
