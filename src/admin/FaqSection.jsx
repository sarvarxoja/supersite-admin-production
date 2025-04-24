import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Dot,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { UpdateModal } from "../components/UpdateModal";
import { Button, DatePicker, Form, Input } from "antd";
import DeleteConfirmationModal from "../components/DeleteModal";

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
  border: 1px solid #d9d9d9 !important;
  box-shadow: none !important;
  padding: 12px 20px !important;
  font-size: 15px;
  resize: none !important;

  &::placeholder {
    color: #737373;
  }
  &:focus {
    border: 1px solid #d9d9d9 !important;
    box-shadow: none !important;
  }

  .ant-form-item-has-error & {
    border-color: red !important;
  }

  @media (min-width: 768px) {
    padding: 13px 15px;
  }
`;
const StyledTextAreaWithPrefix = ({ prefix, ...props }) => {
  return (
    <div className="textarea-with-prefix">
      <div className="textarea-prefix">{prefix}</div>
      <StyledTextArea {...props} />
    </div>
  );
};

export default function FaqSection() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [dataId, setDataId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState("");

  const { lang } = useParams();
  const { t } = useTranslation();

  function openAndClose(id) {
    setSelectedData(id);
    setIsOpen(!isOpen);
  }

  const onFinish = async (values) => {
    setLoad(true);

    if (load === true) {
      return;
    }

    try {
      let { data } = await axios.post("/questions/create", {
        question_uz: values.title.uzb,
        question_ru: values.title.ryc,
        question_eng: values.title.eng,
        answer_uz: values.description.uzb,
        answer_ru: values.description.ryc,
        answer_eng: values.description.eng,
      });

      if (data.status === 201) {
        form.resetFields();
        fetchQuestions();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      let { data } = await axios.get("/questions/all?page=1&&limit=20");
      setData(data.questions);
    } catch (error) {
      console.log(error);
    }
  }

  function cancelForm() {
    form.resetFields();
  }

  async function handleDelete() {
    setDeleteLoad(true);

    if (deleteLoad === true) {
      return;
    }

    try {
      await axios.delete(`/questions/${selectedData}`);
      openAndClose();
      fetchQuestions();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoad(false);
    }
  }

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUpdateItem, setSelectedUpdateItem] = useState(null);

  const handleUpdateOpenModal = (item) => {
    setSelectedUpdateItem(item);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      let { data } = await axios.patch(`/questions/${selectedUpdateItem.id}`, updatedData);
      console.log(data)
      fetchQuestions()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-2 md:px-5 bg-white">
      <div className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex flex-col min-[450px]:flex-row min-[450px]:items-center gap-3 md:gap-5"
            >
              <div className="border border-[#D9D9D9] rounded-[8px] px-[15px] py-[12px] w-full">
                <div
                  onClick={() => setDataId(dataId === item.id ? null : item.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <p className="text-[#222222] text-base md:text-xl font-medium flex items-center">
                    <Dot />
                    {"" + lang === "en"
                      ? item.question_eng
                      : lang === "ru"
                      ? item.question_ru
                      : item.question_uz}
                  </p>
                  {dataId === item.id ? <ChevronUp /> : <ChevronDown />}
                </div>
                {dataId === item.id && (
                  <p className="pt-4 text-[#737373] text-sm md:text-base">
                    {lang === "en"
                      ? item.answer_eng
                      : lang === "ru"
                      ? item.answer_ru
                      : item.answer_uz}
                  </p>
                )}
              </div>
  
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={() => openAndClose(item.id)}
                  className="cursor-pointer w-[54px] md:w-[84px] h-[54px] border border-[#D9D9D9] flex items-center justify-center rounded-[8px]"
                >
                  <Trash2 color="red" />
                </button>
                <button
                  onClick={() => handleUpdateOpenModal(item)}
                  className="cursor-pointer w-[54px] md:w-[84px] h-[54px] border border-[#D9D9D9] flex items-center justify-center rounded-[8px]"
                >
                  <Pencil color="green" />
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {/* Form */}
        <Form
          form={form}
          name="news"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          className="flex flex-col gap-5"
        >
          {/* Question Fields */}
          <Form.Item
            className="!mb-0"
            name={["title", "ryc"]}
            rules={[{ required: true, message: "" }]}
            label={<span>{t("question")}</span>}
          >
            <StyledInput
              size="large"
              placeholder=""
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] mr-2 bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Рус
                </span>
              }
            />
          </Form.Item>
  
          <Form.Item
            className="!mb-0"
            name={["title", "uzb"]}
            rules={[{ required: true, message: "" }]}
          >
            <StyledInput
              size="large"
              placeholder=""
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] mr-2 bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Uzb
                </span>
              }
            />
          </Form.Item>
  
          <Form.Item
            className="!mb-0"
            name={["title", "eng"]}
            rules={[{ required: true, message: "" }]}
          >
            <StyledInput
              size="large"
              placeholder=""
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] mr-2 bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Eng
                </span>
              }
            />
          </Form.Item>
  
          {/* Answer Fields */}
          <Form.Item
            name={["description", "ryc"]}
            label={<span>{t("answer")}</span>}
            rules={[{ required: true, message: "" }]}
          >
            <StyledTextAreaWithPrefix
              rows={2}
              placeholder=""
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Рус
                </span>
              }
            />
          </Form.Item>
  
          <Form.Item
            name={["description", "uzb"]}
            rules={[{ required: true, message: "" }]}
          >
            <StyledTextAreaWithPrefix
              rows={2}
              placeholder=""
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Uzb
                </span>
              }
            />
          </Form.Item>
  
          <Form.Item
            name={["description", "eng"]}
            rules={[{ required: true, message: "" }]}
          >
            <StyledTextAreaWithPrefix
              rows={2}
              placeholder=""
              prefix={
                <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                  Eng
                </span>
              }
            />
          </Form.Item>
  
          {/* Submit Button */}
          <Form.Item className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              className="text-lg font-medium py-[10px] px-6 border border-[#D9D9D9] rounded-[8px] cursor-pointer"
              onClick={() => cancelForm()}
            >
              {t("cancel")}
            </button>
            <button
              className="text-lg font-medium py-[10px] px-6 bg-[#3F73BC] rounded-[8px] text-white cursor-pointer ml-4"
              htmlType="submit"
            >
              {t(`${setLoad === false ? "Loading..." : "save"}`)}
            </button>
          </Form.Item>
        </Form>
  
        {/* Modals */}
        <DeleteConfirmationModal
          isOpen={isOpen}
          handleDelete={handleDelete}
          closeModal={openAndClose}
        />
        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          item={selectedUpdateItem}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
  
}
