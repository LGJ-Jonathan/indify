import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wsikoxfeejrukntjgnks.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzaWtveGZlZWpydWtudGpnbmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDM3MjMsImV4cCI6MjA5MDQxOTcyM30.ZJpFlrCD0HQLLqk4z-CfIF2rN5PwhjzVRLYaj6P46_I'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
