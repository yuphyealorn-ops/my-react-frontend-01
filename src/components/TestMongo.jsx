import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TestMongo() {
 const API_URL = import.meta.env.VITE_API_URL;
 const [users, setUsers] = useState([]);
 const [error, setError] = useState("");

 async function loadUsers() {
  setError("");
  try {
   const response = await fetch(`${API_URL}/api/user/list`, {
    credentials: "include"
   });
   const data = await response.json();

   if (response.status !== 200) {
    setError(JSON.stringify(data));
    return;
   }

   setUsers(data);
  } catch (err) {
   setError(err.toString());
  }
 }

 async function onDelete(id) {
  setError("");
  try {
   const response = await fetch(`${API_URL}/api/user/${id}`, {
    method: "DELETE",
    credentials: "include"
   });

   const data = await response.json();

   if (response.status !== 200) {
    setError(JSON.stringify(data));
    return;
   }

   loadUsers();
  } catch (err) {
   setError(err.toString());
  }
 }

 useEffect(() => {
  loadUsers();
 }, []);

 return (
  <div>
   <h3>User Management (TestMongo)</h3>

   <button onClick={loadUsers}>Reload</button>
   {error && <pre>{error}</pre>}

   <table border="1" cellPadding="8">
    <thead>
     <tr>
      <th>ID</th>
      <th>Username</th>
      <th>Email</th>
      <th>First</th>
      <th>Last</th>
      <th>Status</th>
      <th>Action</th>
     </tr>
    </thead>
    <tbody>
     {users.map((u) => (
      <tr key={u._id}>
       <td>{u._id}</td>
       <td>{u.username}</td>
       <td>{u.email}</td>
       <td>{u.firstname}</td>
       <td>{u.lastname}</td>
       <td>{u.status}</td>
       <td>
        <Link to={`/user/${u._id}`}>Edit</Link>{" "}
        <button onClick={() => onDelete(u._id)}>Delete</button>
       </td>
      </tr>
     ))}
    </tbody>
   </table>
  </div>
 );
}
