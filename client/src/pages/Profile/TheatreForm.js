import React, { useEffect } from "react";
import { Modal, Form, message, Input } from "antd";
import Button from "../../components/button";
import {useDispatch, useSelector} from 'react-redux';
import {HideLoading,ShowLoading} from '../../redux/loadersSlice';
import { AddTheatre, UpdateTheatre } from "../../apiscalls/theatres";

function TheatreForm({
  showTheatreFormModal,
  setShowTheatreFormModal,
  formType,
  setFormType,
  selectedTheatre,
  setSelectedTheatre,
  getData
}) {
  const {user}=useSelector(state=>state.users)
  const dispatch=useDispatch();
  const [form] = Form.useForm();

  const onFinish= async(values)=>{
    values.owner = user._id;
    try{
      dispatch(ShowLoading());
      let response=null
      if(formType==='add'){
        response=await AddTheatre(values);
      }
      else{
        response=await UpdateTheatre({
          ...values,
          theatreId: selectedTheatre._id
        });
      }
      if(response.success){
        message.success(response.message);
        setShowTheatreFormModal(false)
        setSelectedTheatre(null);
        getData();
      }
      else{
        message.error(response.message);
      }
      dispatch(HideLoading());
    }
    catch(error){
      dispatch(HideLoading());
      message.error(error.message);
    }
  }

  useEffect(() => {
    if (selectedTheatre && formType === "edit") {
      form.setFieldsValue({
        name: selectedTheatre.name,
        address: selectedTheatre.address,
        phone: selectedTheatre.phone,
        email: selectedTheatre.email,
      });
    } else {
      form.resetFields();
    }
  }, [selectedTheatre, formType, form]);

  return (
    <Modal
      title={formType === "add" ? "Add Theatre" : "Edit Theatre"}
      open={showTheatreFormModal}
      onCancel={() => {
        setShowTheatreFormModal(false);
        setSelectedTheatre(null);
      }}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "please input theatre name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "please input theatre address!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "please input theatre phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "please input theatre email!" }]}
        >
          <Input />
        </Form.Item>
        
        <div className='flex justify-end gap-1'>
          <Button title="Cancel" variant='outlined' type="button"
            onClick={()=>{
              setShowTheatreFormModal(false)
              setSelectedTheatre(null)
            }}
          />
          <Button title="Save" type='submit' />
        </div>
      </Form>
    </Modal>
  );
}

export default TheatreForm;
