import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  //Custom Hook of react-router
  const [searchParams] = useSearchParams();
  const Lat = searchParams.get("lat");
  const Lng = searchParams.get("lng");

  return [Lat, Lng];
}
