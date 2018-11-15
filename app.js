/* E3 app.js */
'use strict';

const log = console.log
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');

const yargs_argv = yargs.argv
//log(yargs_argv) // uncomment to see what is in the argument array

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1]);	
	if (rest.length > 0) {
		/* complete */ 

		log("Added restaurant " + rest[0].name +'.')

	} else {
		/* complete */ 
		//When duplicated.
		log("Duplicate restaurant not added.");
	}
}

if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);

	// Produce output below
	const reservationDate = new Date(args[1] + " GMT");
	console.log(reservationDate)
	log('Added reservation at ' + args[0] + " on " 
	+ reservations.timeStringTranslate(reservationDate) + ' for ' + args[2] + " people.");

}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array

	// Produce output below
	const printAllRest = restaurants.map(
		function(restaurant){
			log(restaurant.name + ': ' + restaurant.description + ' - ' + String(restaurant.numReservations) + ' active reservations')
		}
	);
}

if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurtantByName(yargs_argv['restInfo']);

	// Produce output below
	log(restaurants.name + ': ' + restaurants.description + ' - ' + String(restaurants.numReservations) + ' active reservations')

}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	
	// Produce output below
	const printAllResv = reservationsForRestaurant.map(
		function(reservation){
			log(reservations.timeStringTranslate(reservation.time) + ', table for ' + reservation.people);
		}
	);
}

if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary
	
	// Produce output below
	const printAllResv = reservationsForRestaurant.map(
		function(reservation){
			log(reservation.restaurant + ": " + reservations.timeStringTranslate(reservation.time) + ', table for ' + reservation.people);
		}
	)
}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarlistReservation(restaurantName); 
	
	// Produce output below
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	

	// Produce output below
	
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()

	// Produce output below
}

