import { useSelector, useDispatch } from "react-redux";
import { toggleDetailModal, setSelectedProduct, getProducts } from "@/app/features/product-slice.js";
import { useState } from "react";
import { withRouter } from "next/router";
import { updateProduct, removeProduct } from "@/utils/api.js";
import validate, { createProductValidation } from "@/utils/validation/validate.js";

// bootstrap component
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function DetailProduct({ router }) {
  const dispatch = useDispatch();
  const showDetailModal = useSelector((state) => state.product.showDetailModal);
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const categories = useSelector((state) => state.category.categories.data);
  const [isUpdateDisabled, setUpdateDisabled] = useState(true);

  const [invalidName, setInvalidName] = useState(undefined);
  const [invalidPrice, setInvalidPrice] = useState(undefined);
  const [invalidQty, setInvalidQty] = useState(undefined);
  const [invalidDescription, setInvalidDescription] = useState(undefined);

  function checkValidation() {
    const resultInvalidName = validate(createProductValidation.name, selectedProduct.name);
    const resultInvalidPrice = validate(createProductValidation.price, selectedProduct.price);
    const resultInvalidQty = validate(createProductValidation.qty, selectedProduct.stock_quantity);
    const resultInvalidDescription = validate(createProductValidation.description, selectedProduct.description);

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

  const handleUpdate = async () => {
    try {
      const isValid = checkValidation();
      if (isValid) {
        await updateProduct(selectedProduct);
        const queryParams = {};
        dispatch(getProducts(queryParams));
        setUpdateDisabled(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async () => {
    try {
      const isConfirm = confirm(`Are you sure remove ${selectedProduct.name}`);
      if (isConfirm) {
        await removeProduct(selectedProduct.product_id);
        const queryParams = {};
        dispatch(getProducts(queryParams));
        dispatch(toggleDetailModal());
      }
      setUpdateDisabled(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={showDetailModal} onHide={() => dispatch(toggleDetailModal())} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedProduct?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-1">
          <label className="form-label">Name</label>
          <input disabled={isUpdateDisabled} type="text" className={`form-control ${invalidName ? "is-invalid" : ""}`} value={selectedProduct?.name} onChange={(e) => dispatch(setSelectedProduct({ name: e.target.value }))} autoFocus />
          <div className="invalid-feedback">{invalidName && invalidName[0].message}</div>
        </div>
        <div className="row g-3">
          <div className="col-8 mb-1">
            <label className="form-label">Price</label>
            <input disabled={isUpdateDisabled} inputMode="numeric" type="number" className={`form-control ${invalidPrice ? "is-invalid" : ""}`} value={selectedProduct?.price} onChange={(e) => dispatch(setSelectedProduct({ price: e.target.value }))} />
            <div className="invalid-feedback">{invalidPrice && invalidPrice[0].message}</div>
          </div>
          <div className="col-4 mb-1">
            <label className="form-label">Qty</label>
            <input disabled={isUpdateDisabled} inputMode="numeric" type="number" className={`form-control ${invalidQty ? "is-invalid" : ""}`} value={selectedProduct?.stock_quantity} onChange={(e) => dispatch(setSelectedProduct({ stock_quantity: e.target.value }))} />
            <div className="invalid-feedback">{invalidQty && invalidQty[0].message}</div>
          </div>
        </div>
        <div className="mb-1">
          <label className="form-label">Category</label>
          <select disabled={isUpdateDisabled} className="form-select" value={selectedProduct?.category_id} onChange={(e) => dispatch(setSelectedProduct({ category_id: e.target.value }))}>
            {categories.map((category, index) => (
              <option key={index} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-1">
          <label className="form-label">Description</label>
          <textarea disabled={isUpdateDisabled} rows="3" className={`form-control ${invalidDescription ? "is-invalid" : ""}`} value={selectedProduct?.description} onChange={(e) => dispatch(setSelectedProduct({ description: e.target.value }))} />
          <div className="invalid-feedback">{invalidDescription && invalidDescription[0].message}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            dispatch(toggleDetailModal());
            setUpdateDisabled(true);
          }}
        >
          Back
        </Button>
        {isUpdateDisabled == true && (
          <Button variant="primary" onClick={() => setUpdateDisabled(false)}>
            Edit
          </Button>
        )}
        {isUpdateDisabled == false && (
          <Button variant="success" onClick={handleUpdate}>
            Update
          </Button>
        )}
        <Button variant="danger" onClick={handleRemove}>
          <i className="bi bi-trash"></i>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default withRouter(DetailProduct);
