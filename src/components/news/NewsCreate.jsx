import axios from "axios";
import styled from "styled-components";
import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button, DatePicker, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

const StyledInput = styled(Input)`
  border: 1px solid #e7e7e7 !important;
  box-shadow: none !important;
  border-radius: 10px;
  padding: 4px 10px !important;

  &::placeholder {
    color: #464b59;
  }

  &:active {
    border: 1px solid red;
  }

  &:focus {
    border-color: black !important;
    box-shadow: none !important;
  }

  /* Ant Design xato holatida qizil border qo'shish */
  .ant-form-item-has-error & {
    border-color: red !important;
  }

  @media (min-width: 768px) {
    padding: 13px 15px;
  }
`;

const StyledTextArea = styled(TextArea)`
  border: 1px solid #e7e7e7 !important;
  box-shadow: none !important;
  border-radius: 10px;
  padding: 12px 20px !important;
  font-size: 15px;
  resize: none !important;

  &::placeholder {
    color: #737373;
  }

  &:active {
    border: 1px solid red;
  }

  &:focus {
    box-shadow: none !important;
  }

  /* Ant Design xato holatida qizil border qo'shish */
  .ant-form-item-has-error & {
    border-color: red !important;
  }

  @media (min-width: 768px) {
    padding: 13px 15px;
  }
`;

export const NewsCreate = ({ reFetch }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const cancelForm = () => {
    
  }

  const onFinish = async (values) => {
    const formData = new FormData();

    setLoad(true);

    if (load === true) {
      return;
    }

    formData.append("news_title_uz", values.title.uzb);
    formData.append("news_title_ru", values.title.rus);
    formData.append("news_title_eng", values.title.eng);
    formData.append("news_about_uz", values.description.uzb);
    formData.append("news_about_ru", values.description.rus);
    formData.append("news_about_eng", values.description.eng);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      let { data } = await axios.post("/news/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.status === 201) {
        form.resetFields();
        reFetch();
        setPreviewImage(null);
        setSelectedImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="lg:pl-4 lg:border-l w-full border-[#D9D9D9]">
      <Form
        form={form}
        name="news"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        className="flex flex-col gap-5"
      >
        <Form.Item>
          <div className="flex flex-col gap-4">
            <label className="cursor-pointer flex flex-col flex- gap-2 px-4 py-2 border border-[#D9D9D9] rounded-lg hover:bg-[#f5f5f5] transition-colors duration-200">
              <span className="text-[#3F73BC] font-medium">
                {t("select_image")}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required
              />
            </label>

            {previewImage && (
              <div className="w-[100px] h-[100px] relative">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover rounded border border-[#D9D9D9]"
                />
              </div>
            )}
          </div>
        </Form.Item>

        {/* Ryc */}
        <Form.Item
          className="!mb-0"
          label={
            <span className="font-medium text-[#13265C]">{t("title")}</span>
          }
          name={["title", "rus"]}
          rules={[{ required: true, message: "" }]}
        >
          <div className="flex items-center gap-[6px]">
            <StyledInput
              size="large"
              // placeholder="Dars nomi"
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Рус
                </span>
              }
            />
          </div>
        </Form.Item>

        {/* Uzb */}
        <Form.Item
          className="!mb-0"
          name={["title", "uzb"]}
          rules={[{ required: true, message: "" }]}
        >
          <div className="flex items-center gap-[6px]">
            <StyledInput
              size="large"
              // placeholder="Dars nomi"
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Uzb
                </span>
              }
            />
            {/* <button
                  type="button"
                  className="w-[53px] cursor-pointer h-[41px] flex items-center justify-center border border-[#D9D9D9] rounded-[8px]"
                >
                  <Trash2 color="red" />
                </button> */}
          </div>
        </Form.Item>

        {/* Eng */}
        <Form.Item
          className="!mb-0"
          name={["title", "eng"]}
          rules={[{ required: true, message: "" }]}
        >
          <div className="flex items-center gap-[6px]">
            <StyledInput
              size="large"
              // placeholder="Dars nomi"
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Eng
                </span>
              }
            />
          </div>
        </Form.Item>

        <Form.Item
          className="!mb-0"
          label={
            <span className="font-medium text-[#13265C]">
              {t("information")}
            </span>
          }
          name={["description", "rus"]}
          rules={[{ required: true, message: "" }]}
        >
          <div className="flex items-center gap-[6px]">
            <StyledTextArea
              rows={3}
              placeholder="Рус"
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Рус
                </span>
              }
            />
          </div>
        </Form.Item>

        {/* Uzb */}
        <Form.Item
          className="!mb-0"
          name={["description", "uzb"]}
          rules={[{ required: true, message: "" }]}
        >
          <div className="flex items-center gap-[6px]">
            <StyledTextArea
              rows={3}
              placeholder="Uzb"
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Uzb
                </span>
              }
            />
          </div>
        </Form.Item>
        {/* Eng */}
        <Form.Item
          className="!mb-0"
          name={["description", "eng"]}
          rules={[{ required: true, message: "" }]}
        >
          <div className="flex items-center gap-[6px]">
            <StyledTextArea
              rows={3}
              placeholder="Eng"
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Eng
                </span>
              }
            />
          </div>
        </Form.Item>
        <Form.Item className="flex">
          <button
            onClick={() => cancelForm()}
            className="mr-5 mb-2 text-sm font-medium py-[10px] px-8 border border-[#D9D9D9] rounded-[8px] cursor-pointer"
          >
            {t("delete")}
          </button>
          <button
            className="text-sm font-medium py-[10px] px-8 bg-[#3F73BC] rounded-[8px] text-white cursor-pointer"
            htmlType="submit"
          >
            {load === true ? "Loading..." : <span>{t("save")}</span>}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};
