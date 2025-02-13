import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Checkbox,
    Button,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { ChevronDownIcon } from "@chakra-ui/icons";
  import { Filter } from "react-feather";
  
  interface LabelFilterProps {
    labels: string[];
    selectedLabels: string[];
    onLabelToggle: (label: string) => void;
  }
  
  const LabelFilter: React.FC<LabelFilterProps> = ({
    labels,
    selectedLabels,
    onLabelToggle,
  }) => {
    // Force dark mode styles
    const menuBg = useColorModeValue("gray.800", "gray.800"); // Dark background
    const menuColor = useColorModeValue("white", "white"); // White text
    const buttonBg = useColorModeValue("gray.700", "gray.700"); // Dark button background
    const buttonColor = useColorModeValue("white", "white"); // White button text
  
    return (
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          
          size="sm"
          ml={2}
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: "gray.600" }} // Darker hover state
          _active={{ bg: "gray.600" }} // Darker active state
        >
          <Filter /> 
        </MenuButton>
        <MenuList
          bg={menuBg}
          color={menuColor}
          maxH="300px"
          overflowY="auto"
        >
          {labels.map((label) => (
            <MenuItem key={label} bg={menuBg} color={menuColor}>
              <Checkbox
                isChecked={selectedLabels.includes(label)}
                onChange={() => onLabelToggle(label)}
                colorScheme="blue" // Ensure the checkbox stands out
              >
                {label}
              </Checkbox>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  };
  
  export default LabelFilter;