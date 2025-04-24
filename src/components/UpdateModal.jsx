import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const UpdateModal = ({ isOpen, onClose, item, onUpdate }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    question_eng: "",
    question_ru: "",
    question_uz: "",
    answer_eng: "",
    answer_ru: "",
    answer_uz: "",
  });

  // Set default values from item when modal opens
  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        question_eng: item.question_eng || "",
        question_ru: item.question_ru || "",
        question_uz: item.question_uz || "",
        answer_eng: item.answer_eng || "",
        answer_ru: item.answer_ru || "",
        answer_uz: item.answer_uz || "",
      });
    }
  }, [item, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{t("update")}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
              <h3 className="font-medium text-lg">{t("answer")}</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English
                </label>
                <textarea
                  name="answer_eng"
                  value={formData.answer_eng}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Рус
                </label>
                <textarea
                  name="answer_ru"
                  value={formData.answer_ru}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  O'zbek
                </label>
                <textarea
                  name="answer_uz"
                  value={formData.answer_uz}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-lg">{t("question")}</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English
                </label>
                <textarea
                  name="question_eng"
                  value={formData.question_eng}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Рус
                </label>
                <textarea
                  name="question_ru"
                  value={formData.question_ru}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  O'zbek
                </label>
                <textarea
                  name="question_uz"
                  value={formData.question_uz}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
