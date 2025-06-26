import React from 'react'

function SearchBar() {
  return (
    <div className='p-5'>
         <div className='flex gap-3
    p-2 rounded-lg items-center w-full bg-[#F4F3F3] text-[rgba(0,0,0,0.4)]'>
       <svg xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" strokeWidth={1.5} 
        stroke="rgba(0,0,0,0.4)" 
        className="w-4 h-4 text-gray-400">
       <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
       </svg>
       <input type='text'
       placeholder='Search'
       onKeyDown={(e)=>{
        if(e.key ==='Enter'){
            const target = e.target as HTMLInputElement;
            console.log(target.value)
        }
        }}
       className='bg-transparent
       outline-none w-full text-xs sm:text-sm text-[sm
       rgba(0,0,0,0.4)]'
       />

   </div>
    </div>
  )
}

export default SearchBar