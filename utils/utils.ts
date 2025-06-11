export function changeRegion(region: string) {
  switch (region) {
    case "north":
      return "Norte";
    case "south":
      return "Sul";
    case "east":
      return "Leste";
    case "west":
      return "Oeste";
    default:
      return region;
  }
}

export function waterTemp(temp: string) {
  switch (temp) {
    case "cold":
      return "Fria";
    case "warm":
      return "Quente";
    default:
      return temp;
  }
}
