document.addEventListener('DOMContentLoaded', function () {
    // Number of raindrops
    var numRaindrops = 25;

    // Create a container for the raindrops
    var rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    document.body.appendChild(rainContainer);

    // Create and append raindrops to the container
    for (var i = 0; i < numRaindrops; i++) {
        var raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = Math.random() * 100 + 'vw'; // Random horizontal position
        raindrop.style.animationDuration = (Math.random() * 2 + 1) + 's'; // Random animation duration
        rainContainer.appendChild(raindrop);
    }
});
