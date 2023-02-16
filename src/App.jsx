import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreatePin from './pages/CreatePin';
import Navbar from './components/Navbar';
import PinDetail from './pages/PinDetail';

const App = ()=> {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/create-pin' element={<CreatePin />} />
                <Route path='/pin-detail/:id' element={<PinDetail />} />
            </Routes>
        </div>
    )
}

export default App;