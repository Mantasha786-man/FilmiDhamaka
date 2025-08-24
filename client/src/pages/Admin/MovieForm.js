import React, { useEffect } from 'react';
import {Form, Modal, Row, Col, message, Input, Select, DatePicker} from 'antd';
import Button from '../../components/button';
import {useDispatch} from 'react-redux';
import {HideLoading, ShowLoading} from "../../redux/loadersSlice";
import { AddMovie, UpdateMovie } from '../../apiscalls/movies';
import moment from 'moment';
const { TextArea } = Input;
const { Option } = Select;

// MovieForm Component: Modal for adding or editing movie details
// This component provides a form interface for creating new movies or updating existing ones
function MovieForm({
  showMovieFormModal,     // Boolean to control modal visibility
  setShowMovieFormModal,  // Function to set modal visibility
  selectedMovie,          // Currently selected movie for editing (null for new movie)
  setSelectedMovie,       // Function to set selected movie
  getData,                // Function to refresh movie list after form submission
  formType                // Type of form: "add" for new movie, "edit" for existing movie
}) {
// jab edit karte hain to jo date aap daal rahe hain, us date ko dikhana
// When editing, show the date that was previously set
  const initialValues = selectedMovie ? {
    ...selectedMovie,
    releaseDate: selectedMovie.releaseDate ? moment(selectedMovie.releaseDate) : null
  } : {};

  const [form] = Form.useForm();
  const dispatch=useDispatch();

  // useEffect hook: Populate form fields when selectedMovie changes
  // This runs when the component mounts or when selectedMovie/form changes
  useEffect(() => {
    if (selectedMovie) {
      // Set form values with existing movie data for editing
      form.setFieldsValue({
        ...selectedMovie,
        releaseDate: selectedMovie.releaseDate ? moment(selectedMovie.releaseDate) : null
      });
    } else {
      // Reset form fields for new movie
      form.resetFields();
    }
  }, [selectedMovie, form]);

  // useEffect hook: Reset form when modal opens for adding new movie
  // This ensures clean form state when adding a new movie
  useEffect(() => {
    // Naya movie add karne ke liye modal khulte waqt form reset karna
    // Reset form when opening modal for adding new movie
    if (showMovieFormModal && formType === "add" && !selectedMovie) {
      form.resetFields();
    }
  }, [showMovieFormModal, formType, selectedMovie, form]);

  // onFinish function: Handles form submission
  // This function is called when the form is submitted successfully
  const onFinish= async(values)=>{
    try{
      dispatch(ShowLoading()) // Show loading indicator
      let response=null;
      
      // moment date ko string format mein convert karna
      // Convert moment date object to string format for API
      const formattedValues = {
        ...values,
        releaseDate: values.releaseDate ? values.releaseDate.format('YYYY-MM-DD') : null
      };
      
      // Determine whether to add new movie or update existing one
      if(formType === "add"){
        response=await AddMovie(formattedValues); // API call to add new movie
      }else{
          response=await UpdateMovie({ // API call to update existing movie
            ...formattedValues,
            movieId:selectedMovie._id // Include movie ID for update
          });
      }
      
      // Handle API response
      if(response.success){
        getData(); // Refresh movie list
        message.success(response.message); // Show success message
        setShowMovieFormModal(false); // Close modal
      }
      else{
        message.error(response.message); // Show error message
      }
       dispatch(HideLoading()) // Hide loading indicator
    }catch(error){
      dispatch(HideLoading()) // Hide loading indicator on error
      message.error(error.message) // Show error message
    }
  }
  return (
    <Modal title={formType==="add" ? "ADD MOVIE" : "EDIT MOVIE"}
    open={showMovieFormModal}
    onCancel={()=>{
      setShowMovieFormModal(false)
    setSelectedMovie(null);
    }}
    footer={null}
    width={800}
    >
   <Form layout='vertical' onFinish={onFinish}
   initialValues={initialValues}
   key={selectedMovie?._id || 'new'}
   >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Movie Name" name='title' rules={[{ required: true, message: 'Please enter movie name!' }]}>
            <Input placeholder="Enter movie name" />
          </Form.Item>
        </Col>

         <Col span={24}>
          <Form.Item label="Movie Description" name='description' rules={[{ required: true, message: 'Please enter movie description!'}]}>
            <TextArea rows={3} placeholder="Enter movie description" />
          </Form.Item>
        </Col>

         <Col span={8}>
          <Form.Item label="Movie Duration" name='duration' rules={[{ required: true, message: 'Please enter movie duration!'}]}>
            <Input placeholder="e.g., 120 " />
          </Form.Item>
        </Col>

         <Col span={8}>
          <Form.Item label="Language" name='language' rules={[{ required: true, message: 'Please select language!'}]}>
           <Select placeholder="Select Language">
            <Option value="English">English</Option>
            <Option value="Hindi">Hindi</Option>
            <Option value="Gujrati">Gujrati</Option>
           </Select>
          </Form.Item>
        </Col>

         <Col span={8}>
          <Form.Item label="Movie Release Date" name='releaseDate' rules={[{ required: true, message: 'Please select release date!'}]}>
            <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
          </Form.Item>
        </Col>

         <Col span={8}>
          <Form.Item label="Genre" name='genre' rules={[{ required: true, message: 'Please select genre!'}]}>
            <Select placeholder="Select Genre">
              <Option value="Action">Action</Option>
              <Option value="Adventure">Adventure</Option>
              <Option value="Comedy">Comedy</Option>
              <Option value="Drama">Drama</Option>
              <Option value="Romance">Romance</Option>
              <Option value="Horror">Horror</Option>
              <Option value="Fantasy">Fantasy</Option>
              <Option value="Animation">Animation</Option>
              <Option value="Musical">Musical</Option>
              <Option value="Biography">Biography</Option>
              <Option value="Historical">Historical</Option>
              <Option value="Crime">Crime</Option>
              <Option value="Family">Family</Option>
              <Option value="Sports">Sports</Option>
              <Option value="Documentary">Documentary</Option>
            </Select>
          </Form.Item>
        </Col>

         <Col span={16}>
          <Form.Item label="Poster URL" name='poster' rules={[{ required: true, message: 'Please enter poster URL!'}]}>
            <Input placeholder="Enter poster URL" />
          </Form.Item>
        </Col>
      </Row>
      {/* cancel save button */}
      <div className='flex justify-end gap-1'>
        <Button title="Cancel" variant='outlined' type="button"
        onClick={()=>{
          setShowMovieFormModal(false);
          setSelectedMovie(null);
        }}
        />
        <Button title="Save" type='submit' />
      </div>
   </Form>
    </Modal>
  )
}

export default MovieForm
