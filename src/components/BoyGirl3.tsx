import React from 'react';
import Image from 'next/image'; // Use this if you're using Next.js
import BlockchainFuture from '/public/Blockchain_Future.png'; // Adjust the path based on your file structure

function BoyGirl() {
    return (
        <div style={{ width: '500px', height: '500px', marginTop: '-20px' }}>
            <Image
                src={BlockchainFuture}
                alt="Blockchain Future"
                layout="responsive"
                width={500}
                height={500}
            />
        </div>
    );
}

export default BoyGirl;
