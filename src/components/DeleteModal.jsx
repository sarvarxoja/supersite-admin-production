import { Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DeleteConfirmationModal({
  isOpen,
  handleDelete,
  closeModal,
}) {
  const { t } = useTranslation();

  return (
    <div className="p-8 flex flex-col items-center">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          ></div>

          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-10 overflow-hidden">
            {/* Modal header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {t("confirm_deletion")}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 cursor-pointer hover:text-gray-500 transition duration-150"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <div className="flex items-center justify-center mb-4 text-red-500">
                <Trash2 size={48} />
              </div>
              <p className="text-center text-gray-700 mb-2">
                {t("confirm_text")}
              </p>
              <p className="text-center text-gray-500 text-sm">
                {t("delete_warn")}
              </p>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition duration-200"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDelete}
                className={`cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center gap-2 transition duration-200`}
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
