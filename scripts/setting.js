// scripts/settings.js

document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.getElementById("settings-form");
    const searchRadiusInput = document.getElementById("search-radius");

    // Ensure the default value is 10 km
    if (searchRadiusInput) {
        searchRadiusInput.value = 10; 
    }

    // Handle form submission
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const newRadius = searchRadiusInput.value;

            // Simple validation
            if (newRadius === "" || parseFloat(newRadius) <= 0) {
                alert("Please enter a valid search radius greater than 0.");
                return;
            }

            // Client-side confirmation demonstrating the feature
            alert(`Settings saved! The search radius is set to ${newRadius} km. (This setting is used for interface demonstration.)`);
            
            console.log("Admin attempted to set radius to:", newRadius + " km");
        });
    }
});