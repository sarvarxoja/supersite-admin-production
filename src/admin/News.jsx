import axios from "axios";
import { Plus } from "lucide-react";

import { useTranslation } from "react-i18next";
import { Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { FetchNew } from "../components/news/FetchNew";
import { NewsCreate } from "../components/news/NewsCreate";


export default function News() {
  const [courses, setCourses] = useState([]);

  const { lang } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      let { data } = await axios.get("/news/all?page=1&limit=20");
      setCourses(data.news);
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div className="bg-white">
      <Link
        to={`/${lang}/admin/news/create`}
        className="w-[190px] py-[10px] px-10 text-[#3F73BC] flex items-center gap-5 cursor-pointer rounded-[8px] border border-[#CDE2FF]"
      >
        <span>{t("add")}</span>
        <Plus size={15} />
      </Link>
      <div className="mt-10 flex gap-5 flex-col-reverse lg:flex-row">
        <div>
          {courses.map((e, index) => {
            return (
              <Link
                key={index}
                to={`/${lang}/admin/news/${e.id}`}
                className="w-[326px] flex justify-end items-start cursor-pointer h-[200px] bg-[#F7F8FD] mb-2 rounded"
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
        <Routes>
          <Route path=":id" element={<FetchNew reFetch={fetchNews}  />} />
          <Route path="create" element={<NewsCreate reFetch={fetchNews} />} />
        </Routes>
      </div>
    </div>
  );
}
