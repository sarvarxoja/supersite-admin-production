import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const DefaultPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/login");
  }, []);
};
