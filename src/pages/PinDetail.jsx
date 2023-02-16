import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentInput from '../components/CommentInput';
import Loader from '../components/Loader';
import { db } from "../firebase";

const PinDetail = ()=> {

    const {id} = useParams();
    const [pinData, setPinData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [isCommentsOpen, setIsCommentsOpen] = useState(true)
    const navigate = useNavigate();

    useEffect(()=>{

        setIsLoading(true)
        onSnapshot(doc(db, 'pins', id), snapshot => {
            setPinData(snapshot.data())
            setComments(snapshot.data().comments)
            setIsLoading(false)
        })

    }, [db]);

    useEffect(()=>{

        if (comments?.length > 0) {
                setIsCommentsOpen(true)
            } else {
                setIsCommentsOpen(false)
            }

    }, [comments])

    console.log(comments)

    return (
        <div className="relative flex justify-center items-center py-5 px-1">
            {/* back button */}
            {!isLoading && (
                <button onClick={()=>navigate(-1)} className="fixed hidden lg:flex left-5 top-20 hover:bg-gray-200 rounded-full p-2">
                    <ArrowBackRoundedIcon fontSize='medium' />
                </button>
            )}

            {/* container */}
            {!isLoading && (<div className='rounded-3xl shadow-md flex lg:flex-row flex-col w-full lg:w-3/4 overflow-clip'>
                {/* image preview */}
                <div className='flex-1'>
                    <img src={pinData?.image} className="w-full" alt="" />
                </div>

                {/* Pin Information */}
                <div className='flex-1'>
                    <div className='p-5'>
                        <h1 className='text-4xl font-bold'>{pinData?.title}</h1>
                        <p>
                            {pinData?.about}
                        </p>
                        <Link to={`/user/${pinData?.createdBy?.userId}`}>
                            <div className='flex items-center mt-5 gap-3'>
                                <img src={pinData?.createdBy?.userImg} className="w-12 h-12 rounded-full object-cover" alt="" />
                                <p>{pinData?.createdBy?.username}</p>
                            </div>
                        </Link>
                        <div className='mt-8'>
                            <div className='flex gap-2'>
                                <h2 className='text-xl'>Comments</h2>
                                <button onClick={()=>setIsCommentsOpen(prev => !prev)} className='w-8 h-8 rounded-full hover:bg-gray-100'>
                                    {comments?.length > 0 && !isCommentsOpen && (
                                        <KeyboardArrowRightIcon />
                                    )}
                                    {comments?.length > 0 && isCommentsOpen && (
                                        <KeyboardArrowDownIcon />
                                    )}
                                </button>
                            </div>
                            {comments?.length > 0 ? (
                                <div className={isCommentsOpen ? 'block' : 'hidden'}>
                                    {comments.map(comment => (
                                        <div className='mt-3 flex items-center gap-2'>
                                            <div className='flex items-center gap-1'>
                                                <img src={comment?.userImg} className="w-8 h-8 rounded-full object-cover" alt="" />
                                                <span className='text-sm font-bold'>
                                                    {comment?.username}
                                                </span>
                                            </div>
                                            <span className='text-gray-700'>
                                                {comment?.comment}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='mt-3 text-gray-600'>
                                    There is no comment yet!
                                </p>
                            )}
                        </div>
                    </div>
                    <div className='border-t border-gray-200 flex items-center justify-center'>
                        <CommentInput pinId={id} />
                    </div>
                </div>
            </div>)}

            {isLoading && <Loader size={100} color="green" />}
        </div>
    )
}

export default PinDetail;