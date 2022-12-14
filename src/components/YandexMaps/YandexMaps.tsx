import { YMaps, Map, Placemark, Clusterer } from "@pbe/react-yandex-maps";
import { YMapsApi } from "@pbe/react-yandex-maps/typings/util/typing";
import { useCallback, useEffect, useRef, useState } from "react";
import { PLACEMARKS_KEY } from "../../constants/localStorage";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IPlacemark } from "../../models/IPlacemark";
import {
  selectPlacemarkAction,
  setPlacemarksAction,
  setSidebarIsShownAction,
} from "../../store/reducers/MapSlice";
import Loader from "../Loader/Loader";
import PlacemarkTooltip from "../PlacemarkTooltip/PlacemarkTooltip";
import Button, { ButtonVariants } from "../UI/Button/Button";
import styles from "./YandexMaps.module.css";
import { renderToStaticMarkup } from "react-dom/server";

const YandexMaps = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const mapInstanceRef = useRef<any>(null);
  const mapAPIRef = useRef<any>(null);

  const sidebarIsShown = useAppSelector((state) => state.map.sidebarIsShown);
  const selectedPlacemark = useAppSelector(
    (state) => state.map.selectedPlacemark
  );
  const placemarks = useAppSelector((state) => state.map.placemarks);

  const dispatch = useAppDispatch();

  const setMapInstanceRef = useCallback((instance: any) => {
    mapInstanceRef.current = instance;
  }, []);

  const setMapAPI = useCallback((api: YMapsApi) => {
    mapAPIRef.current = api;
  }, []);

  useEffect(() => {
    const placemarks: IPlacemark[] = JSON.parse(
      localStorage.getItem(PLACEMARKS_KEY) || "[]"
    );
    dispatch(setPlacemarksAction(placemarks));
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.cursors.push("arrow");
    }
  }, [mapInstanceRef.current]);

  const selectPlacemark = (coords: number[], address: string) => {
    const placemark: IPlacemark = {
      id: new Date().getTime(),
      coords,
      address,
      title: "",
      description: "",
    };

    dispatch(selectPlacemarkAction(placemark));
  };

  const getCoords = (e: any) => {
    if (!sidebarIsShown) return;
    const coords = e.get("coords");
    mapAPIRef.current?.geocode(coords).then((res: any) => {
      const firstGeoObject = res.geoObjects.get(0);
      const address = firstGeoObject.getAddressLine();
      selectPlacemark(coords, address);
    });
  };

  const mapLoaded = (api: YMapsApi) => {
    setLoading(false);
    setMapAPI(api);
  };

  const openSidebar = () => {
    dispatch(setSidebarIsShownAction(true));
  };

  return (
    <>
      {loading && <Loader className={styles.loader} />}
      {!sidebarIsShown && (
        <Button
          variant={ButtonVariants.primary}
          className={styles.add_address_btn}
          onClick={openSidebar}
        >
          ???????????????? ??????????
        </Button>
      )}
      {placemarks.length === 0 && !sidebarIsShown && (
        <div className={styles.no_placemarks_overlay}>
          <h1>??????????</h1>
        </div>
      )}
      <YMaps
        query={{
          ns: "use-load-option",
          //load: "Map,Placemark,control.ZoomControl,geoObject.addon.balloon",
          load: "package.full",
          apikey: "2840f247-3bfd-4132-a1c3-88ad74394a86",
        }}
      >
        <Map
          className={styles.map}
          defaultState={{
            center: [55.75, 37.57],
            zoom: 9,
            controls: ["zoomControl"],
          }}
          //modules={["Placemark", "geocode", "geoObject.addon.balloon"]}
          onClick={getCoords}
          onLoad={(api) => mapLoaded(api)}
          instanceRef={(instance) => setMapInstanceRef(instance)}
        >
          {selectedPlacemark && (
            <Placemark
              geometry={selectedPlacemark.coords}
              options={{
                preset: "islands#greenDotIconWithCaption",
                iconColor: "red",
              }}
            />
          )}
          <Clusterer>
            {placemarks.map((placemark) => (
              <Placemark
                geometry={placemark.coords}
                properties={{
                  balloonContent: renderToStaticMarkup(
                    <PlacemarkTooltip placemark={placemark} />
                  ),
                }}
                key={placemark.id}
              />
            ))}
          </Clusterer>
        </Map>
      </YMaps>
    </>
  );
};

export default YandexMaps;
