import axios from "axios";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import Img from "../assets/jam_picture.png";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button, DatePicker, Form, Input } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDateToUzbek } from "../utils/DateFormatter";
import DeleteConfirmationModal from "../components/DeleteModal";
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
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  max-width: 240px;
  border: 1px solid #e7e7e7 !important;
  box-shadow: none !important;
  border-radius: 10px;
  padding: 10px !important;

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
`;

export default function Course() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [catalogs, setCatalogs] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { id } = useParams();

  const { lang } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    fetchNews();
  }, []);

  function openAndClose() {
    setIsOpen(!isOpen);
  }

  async function handleDelete() {
    setDeleting(true);

    if (deleting === true) {
      return;
    }

    try {
      await axios.delete(`/courses/${id}`);
      openAndClose();
      fetchNews();
      navigate(`/${lang}/admin/courses/`);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  }

  async function fetchNews() {
    try {
      let { data } = await axios.get("/courses/all?page=1&limit=20");
      setCourses(data.courses);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCatalogs();
  }, []);

  async function fetchCatalogs() {
    try {
      let { data } = await axios.get("/courses/get/catalog");
      console.log(data);
      setCatalogs(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCourse();
  }, [id]);

  async function fetchCourse() {
    try {
      let { data } = await axios.get(`/courses/by/${id}`);
      setCourse(data.data);
    } catch (error) {
      setCourse(null);
      console.log(error);
    }
  }

  function cancelForm() {
    form.resetFields();
    setPreviewImage(null);
    setSelectedImage(null);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const [updatePreviewImage, setUpdatePreviewImage] = useState(null);
  const [selectedUpdateImage, setSelectedUpdateImage] = useState(null);

  async function handleUpdateImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedUpdateImage(file);
      setUpdatePreviewImage(URL.createObjectURL(file));
    }
  }

  const onFinish = async (values) => {
    const formData = new FormData();

    setLoad(true);

    if (load === true) {
      return;
    }

    formData.append("catalog", values.catalog);
    formData.append("catalog_uzb", values.catalog_uzb);
    formData.append("catalog_rus", values.catalog_ru);

    formData.append("course_title_uz", values.title.uzb);
    formData.append("course_title_ru", values.title.rus);
    formData.append("course_title_eng", values.title.eng);

    formData.append("benefits_uz", values.benefit.uzb);
    formData.append("benefits_ru", values.benefit.rus);
    formData.append("benefits_eng", values.benefit.eng);

    formData.append("objective_title_uz", values.objective_title_uz.uzb);
    formData.append("objective_title_ru", values.objective_title_ru.rus);
    formData.append("objective_title_eng", values.objective_title_eng.eng);

    formData.append("course_objective_ru", values.description.rus);
    formData.append("course_objective_uz", values.description.uzb);
    formData.append("course_objective_eng", values.description.eng);

    formData.append("end_title_uz", values.end_title_uz.uzb);
    formData.append("end_title_ru", values.end_title_ru.rus);
    formData.append("end_title_eng", values.end_title_eng.eng);

    formData.append("end_info_uz", values.end_info_uz.uzb);
    formData.append("end_info_ru", values.end_info_ru.rus);
    formData.append("end_info_eng", values.end_info_eng.eng);

    formData.append("course_price", values.price.eng);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      let { data } = await axios.post("/courses/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.status === 201) {
        form.resetFields();
        fetchNews();
        setPreviewImage(null);
        setSelectedImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  async function handleUpdate() {
    setUpdating(true);

    if (updating === true) return;

    try {
      const formData = new FormData();

      // course obyektidagi barcha maydonlarni qo‘shamiz
      for (const key in course) {
        formData.append(key, course[key]);
      }

      // yangi rasm tanlangan bo‘lsa, uni ham qo‘shamiz
      if (selectedUpdateImage) {
        formData.append("image", selectedUpdateImage); // "image" backendda .single("image")
      }

      await axios.patch(`/courses/${course.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchNews();
      fetchCourse();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="md:p-5 bg-white">
      <Link
        to={`/${lang}/admin/courses/create`}
        className="w-[190px] py-[10px] px-10 text-[#3F73BC] flex items-center gap-5 cursor-pointer rounded-[8px] border border-[#CDE2FF]"
      >
        <span>{t("add")}</span>
        <Plus size={15} />
      </Link>
      <div className="mt-10 flex flex-col-reverse gap-5">
        <div>
          {courses.map((e, index) => {
            return (
              <Link
                key={index}
                to={`/${lang}/admin/courses/${e.id}`}
                className="max-w-[320px] flex justify-center items-start cursor-pointer h-[200px] bg-[#F7F8FD] mb-2 rounded"
              >
                <img
                  src={`https://www.isouzbekistan.uz/api${e.image}`}
                  loading="lazy"
                  alt=""
                  className="h-full bg-cover rounded"
                />
              </Link>
            );
          })}
        </div>
        {!id ? (
          ""
        ) : course === null ? (
          <div className="w-full border-[#D9D9D9]">
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
                  <label className="cursor-pointer flex flex-col min-[565px]:flex-row gap-2 px-4 py-2 border border-[#D9D9D9] rounded-lg hover:bg-[#f5f5f5] transition-colors duration-200">
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
                        loading="lazy"
                        alt="Preview"
                        className="w-full h-full object-cover rounded border border-[#D9D9D9]"
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
              <h2 className="mb-[-20px] text-xl">{t("courses")}</h2>
              <div className="grid min-[500px]:grid-cols-2 min-[500px]:items-center md:grid-cols-4 gap-x-2 gap-y-1 mt-2">
                <div>
                  <Form.Item
                    className="!mb-0 flex-1"
                    name="catalog"
                    rules={[{ required: true, message: "" }]}
                  >
                    <div>
                      <input
                        list="currency-options"
                        name="catalog"
                        className="w-full h-[35px] border border-[#D9D9D9] rounded-[8px] px-3 text-[#13265C] bg-white focus:outline-none focus:ring-2 focus:ring-[#3F73BC]"
                        placeholder="Eng"
                        required
                      />
                      <datalist id="currency-options">
                        <option value="" disabled hidden>
                          Выберите курс
                        </option>
                          {catalogs.catalog?.map((e, i) => (
                          <option
                            key={i}
                            value={e}
                            className="bg-black text-white"
                          >
                            {e}
                          </option>
                        ))}
                      </datalist>
                    </div>
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    className="!mb-0 flex-1"
                    name="catalog_ru"
                    rules={[{ required: true, message: "" }]}
                  >
                    <div className="mt-2 mb-2">
                      <input
                        list="catalog-rus-options"
                        name="catalog_ru"
                        className="w-full h-[35px] border border-[#D9D9D9] rounded-[8px] px-3 text-[#13265C] bg-white focus:outline-none focus:ring-2 focus:ring-[#3F73BC]"
                        placeholder="Рус"
                        required
                      />
                      <datalist id="catalog-rus-options">
                        <option value="" disabled hidden>
                          Выберите курс
                        </option>
                        {catalogs.catalog_rus?.map((e, i) => (
                        <option
                          key={i}
                          value={e}
                          className="bg-black text-white"
                        >
                          {e}
                        </option>
                      ))}
                      </datalist>
                    </div>
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    className="!mb-0 flex-1"
                    name="catalog_uzb"
                    rules={[{ required: true, message: "" }]}
                  >
                    <div className="mt-2 mb-2">
                      <input
                        list="catalog-uzb-options"
                        name="catalog_uzb"
                        className="w-full h-[35px] border border-[#D9D9D9] rounded-[8px] px-3 text-[#13265C] bg-white focus:outline-none focus:ring-2 focus:ring-[#3F73BC]"
                        placeholder="Uzb"
                        required
                      />
                      <datalist id="catalog-uzb-options">
                        <option value="" disabled hidden>
                          Выберите курс
                        </option>
                        {catalogs.catalog_uzb?.map((e, i) => (
                        <option
                          key={i}
                          value={e}
                          className="bg-black text-white"
                        >
                          {e !== null ? e : ""}
                        </option>
                      ))}
                      </datalist>
                    </div>
                  </Form.Item>
                </div>
                <Form.Item
                  className="!mb-0 w-[150px] "
                  name={["price", "eng"]}
                  rules={[{ required: true, message: "" }]}
                >
                  <StyledInput
                    size="large"
                    type="number"
                    placeholder="Kurs narxi"
                  />
                </Form.Item>
              </div>
              {/* Ryc */}
              <Form.Item
                className="!mb-0"
                label={
                  <span className="font-medium text-[#13265C]">
                    {t("title")}{" "}
                  </span>
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
                        Ryc
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
                  <span className="font-medium text-[#13265C]">{t("information")}</span>
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
              <Form.Item
                className="!mb-0"
                label={
                  <span className="font-medium text-[#13265C]">
                    {t("title")}{" "}
                  </span>
                }
                name={["objective_title_ru", "rus"]}
                rules={[{ required: true, message: "" }]}
              >
                <div className="flex items-center gap-[6px]">
                  <StyledInput
                    size="large"
                    // placeholder="Dars nomi"
                    prefix={
                      <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                        Ryc
                      </span>
                    }
                  />
                </div>
              </Form.Item>

              {/* Uzb */}
              <Form.Item
                className="!mb-0"
                name={["objective_title_uz", "uzb"]}
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
                </div>
              </Form.Item>
              {/* Eng */}
              <Form.Item
                className="!mb-0"
                name={["objective_title_eng", "eng"]}
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
                  <span className="font-medium text-[#13265C]">{t("information")}</span>
                }
                name={["benefit", "rus"]}
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
              <Form.Item
                className="!mb-0"
                name={["benefit", "uzb"]}
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
              <Form.Item
                className="!mb-0"
                name={["benefit", "eng"]}
                rules={[{ required: true, message: "" }]}
              >
                <div className="flex items-center gap-[6px]">
                  <StyledTextArea
                    rows={3}
                    placeholder="Eng"
                    prefix={
                      <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                        Рус
                      </span>
                    }
                  />
                </div>
              </Form.Item>
              <Form.Item
                className="!mb-0"
                label={
                  <span className="font-medium text-[#13265C]">
                    {t("title")}{" "}
                  </span>
                }
                name={["end_title_ru", "rus"]}
                rules={[{ required: true, message: "" }]}
              >
                <div className="flex items-center gap-[6px]">
                  <StyledInput
                    size="large"
                    // placeholder="Dars nomi"
                    prefix={
                      <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                        Ryc
                      </span>
                    }
                  />
                </div>
              </Form.Item>

              {/* Uzb */}
              <Form.Item
                className="!mb-0"
                name={["end_title_uz", "uzb"]}
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
                </div>
              </Form.Item>
              {/* Eng */}
              <Form.Item
                className="!mb-0"
                name={["end_title_eng", "eng"]}
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
                  <span className="font-medium text-[#13265C]">{t("information")}</span>
                }
                name={["end_info_ru", "rus"]}
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
              <Form.Item
                className="!mb-0"
                name={["end_info_uz", "uzb"]}
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
              <Form.Item
                className="!mb-0"
                name={["end_info_eng", "eng"]}
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

              <Form.Item className="flex justify-end">
                <button
                  onClick={() => cancelForm()}
                  className="mr-5 mb-2 text-sm font-medium py-[10px] px-8 border border-[#D9D9D9] rounded-[8px] cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  className="text-sm font-medium py-[10px] px-8 bg-[#3F73BC] rounded-[8px] text-white cursor-pointer"
                  htmlType="submit"
                >
                  {t(`${load === true ? "Loading..." : "save"}`)}
                </button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div className="w-full border-[#D9D9D9] space-y-5">
            <Form.Item>
              <div className="flex flex-col min-[450px]:flex-row min-[450px]:items-center gap-4">
                <label className="cursor-pointer w-fit flex items-center gap-2 px-4 py-2 border border-[#D9D9D9] rounded-lg hover:bg-[#f5f5f5] transition-colors duration-200">
                  <span className="text-[#3F73BC] font-medium">
                    {t("select_image")}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpdateImageChange}
                    className="hidden"
                    required
                  />
                </label>
                <div className="w-[100px] h-[100px] relative">
                  {updatePreviewImage === null ? (
                    <img
                      src={`https://www.isouzbekistan.uz/api${course.image}`}
                      loading="lazy"
                      alt="Preview"
                      className="w-full h-full object-cover rounded border border-[#D9D9D9]"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] relative">
                      <img
                        src={updatePreviewImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded border border-[#D9D9D9]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Form.Item>
            <div className="mb-6">
              <h1 className="text-lg font-medium mb-2">
                {course.course_title_ru}
              </h1>

              <p className="text-sm text-gray-700 mb-6">{course.benefits_ru}</p>
              <p className="text-sm text-gray-600 mb-6">
                {formatDateToUzbek(course.createdAt)}
              </p>
              <div className="grid min-[450px]:grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div>
                  <Form.Item
                    className="!mb-0 flex-1"
                    name="catalog"
                    rules={[{ required: true, message: "" }]}
                  >
                    <div>
                      <input
                        list="currency-options"
                        name="catalog"
                        className="w-full h-[35px] border border-[#D9D9D9] rounded-[8px] px-3 text-[#13265C] bg-white focus:outline-none focus:ring-2 focus:ring-[#3F73BC]"
                        placeholder="Eng"
                        value={course.catalog}
                        onChange={(e) =>
                          setCourse({ ...course, catalog: e.target.value })
                        }
                        required
                      />
                      <datalist id="currency-options">
                        {catalogs.catalog?.map((e, i) => (
                          <option
                            key={i}
                            value={e}
                            className="bg-black text-white"
                          >
                            {e}
                          </option>
                        ))}
                      </datalist>
                    </div>
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    className="!mb-0 flex-1"
                    name="catalog_rus"
                    rules={[{ required: true, message: "" }]}
                  >
                    <div>
                      <input
                        list="currency-options_rus"
                        name="catalog_rus"
                        className="w-full h-[35px] border border-[#D9D9D9] rounded-[8px] px-3 text-[#13265C] bg-white focus:outline-none focus:ring-2 focus:ring-[#3F73BC]"
                        placeholder="Рус"
                        value={course.catalog_rus}
                        onChange={(e) =>
                          setCourse({ ...course, catalog_rus: e.target.value })
                        }
                        required
                      />
                      <datalist id="currency-options_rus">
                        {catalogs.catalog_rus?.map((e, i) => (
                          <option
                            key={i}
                            value={e}
                            className="bg-black text-white"
                          >
                            {e}
                          </option>
                        ))}
                      </datalist>
                    </div>
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    className="!mb-0 flex-1"
                    name="catalog_uzb"
                    rules={[{ required: true, message: "" }]}
                  >
                    <div>
                      <input
                        list="currency-options_eng"
                        name="catalog_uzb"
                        className="w-full h-[35px] border border-[#D9D9D9] rounded-[8px] px-3 text-[#13265C] bg-white focus:outline-none focus:ring-2 focus:ring-[#3F73BC]"
                        value={course.catalog_uzb}
                        placeholder="Uzb"
                        onChange={(e) =>
                          setCourse({ ...course, catalog_uzb: e.target.value })
                        }
                        required
                      />
                      <datalist id="currency-options_eng">
                        {catalogs.catalog_uzb?.map((e, i) => (
                          <option
                            key={i}
                            value={e}
                            className="bg-black text-white"
                          >
                            {e}
                          </option>
                        ))}
                      </datalist>
                    </div>
                  </Form.Item>
                </div>
                <Form.Item className="!mb-0 w-[150px]">
                  <StyledInput
                    size="large"
                    type="number"
                    placeholder="Kurs narxi"
                    prefix="$"
                    value={course.course_price}
                    onChange={(e) =>
                      setCourse({ ...course, course_price: e.target.value })
                    }
                  />
                </Form.Item>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {t("title")} <span className="text-red-500">*</span>
                </label>

                <div className="mb-2">
                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex items-center">
                      <div className="px-2 py-2 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Рус
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm"
                        value={course.course_title_ru}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            course_title_ru: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex items-center">
                      <div className="px-2 py-2 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Uzb
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm"
                        value={course.course_title_uz}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            course_title_uz: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full border border-gray-300 rounded-md">
                    <div className="flex items-center">
                      <div className="px-2 py-2 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Eng
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm"
                        value={course.course_title_eng}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            course_title_eng: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {t("information")} <span className="text-red-500">*</span>
                </label>

                <div className="mb-2">
                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex">
                      <div className="px-2 py-6 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Рус
                        </span>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 text-sm"
                        rows="3"
                        value={course.course_objective_ru}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            course_objective_ru: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex">
                      <div className="px-2 py-6 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Uzb
                        </span>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 text-sm"
                        rows="2"
                        value={course.course_objective_uz}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            course_objective_uz: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full border border-gray-300 rounded-md">
                    <div className="flex">
                      <div className="px-2 py-6 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Eng
                        </span>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 text-sm"
                        rows="3"
                        value={course.course_objective_eng}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            course_objective_eng: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {t("title")} <span className="text-red-500">*</span>
                </label>
                <div className="mb-2">
                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex items-center">
                      <div className="px-2 py-2 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Рус
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm"
                        value={course.objective_title_ru}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            objective_title_ru: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex items-center">
                      <div className="px-2 py-2 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Uzb
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm"
                        value={course.objective_title_uz}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            objective_title_uz: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full border border-gray-300 rounded-md">
                    <div className="flex items-center">
                      <div className="px-2 py-2 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Eng
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm"
                        value={course.objective_title_eng}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            objective_title_eng: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <label className="block text-sm font-medium mb-2">
                  {t("information")}
                </label>

                <div className="mb-2">
                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex">
                      <div className="px-2 py-6 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Рус
                        </span>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 text-sm"
                        rows="3"
                        value={course.benefits_ru}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            benefits_ru: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex">
                      <div className="px-2 py-6 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Uzb
                        </span>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 text-sm"
                        rows="2"
                        value={course.benefits_uz}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            benefits_uz: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full border border-gray-300 rounded-md">
                    <div className="flex">
                      <div className="px-2 py-6 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Eng
                        </span>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 text-sm"
                        rows="3"
                        value={course.benefits_eng}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            benefits_eng: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {t("title")} <span className="text-red-500">*</span>
                </label>
                <div className="mb-2">
                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex items-center">
                      <div className="px-2 py-2 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Рус
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm"
                        value={course.end_title_ru}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            end_title_ru: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex items-center">
                      <div className="px-2 py-2 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Uzb
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm"
                        value={course.end_title_uz}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            end_title_uz: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full border border-gray-300 rounded-md">
                    <div className="flex items-center">
                      <div className="px-2 py-2 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Eng
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm"
                        value={course.end_title_eng}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            end_title_eng: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <label className="block text-sm font-medium mb-2">
                  {t("information")}
                </label>

                <div className="mb-2">
                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex">
                      <div className="px-2 py-6 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Рус
                        </span>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 text-sm"
                        rows="3"
                        value={course.end_info_ru}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            end_info_ru: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full border border-gray-300 rounded-md mb-2">
                    <div className="flex">
                      <div className="px-2 py-6 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Uzb
                        </span>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 text-sm"
                        rows="2"
                        value={course.end_info_uz}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            end_info_uz: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full border border-gray-300 rounded-md">
                    <div className="flex">
                      <div className="px-2 py-6 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                        <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full">
                          Eng
                        </span>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 text-sm"
                        rows="3"
                        value={course.end_info_eng}
                        onChange={(e) =>
                          setCourse({
                            ...course,
                            end_info_eng: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Form.Item className="flex items-center justify-end">
                <button
                  onClick={() => openAndClose()}
                  className="text-sm md:text-lg font-medium py-[10px] px-8 md:px-10 mr-2 bg-red-800 rounded-[8px] text-white cursor-pointer"
                  htmlType="submit"
                >
                  {t("delete")}
                </button>
                <button
                  onClick={handleUpdate}
                  className="text-sm md:text-lg font-medium py-[10px] px-8 md:px-10 bg-blue-600 rounded-[8px] text-white cursor-pointer"
                >
                  {updating === true ? "Loading..." : <span>{t("save")}</span>}
                </button>
              </Form.Item>
            </div>
            <DeleteConfirmationModal
              isOpen={isOpen}
              handleDelete={handleDelete}
              closeModal={openAndClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
