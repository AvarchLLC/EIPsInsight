import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

// Define allowed editor/admin emails
const EDITORS: string[] = ["dhanushlnaik@gmail.com"];

const AdminPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (status === "loading") return;
    // Type guard: session?.user?.email is string
    console.log(!session?.user?.email)
    if (!session || !session.user?.email || !EDITORS.includes(session.user.email)) {
      
      toast({
        title: "Access Denied",
        description: "You are not admin/editor!",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      router.replace("/");
    }
  }, [session, status, router, toast]);

  // Prevent rendering until the check is done
  if (status === "loading" || !session || !session.user?.email || !EDITORS.includes(session.user.email)) {
    return null;
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
    </div>
  );
};

export default AdminPage;
