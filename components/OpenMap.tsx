import { showLocation } from "react-native-map-link";

const OpenMap = (beach: string) => {
  showLocation({
    address: `${beach}, Florianópolis, Santa Catarina, Brasil`,
    cancelText: "Cancelar",
  });
};

export default OpenMap;
