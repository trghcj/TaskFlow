import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '@/api/users';
import { useAuthStore } from '@/store/useAuthStore';

export const useUser = () => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['userProfile', user?.uid],
    queryFn: fetchUserProfile,
    enabled: !!user,
  });
};
