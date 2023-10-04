import React, {useEffect, useState} from 'react';
import {BsFillShareFill} from "react-icons/bs";


const ViewsShare = () => {

    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        // Fetch the view count from the API route
        fetch('/api/viewCount')
            .then((response) => response.json())
            .then((data) => setViewCount(data.viewCount));
    }, []);



    return(
        <>
            <div className="relative inline-block cursor-pointer group">
                {viewCount}
                <div>
                    <BsFillShareFill />
                </div>
                <div className="hidden group-hover:block absolute right-0 top-0 bg-gray-700 text-white p-2 space-y-2">
                    <a href="#" className="block hover:text-blue-500">Facebook</a>
                    <a href="#" className="block hover:text-blue-500">Twitter</a>
                    <a href="#" className="block hover:text-blue-500">LinkedIn</a>
                </div>
            </div>
        </>
    );
}

export default ViewsShare;