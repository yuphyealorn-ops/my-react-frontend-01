import { useState } from "react";

export default function TestApi() {
 const API_URL = import.meta.env.VITE_API_URL;
 const [data, setData] = useState(null);
 const [error, setError] = useState("");

 async function onTest() {
  setError("");
  setData(null);

  try {
   const result = await fetch(`${API_URL}/api/user/profile`, {
    credentials: "include"
   });

   const json = await result.json();

   if (result.status !== 200) {
    setError(JSON.stringify(json));
    return;
   }

   setData(json);
  } catch (err) {
   setError(err.toString());
  }
 }

 return (
  <div>
   <h3>Test API</h3>
   <button onClick={onTest}>Call /api/user/profile</button>
   {error && <pre>{error}</pre>}
   {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
  </div>
 );
}
