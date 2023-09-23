import React, { useState, useEffect, useCallback, useRef } from "react";
import { InputBase, IconButton, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchPage = ({ onSearch, handleClose }) => {
  const [searchText, setSearchText] = useState("");
  const [product, setProduct] = useState([]);
  const [msgError, setMsgError] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleClear = () => {
    setSearchText("");
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const updateRecentSearches = useCallback((newSearch) => {
    setRecentSearches((prevSearches) => {
      const existingSearch = prevSearches.find((search) => search.nameProduct === newSearch.nameProduct);

      if (existingSearch) {
        // jika searchtext yang dicari ada masuk kefront localstorage
        const updatedSearches = [newSearch, ...prevSearches.filter((search) => search.nameProduct !== newSearch.nameProduct)?.slice(0, 4)];
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
        return updatedSearches;
      } else {
        // jika search yang dicari baru masuk kefront
        const updatedSearches = [newSearch, ...prevSearches?.slice(0, 4)];
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
        return updatedSearches;
      }
    });
  }, []);

  const performSearch = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_MY_API}/product/search?q=${searchText}`);
      const searchResult = response.data;

      // Update terakhir yang dicari
      if (searchResult.length > 0) {
        const recentSearch = {
          nameProduct: searchResult[0].nameProduct,
          imageUrl: searchResult[0].imageUrl,
        };
        updateRecentSearches(recentSearch);
      }

      setProduct(searchResult);
      setMsgError(searchResult.msg);
    } catch (error) {
      console.log(error);
    }
  }, [searchText, updateRecentSearches]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText, performSearch]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSearchItemClick = (search) => {
    setSearchText(search.nameProduct);
    updateRecentSearches(search); // Update recent searches state
    performSearch();
  };

  const deleteRecentSearch = (nameProduct) => {
    setRecentSearches((prevSearches) => {
      const updatedSearches = prevSearches.filter((search) => search.nameProduct !== nameProduct);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  };
  return (
    <div className="fixed bg-white rounded-md shadow-md flex flex-col md:w-[50vw] w-[96vw] -translate-x-1/2 p-2">
      <div className="flex mb-2">
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <InputBase className="flex-1" placeholder="Search product..." value={searchText} onChange={handleChange} sx={{ backgroundColor: "white", borderRadius: "4px", padding: "4px" }} inputRef={inputRef} />
        {searchText && (
          <IconButton onClick={handleClear}>
            <ClearIcon />
          </IconButton>
        )}
        <span onClick={handleClose} className="text-sm text-gray-400 cursor-pointer text-center self-center p-2 border rounded bg-gray-100/50">
          ESC
        </span>
      </div>
      <Divider />
      {searchText ? (
        <>
          {msgError && (
            <div className="bg-white p-2 py-6 flex gap-4 justify-center items-center">
              <p className="text-gray-400 text-lg">{msgError}</p>
            </div>
          )}
          {Array.isArray(product) &&
            product.map((product) => (
              <Link
                to={`/products/${product?.product_category.productCategoryName}/${product?.uuid}`}
                key={product?.uuid}
                onClick={() => {
                  handleSearchItemClick(product);
                  handleClose();
                }} // Call handleSearchItemClick with the product object
                className="bg-white p-2 flex gap-4 cursor-pointer justify-start items-center hover:bg-gray-100"
              >
                <img src={product?.imageUrl} className="w-16 h-16 object-cover bg-white" alt={product?.nameProduct} />
                <h1 className="cursor-pointer">{product?.nameProduct}</h1>
              </Link>
            ))}
        </>
      ) : recentSearches.length !== 0 ? (
        <>
          <div className="bg-white p-2">
            <h2 className="text-gray-600 mb-2">Pencarian product terakhir:</h2>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="inline-flex items-center gap-4 bg-gray-100 rounded-md px-2 py-1 mr-2 mb-2 text-sm hover:bg-gray-200"
                onClick={() => {
                  setSearchText(search.nameProduct);
                  handleSearchItemClick(search); // Call handleSearchItemClick with the search object
                }}
              >
                <div className="flex items-center">
                  <img src={search.imageUrl} alt={search.nameProduct} className="w-8 h-8 object-cover rounded-full mr-2" />
                  <p className="cursor-pointer">{search.nameProduct}</p>
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRecentSearch(search.nameProduct); // Call deleteRecentSearch with the search nameProduct
                  }}
                  className="hover:bg-red-400/50 hover:text-white px-2 py-0.5 rounded-full hover:shadow-lg"
                >
                  X
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="p-20 text-gray-500 flex items-center justify-center">Tidak ada pencarian product terbaru</div>
      )}
    </div>
  );
};

export default SearchPage;
