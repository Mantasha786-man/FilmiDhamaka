import React, { useEffect, useState } from 'react'
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllTheatres } from "../../apiscalls/theatres";

function TheatrestList() {
  const [theatres, setTheatres] = useState([]);
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
      message.error(error?.message || "An error occurred while fetching theatres");
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
      title:"Status",
      dataIndex: "isActive",
      render:(text,record)=>{
        if(text){
          return "Approved";
        }else{
          return "Pending / Blocked";
        }
      }
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={theatres} rowKey="_id" />
    </div>
  );
}

export default TheatrestList;
