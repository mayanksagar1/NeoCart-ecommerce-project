import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useFetchCategoriesQuery} from "../redux/api/categoryApiSlice.js";
import {useFilteredProductsQuery} from "../redux/api/productsApiSlice.js";
import {setCategories, setProducts, setChecked} from "../redux/features/shop/shopSlice.js";
import Loader from "../components/Loader.jsx";
import ProductCard from "./Products/ProductCard.jsx";

const Shop = () => {
  const dispatch = useDispatch();
  const {categories, products, checked, radio} = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useFilteredProductsQuery({checked, radio});

  const [priceFilter, setPriceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Toggle filter visibility
  const [brandFilter, setBrandFilter] = useState([]); // Brand filter state

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading && filteredProductsQuery.isSuccess) {
        const filteredProducts = filteredProductsQuery.data.filter((product) => {
          return product.price.toString().includes(priceFilter) || product.price === parseInt(priceFilter, 10);
        });
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [dispatch, filteredProductsQuery.data, checked, radio, priceFilter]);

  const handleBrandChange = (value, brand) => {
    const updatedBrands = value ? [...brandFilter, brand] : brandFilter.filter((b) => b !== brand);
    setBrandFilter(updatedBrands);

    const filteredProducts = filteredProductsQuery.data?.filter((product) => (updatedBrands.length > 0 ? updatedBrands.includes(product.brand) : true));
    dispatch(setProducts(filteredProducts));
  };

  const handleCategoryChange = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const uniqueBrands = [...new Set(filteredProductsQuery.data?.map((product) => product.brand))];

  const resetFilters = () => {
    setPriceFilter("");
    setBrandFilter([]);
    dispatch(setChecked([]));
    dispatch(setProducts([]));
    window.location.reload();
  };

  return (
    <div className=" lg:ml-[7vw] mx-auto px-4">
      <div className="flex flex-col md:flex-row">
        {/* Filter Section */}
        <div
          className={`fixed bg-white z-30 rounded-lg w-64  h-[80vh] overflow-y-auto md:w-fit p-4 md:h-fit md:relative ${
            showFilters ? "block shadow-[0_0_0_100vw_rgba(0,0,0,0.5)]" : "hidden md:block"
          }`}>
          <button onClick={() => setShowFilters(false)} className="md:hidden bg-pink-500 text-white px-3 py-1 rounded-full mb-3">
            Close
          </button>

          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Filters</h2>
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
              {categories?.map((c) => (
                <label key={c._id} className="flex items-center mb-1">
                  <input type="checkbox" onChange={(e) => handleCategoryChange(e.target.checked, c._id)} className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="ml-2 text-sm text-gray-700">{c.name}</span>
                </label>
              ))}
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Brands</h3>
              {uniqueBrands?.map((brand) => (
                <label key={brand} className="flex items-center mb-1">
                  <input type="checkbox" onChange={(e) => handleBrandChange(e.target.checked, brand)} className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="ml-2 text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>

            {/* Price */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Price</h3>
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
            </div>

            {/* Reset */}
            <button onClick={resetFilters} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md">
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Floating Button for Filters */}
        {!showFilters && (
          <button onClick={() => setShowFilters(true)} className="fixed bottom-4 right-4 md:hidden bg-pink-500 text-white rounded-full p-3 shadow-lg z-40">
            Filters
          </button>
        )}
        {/* Products Section */}
        <div className="flex-1 p-4">
          <h2 className="text-xl font-semibold mb-4">{products?.length} Products</h2>
          {filteredProductsQuery.isLoading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <img src="https://res.cloudinary.com/dzwqyiazp/image/upload/v1736705718/icons/om4fklxc7ycw6e3rvrcp.png" alt="No Products" className="w-32 h-32 mb-4" />
              <p className="text-gray-500 text-lg">No products found. Try adjusting your filters.</p>
              <button onClick={resetFilters} className="mt-3 bg-pink-500 text-white px-4 py-2 rounded">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {products.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
