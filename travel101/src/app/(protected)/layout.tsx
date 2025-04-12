'use client';

import { ReactNode } from "react";
import ProtectedRoute from "../protectedRoutes";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
	return (
		<ProtectedRoute>
			{children}
		</ProtectedRoute>
	);
}