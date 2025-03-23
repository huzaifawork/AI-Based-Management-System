import React, { useState, useEffect } from "react";
import { fetchMenuItems } from "../../api/orders";

const MenuList = ({ addToCart }) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const getMenu = async () => {
      const data = await fetchMenuItems();
      setMenu(data);
    };
    getMenu();
  }, []);

  return (
    <div>
      <h2>Menu</h2>
      <div className="menu-grid">
        {menu.map((item) => (
          <div key={item._id} className="menu-item">
            <h3>{item.name}</h3>
            <p>${item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
  return (
    <section className="menu-section">
      <div className="section-header">
        <span className="section-subtitle">Explore Our</span>
        <h2 className="section-title">Cosmic Menu</h2>
        <div className="title-underline" />
      </div>

      <div className="menu-grid">
        {menu.map((item) => (
          <article 
            key={item._id} 
            className="menu-card"
            onClick={() => setSelectedItem(item)}
          >
            <div className="card-glow" />
            <div className="card-content">
              <h3 className="item-title">{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-footer">
                <span className="item-price">${item.price}</span>
                <button 
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                    toast.success(`${item.name} added to cart!`);
                  }}
                >
                  <span className="btn-icon">+</span>
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedItem && (
        <MenuItemModal 
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          addToCart={addToCart}
        />
      )}
    </section>
  );


