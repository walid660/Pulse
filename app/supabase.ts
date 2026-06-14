import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cdxojidnvkebxqpmuqsk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkeG9qaWRudmtlYnhxcG11cXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTcxMDgsImV4cCI6MjA5NjU5MzEwOH0.nfaLyGnf5xp_hGJMDWWzWRSN3l3QkBdzuVSXxC_mflY'

export const supabase = createClient(supabaseUrl, supabaseKey)
