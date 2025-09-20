import { Col, Form, message, Modal, Row, Table, TimePicker } from "antd";
import Button from "../../../components/button";
import React, { useEffect } from "react";
import { GetAllMovies } from "../../../apiscalls/movies";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loadersSlice";
import { AddShow, UpdateShow, DeleteShow, GetAllShowsByTheatre } from "../../../apiscalls/theatres";
import moment from 'moment';

function Shows({ openShowsModal, setOpenShowsModal, theatre }) {
  const [view, setView] = React.useState("table");
  const [shows, setShows] = React.useState([]);
  const [movies, setMovies] = React.useState([]);
  const [selectedShow, setSelectedShow] = React.useState(null);
  const [formType, setFormType] = React.useState("add");
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const moviesResponse = await GetAllMovies();
      if (moviesResponse.success) {
        // Filter out null/undefined movies
        const validMovies = (moviesResponse.data || []).filter(movie => movie && movie._id);
        setMovies(validMovies);
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

  const handleSubmit = async(values)=>{
    try{
      dispatch(ShowLoading());
      // Format time to HH:mm, handling dayjs object from TimePicker
      const formattedValues = {
        ...values,
        time: values.time ? moment(values.time.toDate()).format("HH:mm") : values.time,
        theatre: theatre._id
      };
      if(formType === "edit") {
        formattedValues.showId = selectedShow._id;
        const response=await UpdateShow(formattedValues);
        if(response.success){
          message.success(response.message);
          getData();
          setView("table");
          setFormType("add");
          setSelectedShow(null);
        }else{
          message.error(response.message)
        }
      } else {
        const response=await AddShow(formattedValues);
        if(response.success){
          message.success(response.message);
          getData();
          setView("table");
        }else{
          message.error(response.message)
        }
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

  const handleEdit = (show) => {
    setSelectedShow(show);
    setFormType("edit");
    setView("form");
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
      render: (text, record) => {
        return moment(text, "HH:mm").format("hh:mm A");
      }
    },
    {
      title: "Movie",
      dataIndex: "movie",
      render:(text,record)=>{
        // Add null checking for movie and movie.title
        return record?.movie?.title || "N/A";
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
            <i
              className="ri-pencil-line"
              onClick={() => {
                handleEdit(record);
              }}
            ></i>
           <i
            className="ri-delete-bin-line"
            onClick={() => {
              handleDelete(record._id);
            }}
           ></i>
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
          {view === "table" ? "Shows" : formType === "edit" ? "Edit Show" : "Add Show"}
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
        onFinish={handleSubmit}
        initialValues={formType === "edit" ? {
          name: selectedShow.name,
          date: moment(selectedShow.date).format("YYYY-MM-DD"),
          time: moment(selectedShow.time, "HH:mm"),
          movie: selectedShow.movie._id,
          ticketPrice: selectedShow.ticketPrice,
          totalSeats: selectedShow.totalSeats
        } : {}}
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
                <TimePicker format="hh:mm A" use12Hours />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Movie" name="movie"   rules={[{required:true,message:"please input movie.!"}]}>
                <select>
                  <option value="">Select Movie</option>
                  {movies.filter(movie => movie && movie._id).map((movie)=>(
                    <option key={movie._id} value={movie._id}>{movie?.title || "N/A"}</option>
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
