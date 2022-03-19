import React, { useState, useRef, useEffect } from "react";
import { useContextGlobally } from "../AppContext";
import { v4 as uuidv4 } from "uuid";

const FormContainer = () => {
  const [error, setError] = useState(false);
  const { state, addItem, setState, placeLabels, editItems, currentDate } =
    useContextGlobally();
  const formRef = useRef();

  // Form Functions
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
      if (i.type == "date") i.value = currentDate;
    });
    formRef.current.classList.remove("show-menu");
  };
  // Responsive Menu
  const showMenu = () => {
    formRef.current.classList.toggle("show-menu");
  };

  useEffect(() => {
    document.querySelectorAll(".form__input").forEach((input) => {
      placeLabels(input);
    });
  }, [setForm]);

  // Error Time
  useEffect(() => {
    const er = setTimeout(() => {
      setError(false);
    }, 1200);
    return () => clearTimeout(er);
  }, [error]);

  return (
    <section ref={formRef} className="form__wrapper show-menu">
      <i className="fa fa-bars meun-btn" onClick={showMenu}></i>
      <h1 className="heading">
        <span>To</span>
        <span>Do</span>
        <span>App</span>
      </h1>
      <div className={`error${error ? " show" : ""}`}>all data required</div>
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
          <span className="form__input-label">What To Do ?</span>
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
            defaultValue={currentDate}
            type={"date"}
            onChange={(e) => {
              setState(() => {
                console.log(e.target.value);
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
                  const newItem = {
                    ...state.formItem,
                    time: { ...state.formItem.time, from: e.target.value },
                  };
                  return { ...state, formItem: newItem };
                });
              }}
            />
            <input
              type="time"
              className="form__input time-input"
              onChange={(e) => {
                setState(() => {
                  const newItem = {
                    ...state.formItem,
                    time: { ...state.formItem.time, to: e.target.value },
                  };
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
