import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";

const CommentInput = ({pinId})=> {

    const [user] = useAuthState(auth);
    const [comment, setComment] = useState('')

    const sendComment = async(e)=> {
        e.preventDefault()

        await updateDoc(doc(db, 'pins', pinId), {
            comments: arrayUnion({
                username: user?.displayName,
                userId: user?.uid,
                userImg: user?.photoURL,
                comment: comment
            })
        })

        setComment('')
    }

    return (
        <form onSubmit={sendComment} className="flex justify-center items-center gap-2 flex-1 p-3">
            <img src={user?.photoURL} className='w-10 h-10 rounded-full object-cover' alt="" />
            <input 
                type="text" 
                placeholder="Add comment"
                onChange={e => setComment(e.target.value)}
                value={comment}
                className="flex-1 py-2 px-3 outline-none bg-gray-100 rounded-full text-lg"
            />
            <button className="px-3 py-2 text-white bg-red-600 rounded-lg">
                Add
            </button>
        </form>
    )
}

export default CommentInput;