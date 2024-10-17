"use strict"; // Applies strict mode globally

// Function for toggling dark mode
function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

// Tabs JQuery UI Widget
$( function() {
  $( "#tabs" ).tabs();
} );

// Menu Bar JQuery UI Widget
$( function() {
  $( "#menu" ).menu();
} );

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
  
  // Validation of form inputs
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

// Search form conditions

var geocoder;
var waitingForLocation = false;
$(document).ready(function(){
    geocoder=new google.maps.Geocoder();
    $('#address').on('change textInput input',function(){
        $('#search-lat').val('');
        $('#search-lng').val('');
    });
    $('#form').on('submit',function(e){
        if(!doSearch()){
            e.preventDefault();initiateFindingLocation();
    }});
});

function doSearch(){
    let lat=$('#search-lat').val();
    let lng=$('#search-lng').val();
    if(lat.length<=0||lng.length<=0)return false;
    $('#search-menu').remove();
    $('#search-cf').remove();
    $('#search-dedicated').remove();
    $('#search-local').remove();
    let chainsOption=$('#chains-option').val();
    let gfOption=$('#gf-option').val();
    let maxDistanceEl=$('#max-distance');
    let maxDistance=maxDistanceEl.length?maxDistanceEl.val():'';
    let menu=gfOption=='menu';
    let celiacFriendly=gfOption=='cf';
    let dedicated=gfOption=='dedicated';
    let local=chainsOption=='local';
    let form=$('#form');
    if(menu){
        $('<input>').attr({type:'hidden',id:'search-menu',name:'menu',value:'t'}).appendTo(form);
    }
    if(celiacFriendly){
        $('<input>').attr({type:'hidden',id:'search-cf',name:'cf',value:'t'}).appendTo(form);
    }
    if(dedicated){
        $('<input>').attr({type:'hidden',id:'search-dedicated',name:'dedicated',value:'t'}).appendTo(form);
    }
    if(local){
        $('<input>').attr({type:'hidden',id:'search-local',name:'local',value:'t'}).appendTo(form);
    }
    if(maxDistance.length>0){
        $('<input>').attr({type:'hidden',id:'search-md',name:'md',value:maxDistance}).appendTo(form);
    }
    return true;
}

function initiateFindingLocation(){
    let loader=$('<div></div>').addClass('loader');
    $('#loader-container').append(loader);
    let address=$('#address').val();
    if(address.length>0){
        geocoder.geocode({'address':address},function(results,status){
            if(status==google.maps.GeocoderStatus.OK){
                var result=results[0];
                var loc=result.geometry.location;
                $('#search-address').val(result.formatted_address);
                updateLatLngAndSearch(loc.lat(),loc.lng());
                return false;
            }else{
                $('#loader-container').html('');alert("Unable to find: "+address);
            }});
        }else{
            if(navigator.geolocation){
                waitingForLocation=true;
                navigator.geolocation.getCurrentPosition(advancedPositionUpdate,advancedPositionError);
            }else{$('#loader-container').html('');
            alert('Current location is not supported. Please enter a city or address.');}
    }
}
function updateLatLngAndSearch(lat,lng){
    $('#search-lat').val(lat);$('#search-lng').val(lng);$('#form').submit();
}
function advancedPositionError(error){
    $('#loader-container').html('');console.log(error);
    alert("Unable to find current location. Please enter a city or address.");
}
function advancedPositionUpdate(position){
    if(waitingForLocation){
        waitingForLocation=false;
        let lat=position.coords.latitude;
        let lng=position.coords.longitude;updateLatLngAndSearch(lat,lng);
    }
}

// Google Maps API
// async function init() {
//   await customElements.whenDefined('gmp-map');

//   const map = document.querySelector('gmp-map');
//   const marker = document.querySelector('gmp-advanced-marker');
//   const placePicker = document.querySelector('gmpx-place-picker');
//   const infowindow = new google.maps.InfoWindow();

//   map.innerMap.setOptions({
//     mapTypeControl: false
//   });

//   placePicker.addEventListener('gmpx-placechange', () => {
//     const place = placePicker.value;

//     if (!place.location) {
//       window.alert(
//         "No details available for input: '" + place.name + "'"
//       );
//       infowindow.close();
//       marker.position = null;
//       return;
//     }

//     if (place.viewport) {
//       map.innerMap.fitBounds(place.viewport);
//     } else {
//       map.center = place.location;
//       map.zoom = 17;
//     }

//     marker.position = place.location;
//     infowindow.setContent(
//       `<strong>${place.displayName}</strong><br>
//        <span>${place.formattedAddress}</span>
//     `);
//     infowindow.open(map.innerMap, marker);
//   });
// }

// Event Listeners
document.getElementById("newMessage").addEventListener("submit", validateForm);
// document.addEventListener('DOMContentLoaded', init);