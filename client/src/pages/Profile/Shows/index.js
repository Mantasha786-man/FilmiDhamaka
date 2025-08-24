import { Col, Form, message, Modal, Row, Table } from "antd";
import Button from "../../../components/button";
import React, { useEffect } from "react";
import { GetAllMovies } from "../../../apiscalls/movies";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loadersSlice";
import { AddShow, DeleteShow, GetAllShowsByTheatre } from "../../../apiscalls/theatres";
import moment from 'moment';

function Shows({ openShowsModal, setOpenShowsModal, theatre }) {
  const [view, setView] = React.useState("table");
  const [shows, setShows] = React.useState([]);
  const [movies, setMovies] = React.useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const moviesResponse = await GetAllMovies();
      if (moviesResponse.success) {
        setMovies(moviesResponse.data);
      } else {
        message.error(moviesResponse.message);
      }
      const showResponse=await GetAllShowsByTheatre({
        theatreId: theatre._id
      });
      if(showResponse.success){
        setShows(showResponse.data);
      }else{
        message.error(showResponse.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const handleAddShow = async(values)=>{
    try{
      dispatch(ShowLoading());
      const response=await AddShow({
        ...values,
      theatre: theatre._id
      });
      if(response.success){
        message.success(response.message);
        getData();
        setView("table");
      }else{
        message.error(response.message)
      }
      dispatch(HideLoading());
    }catch(error){
      message.error(error.message);
      dispatch(HideLoading());
    }
  }

  const handleDelete=async(id)=>{
    try{
      dispatch(ShowLoading());
      const response=await DeleteShow({showId:id});
      if(response.success){
        message.success(response.message);
        getData();
      }else{
        message.error(response.message)
      }
      dispatch(HideLoading());
    }catch(error){
      message.error(error.message);
      dispatch(HideLoading());
    }
  }

  const columns = [
    {
      title: "Show Name",
      dataIndex: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      render:(text,record)=>{
        return moment(text).format("MMMM Do YYYY")
      }
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Movie",
      dataIndex: "movie",
      render:(text,record)=>{
        return record.movie.title;
      }
    },
    {
      title: "Ticket Price",
      dataIndex: "ticketPrice",
    },
    {
      title: "Total Seats",
      dataIndex: "totalSeats",
    },
    {
      title: "Avalible Seats",
      dataIndex: "aviailableSeats",
      render:(text,record)=>{
        return record.totalSeats - (record.bookedSeats?.length || 0);
      }
    },
    {
      title: "Action",
      dataIndex: "action",
         render: (text, record) => {
        return (
          <div className="flex gap-1 items-center">
           {record.bookedSeats.length === 0 && (
             <i 
              className="ri-delete-bin-line"
              onClick={() => {
                handleDelete(record._id);
              }}
            ></i>
           )}
          </div>
        );
      },
    },
  ];

  useEffect(()=>{
    getData();
  },[]);

  return (
    <Modal
      title=""
      open={openShowsModal}
      onCancel={() => setOpenShowsModal(false)}
      width={1400}
      footer={null}
    >
      <h1 className="text-primary text-md uppercase mb-1">
        Theatre : {theatre?.name}
      </h1>
      <hr />

      <div className="flex justify-between mt-1 mb-1 items-center">
        <h1 className="text-md uppercase">
          {view === "table" ? "Shows" : "Add Show"}
        </h1>
        {view === "table" &&   <Button
          title="Add Show"
          variant="outlined"
          onClick={() => {
            setView("form");
          }}
        />}
      </div>

      {view === "table" && <Table columns={columns} dataSource={shows} />}
      {view === "form" && (
        <Form layout="vartical"
        onFinish={handleAddShow}
        >
          <Row gutter={[16,16]}>
            <Col span={8}>
              <Form.Item label="Show Name" name="name"
              rules={[{required:true,message:"please input show name.!"}]}>
                <input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Date" name="date"
                rules={[{required:true,message:"please input show date.!"}]}>
                <input type="date" min={new Date().toISOString().split("T")[0]}/>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Time" name="time"
                rules={[{required:true,message:"please input show time.!"}]}>
                <input type="time" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Movie" name="movie"   rules={[{required:true,message:"please input movie.!"}]}>
                <select>
                  <option value="">Select Movie</option>
                  {movies.map((movie)=>(
                    <option value={movie._id}>{movie.title}</option>
                  ))}
                </select>
              </Form.Item>
            </Col>

             <Col span={8}>
              <Form.Item label="Ticket Price" name="ticketPrice"
                rules={[{required:true,message:"please input ticket price.!"}]}>
                <input type="number" />
              </Form.Item>
            </Col>

             <Col span={8}>
              <Form.Item label="Total Seats" name="totalSeats"
                rules={[{required:true,message:"please input total seat.!"}]}>
                <input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex justify-end gap-1">
            <Button variant="outlined" title="Cancel" onClick={()=>{
              setView("table");
            }}/>
            <Button variant="contained" title="SAVE" type="submit"/>
          </div>
        </Form>
      )}
    </Modal>
  );
}

export default Shows;
