import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Chat from "./components/Chat";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/chat" element={<Chat />} />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;