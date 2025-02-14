import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "./Layout"; 
import Home from "./components/Home/Home.jsx";
import Login from "./components/Home/Login.jsx";
import Signup from "./components/Home/Signup.jsx";
import Explore from "./components/Explore/Explore.jsx";
import Feed from "./components/Explore/Feed.jsx";
import Create from "./components/Explore/Create.jsx";
import Search from "./components/Explore/Search.jsx";
import Mentors from "./components/Explore/Mentors.jsx";
import Profile from "./components/Explore/Profile.jsx";
import EditProfile from "./components/Explore/EditProfile.jsx";
import Ask from "./components/Explore/Ask.jsx";
import Session from "./components/Explore/Session.jsx";
import Roadmaps from "./components/Explore/Roadmaps.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js"; 
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Modal from "./components/Explore/Modal";
import About from "./components/Home/About";
import Error from "./Error";

const persist = persistStore(store);
export const server = "http://localhost:8080/api/v1";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="explore" element={<Explore />} />
      <Route path="feed" element={<Feed />} />
      <Route path="create" element={<Create />} />
      <Route path="search" element={<Search />} />
      <Route path="mentors" element={<Mentors />} />
      <Route path="profile/:id?" element={<Profile />} /> {/* Allows optional ID */}
      <Route path="edit" element={<EditProfile />} />
      <Route path="ask/:id?" element={<Ask />} />
      <Route path="inbox" element={<Modal />} />
      <Route path="session" element={<Session />} />
      <Route path="roadmaps" element={<Roadmaps />} />
      <Route path="about" element={<About />} />
      <Route path="*" element={<Error />} /> {/* Catch-all route for unmatched paths */}
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        <RouterProvider router={router} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </StrictMode>
);
