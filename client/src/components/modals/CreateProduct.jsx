import { useDispatch, useSelector } from "react-redux";
import { setCurrentProducts, handleCloseModal, toggleCreateModal } from "@/app/features/product-slice.js";
import { setAlert, resetAlert } from "@/app/features/user-slice.js";
import nookies from "nookies";
import { useRouter } from "next/router";
import { useState } from "react";
import { createProduct, getProducts } from "@/utils/api.js";

// bootstrap components
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

export default function CreateProduct() {
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.user.alert);
  const showCreateModal = useSelector((state) => state.product.showCreateModal);
  const currentCategories = useSelector((state) => state.product.currentCategories.data);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    thumbnail: "https://placehold.co/400x200",
    category_id: 1,
  });

  const resetCreateForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      thumbnail: "https://placehold.co/400x200",
      category_id: 1,
    });
  };

  async function handleCreateProduct() {
    try {
      const cookies = nookies.get();
      await createProduct(cookies.token, newProduct);
      const resultProducts = await getProducts(cookies.token);
      const { data: products, paging } = resultProducts.data;
      dispatch(setCurrentProducts({ products, paging }));
      resetCreateForm();
      dispatch(toggleCreateModal());
    } catch (error) {
      const { errors } = error.response.data;
      dispatch(setAlert({ isOpen: true, text: errors, color: "danger" }));
      console.error(error);
    }
  }

  return (
    <Modal
      show={showCreateModal}
      onHide={() => {
        dispatch(toggleCreateModal());
        dispatch(resetAlert());
      }}
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert.isOpen && (
          <Alert key={alert.color} variant={alert.color}>
            {alert.text}
          </Alert>
        )}
        <div className="mb-1">
          <label className="form-label">Name</label>
          <input type="text" className="form-control form-control-sm" value={newProduct?.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
        </div>
        <div className="row g-3">
          <div className="col-8 mb-1">
            <label className="form-label">Price</label>
            <input type="number" className="form-control form-control-sm" value={newProduct?.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
          </div>
          <div className="col-4 mb-1">
            <label className="form-label">Qty</label>
            <input type="number" className="form-control form-control-sm" value={newProduct?.stock_quantity} onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })} />
          </div>
        </div>
        <div className="mb-1">
          <label className="form-label">Category</label>
          <select className="form-select form-select-sm" value={newProduct?.category_id} onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}>
            {currentCategories.map((category, index) => (
              <option key={index} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-1">
          <label className="form-label">Description</label>
          <textarea type="text" rows="3" className="form-control form-control-sm" value={newProduct?.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(toggleCreateModal())}>
          Back
        </Button>
        <Button type="button" variant="primary" onClick={handleCreateProduct}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
