import React, {useEffect, useState} from 'react';
import {BsFillShareFill} from "react-icons/bs";


const ViewsShare = () => {

    const [counter, setCounter] = useState<number>(9000);

    useEffect(() => {
        const incrementViewsOnLoad = async () => {
            try {
                // Make a POST request to update the views count
                const response = await fetch('/api/count/viewCounter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    // Fetch the updated views count after the POST request
                    const updatedResponse = await fetch('/api/views');
                    const data = await updatedResponse.json();
                    setCounter(data.viewsCount);
                }
            } catch (error) {
                console.error('Error updating views count:', error);
            }
        };

        incrementViewsOnLoad();
    }, []);



    return(
        <>
            <div className="relative inline-block cursor-pointer group">
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