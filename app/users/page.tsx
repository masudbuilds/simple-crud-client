import React from 'react';

// interface User {
//   name: string,
//   email: string,
// }
const UsersPage = async() => {
  const res = await fetch(`http://localhost:5000/users`);
  const users = await res.json();
  return (
    <div>
      <h1>
        Users Page
      </h1>
      <p>
        Total Users: {users.length}
      </p>
    </div>
  );
};

export default UsersPage;