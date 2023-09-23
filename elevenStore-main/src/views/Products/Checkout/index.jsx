import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Divider, FormControl, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Swal from "sweetalert2";
import Button from "components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPhoneNumber, formatter } from "utils/useFormatter";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Checkout() {
  const [address, setAddress] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [shippingCost, setShippingCost] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState("jne"); // Set default courier as "jne"
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();
  const userUuid = useSelector((state) => state?.auth?.user?.uuid);
  const { state } = useLocation();

  const fetchShippingAddress = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_MY_API}/address-users/${userUuid}?primary=true`);
      setShippingAddress(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userUuid) return;

    const getAddress = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_MY_API}/address-users/${userUuid}`);
        setAddress(response.data);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.msg);
        }
      }
    };
    const getPaymentMethod = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_MY_API}/payment-methods`);
        setPaymentMethods(response.data);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.msg);
        }
      }
    };
    if (userUuid) {
      getAddress();
      fetchShippingAddress();
      getPaymentMethod();
    }
  }, [userUuid]);

  useEffect(() => {
    const fetchShippingCost = async () => {
      if (!selectedCourier || !shippingAddress?.city_id) {
        setShippingCost(null);
        return;
      }

      const origin = "54"; // ID of the origin city
      const destination = shippingAddress?.city_id; // ID of the destination city
      const weight = 192; // Weight of the package in grams
      const courier = selectedCourier; // Use the selected courier

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_HOST_API}/api/starter/cost`,
          {
            origin,
            destination,
            weight,
            courier,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const results = response.data.rajaongkir.results;
        if (results.length > 0) {
          const shippingCost = results[0].costs[0].cost[0].value;
          setShippingCost(shippingCost);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchShippingCost(); // Load shipping cost when selectedCourier or shippingAddress changes
  }, [selectedCourier, shippingAddress]);

  const handleCourierChange = (e) => {
    setSelectedCourier(e.target.value);
  };

  const handleUbahClick = () => {
    setDialogOpen(true);
  };

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  let totalSeluruh = 0;

  if (state && state.selectedItems) {
    totalSeluruh = state.selectedItems.reduce((total, row) => {
      return total + row.subtotal;
    }, 0);
  }

  const handleSetPrimaryAddress = (addressId) => {
    axios
      .put(`${process.env.REACT_APP_MY_API}/address-users/${addressId}/primary`)
      .then((response) => {
        console.log(response.data.msg); // Display success message in the console or perform other actions
        setDialogOpen(false);
        fetchShippingAddress();
      })
      .catch((error) => {
        console.error(error); // Handle errors if they occur
      });
  };

  const handleBuatPesanan = (data) => {
    const cartItemCount = Object.values(data.cart).filter((item) => typeof item === "object").length;
    const generateUniqueRandomNumber = () => {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      return randomNumber;
    };
    const invoice = "INV" + "-" + Date.now() + generateUniqueRandomNumber();
    const trackingId = generateUniqueRandomNumber() + Date.now();
    const apiUrl = `${process.env.REACT_APP_MY_API}/checkout`;
    let isSwalDisplayed = false; // Flag variable to track Swal notification

    if (userUuid) {
      try {
        if (selectedMethod === "") {
          Swal.fire("Peringatan!", "Mohon pilih metode pembayaran Anda.", "warning");
        } else {
          if (cartItemCount >= 1) {
            Object.values(data.cart).forEach((dc, index) => {
              const formData = new FormData(); // Buat objek FormData baru untuk setiap iterasi

              formData.append("userUuid", userUuid);
              formData.append("invoice", invoice);
              formData.append("paymentMethodUuid", data.selectedMethod);
              formData.append("ekspedisi", data.courier.selectedCourier);
              formData.append("shippingCost", data.courier.shippingCost);
              formData.append("addressUuid", data.shippingAddress.uuid);
              formData.append("cartUuid", dc.uuid);
              formData.append("trackingId", trackingId);
              formData.append("quantity", dc.quantity);

              axios
                .post(apiUrl, formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then((response) => {
                  console.log(response.data.msg); // Log success message to the console or perform other actions
                  if (!isSwalDisplayed && index === cartItemCount - 1) {
                    Swal.fire({
                      title: "Berhasil",
                      text: "Anda berhasil checkout, silahkan check billing history!",
                      icon: "success",
                      backdrop: "backdrop-filter backdrop-blur-lg",
                      showCancelButton: true,
                      cancelButtonText: "Lanjut Belanja",
                      confirmButtonText: "Billing History",
                    }).then((result) => {
                      // Update the cart status to false (inactive)
                      Object.values(data.cart).forEach((dc) => {
                        const cartUuid = dc.uuid; // Assuming dc is the current cart item
                        const updateCartUrl = `${process.env.REACT_APP_MY_API}/cart/${cartUuid}`;
                        axios.put(updateCartUrl, { statusActive: false });
                      });
                      if (result.dismiss === Swal.DismissReason.cancel) {
                        // User clicked "Lanjut Belanja"
                        navigate("/products");
                      } else if (result.isConfirmed) {
                        // User clicked "Billing History"
                        navigate("/billing-history");
                      }
                    });
                    isSwalDisplayed = true;
                  }
                })
                .catch((error) => {
                  console.error(error); // Handle error if it occurs
                  if (!isSwalDisplayed && index === cartItemCount - 1) {
                    Swal.fire({
                      title: "Error",
                      text: "Terjadi kesalahan saat checkout",
                      icon: "error",
                    });
                    isSwalDisplayed = true;
                  }
                });
            });
          } else {
            const formData = new FormData(); // Buat objek FormData baru

            formData.append("userUuid", userUuid);
            formData.append("invoice", invoice);
            formData.append("paymentMethod", data.selectedMethod);
            formData.append("ekspedisi", data.courier.selectedCourier);
            formData.append("shippingCost", data.courier.shippingCost);
            formData.append("addressUuid", data.shippingAddress.uuid);

            const dc = data.cart;
            formData.append("cartUuid", dc.uuid);
            formData.append("quantity", dc.quantity);

            axios
              .post(apiUrl, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((response) => {
                console.log(response.data.msg); // Tampilkan pesan keberhasilan di konsol atau lakukan tindakan lain
                Swal.fire({
                  title: "Berhasil",
                  text: "Anda berhasil checkout!",
                  icon: "success",
                });
                // if (redirect) {
                //   navigate("/cart");
                // }
              })
              .catch((error) => {
                console.error(error); // Tangani kesalahan jika terjadi
                Swal.fire({
                  title: "Error",
                  text: "Terjadi kesalahan saat checkout",
                  icon: "error",
                });
              });
          }
        }
      } catch (error) {
        if (error.response) {
          console.log(error.response);
          Swal.fire({
            title: "Error",
            text: error.response,
            icon: "error",
          });
        }
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="py-4 px-8 bg-white shadow-lg rounded-lg mt-10">
        <div className="flex flex-col gap-2 justify-center md:justify-start -mt-14 mb-5">
          <img className="w-16 h-16 object-cover rounded-full border-2 border-blue-500" src="https://img.freepik.com/premium-vector/red-geolocation-icon_74669-526.jpg" alt="" />
          <h1 className="text-blue-700/70">Alamat Pengiriman</h1>
        </div>
        <div className="flex items-center gap-10 justify-between">
          <h2 className="text-gray-800 text-lg font-semibold">
            {shippingAddress?.name}&nbsp;
            <span className="text-sm">({shippingAddress?.phoneNumber})</span>
          </h2>
          <p className="text-gray-600 w-full">{shippingAddress?.detailAddress}</p>
          <button className="text-md font-medium text-blue-700/80" onClick={handleUbahClick}>
            Ubah
          </button>
          <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Pilih Alamat</DialogTitle>
            <DialogContent>
              <div className="flex flex-row items-center justify-between gap-2 mb-2 font-semibold">
                <h1 className="flex-1">Nama Penerima/No. Telp</h1>
                <h1 className="flex-1">Alamat</h1>
              </div>
              {address.map((a, idx) => {
                return (
                  <div key={a.uuid + idx} onClick={() => handleSetPrimaryAddress(a.uuid)}>
                    <Divider />
                    <div className="flex flex-row py-2 items-center justify-between gap-2 hover:bg-gray-100/50 cursor-pointer">
                      <p className="flex-1 cursor-pointer">
                        {a.name}
                        <p className="text-gray-500">({formatPhoneNumber(a.phoneNumber)})</p>
                      </p>
                      <p className="flex-1 cursor-pointer">{a.detailAddress}</p>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-end items-end mt-6">
                <Button primary onClick={() => navigate("/user/account/address/add-address")}>
                  Tambah Alamat
                </Button>
              </div>
            </DialogContent>
            <DialogActions>{/* Add code here for dialog actions */}</DialogActions>
          </Dialog>
        </div>
      </div>
      <div className="py-4 px-8 bg-white shadow-lg rounded-lg mt-10">
        <div className="relative overflow-x-auto">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Produk Dipesan</TableCell>
                  <TableCell align="center">Harga Satuan</TableCell>
                  <TableCell align="center">Qty</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state?.selectedItems.map((row) => {
                  return (
                    <TableRow key={row.invoice} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell sx={{ display: "flex", alignItems: "center", gap: 2 }} component="th" scope="row">
                        <img className="w-16 h-16 object-cover" src={row?.product?.imageUrl} alt="" />
                        {row?.product?.nameProduct}
                      </TableCell>
                      <TableCell align="center">{formatter.format(row?.product?.price)}</TableCell>
                      <TableCell align="center">{row.quantity}</TableCell>
                      <TableCell align="right">{formatter.format(row.subtotal)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Divider />
        <div className="flex justify-end items-center gap-16 my-6 text-sm">
          <div className="flex justify-end items-center gap-16 my-6 text-sm">
            <div className="inline-flex justify-center items-center gap-2">
              <p className="font-semibold">Opsi Pengiriman</p>
              <FormControl>
                <Select
                  value={selectedCourier}
                  onChange={handleCourierChange}
                  displayEmpty
                  renderValue={(value) => (value ? value : "Pilih Kurir")}
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Pilih Kurir</em>
                  </MenuItem>
                  <MenuItem value="jne">JNE</MenuItem>
                  <MenuItem value="tiki">TIKI</MenuItem>
                  <MenuItem value="pos">POS Indonesia</MenuItem>
                  {/* Add other courier options as needed */}
                </Select>
              </FormControl>
            </div>
          </div>
          <p>{formatter.format(shippingCost)}</p>
        </div>
        <Divider />
        <div className="flex justify-end items-center gap-16 mt-6">
          <p className="text-sm text-gray-500">Total Pesanan:</p>
          <p className="text-lg text-blue-700/80">{formatter.format(totalSeluruh)}</p>
        </div>
      </div>
      <div className="py-4 px-8 bg-white shadow-lg rounded-lg mt-10">
        <div className="flex gap-6 my-6 items-center">
          <h1>Metode Pembayaran:</h1>
          <RadioGroup className="flex !flex-row gap-2" name="paymentMethod" value={selectedMethod} onChange={handleMethodChange}>
            {paymentMethods?.map((pm, idx) => (
              <FormControlLabel
                key={pm.uuid + idx}
                value={pm.uuid}
                control={<Radio size="small" className="!hidden" />}
                label={pm.paymentName}
                classes={{
                  root: `border ${selectedMethod === pm.uuid ? "border-blue-500" : "hover:border-blue-900/50 hover:bg-blue-900/10 border-gray-300"}`,
                  label: `px-4 py-2 ${selectedMethod === pm.uuid ? "text-blue-500" : "hover:text-blue-900/50 text-gray-500"}`,
                }}
              />
            ))}
          </RadioGroup>
        </div>
        <Divider />
        <div className="flex justify-end gap-12 my-6 text-sm text-gray-500">
          <div className="flex flex-col gap-4">
            <span>Subtotal untuk Produk:</span>
            <span>Total Ongkos Kirim:</span>
            <span>Total Pembayaran:</span>
          </div>
          <div className="flex flex-col gap-4 text-end">
            <span>{formatter.format(totalSeluruh)}</span>
            <span>{formatter.format(shippingCost)}</span>
            <span>{formatter.format(totalSeluruh + shippingCost)}</span>
          </div>
        </div>
        <Divider />
        <div className="flex justify-end gap-12 mt-6 text-sm text-gray-500">
          {state && (
            <Button
              primary
              onClick={(e) => {
                e.preventDefault();
                handleBuatPesanan({
                  shippingAddress,
                  courier: { selectedCourier, shippingCost },
                  paymentTotal: totalSeluruh + shippingCost,
                  selectedMethod,
                  cart: { ...state.selectedItems },
                });
              }}
            >
              Buat Pesanan
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
