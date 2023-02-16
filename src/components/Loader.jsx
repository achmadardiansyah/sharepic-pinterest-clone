import { Circles } from 'react-loader-spinner'

const Loader = ({size, color})=> {
    return (
        <div>
            <Circles
                height={size}
                width={size}
                radius="9"
                color={color}
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
            />
        </div>
    )
}

export default Loader;