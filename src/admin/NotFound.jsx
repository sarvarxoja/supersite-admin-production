import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex flex-1">
        <main className="flex-1 p-4">
          <div className="bg-white p-8 max-w-3xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <AlertCircle size={120} className="text-red-600" />
            </div>
            <h1 className="text-8xl font-bold text-red-600 mb-6">404</h1>
            <h2 className="text-3xl font-medium text-gray-800 mb-4">
              Страница не найдена
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Запрашиваемая страница не существует или была перемещена.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Вернуться на главную
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Если вы считаете, что произошла ошибка, пожалуйста, свяжитесь с
              администратором системы.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
