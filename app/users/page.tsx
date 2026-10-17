import UsersCard from '@/components/Cards/UsersCard';

interface User {
  _id: string;
  name: string
  email: string
}
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
      <div className='grid grid-cols-3 mt-4'>
        {
          users.map((user: User) => <UsersCard key={user._id} user={user}/>)
        }
      </div>
    </div>
  );
};

export default UsersPage;