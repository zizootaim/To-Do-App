import React, { useState, useRef, useEffect } from "react";
import { useContextGlobally } from "../AppContext";
import { v4 as uuidv4 } from "uuid";

const FormContainer = () => {
  const [error, setError] = useState(false);
  const { state, addItem, setState, placeLabels, editItems } =
    useContextGlobally();
  const formRef = useRef();

  const checkInputs = () => {
    let checked = true;

    Array.from(document.querySelectorAll(".form__input")).forEach((input) => {
      if (!input.value) {
        checked = false;
      }
    });

    return checked;
  };

  const setForm = () => {
    Array.from(document.querySelectorAll(".form__input")).forEach((i) => {
      i.value = "";
    });
  };

  useEffect(() => {
    document.querySelectorAll(".form__input").forEach((input) => {
      placeLabels(input);
    });
  }, [setForm]);

  const showMenu = () => {
    formRef.current.classList.toggle("show-menu");
  };

  return (
    <section ref={formRef} className="form__wrapper">
      <i className="fa fa-bars meun-btn" onClick={showMenu}></i>
      <h1 className="heading">To Do App</h1>
      <h3 className="current__operarion">
        {!state.isEditing ? "Adding New Item" : "Editing Item"}
      </h3>
      <article className="form">
        <div className="form__control">
          <input
            type="text"
            className="form__input"
            onChange={(e) => {
              setState(() => {
                const newItem = { ...state.formItem, category: e.target.value };
                return { ...state, formItem: newItem };
              });
            }}
          />
          <span className="form__input-label">Category</span>
        </div>
        <div className="form__control">
          <input
            type="text"
            className="form__input"
            onChange={(e) => {
              setState(() => {
                const newItem = { ...state.formItem, name: e.target.value };
                return { ...state, formItem: newItem };
              });
            }}
          />
          <span className="form__input-label">Name</span>
        </div>
        <div className="form__control">
          <input
            type="text"
            className="form__input"
            onChange={(e) => {
              setState(() => {
                const newItem = { ...state.formItem, place: e.target.value };
                return { ...state, formItem: newItem };
              });
            }}
          />
          <span className="form__input-label">Place</span>
        </div>
        <div className="form__control">
          <span>Date</span>
          <input
            className="form__input"
            type={"date"}
            onChange={(e) => {
              setState(() => {
                const newItem = { ...state.formItem, date: e.target.value };
                return { ...state, formItem: newItem };
              });
            }}
          />
        </div>
        <div className="form__control time-control">
          <div className="time-labels">
          <span>From</span>
          <span>To</span>
            </div>
          <div className="time-inputs">
          <input
            type="time"
            className="form__input time-input"
            onChange={(e) => {
              setState(() => {
                const newItem = { ...state.formItem, time: {...state.formItem.time,from: e.target.value} };
                return { ...state, formItem: newItem };
              });
            }}
            />
            <input
              type="time"
              className="form__input time-input"
              onChange={(e) => {
                setState(() => {
                  const newItem = { ...state.formItem, time: {...state.formItem.time,to: e.target.value} };
                  return { ...state, formItem: newItem };
                });
              }}
              />
            </div>
        </div>
        <button
          className="add__btn"
          onClick={() => {
            if (checkInputs()) {
              setForm();
              if (state.isEditing) {
                editItems(state.formItem);
              } else {
                addItem(state.formItem);
              }
              setError(false);
            } else {
              setError(true);
            }
          }}
        >
          {state.isEditing ? "Edit Item" : "Add"}
        </button>
      </article>
    </section>
  );
};

export default FormContainer;

/*
import React, { useState, useRef, useEffect } from "react";
import { useContextGlobally } from "../AppContext";
import { v4 as uuidv4 } from "uuid";

const initialItem = {
  id: "",
  category: "",
  name: "",
  place: "",
  date: "",
  time: "",
  done: false,
};

const FormContainer = () => {
  const [addedItem, setAddedItem] = useState(initialItem);
  const [error, setError] = useState(false);
  const { state, addItem, editItem } = useContextGlobally();
  const formRef = useRef();

  const placeLabels = (input) => {
    if (input.value) {
      input.parentElement.children[1].classList.add("active");
    } else {
      input.parentElement.children[1].classList.remove("active");
    }
  };
  const checkInputs = () => {
    let checked = true;

    Array.from(document.querySelectorAll(".form__input")).forEach((input) => {
      if (!input.value) {
        checked = false;
      }
    });

    return checked;
  };

  const setForm = () => {
    Array.from(document.querySelectorAll(".form__input")).forEach((i) => {
      i.value = "";
    });
  };
  const getFormData = () => {
    const inputs = document.querySelectorAll(".form__input");
    let obj = {};
    obj.category = inputs[0].value
    obj.name = inputs[1].value
    obj.place = inputs[2].value 
    obj.date = inputs[3].value 
    obj.time = inputs[4].value 
    return obj
  }

  
  useEffect(() => {
    document.querySelectorAll(".form__input").forEach((input) => {
      placeLabels(input);
    });
  }, [addedItem, setForm]);
  useEffect(() => {
    if (error) {
      console.log("Error");
    } else {
      
    }
  }, [error]);

  const showMenu = () => {
    formRef.current.classList.toggle("show-menu");
  };

  return (
    <section ref={formRef} className="form__wrapper show-menu">
      <i className="fa fa-bars meun-btn" onClick={showMenu}></i>
      <h1 className="heading">To Do App</h1>
      <h3 className="current__operarion">Add New Item</h3>
      <article className="form">
        <div className="form__control">
          <input
            type="text"
            className="form__input"
            onChange={(e) => {
              const ID = uuidv4()
              setAddedItem(() => {
                if(state.isEditing){
                  return { ...addedItem,id: state.editedID,category: e.target.value };
                }
                return { ...addedItem, id: ID,category: e.target.value }});
            }}
          />
          <span className="form__input-label">Category</span>
        </div>
        <div className="form__control">
          <input
            type="text"
            className="form__input"
            onChange={(e) => {
              setAddedItem(() => {
                if(state.isEditing){
                  return { ...addedItem,id: state.editedID,name: e.target.value };
                }
                return { ...addedItem,name: e.target.value }});
            }}
          />
          <span className="form__input-label">Name</span>
        </div>
        <div className="form__control">
          <input
            type="text"
            className="form__input"
            onChange={(e) =>
              {
                setAddedItem(() => {
                  if(state.isEditing){
                    return { ...addedItem,id: state.editedID,place: e.target.value };
                  }
                  return { ...addedItem,place: e.target.value }});
              }
            }
          />
          <span className="form__input-label">Place</span>
        </div>
        <div className="form__control">
          <span>Date</span>
          <input
            className="form__input"
            type={"date"}
            onChange={(e) => {
              setAddedItem(() => {
                if(state.isEditing){
                  return { ...addedItem,id: state.editedID,date: e.target.value };
                }
                return { ...addedItem,date: e.target.value }});
            }}
          />
        </div>
        <div className="form__control">
          <span>Time</span>
          <input
            type="time"
            className="form__input"
            onChange={(e) => {
              setAddedItem(() => {
                if(state.isEditing){
                  return { ...addedItem,id: state.editedID,time: e.target.value };
                }
                return { ...addedItem,time: e.target.value }});
            }}
          />
        </div>
        <button
          className="add__btn"
          onClick={() => {
            getFormData()
          if(state.isEditing){
            addItem(addedItem,true);
            
          }
          else addItem(addedItem,false);
          
              setError(false);

              setAddedItem(initialItem);

              setForm();
            
          }}
        >
          Add
        </button>
      </article>
    </section>
  );
};

export default FormContainer;



*/
