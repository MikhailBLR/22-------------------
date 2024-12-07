"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");


class Workout{
  date =  new Date();
  id = (Date.now()+'').slice(-10);
  constructor(coords, distance,duration){
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout{
  constructor(coords, distance,duration,cadence){
    super(coords, distance,duration);
    this.cadence = cadence;
    this.calcPace()
  }
  calcPace(){
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout{
  constructor(coords, distance,duration,elevation){
    super(coords, distance,duration);
    this.elevation = elevation;
  }
  calcSpeed(){
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App{
  _workouts = []
  _map;
  _mapEvet;

  constructor(){
    this._getPosition()
    form.addEventListener('submit', this._newWorkout.bind(this))
    inputType.addEventListener('change', this._toogleField)
  }
  //providing location
  _getPosition(){
    if(navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
      function() {
        alert('no Way!');
      })



  }
  
  _loadMap(position){
    
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude,longitude]
    this._map = L.map('map').setView(coords,13);  
    
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);
    
    this._map.on('click',this._showForm.bind(this));
  }
      
  _showForm(mapE){

    this._mapEvent = mapE
    form.classList.remove('hidden');
    inputDistance.focus();

  }

  _toogleField(){

    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')

  }

  _newWorkout(e){
      e.preventDefault();

      // checking inputs
      const validInputs = (...inputs) => inputs.every(inpt => Number.isFinite(inpt))
      const validPositive = (...inputs) => inputs.every( input => input > 0);
     
      //input value

      const type = inputType.value;
      const distance = +inputDistance.value;
      const duration = +inputDuration.value;
      const {lat, lng } = this._mapEvent.latlng;
      let workout;


      // what kind type
      if(type === 'running'){
        const cadence = +inputCadence.value;
        if(!validInputs(distance,duration,cadence) ||!validPositive(distance,duration,cadence)){
          return alert('Need Number')
        }
        // create train
        workout = new Running ([lat,lng], distance,duration,cadence);
      }

      if(type === 'cycling'){
        const elevation = +inputElevation.value;
        if(!validInputs(distance,duration,elevation) || !validPositive(distance,duration,)){
          return alert('Need Number')
          
        }
        
        workout = new Cycling ([lat,lng], distance,duration,elevation);
      }
      //app training
      this._workouts.push(workout);
      console.log(this._workouts)

      L.marker([lat,lng]).addTo(this._map).bindPopup(L.popup({
        maxWidth: 250,
        minWidth: 100,
        // autoClose: false,
        closeOnClick: false, 
        className: 'mark-popup',
      })
    )
    .setPopupContent("training")
    .openPopup();

    // reset inputs
    inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = "";

  }

}

const app = new App()

