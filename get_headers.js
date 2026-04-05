const url = 'https://gvjmtgvfpbssqlvklski.supabase.co/rest/v1/listings?limit=1';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2am10Z3ZmcGJzc3Fsdmtsc2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzgyMjcsImV4cCI6MjA5MDI1NDIyN30.OZ7RZcXcykNJVY7hhGLthTVLpCeDr3ftRYNTJin8oKg';

fetch(url, {
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Accept': 'text/csv'
  }
})
.then(res => res.text())
.then(text => console.log('CSV Headers:', text))
.catch(err => console.error(err));
