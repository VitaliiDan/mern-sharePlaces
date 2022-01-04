import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
	const USERS = [
		{
			id: 'u1',
			name: 'Elon Musk',
			image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQU2JRbbl3LBOm_an3eI5iplFhOoLESyBwUfmWDO49BS1EYuGUE',
			places: 3
		},
	];
	
	return <UsersList items={USERS}/>;
};

export default Users;
