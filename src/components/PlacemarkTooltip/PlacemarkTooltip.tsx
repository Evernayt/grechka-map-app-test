import { FC } from "react";
import { IPlacemark } from "../../models/IPlacemark";
import styles from "./PlacemarkTooltip.module.css";

interface PlacemarkTooltipProps {
  placemark: IPlacemark;
}

const PlacemarkTooltip: FC<PlacemarkTooltipProps> = ({ placemark }) => {
  return (
    <div className={styles.tooltip}>
      <span className={styles.title}>{placemark.title}</span>
      <span className={styles.description}>{placemark.description}</span>
    </div>
  );
};

export default PlacemarkTooltip;
