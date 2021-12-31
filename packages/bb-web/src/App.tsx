import { Main } from "./components/Main";
import { PlaygroundProvider } from "./components/PlaygroundProvider";

function App() {
  return (
    <PlaygroundProvider>
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
    </PlaygroundProvider>
  );
}

export default App;
