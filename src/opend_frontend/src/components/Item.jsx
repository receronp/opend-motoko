import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/opend_nft";

function Item(props) {
  const [nft, setNFT] = useState({ name: null, owner: null, image: null });

  const id = Principal.fromText(props.id);

  const localhost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localhost });

  async function loadNFT() {
    const NFTActor = await Actor.createActor(idlFactory, {
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
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {nft.name}
            <span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {nft.owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
