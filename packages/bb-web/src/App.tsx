import { Main } from "./components/Main";
import { PlaygroundProvider } from "./components/PlaygroundProvider";

function App() {
  return (
    <PlaygroundProvider>
      <Main />
    </PlaygroundProvider>
  );
}

export default App;
