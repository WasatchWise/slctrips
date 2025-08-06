<script>
  import { onMount } from 'svelte';
  import './app.css';

  let weather = { temp: 0, condition: 'Loading...' };
  
  // Fetch weather data
  async function fetchWeather() {
    try {
      const response = await fetch('/api/weather/slc-airport');
      weather = await response.json();
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  }

  onMount(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
    fetchWeather();
  });
</script>

<!-- Navigation Bar -->
<nav class="bg-slate-600 shadow-sm border-b border-slate-700 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 relative">
      <!-- Left side: SLC Logo -->
      <div class="flex items-center">
        <div class="flex items-center cursor-pointer">
          <img 
            src="/slctrips-logo.png" 
            alt="SLC Trips - From Salt Lake to Everywhere" 
            class="h-10 w-auto object-contain"
          />
        </div>
      </div>
      
      <!-- Centered Slogan -->
      <div class="absolute left-1/2 transform -translate-x-1/2">
        <div class="text-white text-2xl font-bold hidden sm:block">
          <span style="color: white;">From Salt</span>
          <span style="color: white;"> Lake,</span>
          <span style="color: white;"> to</span>
          <span style="color: #FFD700;"> Everywhere</span>
        </div>
      </div>

      <!-- Right side: Hamburger menu -->
      <div class="flex items-center">
        <button class="text-white hover:text-gray-300">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>

<slot />

<!-- Footer -->
<footer class="bg-slate-900 border-t border-slate-700">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex items-center justify-between">
      <!-- Airport Logo -->
      <div class="flex items-center">
        <img 
          src="/airport-logo.png" 
          alt="SLC Airport" 
          class="h-12 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
          on:click={() => window.open('https://www.slcairport.com/', '_blank')}
        />
      </div>
      
      <!-- Center Copyright -->
      <div class="text-center">
        <p class="text-slate-400 text-sm">© 2025 SLCTrips.com - From Salt Lake to Everywhere</p>
      </div>
      
      <!-- Weather Widget -->
      <div class="flex items-center bg-slate-800 rounded-lg px-4 py-3 text-white">
        <span class="mr-3 text-lg">☁️</span>
        <div>
          <div class="font-semibold text-lg">{Math.round(weather.temp)}°F</div>
          <div class="text-sm text-slate-300">{weather.condition}</div>
        </div>
      </div>
    </div>
  </div>
</footer>