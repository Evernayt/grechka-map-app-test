import { useState } from "react";
import Select from "react-select";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
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

const titles: ITitle[] = [
  {
    id: 0,
    name: "Title 1",
  },
  {
    id: 0,
    name: "Title 2",
  },
  {
    id: 0,
    name: "Title 3",
  },
];

const descriptions: IDescription[] = [
  {
    id: 0,
    name: "Description 1",
  },
  {
    id: 1,
    name: "Description 2",
  },
  {
    id: 2,
    name: "Description 3",
  },
];

const Sidebar = () => {
  const [selectedTitle, setSelectedTitle] = useState<ITitle | null>(null);
  const [selectedDescription, setSelectedDescription] =
    useState<IDescription | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const sidebarIsShown = useAppSelector((state) => state.map.sidebarIsShown);
  const selectedPlacemark = useAppSelector(
    (state) => state.map.selectedPlacemark
  );

  const dispatch = useAppDispatch();

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
      className={styles.container}
      style={
        sidebarIsShown
          ? { transform: "translateX(0px)" }
          : { transform: "translateX(-374px)" }
      }
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
