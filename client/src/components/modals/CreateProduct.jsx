import { useDispatch, useSelector } from "react-redux";
import { getProducts, toggleCreateModal } from "@/app/features/product-slice.js";
import { useState } from "react";
import { createProduct } from "@/utils/api.js";
import validate, { createProductValidation } from "@/utils/validation/validate.js";

// bootstrap components
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function CreateProduct() {
  const dispatch = useDispatch();
  const showCreateModal = useSelector((state) => state.product.showCreateModal);
  const categories = useSelector((state) => state.category.categories.data);

  const [invalidName, setInvalidName] = useState(undefined);
  const [invalidPrice, setInvalidPrice] = useState(undefined);
  const [invalidQty, setInvalidQty] = useState(undefined);
  const [invalidDescription, setInvalidDescription] = useState(undefined);

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

  function checkValidation() {
    const resultInvalidName = validate(createProductValidation.name, newProduct.name);
    const resultInvalidPrice = validate(createProductValidation.price, newProduct.price);
    const resultInvalidQty = validate(createProductValidation.qty, newProduct.stock_quantity);
    const resultInvalidDescription = validate(createProductValidation.description, newProduct.description);

    if (resultInvalidName || resultInvalidPrice || resultInvalidQty || resultInvalidDescription) {
      setInvalidName(resultInvalidName);
      setInvalidPrice(resultInvalidPrice);
      setInvalidQty(resultInvalidQty);
      setInvalidDescription(resultInvalidDescription);
      return false;
    } else {
      setInvalidName(undefined);
      setInvalidPrice(undefined);
      setInvalidQty(undefined);
      setInvalidDescription(undefined);
      return true;
    }
  }

  async function handleCreateProduct() {
    try {
      const isValid = checkValidation();
      if (isValid) {
        await createProduct(cookies.token, newProduct);
        const queryParams = {};
        dispatch(getProducts(queryParams));
        resetCreateForm();
        dispatch(toggleCreateModal());
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal show={showCreateModal} onHide={() => dispatch(toggleCreateModal())} keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Create Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-1">
          <label className="form-label">Name</label>
          <input type="text" className={`form-control ${invalidName ? "is-invalid" : ""}`} value={newProduct?.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <div className="invalid-feedback">{invalidName && invalidName[0].message}</div>
        </div>
        <div className="row g-3">
          <div className="col-6 mb-1">
            <label className="form-label">Price</label>
            <input type="number" className={`form-control ${invalidPrice ? "is-invalid" : ""}`} value={newProduct?.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
            <div className="invalid-feedback">{invalidPrice && invalidPrice[0].message}</div>
          </div>
          <div className="col-6 mb-1">
            <label className="form-label">Qty</label>
            <input type="number" className={`form-control ${invalidQty ? "is-invalid" : ""}`} value={newProduct?.stock_quantity} onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })} />
            <div className="invalid-feedback">{invalidQty && invalidQty[0].message}</div>
          </div>
        </div>
        <div className="mb-1">
          <label className="form-label">Category</label>
          <select className="form-select" value={newProduct?.category_id} onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}>
            {categories.map((category, index) => (
              <option key={index} value={category.category_id} disabled={category.category_id == 0}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-1">
          <label className="form-label">Description</label>
          <textarea type="text" rows="3" className={`form-control ${invalidDescription ? "is-invalid" : ""}`} value={newProduct?.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
          <div className="invalid-feedback">{invalidDescription && invalidDescription[0].message}</div>
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
