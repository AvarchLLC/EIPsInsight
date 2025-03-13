import { GetServerSideProps } from 'next';

const RedirectsPage = () => {
  // This component doesn't need to render anything, as it handles redirects
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const path = params?.slug?.[0].toLowerCase(); // Get the path and convert it to lowercase
  console.log(path);
  if (path === 'reviewers') {
    return {
      redirect: {
        destination: '/Reviewers',
        permanent: false, // Set to true if this is a permanent redirect
      },
    };
  }

  if (path === 'analytics') {
    return {
      redirect: {
        destination: '/Analytics',
        permanent: false, // Set to true if this is a permanent redirect
      },
    };
  }

  // Fallback in case no match
  return {
    notFound: true, // Return a 404 page if the path doesn't match
  };
};

export default RedirectsPage;
