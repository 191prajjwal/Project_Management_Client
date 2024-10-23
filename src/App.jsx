import RegisterLogin from './Pages/RegisterLogin/RegisterLogin';
import Dashboard from './Pages/Dashboard/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Public from './Pages/Public/Public';
import { useParams } from 'react-router-dom';
import NotFound from './Components/Dashboard/NotFound/NotFound';
import { useSelector } from 'react-redux';
import ProtectedRoutes from './ProtectedRoutes/ProtectedRoutes';

function App() {
  const isLoaderToggle = useSelector(state => state.loaderAction.loader);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RegisterLogin />} />
          <Route path="/public/sharedtasklink/:taskId" element={<PublicWithTaskId />} />
          <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes >} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      {isLoaderToggle && (
        <h2>Loading....</h2>
      )}
    </>
  );
}

export default App;


function PublicWithTaskId() {
  let { taskId } = useParams();

  return <Public taskId={taskId} />;
}
