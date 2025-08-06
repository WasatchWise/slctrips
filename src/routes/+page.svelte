<script>
  import { onMount } from 'svelte';

  let destinations = [];
  let weather = { temp: 0, condition: 'Loading...' };
  
  // Fetch destinations from the Express API
  async function fetchDestinations() {
    try {
      const response = await fetch('/api/destinations');
      destinations = await response.json();
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
    }
  }

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
    fetchDestinations();
    fetchWeather();
  });
</script>

<svelte:head>
  <title>SLCTrips.com - From Salt Lake to Everywhere</title>
  <meta name="description" content="Discover 739+ authentic Utah destinations from Salt Lake City. Complete 2034 Olympic venue collection." />
</svelte:head>



<!-- Main Content -->
<main class="min-h-screen bg-slate-800">
  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-slate-800 to-slate-900 py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
        From Salt Lake, to <span class="text-yellow-400">Everywhere</span>
      </h1>
      <p class="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
        Discover 1,057+ authentic Utah destinations. Complete 2034 Olympic venue collection with drive time-based filtering.
      </p>
      <div class="bg-slate-700 rounded-lg p-6 max-w-md mx-auto">
        <h3 class="text-lg font-semibold text-white mb-2">Current Conditions</h3>
        <div class="text-3xl font-bold text-yellow-400">{Math.round(weather.temp)}°F</div>
        <div class="text-slate-300">{weather.condition}</div>
      </div>
    </div>
  </section>

  <!-- Destination Count -->
  <section class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="bg-slate-700 rounded-lg p-8 max-w-md mx-auto">
        <h2 class="text-2xl font-bold text-white mb-4">Destinations Available</h2>
        <div class="text-4xl font-bold text-yellow-400">{destinations.length}</div>
        <p class="text-slate-300 mt-2">Authentic Utah experiences from Salt Lake City</p>
      </div>
    </div>
  </section>

  <!-- Recent Destinations Grid -->
  <section class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-white mb-8 text-center">Featured Destinations</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each destinations.slice(0, 6) as destination}
          <div class="bg-slate-700 rounded-lg overflow-hidden hover:bg-slate-600 transition-colors cursor-pointer">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-white mb-2">{destination.name}</h3>
              <p class="text-slate-300 mb-4 line-clamp-3">{destination.description || 'Discover this amazing Utah destination.'}</p>
              <div class="flex justify-between items-center">
                <span class="bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-sm font-medium">
                  {destination.category}
                </span>
                <span class="text-slate-400 text-sm">
                  {destination.driveTimeText || `${destination.driveTime} min`}
                </span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
</main>

