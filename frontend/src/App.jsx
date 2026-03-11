import { Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";

const App = () => (
  <Routes>
    <Route path="/" element={<UploadPage />} />
    <Route path="/success" element={<SuccessPage />} />
  </Routes>
);

export default App;
