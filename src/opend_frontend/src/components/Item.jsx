import React, { useEffect, useState } from "react";
import { HttpAgent } from "@dfinity/agent";
import { Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/opend_nft";
import { opend_backend } from "../../../declarations/opend_backend/index";
import Button from "./Button";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item({ id, role }) {
  const [nft, setNFT] = useState({ name: null, owner: null, image: null });
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();

  const localhost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localhost });
  // TODO: Remove following line for live deploy.
  agent.fetchRootKey();
  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "img/png" })
    );

    setNFT({ name: name, owner: owner.toText(), image: image });

    if (role === "collection") {
      const nftIsListed = await opend_backend.isListed(id);
      if (nftIsListed) {
        setNFT((prevState) => {
          return { ...prevState, owner: "OpenD" };
        });
        setBlur({
          filter: "blur(4px)",
        });
        setSellStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text="Sell" />);
      }
    } else if (role === "discover") {
      const originalOwner = await opend_backend.getOriginalOwner(id);
      if (originalOwner.toText() !== CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text="Buy" />);
      }
      const price = await opend_backend.getListedNFTPrice(id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />);
    }
  }

  let price;
  function handleSell() {
    setPriceInput(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Button handleClick={sellItem} text="Confirm" />);
  }

  async function handleBuy() {
    console.log("Buy was triggered.");
  }

  async function sellItem() {
    setBlur({
      filter: "blur(4px)",
    });
    setLoaderHidden(false);
    const listingResult = await opend_backend.listItem(id, Number(price));
    if (listingResult === "Success") {
      const openDId = await opend_backend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(openDId);
      if (transferResult === "Success") {
        setButton();
        setPriceInput();
        setNFT((prevState) => {
          return { ...prevState, owner: "OpenD" };
        });
        setSellStatus("Listed");
      }
    }
    setLoaderHidden(true);
  }

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={nft.image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {nft.name}
            <span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {nft.owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
