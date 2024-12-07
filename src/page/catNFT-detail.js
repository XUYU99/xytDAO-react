import { ethers } from "ethers";
import { useEffect, useState } from "react";

const NFTDetail = ({ property, togglePop, loadBlockchainData }) => {
  // 状态变量
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态

  // 获取房产、租赁托管 合约实例

  // 获取详细信息
  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("property: ", property);
    } catch (error) {
      console.error("Error fetching details:", error);
      setError("Error fetching property details");
    } finally {
      setLoading(false);
    }
  };

  // 加载数据
  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="home">
      <div className="home__details">
        <div className="home__image">
          <img src={property.image} alt="Home" />
        </div>
        <div className="home__overview">
          <h1>{property.name}</h1>
          <p>
            <strong>{property.attributes[0].value}</strong> bds |
            <strong>{property.attributes[2].value}</strong> ba |
            <strong>{property.attributes[3].value}</strong> sqft
          </p>

          <hr />

          <h2>Overview</h2>

          <hr />

          <h2>Facts and features</h2>

          <ul>
            {property.attributes.map((attribute, index) => (
              <li key={index}>
                <strong>{attribute.trait_type}</strong> : {attribute.value}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={togglePop} className="home__close">
          {/* <img src={close} alt="Close" /> */}
        </button>
      </div>
    </div>
  );
};

export default NFTDetail;
