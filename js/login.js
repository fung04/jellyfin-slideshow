if (localStorage.getItem("base-url") && localStorage.getItem("api-key")) {
    // Redirect to the main page
    window.location.href = "slideshow_swiper.html";
}


document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const baseUrl = document.getElementById("base-url").value.trim();
    const apiKey = document.getElementById("api-key").value.trim();

    // Save the values to local storage
    localStorage.setItem("base-url", baseUrl);
    localStorage.setItem("api-key", apiKey);
    
    // Redirect to the main page or perform additional actions
    window.location.href = "slideshow_swiper.html";
  });