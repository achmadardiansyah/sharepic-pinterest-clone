import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import MasonryLayout from "../components/MasonryLayout";
import Pin from "../components/Pin";
import { db } from "../firebase";

const Home = ()=> {

    const [pins, setPins] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{

        setIsLoading(true)
        onSnapshot(query(collection(db, 'pins'), orderBy('timestamp')), (snapshot)=>{
            setPins(snapshot.docs)
            setIsLoading(false)
        })

    }, [db])

    return (
        <div className="p-3">
            <MasonryLayout>
                {pins.map(pin => (
                    <Pin key={pin.id} data={pin.data()} id={pin.id} />
                ))}
            </MasonryLayout>
            {isLoading && (
                <div className="flex items-center justify-center">
                    <Loader size={100} color='green' />
                </div>
            )}
        </div>
    )
}

export default Home;