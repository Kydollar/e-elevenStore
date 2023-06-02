import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";

import axios from "axios";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  paymentName: yup.string().required("Name Payment is required"),
  norek: yup.string().required("Nomer Rekening is required"),
});

export default function AddThird() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("paymentName", data.paymentName);
      formData.append("norek", data.norek);
      axios.post(`${process.env.REACT_APP_MY_API}/payment-methods`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Berhasil",
        text: "Payment Method berhasil dibuat, akan di arahkan ke halaman payment method!",
        icon: "success",
        confirmButtonText: "Oke",
        allowOutsideClick: false,
        customClass: {
          confirmButton: "confirm",
        },
        buttonsStyling: false,
        timer: 2000,
        timerProgressBar: true,
      }).then(function () {
        // Redirect the user
        navigate("/admin/payment-method");
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
        <div className="flex flex-col w-full gap-y-4 flex-grow">
          <TextField label="Nama" {...register("name")} error={!!errors.name} helperText={errors.name?.message} autoComplete="new-name" />
          <TextField label="Nama Bank/Penyedia Layanan " {...register("paymentName")} error={!!errors.paymentName} helperText={errors.paymentName?.message} autoComplete="new-paymentName" />
          <TextField label="Nomer Rekening" {...register("norek")} error={!!errors.norek} helperText={errors.norek?.message} autoComplete="new-norek" />
          <div>
            <Button type="submit" primary>
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
