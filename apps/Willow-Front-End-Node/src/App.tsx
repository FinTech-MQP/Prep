import NavBar from "./components/NavBar";
import WillowRouter from "./WillowRouter";
import { createContext } from "react";
import useUserContext from "./services/UserContext";

export const userContext = createContext(
  {} as unknown as ReturnType<typeof useUserContext>
);

function App() {
  const user = useUserContext();

  return (
    <userContext.Provider value={user}>
      <NavBar />
      <WillowRouter />
    </userContext.Provider>
  );
}

export default App;
