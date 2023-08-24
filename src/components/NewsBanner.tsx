import React,{useState} from 'react';
import {AiOutlineClose} from "react-icons/ai"
import NextLink from "next/link";
import GitCoin from '@/../public/GitCoinLogo.png';
import Image from "next/image";


const Banner = () => {
    const[isOpen, setIsOpen] = useState(true);
    function ToggleBanner() {
        if(isOpen){
            setIsOpen(false);
        }
        else{
            setIsOpen(true);
        }
    }
    return(
        <>
            <div className={isOpen ? 'block' : 'hidden'}>

                <div className={isOpen ? 'bg-blue-200 flex justify-between lg:px-14 md:px-12 sm:px-10 px-8 py-2' : 'hidden'}>
                    <NextLink target={'_blank'} href={'https://builder.gitcoin.co/#/chains/1/registry/0x03506eD3f57892C85DB20C36846e9c808aFe9ef4/projects/738'}>
                        <div className={'flex space-x-4'}>
                            <div className="text-black lg:text-xl md:text-lg sm:text-lg text-md flex pt-1">
                                {/*&nbsp; <Image src={GitCoin} width={25} height={20} alt=""/>&nbsp;*/}
                                <div className='flex'>
                                    Learn one Ethereum Improvement Proposal at a time. Support us via <span className={'text-green-800 font-bold'}> &nbsp;Gitcoin &nbsp;</span>
                                </div>
                            </div>
                        </div>
                    </NextLink>
                    <div className="cursor-pointer text-black pt-1">
                        <AiOutlineClose onClick={ToggleBanner} size={20}/>
                    </div>
                </div>
            </div>

        </>
    );
}
export default Banner;