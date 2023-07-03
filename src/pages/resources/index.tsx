import React from 'react'
import AllLayout from "@/components/Layout";
import Header from '@/components/Header'
import { Image, Link } from '@chakra-ui/react'
import { Youtube } from 'react-feather'
import project1 from '../../data/images/2.jpg'

// const FeaturedVideos= ({ type, title, summary, img, link }) => {
//   return(
//     <article>
//       <Link href={link} target='_blank'>
//         <Image src={img} alt={title} className='w-full h-auto'/>
//       </Link>

//       <div>
//         <span>{type}</span>
//         <Link href={link} target='_blank'>
//         <h2>{title}</h2>
//         </Link>

//         <p>{summary}</p>
//         <div>
//           <Link href={link} target="_blank"> <Youtube/> </Link>
//           <Link href={link} target="_blank"> Check on Youtube </Link>
//         </div>
//       </div>
//     </article>
//   )
// }

const Resources = () => {
  return (
    <AllLayout>
        <Header title='Resources' subtitle=''/>
        <div className='grid grid-cols-12 gap-24'>
          <div className='col-span-12'>
            {/* <FeaturedVideos 
            type="Featured Video" 
            title="EIP-20: Token Standard" 
            summary="The following standard allows for the implementation of a standard API for tokens within smart contracts. This standard provides basic functionality to transfer tokens, as well as allow tokens to be approved so they can be spent by another on-chain third party." 
            img={project1} 
            link="https://www.youtube.com/watch?v=fwxkbUaa92w"/> */}

            TBD..
          </div>

        </div>
    </AllLayout>
  )
}

export default Resources