"use strict"; // Applies strict mode globally

// Function for toggling dark mode
function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

// Form validation
function validateForm(event){
  // Prevents default form submission
  event.preventDefault();
  
  // My inputs
  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let email = document.getElementById("myEmail");
  let phone = document.getElementById("myPhone");
  let fieldset = document.querySelector("fieldset");
  
  // Displays a message if no comment is entered
  let message = document.getElementById("messageError");
  
  // Containers for display to user
  let confirm = document.getElementById("confirm");
  confirm.classList.add("hidden");
  
  // regular expressions pulled from regexr.com
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
  let phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s-]\d{3}[\s-]\d{4}$/;
  
  // Reset the border styles on the inputs
  firstName.classList.remove("error");
  lastName.classList.remove("error");
  email.classList.remove("error");
  phone.classList.remove("error");
  
  // Hides any previous error messages/empty output containers
  firstName.nextElementSibling.classList.add("hidden");
  lastName.nextElementSibling.classList.add("hidden");
  email.nextElementSibling.classList.add("hidden");
  phone.nextElementSibling.classList.add("hidden");
  message.classList.add("hidden");
  confirm.innerHTML = "";
  
  // String to build output error list
  let errors = "<ul>";
  let isValid = true;
  
  // validation of inputs
  if(!(emailRegex.test(email.value))){
    // Changes boolean flag because the form is not valid
    isValid = false;
    // Adds error class to input
    email.classList.add("error");
    // Displays error message for user about this input
    email.nextElementSibling.classList.remove("hidden");
    errors += "<li>Please enter a valid email address</li>";
  }
  if(!(phoneRegex.test(phone.value))){
      // Changes boolean flag because the form is not valid
      isValid = false;
      // Adds error class to input
      phone.classList.add("error");
      // Displays error message for user about this input
      phone.nextElementSibling.classList.remove("hidden");
      errors += "<li>Please enter a valid phone number</li>";
    }
    
    // If valid, the form is submitted after displaying user info and clearing the form for new input
    if(isValid){
      // Removes the hidden class from the output paragraph
      confirm.classList.remove("hidden");
      
      // Displays the user's input to them in the paragraph for output
      confirm.innerHTML = "<strong>You Entered:</strong><br>Full Name: " + firstName.value + lastName.value + "<br>Email: " + email.value + "<br>Phone Number: " + phone.value;
      
      // Code that submits to the server 
      document.getElementById("newMessage").submit();
  
      // Reset values of inputs/clear them out
      firstName.value = "";
      lastName.value = "";
      phone.value = "";
      email.checked = true;
      phone.checked = false;
  
      // Hides any error messages
      firstName.nextElementSibling.classList.add("hidden");
      email.nextElementSibling.classList.add("hidden");
      phone.nextElementSibling.classList.add("hidden");
    }
}

// Event listeners; gets HTML collection of all the buttons for adding to the cart
let productButtons = document.getElementsByClassName('product-button');
for (let b = 0; b < productButtons.length; b++) {
  //console.log(productButtons[b]);
  productButtons[b].addEventListener("click", addProduct);
}

// Have 1 event handler function that knows which product button was clicked.
function addProduct(e) {
  console.log(e);
  if (e.target.id == 'product1') {
    console.log('Add 13.00 to total');
    totalCart += 13.00;
  }
}

// Weather API
function getWeather(lat, long){
  // Section for the output to display
	let weatherSection = document.getElementById("weather");
	
	let output = "";
	// Clears out any previous output
	weatherSection.innerHTML = "";

	// Variables needed for the API call and displaying the returned data
	let apiKey = "2672eeff80c837aa062d5971c52a2f0a";
	let imgUrlStart = "http://openweathermap.org/img/wn/";
	let imgUrlEnd = "@2x.png";
	let endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
  
	let xhr = new XMLHttpRequest();
	
	// add an event listener for the load event on the object
	xhr.addEventListener("load", function(){
    // Displays the weather for a successful response
    if(this.status == 200){
      let ms = this.response.dt * 1000;
      let date = new Date(ms);
      
      ms = this.response.sys.sunrise * 1000;
      let rise = new Date(ms);
      
      ms = this.response.sys.sunset * 1000;
      let set = new Date(ms);

	// Builds the URL for the weather icon/image
	let iconCode = this.response.weather[0].icon;
	let iconUrl = `${imgUrlStart}${iconCode}${imgUrlEnd}`;
	
	// Appends to the output string
	output += `<h4>Today's Weather for ${this.response.name}</h4>
	<img src="${iconUrl}" alt="${this.response.weather[0].main}">
	<dl>
	<dt>Current Conditions:</dt>
	<dd>${this.response.weather[0].description}</dd>
	<dt>Current Temp:</dt>
	<dd>${Math.round(this.response.main.temp)}&deg;</dd>
	<dt>Local Max Temp:</dt>
	<dd>${Math.round(this.response.main.temp_max)}&deg;</dd>
	<dt>Local Min Temp:</dt>
	<dd>${Math.round(this.response.main.temp_max)}&deg;</dd>
	<dt>Sunrise:</dt>
	<dd>${new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'medium' }).format(rise)}</dd>
	<dt>Sunset:</dt>
	<dd>${new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'medium' }).format(set)}</dd>
	</dl>`;
	// remove the class from the section that has been keeping it hidden on the page
	weatherSection.classList.remove("hidden");
	// add the class to make it display
	weatherSection.classList.add("display");
	// add the output string to that section to display our weather data from the API
	weatherSection.innerHTML = output;
}else{
	// displays an error message incase we get a 401 error response from the server
	weatherSection.innerHTML = "There was an issue with your call to the Open Weather API. Check the endopint and try again.";
}
});
	// set the expected response type
	xhr.responseType = "json";
	
	// open a connection to the endpoint of the correct type
	xhr.open("GET", endpoint);
	
	// send the request to the server
	xhr.send();
}

// this function will get the user's geolocation on button click, and once it has that, it will call the function with the call to the API
// If it is unable to get the geolocation info, an error message will be displayed and the API will not be called
function getLocation(e){
	// preventDefault form submission
	e.preventDefault();

	//get user's geolocation to use to return weather for that location

	//user will have to agree to allow this access, may need to use Firefox
	if(!navigator.geolocation) {
		document.getElementById("weather").textContent = 'Geolocation is not supported by your browser';
	} else {
		navigator.geolocation.getCurrentPosition(success);
		function success(location){
			getWeather(location.coords.latitude, location.coords.longitude);
			console.log(location);
		}
	}
}

// Event listeners
document.getElementById("newMessage").addEventListener("submit", validateForm);
document.getElementById("myWeatherSubmit").addEventListener("click", getLocation);