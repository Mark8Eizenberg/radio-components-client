import React, { useEffect, useState } from 'react'

export default function UserPicker({ calbackToSetUser }) {
    const [usersList, setUsersList] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (usersList == null) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + localStorage.token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("/api/users", requestOptions)
                .then(response => response.json())
                .then(result => setUsersList(result))
                .catch(error => console.log('error', error));
        } else if (user == null) {
            setUser(usersList[0].id)
        }

        if (typeof (calbackToSetUser) === 'function') {
            calbackToSetUser(user);
        }
    }, [user, usersList, setUser, calbackToSetUser]);

    return <>
        <select onChange={(e) => { setUser(e.target.value) }}>
            {usersList && usersList.map((user) => <option key={user.id} value={user.id}>{user.fullName}</option>)}
        </select>
    </>

}