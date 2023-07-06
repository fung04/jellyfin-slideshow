document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const baseUrl = document.getElementById("base-url").value.trim();
    const apiKey = document.getElementById("api-key").value.trim();
  
    // Set the values in jellyfin_api.js
    ApiConstant.baseUrl = baseUrl;
    ApiConstant.apiKey = apiKey;
    
    // Redirect to the main page or perform additional actions
    window.location.href = "slidesshow_swiper.html";
  });