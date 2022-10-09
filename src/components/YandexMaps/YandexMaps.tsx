import { YMaps, Map, Placemark, Clusterer } from "@pbe/react-yandex-maps";
import { YMapsApi } from "@pbe/react-yandex-maps/typings/util/typing";
import { useCallback, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IPlacemark } from "../../models/IPlacemark";
import { selectPlacemarkAction } from "../../store/reducers/MapSlice";
import styles from "./YandexMaps.module.css";

const YandexMaps = () => {
  const mapRef = useRef<any>(null);

  const sidebarIsShown = useAppSelector((state) => state.map.sidebarIsShown);
  const selectedPlacemark = useAppSelector(
    (state) => state.map.selectedPlacemark
  );
  const placemarks = useAppSelector((state) => state.map.placemarks);

  const dispatch = useAppDispatch();

  const setMapRef = useCallback((instance: YMapsApi) => {
    mapRef.current = instance;
  }, []);

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
    mapRef.current?.geocode(coords).then((res: any) => {
      const firstGeoObject = res.geoObjects.get(0);
      const address = firstGeoObject.getAddressLine();
      selectPlacemark(coords, address);
    });
  };

  return (
    <>
      {placemarks.length === 0 && !sidebarIsShown && (
        <div className={styles.no_placemarks_overlay}>
          <h1>Пусто</h1>
        </div>
      )}
      <YMaps
        query={{
          ns: "use-load-option",
          load: "Map,Placemark,control.ZoomControl,geoObject.addon.balloon",
          // load: "package.full",
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
          modules={["Placemark", "geocode", "geoObject.addon.balloon"]}
          onClick={getCoords}
          onLoad={(instance) => setMapRef(instance)}
        >
          <Clusterer>
            {selectedPlacemark && (
              <Placemark
                geometry={selectedPlacemark.coords}
                options={{
                  preset: "islands#greenDotIconWithCaption",
                  iconColor: "red",
                }}
              />
            )}
            {placemarks.map((placemark) => (
              <Placemark geometry={placemark.coords} key={placemark.id} />
            ))}
          </Clusterer>
        </Map>
      </YMaps>
    </>
  );
};

export default YandexMaps;
