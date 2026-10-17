import UsersCard from '@/components/Cards/UsersCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
      <h1>Users Page</h1>
      <p>Total Users: {users.length}</p>
      <Link href={"/users/new"}>
        <Button>Add New User</Button>
      </Link>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {users.map((user: User) => (
          <UsersCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  )
};

export default UsersPage;