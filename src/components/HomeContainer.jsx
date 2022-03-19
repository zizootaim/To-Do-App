import React, { useEffect, useState } from "react";
import { useContextGlobally } from "../AppContext";

const HomeContainer = () => {
  const { state, editItem, deleteItem, completeItem } = useContextGlobally();
  const [filterTypes, setFilterTypes] = useState({ existed: false });
  const [filteredItems, setFilteredItems] = useState([]);

  // Lists Functions

  const showFilterList = (e) => {
    const filterList = e.target.parentElement.querySelector(".filter__list");
    let height = 55;

    Array.from(filterList.children).forEach((li) => {
      height += li.offsetHeight;
    });
    filterList.parentElement.style.height = height + "px";
  };

  const closeFilterList = (e) => {
    let targetEl = "";

    if (e.target.parentElement.parentElement.classList[0] == "filter") {
      targetEl = e.target.parentElement.parentElement;
    } else {
      targetEl =
        e.target.parentElement.parentElement.parentElement.parentElement;
    }
    targetEl.style.height = "34px";
  };
  const showSubMenu = (e) => {
    let target = e.target;
    if (target.className.includes("filter__item")) target = e.target;
    else target = e.target.parentElement.parentElement;
    target.children[0].classList.toggle("open");
    if (!target.children[0].className.includes("open")) {
      closeFilterList(e);
    }
  };
  // Show Item Function
  const showItem = (e) => {
    let show = true,
      item = "";
    if (!e.target.className.includes("item__container"))
      item = e.target.parentElement;
    else item = e.target;
    if (e.target.className.includes("close-item-btn")) {
      show = false;
    }
    if (show) item.classList.add("open");
    else item.classList.remove("open");
  };
  // Filter Items Function

  const filterItems = (e, obj) => {
    const { type, payload } = obj;
    let newItems = [];
    switch (type.name) {
      case "category":
        {
          newItems = filteredItems.filter((i) => i.category == payload);
        }
        break;
      case "date":
        {
          if (type.cat == "years") {
            newItems = filteredItems.filter(
              (i) => i.date.slice(0, 4) == payload
            );
          }
          if (type.cat == "months") {
            newItems = filteredItems.filter(
              (i) => i.date.slice(0, 7) == payload
            );
          }
          if (type.cat == "days") {
            newItems = filteredItems.filter((i) => i.date == payload);
          }
        }
        break;
      case "place":
        {
          newItems = filteredItems.filter((i) => i.place == payload);
        }
        break;
      case "completed":
        {
          newItems = filteredItems.filter((i) => i.done == true);
        }
        break;
      default:
        newItems = state.items;
    }
    if (newItems.length == 0) {
      setFilterTypes({ ...filterTypes, existed: false });
    }
    setFilteredItems(newItems);
    closeFilterList(e);
  };

  // Get Filter Types

  useEffect(() => {
    if (state.items.length >= 1) {
      setFilteredItems(state.items);
      const filterCategories = state.items.map((i) => {
        return i.category;
      });
      let filterDate = [
        {
          type: "years",
          value: [],
        },
        {
          type: "months",
          value: [],
        },
        {
          type: "days",
          value: [],
        },
      ];
      state.items.forEach((i) => {
        filterDate[0].value = [...filterDate[0].value, i.date.slice(0, 4)];
        filterDate[1].value = [...filterDate[1].value, i.date.slice(0, 7)];
        filterDate[2].value = [...filterDate[2].value, i.date];
      });
      const newFilterDate = filterDate.map((d) => {
        const newValue = d.value.filter((a, b) => d.value.indexOf(a) === b);
        return { ...d, value: newValue };
      });

      const filterPlaces = state.items.map((i) => i.place);

      setFilterTypes({
        filterCategories: filterCategories.filter(
          (a, b) => filterCategories.indexOf(a) == b
        ),
        filterDate: newFilterDate,
        filterPlaces: filterPlaces.filter(
          (a, b) => filterPlaces.indexOf(a) == b
        ),
        existed: true,
      });
    } else {
      setFilterTypes({ existed: false });
    }
  }, [state.items]);

  return (
    <section className="home">
      <h1 className="home__title">
        <p className="copyright">© 2022 Made By Ziad Otaim.</p>

        <span>{state.items.length >= 1 ? "" : "Add Your First To Do"}</span>
      </h1>
      {filterTypes.existed ? (
        <>
          <h1 className="title">Filter Your Items</h1>
          <article className="filter__wrapper">
            <div className="filter">
              <button className="filter-btn" onClick={showFilterList}>
                category
              </button>
              <ul className="filter__list">
                {filterTypes.filterCategories.map((c, index) => (
                  <li
                    key={index}
                    onClick={(e) =>
                      filterItems(e, { type: { name: "category" }, payload: c })
                    }
                  >
                    {c.length >= 10 ? `${c.slice(0, 14)}...` : c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="filter date-filter">
              <button className="filter-btn" onClick={showFilterList}>
                date
              </button>
              <ul className="filter__list">
                {filterTypes.filterDate.map((i, index) => {
                  return (
                    <li
                      key={index}
                      className="filter__item"
                      onClick={showSubMenu}
                    >
                      {i.type}
                      <ul className="filter__item-list">
                        {i.value.map((v, index) => (
                          <li
                            key={index}
                            onClick={(e) =>
                              filterItems(e, {
                                type: { name: "date", cat: i.type },
                                payload: v,
                              })
                            }
                          >
                            {v}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="filter">
              <button className="filter-btn" onClick={showFilterList}>
                place
              </button>
              <ul className="filter__list">
                {filterTypes.filterPlaces.map((p, index) => (
                  <li
                    key={index}
                    onClick={(e) => {
                      filterItems(e, { type: { name: "place" }, payload: p });
                    }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="filter">
              <button
                className="filter-btn"
                onClick={(e) => {
                  filterItems(e, { type: { name: "completed" }, payload: "" });
                }}
              >
                completed
              </button>
            </div>
          </article>
        </>
      ) : (
        ""
      )}
      <article className="items__wrapper">
        {state.items.length >= 1 ? (
          filteredItems.length >= 1 ? (
            filteredItems.map((i) => {
              return (
                <div
                  className={`item__container${i.done ? " done" : ""}`}
                  key={i.id}
                  onClick={(e) => showItem(e)}
                >
                  <i className="fa fa-times close-item-btn"></i>
                  <div className="done-top">
                    <i className="fa fa-check"></i>
                  </div>
                  <div className="item__title">
                    {i.name.length >= 40 ? `${i.name.slice(0, 30)}...` : i.name}
                  </div>
                  <ul className="item__list">
                    <li>
                      <p>
                        category :{" "}
                        <span>
                          {i.category.length >= 35
                            ? `${i.category.slice(0, 30)}...`
                            : i.category}
                        </span>
                      </p>
                    </li>

                    <li>
                      <p>
                        place :{" "}
                        <span>
                          {i.place.length >= 35
                            ? `${i.place.slice(0, 30)}...`
                            : i.place}
                        </span>
                      </p>
                    </li>
                    <li>
                      <p>
                        date : <span>{i.date}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        from : <span>{i.time.from}</span>
                      </p>
                      <p>
                        to : <span>{i.time.to}</span>
                      </p>
                    </li>
                  </ul>
                  <div className="item__btns">
                    <button
                      className="btn complete__btn"
                      onClick={() => completeItem(i.id)}
                    >
                      <i className="far fa-check-circle"></i>
                    </button>
                    <button
                      className="btn edit__btn"
                      onClick={() => editItem(i.id)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="btn delete__btn"
                      onClick={() => deleteItem(i.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty__list">
              <p>Nothing...</p>
              <button
                className="filter-btn"
                onClick={() => {
                  setFilterTypes({ ...filterTypes, existed: true });
                  setFilteredItems(state.items);
                }}
              >
                Show All
              </button>
            </div>
          )
        ) : (
          ""
        )}
      </article>
    </section>
  );
};

export default HomeContainer;
