// CreateUserForm.js
import React, { useState } from 'react';
import { postData } from '../../RestAPIs/Apis';

const CreateUserForm = () => {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //calling rest api hosted on express server
        postData("http://localhost:8000/createUser", userData).then(rs=>{
            console.log(rs);
        });
        console.log(userData);
    };

    return (
        <div>
            <h2>Create User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required={false}
                    />
                </div>
                <div>
                    <button type="submit">Create User</button>
                </div>
            </form>
        </div>
    );
};

export default CreateUserForm;
