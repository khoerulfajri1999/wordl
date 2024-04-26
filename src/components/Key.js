import React, { useContext } from "react";
import { AppContext } from "../App";

export const Key = ({ keyVal, bigKey, disabled }) => {
  const { onDelete, onEnter, onSelectLetter } = useContext(AppContext);
  const selectLetter = () => {
    if (keyVal === "ETR") {
      onEnter();
    } else if (keyVal === "DEL") {
      onDelete();
    } else {
      onSelectLetter(keyVal) && onSelectLetter();
    }
  };
  return (
    <div
      className="key"
      id={bigKey ? "big" : disabled && "disabled"}
      onClick={selectLetter}
    >
      {keyVal}
    </div>
  );
};
