import "./App.css";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { LogtoProvider } from "@logto/react";
import { useLogto } from "@logto/react";
import { useHandleSignInCallback } from "@logto/react";

const config = {
  endpoint: "http://localhost:3001", // E.g. http://localhost:3001
  appId: "kipc6uq59qav3wy7ibdfk",
  resources: ["http://localhost:3000"],
};

const SignIn = () => {
  const { signIn, isAuthenticated } = useLogto();

  if (isAuthenticated) {
    return <div>Signed in</div>;
  }

  return (
    <button onClick={() => signIn("http://localhost:3003/callback")}>
      Sign In
    </button>
  );
};

const SignOut = () => {
  const { signOut } = useLogto();

  return (
    <button onClick={() => signOut("http://localhost:3003")}>Sign out</button>
  );
};

const Home = () => {
  const { getAccessToken, isAuthenticated } = useLogto();
  const [data, setData] = useState("");

  const fetchData = async (accessToken) => {
    const response = await fetch("http://localhost:3000/api/products", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      setData(await response.text());
    } else {
      setData("Unauthorized");
    }
  };

  useEffect(() => {
    async function getApiToken() {
      // if (isAuthenticated) {
      const accessToken = await getAccessToken("http://localhost:3000");

      await fetchData(accessToken);
      // } else {
      //   console.log("Not authenticated");
      // }
    }
    getApiToken();
  }, [isAuthenticated, getAccessToken]);

  return (
    <div>
      {data}
      <SignIn />
      <SignOut />
    </div>
  );
};

const Callback = () => {
  const navigate = useNavigate();

  const { isLoading } = useHandleSignInCallback(() => {
    // Navigate to root path when finished
    navigate("/");
  });

  // When it's working in progress
  if (isLoading) {
    return <div>Redirecting...</div>;
  }
};

function App() {
  return (
    <BrowserRouter>
      <LogtoProvider config={config}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </LogtoProvider>
    </BrowserRouter>
  );
}

export default App;
