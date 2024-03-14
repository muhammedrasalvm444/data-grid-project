"use client";
import { Container, Grid, Typography } from "@mui/material";
import React from "react";

const DetailPageComponent = ({ product, productId }) => {
  let singleData = product?.filter((item) => item?.gtin === productId);
  let singleProductData = singleData[0];

  return (
    <Container>
      <Grid container spacing={3}>
        <Container>
          <Typography variant="h5" className="mt-5 text-red-700">
            {singleProductData?.name}
          </Typography>

          <div className="mt-5">
            <Grid>
              {/* <div className="mt-20">
                <img
                  src={singleProductData?.images?.front ?? ""}
                  width={200}
                  height={200}
                  className="bg-white border-black "
                />
              </div> */}
              <Typography variant="h5" className="my-10 text-red-700">
                Product details
              </Typography>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={6}>
                <Typography>
                  <strong>id:</strong> {singleProductData.gtin}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Brand:</strong> {singleProductData.brand}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Description:</strong> {singleProductData.description}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Category:</strong>{" "}
                  {singleProductData.category_level_1}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Sku:</strong> {singleProductData.sku_code}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Price:</strong> {singleProductData.mrp?.mrp}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>ingredients:</strong>{" "}
                  {singleProductData.attributes?.ingredients}
                </Typography>
              </Grid>{" "}
              <Grid item xs={6}>
                <Typography>
                  <strong>Price:</strong> {singleProductData.mrp?.mrp}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Container>
      </Grid>
    </Container>
  );
};

export default DetailPageComponent;
