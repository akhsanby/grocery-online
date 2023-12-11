import { useSelector, useDispatch } from "react-redux";
import { toggleDetailModal, setSelectedProduct } from "@/app/features/product-slice.js";
import { useState } from "react";
import { useRouter } from "next/router";
import nookies from "nookies";
import { updateProduct, removeProduct, getProducts } from "@/utils/api.js";

// bootstrap component
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function DetailProduct() {
  const router = useRouter();
  const dispatch = useDispatch();
  const showDetailModal = useSelector((state) => state.product.showDetailModal);
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const currentCategories = useSelector((state) => state.product.currentCategories.data);

  const [isUpdateDisabled, setUpdateDisabled] = useState(true);

  const handleUpdate = async () => {
    try {
      const cookies = nookies.get();
      await updateProduct(cookies.token, selectedProduct);
      await getProducts(cookies.token);
      setUpdateDisabled(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async () => {
    try {
      const cookies = nookies.get();
      const isConfirm = confirm(`Are you sure remove ${selectedProduct.name}`);
      if (isConfirm) {
        await removeProduct(cookies.token, selectedProduct.product_id);
        await getProducts(cookies.token);
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
          <input disabled={isUpdateDisabled} type="text" className="form-control form-control-sm" value={selectedProduct?.name} onChange={(e) => dispatch(setSelectedProduct({ name: e.target.value }))} autoFocus />
        </div>
        <div className="mb-1">
          <label className="form-label">Category</label>
          <select disabled={isUpdateDisabled} className="form-select form-select-sm" value={selectedProduct?.category_id} onChange={(e) => dispatch(setSelectedProduct({ category_id: e.target.value }))}>
            {currentCategories.map((category, index) => (
              <option key={index} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="row g-3">
          <div className="col-8 mb-1">
            <label className="form-label">Price (Rp)</label>
            <input disabled={isUpdateDisabled} type="number" className="form-control form-control-sm" value={selectedProduct?.price} onChange={(e) => dispatch(setSelectedProduct({ price: e.target.value }))} />
          </div>
          <div className="col-4 mb-1">
            <label className="form-label">Qty</label>
            <input disabled={isUpdateDisabled} type="number" className="form-control form-control-sm" value={selectedProduct?.stock_quantity} onChange={(e) => dispatch(setSelectedProduct({ stock_quantity: e.target.value }))} />
          </div>
        </div>
        <div className="mb-1">
          <label className="form-label">Description</label>
          <textarea disabled={isUpdateDisabled} rows="3" className="form-control form-control-sm" value={selectedProduct?.description} onChange={(e) => dispatch(setSelectedProduct({ description: e.target.value }))} />
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
