import React from "react";

function PriceLabel({ sellPrice }) {
  return (
    <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
      <span className="disChip-label">{sellPrice} DANG</span>
    </div>
  );
}

export default PriceLabel;
