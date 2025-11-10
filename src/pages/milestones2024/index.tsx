import { VStack } from "@chakra-ui/react";
import React, { useState, useEffect, useLayoutEffect } from "react";
import CloseableAdCard from "@/components/CloseableAdCard";
import AllLayout from "@/components/Layout";
import {
  Box,
  Spinner,
  useColorModeValue,
  Wrap,
  WrapItem,
  Text,
  List,
  UnorderedList,
  ListItem,
  Heading,
  Grid,
  Stack,
  Image,
  Link
} from "@chakra-ui/react";
import NLink from "next/link";
const EIPsInsightRecap = () => {
    const bg = useColorModeValue("#f6f6f7", "#171923");
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        if (bg === "#f6f6f7") {
          setIsDarkMode(false);
        } else {
          setIsDarkMode(true);
        }
      });

  return (
    <>
      <AllLayout>
    <Box 
    paddingBottom={{ lg: "10", sm: "10", base: "10" }}
    marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
    paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
    marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
    >
      <VStack spacing={6} align="start">
      <Text
        
           transition={{ duration: 0.5 } as any}
           fontSize={{base: "2xl",md:"4xl", lg: "6xl"}}
           fontWeight={{ base: "extrabold", md: "bold", lg: "bold" }}
           color="#30A0E0"
          >
          EIPs Insight Recap: 2024 Milestones
        </Text>

        {/* EtherWorld Advertisement */}
        <Box w="100%" my={6}>
          <CloseableAdCard />
        </Box>

        <Stack 
  direction={{ base: "column", lg: "row" }} // Stack vertically on small screens, horizontally on large screens
  spacing={6} 
  align="center" // Align content in the center
  justify="center" // Center content horizontally and vertically
>
  {/* Image Box */}
  <Box 
    display="flex" 
    justifyContent="center" 
    width={{ base: "100%", lg: "40%" }} // Image takes up 40% of the width on large screens
  >
    <Image 
      src="milestone1.jpg" 
      alt="Image 1" 
      borderRadius="md" 
      width={{ base: "250px", md: "350px", lg: "100%" }} // Image width is set to 100% on large screens
      height="auto" // Maintain aspect ratio
      border="2px solid blue" 
      objectFit="contain" // Ensure image is contained within the box without distortion
    />
  </Box>

  {/* Text */}
  <Box 
    width={{ base: "100%", lg: "60%" }} // Text takes up 60% of the width on large screens
    textAlign="justify"
  >
    <Text 
      fontSize={{ base: "md", md: "xl", lg: "xl" }} 
    >
      As the Ethereum Improvement Proposals (EIPs) play an important role in
      shaping Ethereum's future, tools like 
     {" "} <Link href="https://eipsinsight.com/" color="blue.400" isExternal className="underline">
      EIPs Insight</Link> {" "}
      offer valuable
      analytics and tracking solutions to enhance transparency and
      efficiency. This review highlights the pivotal role played by the
      Analytics Scheduler, Reviewers Tracker, EIP Board, and other
      utilities, which together streamline workflows, promote
      accountability, and optimize the management of proposals.
     </Text>
     <Text 
      fontSize={{ base: "md", md: "xl", lg: "xl" }} 
    >
     With help
      of these tools and their functionalities, we can better appreciate
      how the Ethereum community stays organized and forward-looking in a
      decentralized environment.
    </Text>
  </Box>
</Stack>



        <Heading as="h2" size="lg" textAlign="justify">
          Analytics Scheduler
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The 
          {" "} <Link href="https://eipsinsight.com/Analytics" color="blue.400" isExternal className="underline">
          Analytics Scheduler</Link> {" "}
           is a powerful tool designed to monitor and
          analyze the performance of Ethereum-based GitHub repositories. Its
          primary function is to track PRs and issues, providing a detailed
          breakdown of repository activity over time. By offering monthly and
          yearly insights, the tool helps teams assess their productivity and
          maintain oversight of code contributions and bug reports.
        </Text>

        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          Designed based on 
          {" "} <Link href="https://github.com/AvarchLLC/EIPsInsight/issues/56" color="blue.400" isExternal className="underline">
          input</Link> {" "}
          from active EIP Editors, the scheduler
          automates data extraction from GitHub, eliminating manual tracking
          and ensuring comprehensive visibility into repository workflows. This
          enhances efficiency by keeping development cycles organized and
          transparent.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone2.jpg" alt="Image 2" borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
        />
        </Box>

        <Heading as="h3" size="md" textAlign="justify">
          1. Comprehensive PR/Issue Tracking
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The 
          {" "} <Link href="https://eipsinsight.com//Analytics#GithubAnalytics" color="blue.400" isExternal className="underline">
          Analytics Scheduler</Link> {" "}
           tracks the creation, closure, and merging of
          PRs and issues. By presenting this data on a monthly and yearly
          basis, it allows various teams to gauge their progress consistently.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        One of its standout features is the ability to display PRs and issues that remain open at the end of each month. 
        This provides teams a clear understanding of ongoing tasks and helps prioritize outstanding work.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone3.png" alt="Image 3" borderRadius="md"
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
         />
         </Box>

        <Heading as="h3" size="md" textAlign="justify">
          2. Lifecycle Insights
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The tool maintains a 
          {" "} <Link href="https://eipsinsight.com//Analytics#GithubAnalytics" color="blue.400" isExternal className="underline">
          historical record of PRs</Link> {" "}
          and issues, enabling
          users to visualize activity over extended periods. By examining
          long-term trends, teams can identify peak development times,
          recurring issues, and productivity patterns.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone4.jpg" alt="Image 4" borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
        />
        </Box>

        <Heading as="h3" size="md" textAlign="justify">
          3. Visualization & Reporting
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The Analytics Scheduler transforms raw GitHub data into intuitive
          {" "} <Link href="https://eipsinsight.com//Analytics#GithubAnalytics" color="blue.400" isExternal className="underline">
          visual reports</Link> {" "}
           and charts. These visualizations offer a quick
          snapshot, making it easier for teams to communicate progress to
          stakeholders.The tool’s graphical representation simplifies complex data, allowing non-technical team members to understand 
          performance at a glance.

        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone5.png" alt="Image 5" borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
        />
        </Box>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        This allows for better performance evaluations and helps identify areas that require additional attention. 
        By addressing bottlenecks early, managers can streamline development workflows and improve overall efficiency. 
        This enables teams to prioritize tasks and allocate resources effectively.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        Developers can use the tool to monitor their individual contributions, providing transparency into their work. 
        This fosters a sense of accountability and helps during performance reviews.
        </Text>

        <Heading as="h2" size="lg" textAlign="justify">
          <div id="reviewers-tracker"> Reviewers Tracker </div>
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The 
          {" "} <Link href="https://eipsinsight.com/Reviewers" color="blue.400" isExternal className="underline">
          Reviewers Tracker</Link> {" "} is designed to monitor and analyze the activity
          of EIP editors. It focuses on tracking PR reviews made by editors,
          providing insights into their contributions and review patterns over
          time. This tool helps to ensure transparency and accountability in
          the review process, promoting efficiency and improving the overall
          quality of Ethereum proposals.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        By offering comparative data and detailed timelines, the Reviewers Tracker assists in identifying the most active editors,
         their areas of expertise, and the time taken to review PRs. 
        This insight is essential for improving the responsiveness and effectiveness of the EIP process.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone6.png" alt="Image 6" borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
        />
        </Box>

        <Heading as="h3" size="md" textAlign="justify">
          1. Individual Editor Tracking
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The 
          {" "} <Link href="https://eipsinsight.com//Reviewers#Leaderboard" color="blue.400" isExternal className="underline">
          Reviewers Tracker</Link> {" "}
          enables users to monitor the activity of
          individual EIP editors. For each PR reviewed, the tool logs essential
          details, such as the date of review and the specific PR. This
          information is compiled to create detailed monthly and cumulative
          reports, offering a comprehensive overview of an editor’s
          contributions.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        Tracking individual editors ensures that the community can recognize and appreciate active contributors while 
        identifying areas where additional support may be needed. This feature helps maintain fairness and balance in the 
        distribution of review responsibilities.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone7.png" alt="Image 7" borderRadius="md"
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
         />
         </Box>

        <Heading as="h3" size="md" textAlign="justify">
          2. Editors’ Activity Timeline
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          A 
          {" "} <Link href="https://eipsinsight.com//Reviewers#ActivityTimeline" color="blue.400" isExternal className="underline">
         dedicated activity timeline</Link> {" "}
          tracks the submission times of editors,
          providing insight into when reviews are typically conducted. This
          timeline helps contributors anticipate when PR reviews are likely to
          occur, streamlining planning and reducing uncertainty.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone8.png" alt="Image 8" borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "950px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
        />
        </Box>

        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          For example, if certain editors consistently review PRs at the end of
          the month, contributors can adjust their submission schedules
          accordingly to align with these patterns. This feature enhances
          predictability and reduces the waiting time for approvals.
        </Text>

        <Heading as="h3" size="md" textAlign="justify">
          3. Editor Specialization Chart
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The Reviewers Tracker 
          {" "} <Link href="https://eipsinsight.com//Reviewers#Speciality" color="blue.400" isExternal className="underline">
          categorizes editors based on their specialization </Link> {" "}
          within different types of proposals, such as EIPs,
          ERCs, and RIPs. This specialization chart identifies which editors
          focus on specific areas, allowing teams to assign PRs to editors best
          suited to handle them.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone9.png" alt="Image 9" borderRadius="md"
        width={{ base: "250px", md: "450px", lg: "950px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
         />
         </Box>

        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          By matching editors to their areas of expertise, the tool ensures
          that reviews are conducted by knowledgeable individuals, leading to
          higher-quality assessments and fewer revisions. This reduces
          back-and-forth and accelerates the proposal acceptance process.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        The Reviewers Tracker provides valuable insights into the contributions of EIP editors,
        helping identify the most active and engaged reviewers. This is essential for recognizing high-performing editors and ensuring they receive appropriate acknowledgment. 
        It also highlights editors who may need additional support or motivation to increase their participation.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        Contributors can see which editors are most active and specialize in specific areas, 
        allowing them to reach out for assistance or clarification. 
        This promotes a more connected and efficient review environment.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        New editors can use the tool to familiarize themselves with the review process by observing the activity of experienced editors. 
        This helps newcomers understand best practices, submission timelines,
        and areas of specialization, accelerating their learning curve and increasing their contributions.
        </Text>

        <Heading as="h2" size="lg" textAlign="justify">
          <div id="eip-board"> EIP Board </div>
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The 
          {" "} <Link href="https://eipsinsight.com/boards" color="blue.400" isExternal className="underline"> 
          EIP Board </Link> {" "}
          is a prioritization tool designed to streamline the
          review process for EIPs. Developed in collaboration with 
          {" "} <Link href="https://x.com/_samwilsn_" color="blue.400" isExternal className="underline">
         samwilsn</Link>,
          the EIP Board helps editors identify and prioritize PRs that require
          urgent attention. By systematically highlighting PRs based on waiting
          times and importance, the tool optimizes the review workflow,
          ensuring that critical proposals do not face unnecessary delays.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        The EIP Board curates a list of PRs that require immediate attention from editors. 
        This list is generated by analyzing PRs based on their waiting times and the urgency of editor reviews. 
        Proposals that have been in the queue for extended periods 
        are flagged for prioritization, ensuring that long-standing submissions are addressed promptly.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone10.png" alt="Image 10" borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "950px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
        />
        </Box>

        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          By automating this prioritization, the tool reduces the likelihood of
          PRs being overlooked, fostering a more responsive and fair review
          process. Editors can easily access and manage high-priority
          proposals, streamlining the workflow and enhancing overall
          efficiency.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        This prevents the duplication of effort and ensures that reviews are conducted in a timely and organized manner, 
        preventing bottlenecks in the development cycle. The tool fosters collaboration by providing a unified view of pending PRs.
         Editors can distribute tasks, work on proposals together, 
        and ensure that complex submissions receive adequate attention from multiple reviewers.
        </Text>

        <Heading as="h2" size="lg" textAlign="justify">
          <div id="search-tool">Search Tool</div>
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The 
          {" "} <Link href="https://eipsinsight.com/SearchEip" color="blue.400" isExternal className="underline">
          Search Tool </Link> {" "}
          simplifies the process of locating EIPs by allowing
          users to filter and retrieve proposals based on specific parameters
          such as EIP number, author, GitHub handle, and title. This tool is
          designed to enhance accessibility and efficiency, enabling
          developers, editors, and community members to quickly find relevant
          EIPs without manually combing through vast repositories.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        By offering refined search capabilities, the tool contributes to greater productivity in the Ethereum development ecosystem, 
        allowing contributors to focus on proposal evaluation, drafting, and collaboration.
        </Text>
        

        <Heading as="h3" size="md" textAlign="justify">
          1. EIP Number Search
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          Users can locate proposals by entering a 
          {" "} <Link href="https://eipsinsight.com/SearchEip" color="blue.400" isExternal className="underline">
         specific EIP number</Link>.
          This
          feature is particularly useful for editors and developers who need to
          review or reference a particular proposal quickly. Instead of
          navigating through GitHub repositories manually, users can simply
          input the EIP number and retrieve the relevant document instantly.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone11.png" alt="Image 11" borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
        />
        </Box>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        This functionality reduces the time spent searching for specific proposals,
         making the review and research process significantly more efficient.
        </Text>
        

        <Heading as="h3" size="md" textAlign="justify">
          2. Author-Based Filtering
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The tool enables searches based on the 
          {" "} <Link href="https://eipsinsight.com/authors" color="blue.400" isExternal className="underline">
          author’s name or GitHub
          handle</Link>,
           allowing users to view all EIPs contributed by a specific
          individual. This is valuable for tracking the work of prolific
          contributors or identifying patterns in the types of proposals
          authored by a particular developer.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        Author filtering fosters greater collaboration by making it easier to recognize and connect 
        with active contributors in the Ethereum ecosystem.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone12.png" alt="Image 12" borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
        />
        </Box>
        

        <Heading as="h3" size="md" textAlign="justify">
          3. Title & Keyword Search
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        Users can filter EIPs by entering keywords from the 
        {" "} <Link href="https://eipsinsight.com/SearchEipTitle" color="blue.400" isExternal className="underline">
        title or description</Link>{" "} of the proposal. 
        This allows for flexible and broad searches, making it easy to locate proposals even if the exact EIP number or author is unknown.
         By searching for relevant terms, 
        users can identify proposals that align with their areas of interest or project requirements.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone13.png" alt="Image 13" borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain"
        />
        </Box>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        Title-based searches are especially beneficial for newcomers to Ethereum development, as they can discover relevant proposals by simply typing in general concepts or themes.
        </Text> 
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        Authors drafting new EIPs can use the tool to find similar proposals by searching for relevant terms or past contributors in their domain. This allows them to reference and build upon existing proposals, ensuring continuity and reducing redundant submissions
        </Text>
        <Heading as="h1" size="xl" textAlign="justify">
          <div id="pectra-upgrade"> Pectra Network Upgrade </div>
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The 
          {" "} <Link href="https://eipsinsight.com/pectra" color="blue.400" isExternal className="underline">
          Pectra</Link>{" "} 
           Page is a dedicated resource that provides comprehensive information on the Pectra network upgrade along with detailed specifications for devnet and testnet environments. This page serves as a centralized hub for tracking network upgrades across the Ethereum ecosystem, offering a granular breakdown of the contributions made by authors and the proposals (EIPs) involved in each upgrade cycle.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone14.png" alt="Pectra Overview" 
        borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain" 
        />
        </Box>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The Pectra Page provides exhaustive details regarding the 
          {" "} <Link href="https://eipsinsight.com/pectra" color="blue.400" isExternal className="underline">
          Pectra network upgrade
          </Link>{" "}  as well as past and future Ethereum upgrades. Users can access comprehensive specs for devnet and testnet environments, allowing them to track and prepare for changes before they are implemented on the mainnet.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone15.png" alt="Pectra Specifications" 
        borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain" 
        />
        </Box>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          By having a canonical source for this information, the tool ensures that developers and stakeholders are aligned, minimizing confusion and reducing the risk of errors during upgrade deployments.
        </Text>
        <Heading as="h2" size="lg">
          <div id="network-info"> Detailed Network Upgrade Information </div>
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          A prominent feature of the Pectra Page is the 
          {" "} <Link href="https://eipsinsight.com/pectra" color="blue.400" isExternal className="underline">
          network upgrade chart</Link>
          , which visually represents contributions from different proposals (EIPs) to each upgrade. This chart allows users to see which proposals were integrated into a particular upgrade and how various contributors influenced its development.
        </Text>
        
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The chart simplifies complex upgrade data, making it easier for users to grasp the broader scope of Ethereum’s evolution at a glance. This feature is particularly useful for ecosystem researchers looking to monitor the development trajectory.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone16.png" alt="Upgrade Chart" 
        borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain" 
        />
        </Box>
        <Heading as="h2" size="lg">
          Author Contribution Insights
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The page highlights contributions from individual authors involved in Ethereum’s upgrade process. By detailing the 
          {" "} <Link href="https://eipsinsight.com/pectra" color="blue.400" isExternal className="underline">
          number of EIPs authored by each contributor</Link>, the tool recognizes key players in the ecosystem and showcases the impact of their work.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        This feature fosters a sense of community and encourages further participation by spotlighting
         contributors who drive protocol improvements.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone17.png" alt="Author Insights"
        borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain" 
         />
         </Box>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          Developers can use the Pectra Page to track upcoming network upgrades and prepare their applications accordingly. By reviewing devnet and testnet specifications, developers ensure their projects remain compatible with Ethereum’s evolving infrastructure.
        </Text>
        <Heading as="h2" size="lg">
          Tracking Status Change of Various Proposals
        </Heading>
        <Heading as="h3" size="md">
          Ethereum Improvement Proposals (EIPs)
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The {" "} <Link href="https://eipsinsight.com/eip" color="blue.400" isExternal className="underline">
          EIPs</Link> page provides a comprehensive overview of Ethereum Improvement Proposals (EIPs), offering valuable statistics and visualizations. The page highlights the total number of EIPs and their distribution across different statuses, including Final, Draft, Review, and other stages.
        </Text>
        
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          A stacked bar chart breaks down the types of EIPs over the years, categorized into Core, Meta, and other segments, reflecting growth and activity trends from 2015 to 2024. The interface allows users to download data in CSV format for further analysis, making it an essential tool for tracking the evolution and adoption of EIPs.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone18.png" alt="EIP Statistics" 
        borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain" 
        />
        </Box>
        <Heading as="h3" size="md">
          Ethereum Request Comment (ERC)
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The ERCs Page offers a detailed snapshot of Ethereum Request for Comments (ERCs), crucial for defining standards and token interfaces in the Ethereum ecosystem.
        </Text>
        
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          Users can download data in CSV format for deeper analysis, making this an essential tool for tracking ERC adoption and trends.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone19.png" alt="ERC Statistics"
        borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain" 
         />
         </Box>
        <Heading as="h3" size="md">
          Rollup Improvement Proposal (RIP)
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The {" "} <Link href="https://eipsinsight.com/rip" color="blue.400" isExternal className="underline">RIP</Link> Page is a specialized resource that aggregates and visualizes RIP data, offering insights into contributions and development trends that are not readily available elsewhere. This tool plays a critical role in documenting and categorizing RIPs, ensuring that contributors and community members have access to a structured overview of ongoing and completed proposals.
        </Text>
        <Box display="flex" justifyContent="center" width="100%">
        <Image src="milestone20.png" alt="RIP Dashboard" 
        borderRadius="md" 
        width={{ base: "250px", md: "450px", lg: "850px" }} // Use width instead of boxSize for rectangular shape
        height="auto" // Maintain aspect ratio
        border="2px solid blue" 
        objectFit="contain" 
        />
        </Box>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          One of the distinguishing aspects of the RIP Page is that it provides exclusive access to Rollup Improvement Proposals in a dashboard that is not publicly available on any other platforms.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          The RIP Page features visual charts and graphs that break down RIPs by category, status, and contributor. These visualizations offer users a clear overview of proposal distribution and development activity, making it easier to identify trends and prioritize areas for further contribution.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
        Visualization simplifies complex data, allowing users to quickly assess the progress of various RIPs without needing to sift through raw text or code repositories.
        </Text>
        <Heading as="h2" size="lg">
          <div id="gratitute">Gratitude</div> 
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          We also want to extend our gratitude to the Ethereum community for their unwavering support, particularly from the EIP Editors and Gitcoin Grants. Their contributions have been instrumental in driving the development and enhancement of EIPs Insight. This collaboration highlights the power of collective effort in fostering innovation and maintaining the integrity of the Ethereum ecosystem.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          We extend our heartfelt thanks to all contributors whose dedication and hard work have been pivotal in making EIPs Insight a success this year.
        </Text>
        <Heading as="h2" size="lg">
          <div id="conclusion">Conclusion</div>
        </Heading>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          These features by EIPs Insight not only simplify the EIP process but also strengthen the Ethereum ecosystem by fostering collaboration and improving visibility across all development stages. From monitoring individual editor contributions to prioritizing critical proposals, these tools reflect the community’s commitment to growth and innovation.
        </Text>
        <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
          As Ethereum continues to evolve, platforms like 
          {" "} <Link href="https://eipsinsight.com/" color="blue.400" isExternal className="underline">
          EIPs Insight</Link> will remain essential for driving efficiency, encouraging participation, and ensuring that the network’s governance stays robust and inclusive. By leveraging these insights, contributors can actively shape the blockchain’s future while reinforcing the core principles of decentralization and transparency.
        </Text>
      </VStack>
    </Box>
    </AllLayout>
    </>
  );
};

export default EIPsInsightRecap;
