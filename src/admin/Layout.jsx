import React, { useEffect, useState } from "react";
import AdminLogo from "../assets/admin-logo.png";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";

const router = [
  { id: "1", name: "general_statistics", path: "/" },
  { id: "2", name: "news", path: "/news" },
  { id: "3", name: "courses", path: "/courses" },
  { id: "4", name: "frequently_asked_questions", path: "/faq-section" },
];

export default function LayoutPage() {
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (event) => {
    const newLang = event.target.value;
    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(uz|en|ru)/, "");
    const newPath = `/${newLang}${pathWithoutLang}`;
    i18n.changeLanguage(newLang);
    navigate(newPath);
  };

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-[100px] bg-white flex items-center justify-between px-4 lg:px-20 shadow-lg">
        <div className="flex items-center gap-4">
          <img src={AdminLogo} alt="Admin Logo" className="h-10" />
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <select
          onChange={changeLanguage}
          className="border rounded px-2 py-1 text-sm lg:text-base"
          value={lang}
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
          <option value="uz">Uzbek</option>
        </select>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } lg:block w-full lg:w-[250px] flex-shrink-0 bg-white p-4 border-r`}
        >
          <div className="flex flex-col gap-3 sticky lg:top-4">
            {router.map((item) => (
              <NavLink
                key={item.id}
                to={`/${lang}/admin${item.path}`}
                end
                className={({ isActive }) =>
                  `text-[#222222] text-base lg:text-lg font-medium px-4 py-3 border border-[#FFE9EB] rounded-[6px] transition-all duration-300 ${
                    isActive
                      ? "bg-[#FFE9EB] text-[#A11E29]"
                      : "hover:bg-[#FFE9EB]"
                  } shadow-sm`
                }
              >
                {t(item.name)}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 bg-[#F7F8FD] p-4 lg:p-5">
          <div className="border border-[#FAEAEB] rounded-[12px] bg-white min-h-full p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
