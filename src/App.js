import { useEffect, useState } from "react";
import "./App.css";
import {
  auth,
  db,
  loginWithEmailAndPassword,
  logInWithGoogle,
  logout,
  registerWithEmailAndPassword,
} from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [displayName, setDisplayName] = useState("");

  const fetchName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = await doc.docs[0].data();
      setDisplayName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured!");
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchName();
  }, [user]);

  return (
    <div className="app">
      <div className="container">
        {user ? (
          <>
            <div className="container_title">{displayName}</div>
            <button onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <>
            <div className="container_title">Login or Signup</div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => loginWithEmailAndPassword(email, password)}>
              Login
            </button>
            <button
              onClick={() =>
                registerWithEmailAndPassword(name, email, password)
              }
            >
              Signup
            </button>
            <button onClick={() => logInWithGoogle()}>
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
