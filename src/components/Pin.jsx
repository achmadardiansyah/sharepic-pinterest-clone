import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Pin = ({data, id})=> {

    const [user] = useAuthState(auth);
    const [hasSaved, setHasSaved] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{

        setHasSaved(data?.savedBy?.find(id => user?.uid === id) === user?.uid)

    }, [])

    const handleSave = async(e)=> {
        e.stopPropagation()
        const save = data?.savedBy?.find(id => user?.uid === id)

        if (save === undefined) {
            await updateDoc(doc(db, 'pins', id), {
                savedBy: arrayUnion(user?.uid)
            })
            setHasSaved(true)
        } else {
            await updateDoc(doc(db, 'pins', id), {
                savedBy: arrayRemove(user?.uid)
            })
            setHasSaved(false)
        }
    }

    return (
        <div>
            <div onClick={()=>navigate(`/pin-detail/${id}`)}>
                <div className="relative group cursor-zoom-in">
                    <img src={data?.image} className="rounded-lg group-hover:brightness-50" alt="" />
                    <div className="absolute inset-0 p-3 hidden group-hover:flex flex-col justify-between">
                        <div className="flex justify-between">
                            {user && (
                                <button onClick={handleSave} className={`px-3 py-1 rounded-full text-white text-lg ${hasSaved ? 'bg-gray-800' : 'bg-red-700'}`}>
                                    {hasSaved ? 'Saved' :  'Save'}
                                </button>
                            )}

                            {user && user?.uid === data?.createdBy?.userId && (
                                <button className="px-3 py-1 rounded-full text-white text-lg bg-red-700">
                                    <DeleteIcon />
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <a href={data?.destination} className="px-3 py-1 rounded-full text-black text-sm bg-gray-200 flex items-center">
                                <ArrowOutwardIcon />
                                <span>{data?.destination?.slice(8, 26)}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Link to={`/user/${data?.createdBy?.userId}`}>
                <div className="flex gap-3 items-center mt-2 pl-2">
                    <img src={data?.createdBy?.userImg} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <span className="font-semibold hover:underline">
                        {data?.createdBy?.username}
                    </span>
                </div>
            </Link>
        </div>
    )
};

export default Pin;