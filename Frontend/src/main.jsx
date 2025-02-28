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
import CodeEditor from "./components/Pages/CodeEditor";
import QuestionList from "./components/Pages/QuestionList";
import RequireRole from "./components/Global/RequireRole";
import AiBot from "./components/Global/AiBot";
import AskBot from "./components/Global/AskBot";

const persist = persistStore(store);
export const server = "http://localhost:8000/api/v1";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="explore" element={<Explore />} />
      <Route path="feed" element={<Feed />} />
      <Route path="collabx-ai-chatbot" element={<AskBot />} />
      <Route path="create" element={
        <RequireRole>
          <Create />
        </RequireRole>
      } />
      <Route path="search" element={
        <RequireRole>
          <Search />
        </RequireRole>
      } />
      <Route path="mentors" element={
        <RequireRole>
          <Mentors />
        </RequireRole>
      } />
      <Route path="profile/:id?" element={
        <RequireRole>
          <Profile />
        </RequireRole>
      } /> {/* Allows optional ID */}
      <Route path="edit" element={<EditProfile />} />
      <Route path="ask/:id?" element={
        <RequireRole>
          <Ask />
        </RequireRole>
      } />
      <Route path="inbox" element={<Modal />} />
      <Route path="session" element={
        <RequireRole>
          <Session />
        </RequireRole>
      } />
      <Route path="roadmaps" element={
        <RequireRole>
          <Roadmaps />
        </RequireRole>
      } />
      <Route path="about" element={<About />} />
      <Route path="code-editor" element={
        <RequireRole>
          <CodeEditor />
        </RequireRole>
      } />
      <Route path="dsa-sheet-code-editor" element={
        <RequireRole>
          <QuestionList />
        </RequireRole>
      } />
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
