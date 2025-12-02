import styles from "./CountriesList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../context/CitiesContext";

function CountriesList() {
  const { cities, isLoading, flagemojiToPNG } = useCities();

  if (isLoading) return <Spinner />;

  if (cities.length === 0)
    return <Message message={"Add your first city by clicking on the map!"} />;

  // const countries = cities.reduce((arr, city) => {
  //   if (!arr.map((el) => el.country).includes(city.country))
  //     return [...arr, { country: city.country, emoji: city.emoji }];
  //   else {
  //     return arr;
  //   }
  // }, []);

  const countriesUnique = new Set(
    cities.map((city) =>
      JSON.stringify({ country: city.country, emoji: city.emoji })
    )
  );
  const countries = [...countriesUnique].map((each) => JSON.parse(each));

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem
          flagemojiToPNG={flagemojiToPNG}
          key={country.country}
          country={country}
        />
      ))}
    </ul>
  );
}

export default CountriesList;
