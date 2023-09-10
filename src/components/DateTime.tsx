import React from 'react'

const DateTime = () => {

    var currentDate = new Date();
    const year =  currentDate.getFullYear();
    const month = currentDate.getMonth()+1;
    const date = currentDate.getDate();
    const hour = currentDate.getHours();
    const minutes = currentDate.getMinutes()

    return(
        <>
            <div className='flex justify-between mx-12 lg:text-[14px] text-xs py-4 bottom-0'>
                <div>
                    <p className={'text-gray-500 px-3 rounded-[0.55rem] py-1'}>EIPsInsight.com</p>
                </div>
                <div className={'text-gray-500 px-3 rounded-[0.55rem] py-1'}>
                    <p>{date < 10 ? '0'+`${date}` : date}-{month < 10 ? '0'+`${month}` : month}-{year}  {hour < 10 ? '0'+`${hour}` : hour}:{minutes < 10 ? '0'+`${minutes}` : minutes}</p>
                </div>
            </div>
        </>
    )
}

export default DateTime;