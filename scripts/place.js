document.addEventListener('DOMContentLoaded', () => {
    // Footer
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    const lastModified = document.lastModified;
    document.getElementById('last-modified').textContent = lastModified;

    // Weather
    const temperature = 5; // Static value for demonstration
    const windSpeed = 5; // Static value

    document.getElementById('temperature').textContent = temperature;
    document.getElementById('wind-speed').textContent = windSpeed;

    function calculateWindChill(temp, speed) {
        if (temp <= 10 && speed > 4.8) {
            return (13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16)).toFixed(1);
        } else {
            return 'N/A';
        }
    }

    const windChill = calculateWindChill(temperature, windSpeed);
    document.getElementById('wind-chill').textContent = windChill;
});
