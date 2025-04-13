import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Layout from "./Layout";
import Home from "./components/Home/Home";
import Login from "./components/Home/Login";
import Signup from "./components/Home/Signup";
import Explore from "./components/Explore/Explore";
import Feed from "./components/Explore/Feed";
import Create from "./components/Explore/Create";
import Search from "./components/Explore/Search";
import Mentors from "./components/Explore/Mentors";
import Profile from "./components/Explore/Profile";
import EditProfile from "./components/Explore/EditProfile";
import Ask from "./components/Explore/Chats";
import Session from "./components/Explore/Session";
import Roadmaps from "./components/Explore/Roadmaps";
import { Provider } from "react-redux";
import store from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Modal from "./components/Explore/Modal";
import About from "./components/Home/About";
import Error from "./Error";
import CodeEditor from "./components/Pages/CodeEditor";
import QuestionList from "./components/Pages/QuestionList";
import RequireRole from "./components/Global/RequireRole";
import AskBot from "./components/Global/AskBot";
import ChatSidebar from "./components/Explore/ChatSidebar";
import SocketManager from "./components/Global/SocketManager";
import Playground from "./components/Explore/Playground";
import Premium from "./components/Explore/Premium";
import Help from "./components/Explore/Help";

const persist = persistStore(store);
export const server = "http://localhost:8000/api/v1";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public Routes */}
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="about" element={<About />} />
      <Route path="explore" element={<Explore />} />
      
      {/* Protected Routes - Complete Profile Required */}
      <Route path="feed" element={
        <RequireRole>
          <Feed />
        </RequireRole>
      } />
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
      <Route path="dsa-sheet-code-editor" element={
        <RequireRole>
          <QuestionList />
        </RequireRole>
      } />
      <Route path="profile/:id?" element={
        <RequireRole>
          <Profile />
        </RequireRole>
      } />
      <Route path="ask/:id?" element={
        <RequireRole>
          <Ask />
        </RequireRole>
      } />
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
      <Route path="/premium" element={ <Premium/> } />
      <Route path="/need-help" element={ <Help/> } />
      <Route path="code-editor" element={
        <RequireRole>
          <CodeEditor />
        </RequireRole>
      } />
      <Route path="chat" element={
        <RequireRole>
          <ChatSidebar />
        </RequireRole>
      } />
      <Route path="collabx-ai-chatbot" element={
        <RequireRole>
          <AskBot />
        </RequireRole>
      } />
      
      {/* Special Cases */}
      <Route path="edit" element={
        <RequireRole>
          <EditProfile />
        </RequireRole>
      } />
      <Route path="playground" element={
        <RequireRole>
          <Playground />
        </RequireRole>
      } />
      <Route path="inbox" element={<Modal />} />
      
      {/* Error Handling */}
      <Route path="*" element={<Error />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        <SocketManager />
        <RouterProvider router={router} />
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={1}
          theme="dark"
        />
      </PersistGate>
    </Provider>
  </StrictMode>
);