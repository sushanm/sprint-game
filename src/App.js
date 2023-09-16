import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import './App.css';
import Games from "./pages/Game";

function App() {
  return (
    //basename={process.env.PUBLIC_URL}
    <BrowserRouter >
      <Routes>
        <Route path="/" exact element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="games" element={<Games />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
