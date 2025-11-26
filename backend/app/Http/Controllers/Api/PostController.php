<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Reply;
use App\Models\PostReaction;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    private $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Get all posts with pagination, sorted by latest
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');

        $query = Post::with(['user', 'reactions', 'replies.user'])
            ->withCount('reactions')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where('content', 'like', '%' . $search . '%');
        }

        $posts = $query->paginate($perPage);

        // Add hasReacted flag for current user
        $posts->getCollection()->transform(function ($post) use ($request) {
            $post->has_reacted = $post->hasReactionFrom($request->user()->id);
            return $post;
        });

        return response()->json($posts);
    }

    /**
     * Get trending posts (TOP 3 with most reactions)
     */
    public function trending()
    {
        $posts = Post::with(['user', 'reactions'])
            ->withCount('reactions')
            ->orderBy('reactions_count', 'desc')
            ->take(3)
            ->get();

        return response()->json($posts);
    }

    /**
     * Create a new post with AI fact-checking
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        // AI fact-checking
        $factCheck = $this->aiService->factCheck($request->content);

        $post = Post::create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
            'is_ai_flagged' => $factCheck['is_flagged'],
            'ai_flag_reason' => $factCheck['reason'],
        ]);

        $post->load(['user', 'reactions', 'replies']);
        $post->reactions_count = 0;
        $post->has_reacted = false;

        return response()->json([
            'post' => $post,
            'ai_warning' => $factCheck['is_flagged'] ? $factCheck['reason'] : null,
        ], 201);
    }

    /**
     * Get a single post with replies
     */
    public function show(Request $request, $id)
    {
        $post = Post::with(['user', 'reactions', 'replies.user'])
            ->withCount('reactions')
            ->findOrFail($id);

        $post->has_reacted = $post->hasReactionFrom($request->user()->id);

        return response()->json($post);
    }

    /**
     * Delete a post (only by owner)
     */
    public function destroy(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    /**
     * Add a reply to a post
     */
    public function addReply(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $post = Post::findOrFail($id);

        // Check if content mentions @checkAI
        $isAIMention = str_contains($request->content, '@checkAI');
        $content = $request->content;

        if ($isAIMention) {
            // Extract the question after @checkAI
            $question = trim(str_replace('@checkAI', '', $content));

            // Get post content as context
            $context = 'Original post: ' . $post->content;

            // Generate AI response
            $aiResponse = $this->aiService->generateResponse($question, $context);

            // Create AI reply
            $reply = Reply::create([
                'post_id' => $id,
                'user_id' => null, // AI doesn't have a user_id
                'content' => $aiResponse,
                'is_ai_response' => true,
            ]);
        } else {
            // Regular user reply
            $reply = Reply::create([
                'post_id' => $id,
                'user_id' => $request->user()->id,
                'content' => $content,
                'is_ai_response' => false,
            ]);
        }

        $reply->load('user');

        return response()->json($reply, 201);
    }

    /**
     * Toggle reaction (boost mark) on a post
     */
    public function toggleReaction(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $userId = $request->user()->id;

        $existingReaction = PostReaction::where('post_id', $id)
            ->where('user_id', $userId)
            ->first();

        if ($existingReaction) {
            $existingReaction->delete();
            return response()->json([
                'reacted' => false,
                'reactions_count' => $post->reactions()->count(),
            ]);
        } else {
            PostReaction::create([
                'post_id' => $id,
                'user_id' => $userId,
            ]);
            return response()->json([
                'reacted' => true,
                'reactions_count' => $post->reactions()->count(),
            ]);
        }
    }

    /**
     * Search posts
     */
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:1',
        ]);

        $query = $request->input('q');
        $perPage = $request->input('per_page', 15);

        $posts = Post::with(['user', 'reactions', 'replies'])
            ->withCount('reactions')
            ->where('content', 'like', '%' . $query . '%')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $posts->getCollection()->transform(function ($post) use ($request) {
            $post->has_reacted = $post->hasReactionFrom($request->user()->id);
            return $post;
        });

        return response()->json($posts);
    }
}
