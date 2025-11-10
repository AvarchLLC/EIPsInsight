import { IconButton, useToast, useColorModeValue, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import { useState } from "react";

// Reusable CopyLink component
interface CopyLinkProps {
  link: string;
  style?: React.CSSProperties;
}

const CopyLink: React.FC<CopyLinkProps> = ({ link, style }) => {
  const [isCopied, setIsCopied] = useState(false);
  const toast = useToast();
  const bg = useColorModeValue('whiteAlpha.900', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const iconSize = useBreakpointValue({ base: '16px', md: '18px' });

  // Function to copy the link to the clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      toast({
        title: 'Link copied',
        status: 'success',
        duration: 1800,
        isClosable: true,
      });

      // reset after a short delay so users can copy again
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy link to clipboard',
        status: 'error',
        duration: 2500,
        isClosable: true,
      });
    }
  };

  return (
    <Tooltip label={isCopied ? 'Copied' : 'Copy link'} hasArrow>
      <IconButton
        onClick={copyToClipboard}
        aria-label={isCopied ? 'Copied' : 'Copy link'}
        icon={isCopied ? <CheckIcon boxSize={iconSize} /> : <CopyIcon boxSize={iconSize} />}
        variant="outline"
        size="sm"
        bg={bg}
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        _hover={{ bg: hoverBg, transform: 'translateY(-2px)', boxShadow: 'md' }}
        _active={{ transform: 'translateY(0)' }}
        borderRadius="md"
        aria-pressed={isCopied}
        ml={2}
      />
    </Tooltip>
  );
};

export default CopyLink;
