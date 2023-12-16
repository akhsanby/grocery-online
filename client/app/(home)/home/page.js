export default function Home() {
  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">All Products</h2>
      <div className="row">
        <div className="col-3">
          <div className="card">
            <div className="card-header fw-bold">Category</div>
            <ul className="list-group list-group-flush">
              <li className={`list-group-item pointer`}>All Products</li>
              {/* {currentCategories.length > 0 &&
                  currentCategories.map((category, index) => (
                    <li className={`list-group-item pointer ${activeCategory === category.name ? "active" : ""}`} key={index} onClick={() => dispatch(setActiveCategory(category.name))}>
                      {category.name}
                    </li>
                  ))} */}
            </ul>
          </div>
        </div>
        <div className="col-9">
          <div className="row">
            <div className="col-6">
              <div className="input-group mb-3">{/* <input type="text" className="form-control" placeholder="Search..." value={searchKeyword} onChange={(e) => dispatch(setSearchKeyword(e.target.value))} /> */}</div>
            </div>
            <div className="col-6">
              {/* {decodeToken.userLevel === "admin" && (
                  <div className="mb-3 float-end">
                    <button type="button" className="btn btn-primary" onClick={() => dispatch(toggleCreateModal())}>
                      Create Product
                    </button>
                    <CreateProductModal />
                  </div>
                )} */}
            </div>
          </div>
          <div className="row g-2">
            {/* <ProductBox decodeToken={decodeToken} currentCategories={currentCategories} currentCarts={currentCarts.data} />
              <DetailProductModal /> */}
          </div>
          <div className="row mt-3">
            <div className="col-4 offset-4 d-flex justify-content-center">{/* <Pagination /> */}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
