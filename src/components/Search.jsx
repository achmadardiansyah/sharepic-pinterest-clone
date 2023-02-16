import SearchIcon from '@mui/icons-material/Search';

const Search = ()=> {
    return (
        <form className='flex items-center bg-gray-100 flex-1 rounded-lg p-2 text-2xl'>
            <SearchIcon className='text-gray-500' />
            <input 
                type="text" 
                className="outline-none border-none bg-transparent flex-1 placeholder:text-gray-500"
                placeholder='Search'
            />
        </form>
    )
}

export default Search;