import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserDetail() {
 const API_URL = import.meta.env.VITE_API_URL;
 const { id } = useParams();

 const usernameRef = useRef();
 const emailRef = useRef();
 const firstnameRef = useRef();
 const lastnameRef = useRef();
 const statusRef = useRef();

 const [error, setError] = useState("");
 const [ok, setOk] = useState(false);

 async function loadUser() {
  setError("");
  setOk(false);

  try {
   const result = await fetch(`${API_URL}/api/user/${id}`, {
    credentials: "include"
   });
   const data = await result.json();

   if (result.status !== 200) {
    setError(JSON.stringify(data));
    return;
   }

   usernameRef.current.value = data.username ?? "";
   emailRef.current.value = data.email ?? "";
   firstnameRef.current.value = data.firstname ?? "";
   lastnameRef.current.value = data.lastname ?? "";
   statusRef.current.value = data.status ?? "ACTIVE";
  } catch (err) {
   setError(err.toString());
  }
 }

 async function onUpdate() {
  setError("");
  setOk(false);

  const body = {
   username: usernameRef.current.value,
   email: emailRef.current.value,
   firstname: firstnameRef.current.value,
   lastname: lastnameRef.current.value,
   status: statusRef.current.value
  };

  try {
   const result = await fetch(`${API_URL}/api/user/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
     "Content-Type": "application/json"
    },
    credentials: "include"
   });

   const data = await result.json();

   if (result.status !== 200) {
    setError(JSON.stringify(data));
    return;
   }

   setOk(true);
   loadUser();
  } catch (err) {
   setError(err.toString());
  }
 }

 useEffect(() => {
  loadUser();
 }, []);

 return (
  <div>
   <h3>Edit User</h3>
   {error && <pre>{error}</pre>}
   {ok && <div>Update OK</div>}

   <table>
    <tbody>
     <tr>
      <th>Username</th>
      <td><input type="text" ref={usernameRef} /></td>
     </tr>
     <tr>
      <th>Email</th>
      <td><input type="text" ref={emailRef} /></td>
     </tr>
     <tr>
      <th>First Name</th>
      <td><input type="text" ref={firstnameRef} /></td>
     </tr>
     <tr>
      <th>Last Name</th>
      <td><input type="text" ref={lastnameRef} /></td>
     </tr>
     <tr>
      <th>Status</th>
      <td>
       <select ref={statusRef}>
        <option>ACTIVE</option>
        <option>SUSPENDED</option>
        <option>DELETED</option>
       </select>
      </td>
     </tr>
    </tbody>
   </table>

   <button onClick={onUpdate}>Update</button>
  </div>
 );
}
