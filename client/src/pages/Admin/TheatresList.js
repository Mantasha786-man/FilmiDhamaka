import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllTheatres, UpdateTheatre, DeleteTheatre } from "../../apiscalls/theatres";
import Shows from "../Profile/Shows";
import TheatreForm from "../Profile/TheatreForm";
import Button from "../../components/button";

function TheatresList() {
  const [theatres, setTheatres] = useState([]);
  const [openShowsModal, setOpenShowsModal] = useState(false);
  const [showTheatreFormModal, setShowTheatreFormModal] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatres();
      if (response && response.success) {
        setTheatres(response.data || []);
      } else {
        message.error(response?.message || "Failed to fetch theatres");
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(
        error?.message || "An error occurred while fetching theatres"
      );
    }
  };

  const handleDelete = async (theatreId) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteTheatre({
        theatreId,
      });
      if (response && response.success) {
        message.success(response.message || "Theatre deleted successfully");
        getData();
      } else {
        message.error(response?.message || "Failed to delete theatre");
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error?.message || "An error occurred while deleting theatre");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1 items-center">
            <i 
              className="ri-delete-bin-line"
              onClick={() => {
                handleDelete(record._id);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedTheatre(record);
                setFormType("edit");
                setShowTheatreFormModal(true);
              }}
            ></i>
            <span className="underline"
            onClick={()=>{
              setSelectedTheatre(record);
              setOpenShowsModal(true);
            }}
            >Add Shows</span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-1">
        <Button
          title="Add Theatre"
          variant="outlined"
          onClick={() => {
            setFormType("add");
            setSelectedTheatre(null);
            setShowTheatreFormModal(true);
          }}
        />
      </div>

      <Table columns={columns} dataSource={theatres} rowKey="_id" />

      <TheatreForm
        showTheatreFormModal={showTheatreFormModal}
        setShowTheatreFormModal={setShowTheatreFormModal}
        selectedTheatre={selectedTheatre}
        setSelectedTheatre={setSelectedTheatre}
        formType={formType}
        getData={getData}
      />
      
      {openShowsModal && <Shows openShowsModal={openShowsModal}
      setOpenShowsModal={setOpenShowsModal}
      theatre={selectedTheatre}/>}
    </div>
  );
}

export default TheatresList;
