import React, { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import Item from "./Item";

function Gallery({ title, ids, role }) {
  const [items, setItems] = useState();

  function fetchNFTs() {
    if (ids !== undefined) {
      setItems(
        ids.map((NFTId) => <Item id={NFTId} key={NFTId.toText()} role={role} />)
      );
    }
  }

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
