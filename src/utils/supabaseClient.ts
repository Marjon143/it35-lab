import { createClient } from '@supabase/supabase-js';
 
 const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
 const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
 
 export const supabase = createClient("https://gldijxqkegodtrzopeqy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsZGlqeHFrZWdvZHRyem9wZXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTcxNjcsImV4cCI6MjA1OTIzMzE2N30.NSp-70IAJRFwH-wleTeB4U3vtYDAGY1FjLxAn7YdV88");