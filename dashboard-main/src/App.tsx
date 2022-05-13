import './App.css';
import Modal from './components/Containers/Modal/Modal';
import Menu from './components/LeftMenu/Menu/Menu';
import Body from './components/MainBody/Body/Body';
import { modalActions } from './store/modal';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Spinner from './components/Containers/Spinner/Spinner';

function App() {
  const dispatch = useAppDispatch();
  const modalVisible = useAppSelector(state => state.modal.show);
  const spinnerVisible = useAppSelector(state => state.spinner.show);
  let userLoggedIn = useAppSelector(state => state.usuario.isLoggedIn);

  const closeModal = () => {
    if (modalVisible)
        dispatch(modalActions.show(false));
  }

  return (    
    <div>
      {
        !userLoggedIn ?       
        <Routes>
          <Route path={'*'} element={<Login />} />
        </Routes>  : 

        <div onClick={closeModal} className={`App ${modalVisible || spinnerVisible ? 'blur-bg' : ''}`}>
          <Menu />    
          <Body />        
        </div>      
      }  
      <Spinner />
      <Modal />    
      
    </div>
  );
}

export default App;
