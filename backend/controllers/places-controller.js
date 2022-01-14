const {v4: uuidv4} = require('uuid');
const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
let DUMMY_PLACES = [
	{
		id: 'p1',
		title: 'Empire State Building',
		description: 'One of the most famous sky scrapers on the world',
		imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
		address: '20 W 34th St, New York, NY 10001, United States',
		location: {
			lat: 40.7484405,
			lng: -73.9878584,
		},
		creator: 'u1',
	},
	{
		id: 'p2',
		title: 'Eiffel Tower',
		description: 'One of the most famous tower',
		imageUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.posters.pl%2Fplakaty%2Feiffel-tower-v16734&psig=AOvVaw0W5qWTVICCIOZmX3ZVMy8J&ust=1642169267302000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCODG0rDzrvUCFQAAAAAdAAAAABAI',
		address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
		location: {
			lat: 48.8583701,
			lng: 2.2922873,
		},
		creator: 'u2',
	},
	{
		id: 'p3',
		title: 'Colosseum',
		description: 'One of the most antique arena',
		imageUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.planetware.com%2Frome%2Fcolosseum-i-la-rcl.htm&psig=AOvVaw2KTzKVc620LbTTPFJiYfkh&ust=1642171354181000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCLis9pX7rvUCFQAAAAAdAAAAABAD',
		address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
		location: {
			lat: 41.8902102,
			lng: 12.4900369,
		},
		creator: 'u2',
	},
];

const getPlaceById = (req, res, next) => {
	const placeId = req.params.pid
	const place = DUMMY_PLACES.find(place => place.id === placeId)
	
	if (!place) {
		throw new HttpError('Could not find a place for the provided id.', 404)
	}
	res.json({place});
	
}

const getPlacesByUserId = (req, res, next) => {
	const userId = req.params.uid
	const isUser = DUMMY_PLACES.find(place => place.creator === userId)
	const userPlaces = DUMMY_PLACES.filter(place => place.creator === userId)
	if (!isUser) {
		next(new HttpError('Could not find a user with provided id.', 404))
	} else {
		res.json({userPlaces});
	}
}

const createPlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422))
	}
	
	const {title, description, imageUrl, address, creator} = req.body;
	
	let coordinates;
	
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error)
	}
	
	const createdPlace = {
		id: uuidv4(),
		title,
		description,
		imageUrl,
		address,
		creator,
		location: coordinates,
	}
	
	DUMMY_PLACES.push(createdPlace);
	
	res.status(201).json({place: createdPlace})
}

const updatePlaceById = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new HttpError('Invalid inputs passed, please check your data.', 422);
	}
	
	const {title, description} = req.body;
	const placeId = req.params.pid;
	
	const updatedPlace = {...DUMMY_PLACES.find(place => place.id === placeId)}
	const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId)
	updatedPlace.title = title;
	updatedPlace.description = description;
	
	DUMMY_PLACES[placeIndex] = updatedPlace;
	
	res.status(200).json({place: updatedPlace});
}

const deletePlaceById = (req, res, next) => {
	const placeId = req.params.pid;
	if (!DUMMY_PLACES.find(place => place.id === placeId)) {
		throw new HttpError('Could not find a place for that id.', 404)
	}
	DUMMY_PLACES = [...DUMMY_PLACES.filter(place => place.id !== placeId)];
	res.status(200).json({message: 'Deleted place'})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;