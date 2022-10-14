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
  const [percent, setPercent] = useState<number>(0);
  const [tilesCount, setTilesCount] = useState<number>(0);

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

  useEffect(() => {
    preloader();
    const placemarks: IPlacemark[] = JSON.parse(
      localStorage.getItem(PLACEMARKS_KEY) || "[]"
    );
    dispatch(setPlacemarksAction(placemarks));
  }, []);

  const preloader = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const hTiles = Math.ceil(width / 256) + 2;
    const vTiles = Math.ceil(height / 256) + 2;

    //const tilesCount = hTiles * vTiles;
    setTilesCount(hTiles * vTiles)

    // for (let i = 0; i < tilesCount; i++) {
    //   return new Promise((resolve, reject) => {
    //     const image = document.createElement("img");
    //     image.src =
    //       "https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=22.10.14-1-b220930144100&x=309&y=160&z=9&scale=1&lang=ru_RU&apikey=2840f247-3bfd-4132-a1c3-88ad74394a86&ads=enabled";
    //     image.onload = resolve;
    //     image.onerror = reject;
    //   }).then(() => setPercent((prevState) => prevState + 1));
    // }
  };

  // useEffect(() => {
  //   if (percent === 100) return;
  //   setPercent((prevState) => prevState + 1);
  //   const resourceList: any[] = window.performance.getEntriesByType("resource");
  //   console.log(resourceList);
  // }, [percent]);

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
    console.log(e);
    //e.originalEvent.target.cursors.push('arrow');
    const coords = e.get("coords");
    mapRef.current?.geocode(coords).then((res: any) => {
      const firstGeoObject = res.geoObjects.get(0);
      const address = firstGeoObject.getAddressLine();
      selectPlacemark(coords, address);
    });
  };

  const mapLoaded = (instance: YMapsApi) => {
    setLoading(false);
    setMapRef(instance);
    //console.log(instance);
    //instance.Map.prototype.cursors.push("arrow");
  };

  const openSidebar = () => {
    dispatch(setSidebarIsShownAction(true));
  };

  return (
    <>
      {/* {loading && <Loader className={styles.loader} />} */}
      {!sidebarIsShown && (
        <Button
          variant={ButtonVariants.primary}
          className={styles.add_address_btn}
          onClick={openSidebar}
        >
          Добавить адрес {percent}
        </Button>
      )}
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
          onLoad={(instance) => mapLoaded(instance)}
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
