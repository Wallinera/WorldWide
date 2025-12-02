import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../context/CitiesContext";

function CityList() {
  const { cities, isLoading, flagemojiToPNG } = useCities();

  if (isLoading) return <Spinner />;

  if (cities.length === 0)
    return <Message message={"Add your first city by clicking on the map!"} />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem key={city.id} city={city} flagemojiToPNG={flagemojiToPNG} />
      ))}
    </ul>
  );
}

export default CityList;
