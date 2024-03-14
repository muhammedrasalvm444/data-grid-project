"use client";
import {
  Avatar,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { FaEye } from "react-icons/fa";
import DetailPageComponent from "../DetailPageComponent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProductsList = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productId, setProductId] = useState();
  const [pageState, setPageState] = useState({
    isLoading: false,
    total: 0,
    data: [],
    page: 15,
    pageSize: 20,
  });

  const handleViewDetails = (id) => {
    setProductId(id);
    setOpen(true);
  };

  const handleClose = ({ params }) => {
    setOpen(false);
  };

  const productsWithImageUrl = useMemo(
    () =>
      products?.products?.map((product) => ({
        ...product,
        imageUrl: product.images?.front || "", // Set imageUrl
      })),
    [products]
  );

  const getRowId = (row) => {
    // Generate a unique ID for each row
    return row.gtin || Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setPageState((old) => ({
          ...old,
          isLoading: true,
        }));

        const response = await axios.get(
          `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products`,
          {
            params: {
              page: pageState.page, // Include the current page number
              // pageSize: paginationState.pageSize, // Include the page size
            },
          }
        );
        setProducts(response.data);
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: response?.data?.products,
          total: response?.data?.totalResults,
        }));
        setLoading(false);

        // Extract and set the current page data based on pagination parameters
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [pageState.page, pageState.pageSize]); // Re-fetch data when pagination state changes
  // Re-fetch data when pagination state changes
  const imageUrl = products?.products?.images?.front
    ? products?.products?.images?.front
    : products?.products?.images?.back
    ? products?.products?.images?.back
    : products?.products?.images?.top; // Change 'front' to any other key to select a different image

  const columns = useMemo(
    () => [
      {
        field: "gtin",
        headerName: "Id",
        width: 160,
        valueGetter: (params) => params.value || "NA", // If id is null, generate a random number
        filterable: false,
        sortable: false,
      },
      {
        field: "imageUrl",
        headerName: "Image",
        width: 100,
        renderCell: (params) =>
          params.value ? (
            <Avatar
              src={params.value}
              alt="Product"
              // style={{ width: 100, height: 100 }}
            />
          ) : null,
        sortable: false,
        filterable: false,
      },
      {
        field: "name",
        headerName: "Product name",
        width: 200,
        filterable: true,
        sortable: false,
        sortComparator: (obj1, obj2) => {
          const name1 = obj1.name?.toLowerCase(); // Handle missing names and convert to lowercase
          const name2 = obj2.name?.toLowerCase();
          return name1.localeCompare(name2); // Case-insensitive comparison
        },
        //   filterable: true,
      },
      {
        field: "mrp", // This might be undefined if 'mrp' is missing
        headerName: "Price (MRP)",
        width: 180,
        filterable: false,
        sortable: true,
        valueGetter: (params) =>
          params.value && params.value.mrp
            ? parseFloat(params.value.mrp)
            : null, // Ensure 'mrp' is a number
        valueFormatter: (params) => {
          if (params.value && typeof params.value === "number") {
            return `${params.value.toFixed(2)}`; // Format the value as a currency with two decimal places
          } else {
            return "0"; // Return empty string if 'mrp' is missing or not a number
          }
        },
      },
      {
        field: "brand",
        headerName: "Brand",
        width: 180,
        filterable: true,
        sortable: false,
      },
      {
        field: "category_level_1",
        headerName: "Category",
        width: 160,
      },
      {
        field: "viewDetails",
        headerName: "View Details",
        width: 120,
        renderCell: (params) => (
          <IconButton onClick={() => handleViewDetails(params.row.gtin)}>
            <FaEye />
          </IconButton>
        ),
      },
    ],
    []
  );
  const handlePageChange = (newPage) => {
    setPageState((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageState((prev) => ({ ...prev, pageSize: newPageSize }));
  };

  //   if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="">
        <Box sx={{ height: 500, width: "100s%" }}>
          <Typography
            variant="h4"
            component="h3"
            sx={{ textAlign: "center", margin: "10px" }}
          >
            Our products
          </Typography>
          {loading ? (
            <div className="flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <DataGrid
              rows={productsWithImageUrl}
              columns={columns}
              getRowId={getRowId}
              loading={pageState?.isLoading}
              rowCount={pageState?.total}
              pageSizeOptions={[20]}
              pagination
              page={pageState?.page - 1}
              pageSize={pageState?.pageSize}
              paginationMode="server"
              onPageChange={handlePageChange} // Handle page change
              onPageSizeChange={handlePageSizeChange} // Handle page size change
            />
          )}
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ width: "1000x" }}
        >
          <Box sx={style}>
            <DetailPageComponent
              product={products?.products}
              productId={productId}
            />
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default ProductsList;
