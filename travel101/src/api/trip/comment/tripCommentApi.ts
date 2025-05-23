import { apiClient } from "@/api/apiClient";
import { publicApiClient } from "../../publicApiClient";
import { CommentUpdateProps, FetchCommentOptions, CommentRequestProps, CommentProps } from "@/types/trip/comment/tripCommentTypes";

const TRIP_COMMENT_URL = "http://localhost:8080/api/comment";
const PUBLIC_TRIP_COMMENT_URL = "http://localhost:8080/public/comment";

const getRootComments = async (commentRequest: FetchCommentOptions): Promise<any> => {
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

const getCommentsReplies = async (parentUid: string): Promise<any> => {
	try {
		const response = await publicApiClient(`${PUBLIC_TRIP_COMMENT_URL}/getTripCommentReplies?parentUid=${parentUid}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error get trip comments:", error);
		return null;
	}
}

const addCommentApi = async (newComment: CommentRequestProps): Promise<CommentProps> => {
	return await apiClient(`${TRIP_COMMENT_URL}/addComment`, {
		method: 'POST',
		body: JSON.stringify(newComment),
	});
}

const updateCommentApi = async (updateComment: CommentUpdateProps): Promise<any> => {
	return await apiClient(`${TRIP_COMMENT_URL}/updateComment`, {
		method: "PUT",
		body: JSON.stringify(updateComment)
	});
}

const deleteCommentApi = async (targetUid: string): Promise<any> => {
	return await apiClient(`${TRIP_COMMENT_URL}/deleteComment?targetUid=${targetUid}`, {
		method: "DELETE"
	});
}

export { getRootComments, getCommentsReplies, addCommentApi, updateCommentApi, deleteCommentApi }