import React, { useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const AppContext = React.createContext();

const initialState = {
  formItem: {},
  items: [],
  isEditing: false,
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Items Operations
  const addItem = (item) => {
    const ID = uuidv4();
    const newItem = { ...item, id: ID };
    setState(() => {
      const arr = [...state.items, newItem];
      return { ...state, items: arr };
    });
  };

  const editItems = (item) => {
    const newItems = state.items.map((i) => {
      if (i.id == item.id) return item;
      return i;
    });
    setState(() => {
      return { ...state, items: newItems, isEditing: false };
    });
  };
  
  const deleteItem = (ID) => {
    const newItems = state.items.filter((i) => i.id != ID);

    setState({ ...state, items: newItems });
  };

  const completeItem = (ID) => {
    const newItems = state.items.map((i) => {
      if (i.id == ID) {
        return { ...i, done: true };
      }
      return i;
    });
    setState({ ...state, items: newItems });
  };
  
  const editItem = (ID) => {
    const item = state.items.filter((i) => i.id == ID)[0];
    updateForm(item);
    setState(() => {
      return { ...state, isEditing: true, formItem: item };
    });
  };

 // Form UI Styles

  const placeLabels = (input) => {
    if (input.value) {
      input.parentElement.children[1].classList.add("active");
    } else {
      input.parentElement.children[1].classList.remove("active");
    }
  };

  const updateForm = (i) => {
    const inputs = document.querySelectorAll(".form__input");
    inputs[0].value = i.category;
    inputs[1].value = i.name;
    inputs[2].value = i.place;
    inputs[3].value = i.date;
    inputs[4].value = i.time;
    document.querySelectorAll(".form__input").forEach((input) => {
      placeLabels(input);
    });
  };

  // Setup The State

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items"));

    if (storedItems.length >= 1) {
      setState(() => {
        return { ...state, items: storedItems };
      });
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <AppContext.Provider
      value={{ state, addItem, setState, placeLabels, editItems, editItem,deleteItem,completeItem,updateForm }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useContextGlobally = () => {
  return useContext(AppContext);
};
