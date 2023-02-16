import { Link } from 'react-router-dom';
import {useAuthState } from 'react-firebase-hooks/auth';
import { auth, GoogleProvider } from '../firebase.js'
import AddIcon from '@mui/icons-material/Add';
import Loader from './Loader.jsx';
import Search from './Search';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useState } from 'react';

const Navbar = ()=> {

    const [user, loading] = useAuthState(auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    console.log(user)

    return (
        <div className='h-[10vh] flex items-center justify-between gap-3 p-2 shadow-sm sticky top-0 bg-white z-50'>
            <div>
                <Link to='/'>
                    <h1 className='hidden lg:block text-red-600 text-3xl font-semibold'>
                        SharePic
                    </h1>
                    <h1 className='block lg:hidden text-white text-3xl font-semibold bg-red-600 p-2 rounded-full'>
                        SP
                    </h1>
                </Link>
            </div>

            <Search />

            {loading && (<Loader size={30} />)}

            { user && (<button className='h-full bg-gray-200 px-3 rounded-lg'>
                <Link to='/create-pin'>
                    <AddIcon />
                </Link>
            </button>)}

            {user ? (
                <div onClick={()=>setIsMenuOpen(prev => !prev)} className='relative cursor-pointer'>
                    <img src={user?.photoURL} className='w-10 h-10 rounded-full object-cover' alt="" />
                    {isMenuOpen ? (
                        <div className='absolute top-12 bg-white shadow-md right-0 w-40 flex flex-col justify-center items-center'>
                            <Link to='/profile' className='p-2'>
                                Visit Profile
                            </Link>
                            <button onClick={()=>signOut(auth)} className='p-2'>
                                Sign Out
                            </button>
                        </div>
                    ) : ''}
                </div>
            ) : (
                !loading && (
                    <button onClick={()=>signInWithPopup(auth, GoogleProvider)} className='btn-primary'>
                        Sign Up with google
                    </button>
                )
            )}
            
        </div>
    )
}

export default Navbar;