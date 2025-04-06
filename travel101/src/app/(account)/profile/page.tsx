'use client'

import { useUserStore } from "@/app/store/user/user-store";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileRedirect() {
	const { user, isLoading, verifyUser } = useUserStore();

	useEffect(() => {
		verifyUser();
	}, []);

	// if user is undefined
	if (isLoading) return <p>Loading...</p>;

	// redirect
	if (user) {
		console.log("if user: ", user)
		redirect(`/profile/${user.uid}`);
	} else {
		console.log("else user: ", user)
		redirect("/");
	}

	return null;
}
