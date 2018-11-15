/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

const getSystemStatus = () => {
	const status = fs.readFileSync('status.json')
	return JSON.parse(status)
}

/*********/

/* Helper functions to save JSON */
const updateSystemStatus = () => {
	const status = {}
	
	/* Add your code below */

	fs.writeFileSync('status.json', JSON.stringify(status))
}

const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */
	fs.writeFileSync('restaurants.json', JSON.stringify(restaurants));
};

const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */
	fs.writeFileSync('reservations.json', JSON.stringify(reservations));

};

/*********/

// Should return an array
const addRestaurant = (name, description) => {
	// Check for duplicate names
	const restaurants = getAllRestaurants();
	const ifExisted = restaurants.filter(restaurant => restaurant.name == name);
	if (ifExisted.length > 0){
		return [];
	}
	

	// if no duplicate names:
	let restaurant = null;
	restaurant = {'name':name, 'description':description, 'numReservations':0};
	restaurants.push(restaurant);
	saveRestaurantsToJSONFile(restaurants);
	return [restaurant];

}

const addReservation = (restaurant, time, people) => {
	
	/* Add your code below */
	let reservation = null;
	const reservationDate = new Date(time+" GMT");
	reservation = {'restaurant':restaurant, 'time':reservationDate, 'people':people};
	
	//Save to reservations
	let reservations = getAllReservations();
	reservations.push(reservation);
	saveReservationsToJSONFile(reservations);

	//Update to restaurants
	const restaurants = getAllRestaurants();
	let updated_restaurants = [];
	const printAllRest = restaurants.map(
		function(restaurant){
			let newRest = restaurant;
			if (restaurant.name == reservation.restaurant){
				newRest.numReservations += 1;
			}
			updated_restaurants.push(newRest);
		}
	);
	saveRestaurantsToJSONFile(restaurants);
	return reservation;

}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	try {
		const restaurantsFromFile = fs.readFileSync('restaurants.json')
		return JSON.parse(restaurantsFromFile)
	} catch(e) {
		return [];
	}
};


const getRestaurtantByName = (name) => {
	/*Return The restaurant with this name. 
	As I assume there is only one restaurant with one name. */
	/* Add your code below */
	const restaurants = getAllRestaurants();
	restaurants.filter(restaurant => restaurant.name == name);
	return restaurants[0];
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  	/* Add your code below */
  	try {
		const reservationsFromFile = fs.readFileSync('reservations.json')
		return JSON.parse(reservationsFromFile)
	} catch(e) {
		return [];
	}
};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
	const reservations = getAllReservations();
	const reservations_filtered = reservations.filter(reservation => reservation.restaurant == name);
	return reservations_filtered;
};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
	time += ' GMT';
	//I don't know why to add GMT instead of EST... Just do it.
	const startTime = new Date(time);
	let endTime = new Date(time);
	endTime.setTime(startTime.getTime() + (60*60*1000));
	
	const reservations = getAllReservations();
	const reservations_filtered = reservations.filter(function(reservation){
		const reservationTime = new Date(reservation.time);
		return (reservationTime < endTime) && (reservationTime > startTime);
	});
	
	return reservations_filtered;
}


const checkOffEarliestReservation = (restaurantName) => {
	
	const checkedOffReservation = null;
 	return checkedOffReservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use array.map()
	
}

const timeStringTranslate = (timestring) => {
	/*Translate timestring
	from: 2018-11-17T17:15:00.000Z
	to Nov. 17 2018, 5:15 p.m. 
	const d = new Date(timestring);

	datetime.format(d,'MMM. DD YYYY, HH:MM A');

	*/
	const d = new Date(timestring);
	return datetime.format(d,'MMM. DD YYYY, h:mm A',true);
}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurtantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations,
	timeStringTranslate
}
