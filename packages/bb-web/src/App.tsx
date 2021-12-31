import React from "react";
import "./App.css";
import { Main } from "./components/Main";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Main />
    </div>
  );
}

export default App;
