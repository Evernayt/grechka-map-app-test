import { FC, HTMLAttributes } from "react";
import styles from "./Loader.module.css";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Loader: FC<LoaderProps> = ({ className, ...props }) => {
  return (
    <div className={[styles.container, className].join(" ")} {...props}>
      <div className={styles.loader}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
