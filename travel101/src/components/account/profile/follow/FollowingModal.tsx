'use client'

import { useEffect, useRef, useState } from "react";
import { UserSnippet } from "@/types/user/userSnippetTypes";
import { useParams } from "next/navigation";
import { FaSearch } from 'react-icons/fa';
import { useInfiniteFollowing } from "@/hooks/profile/useInfiniteFollowers";
import UserSnippetCard from "@/components/ui/card/UserSnippetCard";

export default function FollowingModal() {
	const { uuid } = useParams<{ uuid: string }>();
	const {
		data: followings,
		isLoading,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage
	} = useInfiniteFollowing(uuid);
	// const allFollowing = followings?.pages.flatMap(page => page.content) || [];
	const observerRef = useRef<HTMLDivElement | null>(null);
	const [snippets, setSnippets] = useState<UserSnippet[]>([]);

	const toggleFollow = (uuid: string, isFollowing: boolean) => {
		setSnippets(prev =>
			prev.map(snippet =>
				snippet.uuid === uuid ? { ...snippet, isFollowing } : snippet
			)
		);
	};

	useEffect(() => {
		if (followings) {
			const lastPage = followings.pages[followings.pages.length - 1];
			const newSnippets = lastPage?.content || [];

			setSnippets(prev => {
				const combined = [...prev, ...newSnippets];
				const unique = Array.from(new Map(combined.map(item => [item.uuid, item])).values());
				return unique;
			});
		}
	}, [followings]);

	useEffect(() => {
		if (!hasNextPage || !observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 1 }
		);

		observer.observe(observerRef.current);

		return () => {
			if (observerRef.current) observer.unobserve(observerRef.current);
		};
	}, [observerRef, hasNextPage, fetchNextPage]);

	return (
		<div className="w-full max-w-[400px] min-w-[300px]">
			<div className="flex justify-center items-center px-4 pb-3 border-b border-gray-700">
				<h2 className="text-xl font-semibold">Following</h2>
			</div>

			<div className="px-4 py-3">
				<div className="relative">
					<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search"
						// value={searchQuery}
						// onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full border border-gray-700 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
					/>
				</div>
			</div>

			<div className="max-h-[300px] overflow-y-auto">
				{isLoading || (snippets && snippets.length === 0) ? (
					<p className="text-gray-400 text-center py-4">No followers found</p>
				) : (
					snippets.map((following: UserSnippet, index: number) => (
						<>
							<UserSnippetCard
								key={following.uuid}
								userSnippet={following}
								toggleFollow={toggleFollow}
							/>
							<div className="my-1" />
							{index === snippets.length - 1 && <div ref={observerRef} />}
						</>
					))
				)}
				{isFetchingNextPage && <p className="text-center text-gray-400 py-2">Loading more...</p>}
			</div>
		</div>
	);
}