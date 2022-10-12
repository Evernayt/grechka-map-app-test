import { FC, useEffect } from "react";
import { createPortal } from "react-dom";
import { IPlacemark } from "../../models/IPlacemark";
import styles from "./PlacemarkTooltip.module.css";

interface PlacemarkTooltipProps {
  placemark: IPlacemark;
  elementId: string;
}

const PlacemarkTooltip: FC<PlacemarkTooltipProps> = ({
  placemark,
  elementId,
}) => {
  // находим искомый HTML по id
  const mount = document.getElementById(elementId);
  // создаём свой div
  const el = document.createElement("div");

  useEffect(() => {
    // добавляем свой див к искомому элементу
    if (mount) mount.appendChild(el);
    return () => {
      // удаляем элемент от искомого при завершении компоненты
      if (mount) mount.removeChild(el);
    };
  }, [el, mount]);

  // отменяем отрисовку при отсутствии искомого элемента
  if (!mount) return null;

  const renderTooltip = () => {
    return (
      <div className={styles.tooltip}>
        <div>{'placemark.title'}</div>
        <div>{placemark.description}</div>
      </div>
    );
  };

  // собственно, пририсовываем React-элемент в div к искомому HTML
  return createPortal(renderTooltip(), el);
};

export default PlacemarkTooltip;
