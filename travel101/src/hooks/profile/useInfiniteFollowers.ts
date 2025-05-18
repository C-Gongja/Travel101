import { getFollowersPaginated, getFollowingPaginated } from "@/api/account/follow/FollowApi";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 10;

export const useInfiniteFollowers = (uuid: string) => {
	return useInfiniteQuery({
		queryKey: ["infFollowers", uuid],
		queryFn: async ({ pageParam = 0 }) => {
			return await getFollowersPaginated({
				uuid,
				page: pageParam,
				limit: LIMIT,
			});
		},
		getNextPageParam: (lastPage, allPages) => {
			return lastPage?.hasNext ? allPages.length : undefined;
		},
		initialPageParam: 0,
		enabled: !!uuid,
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
	});
};

export const useInfiniteFollowing = (uuid: string) => {
	return useInfiniteQuery({
		queryKey: ["infFollowing", uuid],
		queryFn: async ({ pageParam = 0 }) => {
			return await getFollowingPaginated({
				uuid,
				page: pageParam,
				limit: LIMIT,
			});
		},
		getNextPageParam: (lastPage, allPages) => {
			return lastPage?.hasNext ? allPages.length : undefined;
		},
		initialPageParam: 0,
		enabled: !!uuid,
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
	});
};