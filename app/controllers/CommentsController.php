<?php

class CommentsController extends BaseController {

	/**
	 * Remove the specified resource from storage.
	 *
	 * @return Response
	 */
	public function destroy($id)
	{
		$comment = Comment::find($id);
		$comment->delete();

		return Response::json([
			'error' => false,
			'message' => 'comment deleted'
		],200);
	}

}