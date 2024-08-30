import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://aofiagwcuylnscvwyhyc.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZmlhZ3djdXlsbnNjdnd5aHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5MzI3MTIsImV4cCI6MjAzODUwODcxMn0.nlen1HXhmA0fTDaaNNk_YOUL92h1BpdDEFVDs5ObsNM"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
