import { showLocation } from "react-native-map-link";

const OpenMap = (beach: string) => {
  showLocation({
    address: `${beach}, Florianópolis, Santa Catarina, Brasil`,
    dialogTitle: "Abrir Localização",
    dialogMessage: "Selecione o aplicativo de GPS para traçar a rota ou visualizar este ponto",
    cancelText: "Cancelar",
  });
};

export default OpenMap;
