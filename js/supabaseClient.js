// Supabase Client Initialization
// Asegúrate de incluir la librería de Supabase en tus HTML antes de este script:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = 'https://rfnldokegvxrjpxbkvns.supabase.co'; // Reemplazar con tu URL de proyecto Supabase
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmbmxkb2tlZ3Z4cmpweGJrdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDY3MDMsImV4cCI6MjA5NzM4MjcwM30.AlketIJng1UfhP7I3qsPFD_7kcZM3SW7WNJnGAidVMw'; // Reemplazar con tu anon key de Supabase

// Initialize the Supabase client avoiding global 'supabase' name collision
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// You can access the database through supabaseClient

// Global Helper to get root index URL safely across GitHub Pages and subdirectories
function getAdminRootIndex() {
    const path = window.location.pathname;
    const match = path.match(/^(.*\/SUMINISTROSMG\/)/i);
    if (match) return match[1] + 'index.html';
    const adminIdx = path.search(/\/admin_[^\/]+/i);
    if (adminIdx !== -1) return path.substring(0, adminIdx) + '/index.html';
    return '../index.html';
}

