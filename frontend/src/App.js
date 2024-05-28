import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AllGroup from "./AllGroup";
import CreateGroup from "./CreateGroup";
import SelectedGroup from "./SelectedGroup";
import GroupRequests from "./GroupRequests";
import AddTopic from "./AddTopic";
import SelectedTopic from "./SelectedTopic";
function App() {

  return (
    <div className="app">
       <Router>
            <Routes>
              <Route
                path="/"
                element={<Login/>}
              />
              <Route
                path="/signup"
                element={<SignUp/>}
              />
              <Route
                path="/dashboard"
                element={<Dashboard/>}
              />
              <Route
                path="/allgroups"
                element={<AllGroup/>}
              />
              <Route
                path="/create-groups"
                element={<CreateGroup/>}
              />
              <Route
                path="/group/:id"
                element={<SelectedGroup/>}
              />
              <Route
                path="/group/requests/:id"
                element={<GroupRequests/>}
              />
              <Route
                path="/add-topic/:id"
                element={<AddTopic/>}
              />
              <Route
                path="/topic/:id/:topicId"
                element={<SelectedTopic/>}
              />
            </Routes>
          </Router>
    </div>
  );
}

export default App;