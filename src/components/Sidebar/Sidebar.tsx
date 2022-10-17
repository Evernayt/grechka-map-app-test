import { useEffect, useState } from "react";
import Select from "react-select";
import { PLACEMARKS_KEY } from "../../constants/localStorage";
import createClone from "../../helpers/createClone";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchMockAPI } from "../../http/mockAPI";
import { IDescription } from "../../models/IDescription";
import { IPlacemark } from "../../models/IPlacemark";
import { ITitle } from "../../models/ITitle";
import {
  addPlacemarkAction,
  selectPlacemarkAction,
  setSidebarIsShownAction,
} from "../../store/reducers/MapSlice";
import Button, { ButtonVariants } from "../UI/Button/Button";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [titles, setTitles] = useState<ITitle[]>([]);
  const [descriptions, setDescriptions] = useState<IDescription[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<ITitle | null>(null);
  const [selectedDescription, setSelectedDescription] =
    useState<IDescription | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const sidebarIsShown = useAppSelector((state) => state.map.sidebarIsShown);
  const selectedPlacemark = useAppSelector(
    (state) => state.map.selectedPlacemark
  );
  const placemarks = useAppSelector((state) => state.map.placemarks);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchMockData();
  }, []);

  const fetchMockData = () => {
    fetchMockAPI().then((data) => {
      setTitles(data.titles);
      setDescriptions(data.descriptions);
    });
  };

  const addAddress = () => {
    if (!selectedPlacemark) {
      setErrorMessage("Адрес не выбран");
      return;
    } else if (!selectedTitle) {
      setErrorMessage("Заголовок не выбран");
      return;
    } else if (!selectedDescription) {
      setErrorMessage("Описание не выбрано");
      return;
    } else {
      setErrorMessage("");
    }

    const placemark: IPlacemark = {
      ...selectedPlacemark,
      title: selectedTitle.name,
      description: selectedDescription.name,
    };

    dispatch(addPlacemarkAction(placemark));

    const placemarksClone: IPlacemark[] = createClone(placemarks);
    placemarksClone.push(placemark);
    localStorage.setItem(PLACEMARKS_KEY, JSON.stringify(placemarksClone));

    close();
  };

  const close = () => {
    dispatch(setSidebarIsShownAction(false));
    dispatch(selectPlacemarkAction(null));
    setSelectedTitle(null);
    setSelectedDescription(null);
    setErrorMessage("");
  };

  return (
    <div
      className={[
        styles.container,
        sidebarIsShown ? styles.hide : styles.show,
      ].join(" ")}
    >
      <div>
        <h2>Выберите адрес на карте</h2>
        <h3>{`Адрес: ${
          selectedPlacemark ? selectedPlacemark.address : "Не выбран"
        }`}</h3>
        <div className={styles.inputs}>
          <Select
            options={titles}
            value={selectedTitle}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.name}
            placeholder="Выберите заголовок..."
            onChange={setSelectedTitle}
          />
          <Select
            options={descriptions}
            value={selectedDescription}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.name}
            placeholder="Выберите описание..."
            onChange={setSelectedDescription}
          />
          <Button variant={ButtonVariants.primary} onClick={addAddress}>
            Добавить
          </Button>
          <span className={styles.error_message}>{errorMessage}</span>
        </div>
      </div>
      <Button onClick={close}>Закрыть</Button>
    </div>
  );
};

export default Sidebar;
