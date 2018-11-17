/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {
	log('in startSystem')
	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		console.log('statusJsonNotFound!')
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
	log('in getSystem')
	const status = fs.readFileSync('status.json');
	const retStatus = JSON.parse(status);
	const updated_retStatus = updateSystemStatus();
	//const updated_status = fs.readFileSync('status.json');
	//const updated_retStatus = JSON.parse(updated_status);
	return updated_retStatus;
}

/*********/

const getCurrentSystemStatus = () =>{
	const status = fs.readFileSync('status.json');
	return JSON.parse(status);
}

/* Helper functions to save JSON */
const updateSystemStatus = () => {
	log('in UpdateSystem')
	const status = getCurrentSystemStatus();
	/* Add your code below */
	const restaurants = getAllRestaurants();
	const numRestaurants = restaurants.length;
	const reservations = getAllReservations();
	const numReservations = reservations.length;

	let dict = [];
	restaurants.map(
		function(restaurant){
			dict[restaurant.numReservations] = restaurant;
		}
	)
	const keys = Object.keys(dict);
	const sorted_keys = keys.sort(function(a,b){
		return a - b;
	})
	const busiestRestaurant = dict[sorted_keys[sorted_keys.length - 1]].name;
	console.log('status!')
	console.log(status);

	const new_status = {
		numRestaurants: numRestaurants,
		totalReservations: numReservations,
		currentBusiestRestaurantName: busiestRestaurant,
		systemStartTime: status.systemStartTime,
	}
	console.log(new_status);
	fs.writeFileSync('status.json', JSON.stringify(new_status))
	return new_status;
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
	const ifExisted = restaurants.filter(restaurant => restaurant.name ===name);
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
			if (restaurant.name === reservation.restaurant){
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
	const restaurant_filtered = restaurants.filter(restaurant => restaurant.name === name);
	
	return restaurant_filtered;
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
	const reservations_filtered = reservations.filter(reservation => reservation.restaurant ===name);
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
	
	let checkedOffReservation = null;
	const reservationsFromName = getAllReservationsForRestaurant(restaurantName);
	//I know it's a little bit ridiculous, but map is a sync function 
	//and I don't wanna use for.
	//1 map all dates
	let dict = {};
	const printAllResv = reservationsFromName.map(
		function(reservation){
			dict[reservation.time] = reservation;
		}
	)
	//2 finded the earliest

	const keys = Object.keys(dict);
	//Is this the earliest? Check later!
	const sorted_keys = keys.sort(function(a,b){
		return Date.parse(a) > Date.parse(b);
	})

	//3 find who has this time and remove
	//Save to reservations
	checkedOffReservation = dict[sorted_keys[0]];
	const reservations = getAllReservations();
	const reservationsToKeep = reservations.filter(reservation => (reservation.restaurant !== restaurantName) || (reservation.time !== sorted_keys[0]));
	saveReservationsToJSONFile(reservationsToKeep);

	//Update to restaurants
	const restaurants = getAllRestaurants();
	let updated_restaurants = [];
	const printAllRest = restaurants.map(
		function(restaurant){
			if (restaurant !== undefined){
				let newRest = restaurant;
				if (restaurant.name === checkedOffReservation.restaurant){
					newRest.numReservations -= 1;
				}
				updated_restaurants.push(newRest);
			}
		}
	);
	saveRestaurantsToJSONFile(updated_restaurants);

 	return checkedOffReservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use array.map()
	const reservations = getAllReservations();
	const reservationsForRestaurant = getAllReservationsForRestaurant(restaurant);
	let newReservations = [];
	let retReservations = [];
	reservations.map(
		function(reservation){
			if (reservation.restaurant === restaurant){
				const currDate = new Date(reservation.time);
				const delayedDate = new Date(currDate.getTime() + minutes * 60 * 1000);
				reservation.time = delayedDate;
				retReservations.push(reservation);
			}
			newReservations.push(reservation);
		}
	)
	saveReservationsToJSONFile(newReservations);
	return retReservations;
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
