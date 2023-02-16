import { useRef, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Loader from '../components/Loader';

const CreatePin = ()=> {

    const inputRef = useRef();
    const [user] = useAuthState(auth);
    const [imageSelected, setImageSelected] = useState(null);
    const [fields, setFields] = useState(false);
    const [wrongTypeImage, setWrongTypeImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState({
        title: '',
        about: '',
        category: '',
        destination: ''
    });
    const [categories, setCategories] = useState([]);

    const handleInputImage = (e)=> {
        const file = e.target.files[0];

        const { type } = file;

        const fr = new FileReader()

        if (type === 'image/jpeg' || type === 'image/jpg' || type === 'image/tiff' || type === 'image/png' || type === 'image/gif'){
            fr.readAsDataURL(file)

            fr.onload = (event) => {
                setImageSelected(event.target.result)
            }

            setWrongTypeImage(false)
        } else {
            setWrongTypeImage(true)
        }
    }

    const removeImage = (e)=> {
        e.stopPropagation()
        setImageSelected(null)
    };

    const handleInput = (e)=> {
        setInput(prevInput => ({
            ...prevInput,
            [e.target.name]: e.target.value
        }))
    };

    const addCategory = ()=> {
        setCategories(prevCategories => ([
            ...prevCategories,
            input.category
        ]))
    };

    const removeCategory = (id)=> {
        setCategories(categories.filter(category => category !== id))
    }

    const savePin = async()=> {
        if (input.title && input.about && categories && imageSelected) {
            setIsLoading(true)

            const pin = await addDoc(collection(db, 'pins'), {
                title: input.title,
                about: input.about,
                destination: input.destination,
                createdBy: {
                    username: user?.displayName,
                    userId: user?.uid,
                    userImg: user?.photoURL
                },
                keywords: input.title.split(' ').concat(categories),
                savedBy: [],
                comments: []
            })

            const storageRef = ref(storage, pin.id)

            await uploadString(storageRef, imageSelected, 'data_url')

            const imgUrl = await getDownloadURL(storageRef)

            await updateDoc(doc(db, 'pins', pin.id), {
                image: imgUrl
            })

            setIsLoading(false)
        } else {

            setFields(true)

            setTimeout(()=>{
                setFields(false)
            }, 2000)
        }
    }

    return (
        <div className="flex justify-center items-center bg-gray-200 py-10">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-5 p-10 w-4/5 lg:min-h-[80vh] bg-white rounded-lg">
                {/* image preview */}
                <div className="p-3 w-72 h-[70vh] bg-gray-100 rounded-md">
                    <div onClick={()=>inputRef.current.click()} className=" border-2 border-dashed border-gray-200 w-full h-full flex justify-center items-center">
                        <input onChange={handleInputImage} type="file" ref={inputRef} hidden />
                        
                        {imageSelected ? (
                            <div className="relative">
                                <img src={imageSelected} className='w-full rounded-sm' alt="" />
                                <button onClick={removeImage} className="p-1 w-10 h-10 rounded-full bg-gray-300/50 hover:bg-gray-700 text-white absolute top-2 right-3">
                                    <CloseIcon />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center">
                                <div className="p-2 bg-gray-400 w-12 h-12 flex justify-center items-center rounded-full text-gray-200">
                                    <FileUploadIcon />
                                </div>
                                <span className="font-semibold">Click to upload</span>
                                {wrongTypeImage ? (
                                    <p className="text-xl font-bold text-red-600">It&apos;s wrong file type.</p>
                                ) : (
                                    <p className="mt-32 text-gray-600 p-3 text-xs text-center">
                                        Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* create form */}
                <div className="flex-1 w-full flex flex-col">
                    {fields && (<p className="text-2xl text-red-500 font-semibold">Please add all fields!</p>)}
                    <input 
                        type="text" 
                        placeholder="Add title"
                        name="title"
                        onChange={handleInput}
                        className="createInput text-4xl font-bold"
                        />

                    <div className="flex gap-3 items-center my-6 px-5">
                        <img src={user?.photoURL} className="w-12 h-12 rounded-full object-cover" alt="" />
                        <h1 className="font-semibold">{user?.displayName}</h1>
                    </div>

                    <input 
                        type="text" 
                        placeholder="Tell people what your pin is about"
                        className="createInput text-lg"
                        name="about"
                        onChange={handleInput}
                        />

                    <div className="flex items-center">
                        <input 
                            type="text" 
                            placeholder="Add category"
                            className="createInput mt-5"
                            name="category"
                            onChange={handleInput}
                            />
                        <button onClick={addCategory} className="bg-red-600 px-5 py-2 text-white font-semibold rounded-md">
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-1">
                        {categories && categories.map(category => (
                            <div key={category} className="flex items-center bg-red-600 text-white px-3 py-1 rounded-sm">
                                <span>{category}</span>
                                <button onClick={()=>removeCategory(category)}>
                                    <CloseIcon />
                                </button>
                            </div>
                        ))}
                    </div>

                    <input 
                        type="url" 
                        placeholder="Add destination link"
                        className="createInput text-lg mt-12"
                        name="destination"
                        onChange={handleInput}
                        />

                    <button onClick={savePin} className="ml-auto bg-red-600 text-white py-1 px-3 text-2xl flex items-center gap-3 rounded-md my-2">
                        {isLoading ? (<span>Saving</span>) : (<span>Save</span>)}
                        {isLoading && (<Loader size={20} color='#fff' />)}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreatePin;