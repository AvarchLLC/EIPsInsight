import { useRouter } from 'next/router';
import All from '../index';

/**
 * Dynamic route handler for /upgrade/[upgrade]
 * Renders the upgrade page with the selected upgrade from the URL path
 */
const UpgradePage = () => {
  const router = useRouter();
  const { upgrade } = router.query;

  // Validate upgrade parameter
  const validUpgrades = ['pectra', 'fusaka', 'glamsterdam', 'hegota'];
  const selectedUpgrade = typeof upgrade === 'string' && validUpgrades.includes(upgrade.toLowerCase()) 
    ? upgrade.toLowerCase() 
    : 'glamsterdam';

  // Render the main upgrade page component with the selected upgrade
  return <All initialUpgrade={selectedUpgrade} />;
};

export default UpgradePage;

export async function getStaticPaths() {
  return {
    paths: [
      { params: { upgrade: 'pectra' } },
      { params: { upgrade: 'fusaka' } },
      { params: { upgrade: 'glamsterdam' } },
      { params: { upgrade: 'hegota' } },
    ],
    fallback: false,
  };
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
