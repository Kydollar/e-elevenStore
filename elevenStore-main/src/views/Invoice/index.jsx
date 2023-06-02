import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Button from "components/Button";
import Swal from "sweetalert2";
import { Divider, IconButton, TextField } from "@mui/material";
import moment from "moment";
import "moment/locale/id";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber, formatter } from "utils/useFormatter";
import { Clear, HighlightOff } from "@mui/icons-material";

import PaidImage from "../../assets/images/paid.webp";
import RejectedImage from "../../assets/images/rejected.jpg";

moment.locale("id");

const columns = [
  {
    name: "uuid",
    label: "Uuid",
    options: {
      filter: false,
      sort: false,
      display: false,
      viewColumns: false,
      customBodyRender: (value) => {
        return <div className="whitespace-nowrap">{value}</div>;
      },
    },
  },
  {
    name: "invoice",
    label: "Invoice",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => {
        return <div className="whitespace-nowrap">{value}</div>;
      },
    },
  },
  {
    name: "userUuid",
    label: "User Uuid",
    options: {
      filter: false,
      sort: false,
      display: false,
      viewColumns: false,
      customBodyRender: (value) => {
        return <div className="whitespace-nowrap">{value}</div>;
      },
    },
  },
  {
    name: "product",
    label: "Product Item",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => {
        return (
          <div className="flex flex-col whitespace-nowrap">
            {value.map((v, idx) => (
              <p key={idx} className="font-semibold cursor-pointer">
                {v}
              </p>
            ))}
          </div>
        );
      },
    },
  },
  {
    name: "tracking",
    label: "Tracking",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => {
        return <div className="whitespace-nowrap">{value}</div>;
      },
    },
  },
  {
    name: "paymentMethod",
    label: "Payment Method",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => {
        return <div className="whitespace-nowrap">{value}</div>;
      },
    },
  },
  {
    name: "createdAt",
    label: "Transaction Time",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => {
        const formattedDate = moment(value).format("LLLL");
        return <div className="whitespace-nowrap">{formattedDate}</div>;
      },
    },
  },
  {
    name: "paymentLimit",
    label: "Transaction End",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => {
        const formattedDate = moment(value).format("LLLL");
        return <div className="whitespace-nowrap">{formattedDate}</div>;
      },
    },
  },
  {
    name: "status",
    label: "Status",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => {
        if (value === null) {
          return <span className="bg-gradient-to-tl from-yellow-600 to-amber-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">Pending</span>;
        } else if (value === false) {
          return <div className="bg-gradient-to-tl from-red-600 to-rose-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">Rejected</div>;
        } else {
          return <div className="bg-gradient-to-tl from-green-600 to-lime-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">Paid</div>;
        }
      },
    },
  },
];

const Invoice = () => {
  const [falseResponse, setFalseResponse] = useState([]);
  const [trueResponse, setTrueResponse] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [lastCombinedData, setLastCombinedData] = useState(null);
  const [clickInvoice, setClickInvoice] = useState(null);
  const [lastDataBoolean, setLastDataBoolean] = useState(false);

  const userUuid = useSelector((state) => state?.auth?.user?.uuid);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userUuid) return;

    const getTrueResponse = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_MY_API}/checkout/${userUuid}?status=true`);
        return response.data;
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.msg);
        }
        return null;
      }
    };

    const getFalseResponse = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_MY_API}/checkout/${userUuid}?status=false`);
        return response.data;
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.msg);
        }
        return null;
      }
    };

    const fetchData = async () => {
      const trueResponse = await getTrueResponse();
      const falseResponse = await getFalseResponse();

      if (trueResponse && falseResponse) {
        const combinedDataAxios = [...trueResponse, ...falseResponse];
        setCombinedData(
          Object.values(
            combinedDataAxios.reduce((acc, primary) => {
              const { invoice } = primary;
              if (!acc[invoice]) {
                acc[invoice] = { ...primary, cart: [primary.cart] };
              } else {
                acc[invoice].cart.push(primary.cart);
              }
              return acc;
            }, {})
          )
        );
      } else if (trueResponse) {
        setCombinedData(trueResponse);
      } else if (falseResponse) {
        setCombinedData(falseResponse);
      }
    };

    fetchData();
  }, [userUuid]);

  useEffect(() => {
    if (combinedData.length > 0 || !clickInvoice) {
      if (clickInvoice) {
        // Get combinedData by invoice (using data from clickInvoice)
        const filteredData = combinedData.filter((data) => data.invoice === clickInvoice);
        const sortedData = filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLastCombinedData(sortedData[0]);
        setLastDataBoolean(false);
      } else {
        // Sort combinedData by createdAt
        const sortedData = combinedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLastCombinedData(sortedData[0]);
        setLastDataBoolean(true);
      }
    }
  }, [combinedData, clickInvoice]);

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: "0px 0px 5px 2px rgba(0,0,0,0.03)",
              borderRadius: "0.5rem",
            },
          },
        },
        MUIDataTableToolbarSelect: {
          styleOverrides: {
            root: {
              padding: "14px 0px 14px 0px",
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              "&:hover": {
                backgroundColor: "#f5f5f5", // Add your desired hover background color here
                cursor: "pointer",
              },
            },
          },
        },
      },
    });

  const options = {
    textLabels: {
      body: {
        noMatch: "Invoice anda kosong!",
      },
    },
    search: true,
    selectableRows: "none",
    responsive: "standard",
    download: false,
    viewColumns: false,
    filter: true,
    pagination: false,
    onRowClick: (rowData) => {
      const selectedRowChildren = rowData.map((row) => {
        if (typeof row === "object" && row !== null && row.props && row.props.children) {
          return row.props.children;
        }
        return null;
      });
      setClickInvoice(selectedRowChildren[1]);
    },
  };

  return (
    <div className="relative">
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"List Invoice"}
          columns={columns}
          options={options}
          data={combinedData.map((primary) => [
            primary.uuid,
            primary.invoice,
            primary.userUuid,
            primary.cart.map((c) => c.product.nameProduct),
            primary.trackingId,
            primary.payment_method.paymentName,
            primary.createdAt,
            primary.paymentLimit,
            primary.status,
          ])}
        />
      </ThemeProvider>
      <div className="bg-white p-6 mt-6 rounded-lg" style={{ boxShadow: "0px 0px 5px 2px rgba(0,0,0,0.03)" }}>
        <h1 className="text-xl font-semibold">{lastDataBoolean && "New"} Invoice</h1>
        <Divider className="pt-2" />
        {combinedData.length > 0 ? (
          <>
            <div className="my-4 flex flex-row gap-12">
              <div>
                <h1 className="text-xl font-bold text-blue-500">INVOICE</h1>
                <p>
                  {"#"}
                  {lastCombinedData?.invoice}
                </p>
                <p>{moment(lastCombinedData?.createdAt).format("LLLL")}</p>
                <div className="mt-20">
                  <h1 className="text-gray-400">Client Details</h1>
                  <p>
                    {lastCombinedData?.user?.name} / {lastCombinedData?.address?.name}
                  </p>
                  <p>{formatPhoneNumber(lastCombinedData?.address?.phoneNumber)}</p>
                  <p>{lastCombinedData?.user?.email}</p>
                  <p>{lastCombinedData?.address?.detailAddress}</p>
                </div>
              </div>
              <div className="grow flex justify-end">
                <div className="text-end">
                  <h1 className="text-gray-400">Payment Method</h1>
                  <p>
                    {lastCombinedData?.payment_method.paymentName} ({lastCombinedData?.payment_method.name})
                  </p>
                  <p>No Rekening : {lastCombinedData?.payment_method.norek}</p>
                  <div className="flex justify-end">
                    <img src={lastCombinedData?.status === true ? PaidImage : RejectedImage} alt="payment" className="h-32 w-32" />
                  </div>
                </div>
              </div>
            </div>
            <Divider className="pt-2" />
            <div className="flex justify-center mt-10">
              <table className="w-full text-left table-auto print:text-sm" id="table-items">
                <thead>
                  <tr className="text-white bg-gray-700 print:bg-gray-300 print:text-black">
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2 text-right">Qty</th>
                    <th className="px-4 py-2 text-right">Unit Price</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {lastCombinedData?.cart.map((lc, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 border">{lc?.product.nameProduct}</td>
                      <td className="px-4 py-2 text-right border tabular-nums slashed-zero">{lc?.quantity}</td>
                      <td className="px-4 py-2 text-right border tabular-nums slashed-zero">{formatter.format(lc?.product.price)}</td>
                      <td className="px-4 py-2 text-right border tabular-nums slashed-zero">{formatter.format(lc?.subtotal)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td className="invisible"></td>
                    <td className="invisible"></td>
                    <td className="px-4 py-2 font-extrabold text-right border">Ongkir</td>
                    <td className="px-4 py-2 text-right border tabular-nums slashed-zero">{formatter.format(lastCombinedData?.shippingCost)}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="invisible"></td>
                    <td className="invisible"></td>
                    <td className="px-4 py-2 font-extrabold text-right border">Total</td>
                    <td className="px-4 py-2 text-right border tabular-nums slashed-zero">{formatter.format(lastCombinedData?.cart.reduce((total, item) => total + item.subtotal, 0) + lastCombinedData?.shippingCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-4">No invoice data available.</p>
        )}
      </div>
    </div>
  );
};

export default Invoice;
