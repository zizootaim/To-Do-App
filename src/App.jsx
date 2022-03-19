import React from "react";
import "./App.css";
import { AppProvider } from "./AppContext";
import FormContainer from "./components/FormContainer";
import HomeContainer from "./components/HomeContainer";

const App = () => {
  return (
    <>
    <AppProvider>
      <FormContainer />
      <HomeContainer />
    </AppProvider>
    </>
  );
};



export default App;
