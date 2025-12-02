import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

const CitiesContext = createContext();
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: null,
  error: "",
};

// reducer functions must be pure, that means API request functionalities are not allowed within it.
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded": {
      return { ...state, isLoading: false, currentCity: action.payload };
    }

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [action.payload, ...state.cities],
      };

    case "city/deleted":
      return { ...state, isLoading: false, cities: action.payload };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState(null);

  const [{ cities, isLoading, error, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(BASE_URL + "/cities");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
    }
    fetchCities();
  }, []);

  const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
      .map((char) => String.fromCharCode(char - 127397).toLowerCase())
      .join("");
    return (
      <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
    );
  };

  const getCity = useCallback(
    async function getCity(id) {
      // converting currentCity.id to string, because json-server can give letters as ids as well. the id prop in this case is already a string coming from the url
      if (id === String(currentCity?.id)) return;
      {
        dispatch({ type: "loading" });
        try {
          const res = await fetch(`${BASE_URL}/cities/${id}`);
          const data = await res.json();
          dispatch({ type: "city/loaded", payload: data });
        } catch {
          dispatch({
            type: "rejected",
            payload: "There was an error loading data...",
          });
        }
      }
    },
    [currentCity]
  );
  async function createCity(newCity) {
    {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        dispatch({ type: "city/created", payload: data });
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error creating the city.",
        });
      }
    }
  }
  async function deleteCity(id) {
    {
      dispatch({ type: "loading" });

      try {
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });
        dispatch({
          type: "city/deleted",
          payload: cities.filter((city) => city.id !== id),
        });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error deleting the city.",
        });
      }
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        flagemojiToPNG,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
