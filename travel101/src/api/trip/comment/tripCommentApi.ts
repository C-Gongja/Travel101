import { apiClient } from "@/api/apiClient";
import { publicApiClient } from "../../publicApiClient";
import { FetchCommentOptions, TripCommentProps, TripCommentRequestProps } from "@/types/trip/comment/tripCommentTypes";

const TRIP_COMMENT_URL = "http://localhost:8080/api/comment";
const PUBLIC_TRIP_COMMENT_URL = "http://localhost:8080/public/comment";


const getTripRootComments = async (commentRequest: FetchCommentOptions): Promise<any> => {
	console.log("commentRequest: ", commentRequest);
	try {
		const response = await publicApiClient(`${PUBLIC_TRIP_COMMENT_URL}/getTripRootComments?targetType=${commentRequest.targetType}&targetUid=${commentRequest.targetUid}`,
			{ method: "GET" });
		return response;
	} catch (error) {
		console.error("Error get trip comments:", error);
		return null;
	}
}

const getTripCommentsReplies = async (parentUid: string): Promise<any> => {
	try {
		const response = await publicApiClient(`${PUBLIC_TRIP_COMMENT_URL}/getTripCommentReplies?parentUid=${parentUid}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error get trip comments:", error);
		return null;
	}
}

const addTripComment = async (newComment: TripCommentRequestProps): Promise<any> => {
	try {
		const response = await apiClient(`${TRIP_COMMENT_URL}/addComment`, {
			method: "POST",
			body: JSON.stringify(newComment)
		});
		return response;
	} catch (error) {
		console.error("Error add trip comments:", error);
		return null;
	}
}

export { getTripRootComments, getTripCommentsReplies, addTripComment }