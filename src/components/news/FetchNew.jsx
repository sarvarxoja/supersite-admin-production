import axios from "axios";
import { Form } from "antd";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import DeleteConfirmationModal from "../DeleteModal";
import { formatDateToUzbek } from "../../utils/DateFormatter";
import { Link, useNavigate, useParams } from "react-router-dom";

export const FetchNew = ({ reFetch }) => {
  const [form] = Form.useForm();
  const { id, lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [course, setCourse] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatePreviewImage, setUpdatePreviewImage] = useState(null);
  const [selectedUpdateImage, setSelectedUpdateImage] = useState(null);

  function openAndClose() {
    setIsOpen(!isOpen);
  }

  async function handleDelete() {
    setDeleting(true);
    if (deleting) return;

    try {
      await axios.delete(`/news/${id}`);
      openAndClose();
      reFetch();
      navigate(`/${lang}/admin/news/`);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  }

  async function handleUpdateImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedUpdateImage(file);
      setUpdatePreviewImage(URL.createObjectURL(file));
    }
  }

  async function handleUpdate() {
    setUpdating(true);
    if (updating) return;

    try {
      const formData = new FormData();
      for (const key in course) {
        formData.append(key, course[key]);
      }
      if (selectedUpdateImage) {
        formData.append("image", selectedUpdateImage);
      }

      await axios.patch(`/news/${course.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      reFetch();
      fetchCourse();
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    fetchCourse();
  }, [id]);

  async function fetchCourse() {
    try {
      let { data } = await axios.get(`/news/by/${id}`);
      setCourse(data.data);
    } catch (error) {
      setCourse(null);
      console.log(error);
    }
  }

  if (course === null) {
    return <div></div>;
  }

  return (
    <div className="lg:border-l lg:pl-6 w-full border-[#D9D9D9] space-y-5">
      {/* Image Upload Section */}
      <Form.Item>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-[#D9D9D9] rounded-lg hover:bg-[#f5f5f5] transition-colors duration-200">
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
            <img
              src={
                updatePreviewImage ??
                `https://www.isouzbekistan.uz/api${course.image}`
              }
              alt="Preview"
              className="w-full h-full object-cover rounded border border-[#D9D9D9]"
            />
          </div>
        </div>
      </Form.Item>

      {/* Title and Info */}
      <div className="mb-6">
        <h1 className="text-lg font-medium mb-2">{course.news_title_ru}</h1>
        <p className="text-sm text-gray-700 mb-2">{course.news_about_ru}</p>
        <p className="text-sm text-gray-600 mb-4">
          {formatDateToUzbek(course.createdAt)}
        </p>

        {/* Title Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {t("title")} <span className="text-red-500">*</span>
          </label>
          {["ru", "uz", "eng"].map((langKey) => (
            <div
              key={langKey}
              className="w-full border border-gray-300 rounded-md mb-2"
            >
              <div className="flex items-center">
                <div className="px-2 py-2 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                  <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full uppercase">
                    {langKey}
                  </span>
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm"
                  value={course[`news_title_${langKey}`] || ""}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      [`news_title_${langKey}`]: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* About Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {t("information")} <span className="text-red-500">*</span>
          </label>
          {["ru", "uz", "eng"].map((langKey) => (
            <div
              key={langKey}
              className="w-full border border-gray-300 rounded-md mb-2"
            >
              <div className="flex">
                <div className="px-2 py-6 border-r border-gray-300 bg-gray-50 w-12 flex justify-center">
                  <span className="flex items-center justify-center w-[33px] h-[33px] bg-[#EFF3FF] text-[#3F73BC] text-[12px] font-semibold rounded-full uppercase">
                    {langKey}
                  </span>
                </div>
                <textarea
                  className="w-full px-3 py-2 text-sm"
                  rows="3"
                  value={course[`news_about_${langKey}`] || ""}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      [`news_about_${langKey}`]: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {/* <Form.Item className="flex flex-col sm:flex-row justify-end"> */}
      <div className="flex gap-2">
        <button
          onClick={() => openAndClose()}
          className="text-lg font-medium py-2 px-6 bg-red-800 rounded-[8px] text-white cursor-pointer"
          htmlType="submit"
        >
          {t("delete")}
        </button>
        <button
          onClick={handleUpdate}
          className="text-lg font-medium py-2 px-6 bg-blue-600 rounded-[8px] text-white cursor-pointer"
        >
          {updating ? "Loading..." : <span>{t("save")}</span>}
        </button>
      </div>
      {/* </Form.Item> */}
      <DeleteConfirmationModal
        isOpen={isOpen}
        handleDelete={handleDelete}
        closeModal={openAndClose}
      />
    </div>
  );
};
