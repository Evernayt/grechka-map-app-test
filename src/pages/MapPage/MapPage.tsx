import { Button, Sidebar, YandexMaps } from "../../components";
import { ButtonVariants } from "../../components/UI/Button/Button";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setSidebarIsShownAction } from "../../store/reducers/MapSlice";
import styles from "./MapPage.module.css";

const MapPage = () => {
  const sidebarIsShown = useAppSelector((state) => state.map.sidebarIsShown);

  const dispatch = useAppDispatch();

  const openSidebar = () => {
    dispatch(setSidebarIsShownAction(true));
  };

  return (
    <div>
      <Sidebar />
      {!sidebarIsShown && (
        <Button
          variant={ButtonVariants.primary}
          className={styles.add_address_btn}
          onClick={openSidebar}
        >
          Добавить адрес
        </Button>
      )}
      <YandexMaps />
    </div>
  );
};

export default MapPage;
