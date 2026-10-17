interface User {
  userId: string,
  name: string
  email: string
}

const UserDetailPage = async({params}: {params: User}) => {

  const {userId} = await params;
  const res = await fetch(
    `http://localhost:5000/users/${userId}`
  )
  const user = await res.json();
  return (
    <div className="p-4">
      <h2>User ID: {userId}</h2>
      <h2>Name: {user.name}</h2>
      <h2>Email: {user.email}</h2>
    </div>
  );
};

export default UserDetailPage;