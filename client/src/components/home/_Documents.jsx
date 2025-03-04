import { useNavigate } from "react-router-dom";
import GoBack from "../reusable/GoBack";

function Documents() {

  const navigate = useNavigate();

  return (
    <>
      <GoBack handleGoBack={() => navigate(-1)} />
    </>
  );
}

export default Documents;