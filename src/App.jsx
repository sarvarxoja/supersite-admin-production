import News from "./admin/News";
import Login from "./admin/Login";
import Course from "./admin/Course";
import LayoutPage from "./admin/Layout";
import React, { useEffect, useState } from "react";
import Statistics from "./admin/Statistics";
import FaqSection from "./admin/FaqSection";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import { DefaultPage } from "./admin/Default";
import NotFoundPage from "./admin/NotFound";
import { NewsCreate } from "./components/news/NewsCreate";
import { FetchNew } from "./components/news/FetchNew";

export default function App() {
  const [access, setAccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data } = await axios.post("/auth/token/exists");
      if (data.status === 200) {
        setAccess(true);
      } else {
        setAccess(false);
        navigate("/admin/login");
      }
    } catch (error) {
      console.log(error);
      setAccess(false);
      navigate("/admin/login");
    }
  }

  if (access === null) return null;

  return (
    <Routes>
      <Route path="/" element={<DefaultPage />} />

      {/* Til parametrini yuqori darajada qo'shish */}
      <Route path="/:lang/admin" element={<LayoutPage />}>
        <Route index element={<Statistics />} />

        {/* "/:lang/admin/news" yo'lining bolalari uchun tilni qo'shamiz */}
        <Route path="news/*" element={<News />} />
        <Route path="courses" element={<Course />} />
        <Route path="courses/:id" element={<Course />} />
        <Route path="faq-section" element={<FaqSection />} />
      </Route>
      <Route path="/*" element={<NotFoundPage />} />
      <Route path="/admin/login" element={<Login access={access} />} />
    </Routes>
  );
}
