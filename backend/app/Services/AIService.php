<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    private $apiKey;
    private $apiUrl = 'https://api.openai.com/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
    }

    /**
     * Fact-check the content of a post
     * Returns ['is_flagged' => bool, 'reason' => string|null]
     */
    public function factCheck(string $content): array
    {
        if (empty($this->apiKey)) {
            Log::warning('OpenAI API key not configured');
            return ['is_flagged' => false, 'reason' => null];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(10)->post($this->apiUrl, [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'あなたはファクトチェッカーです。投稿内容に明らかに事実と異なる情報や誤情報が含まれている場合のみ、それを指摘してください。一般的な意見や主観的な内容は問題ありません。明らかな誤情報がある場合のみ「WARNING:」で始まる理由を返し、そうでない場合は「OK」のみを返してください。',
                    ],
                    [
                        'role' => 'user',
                        'content' => '以下の投稿内容をチェックしてください: ' . $content,
                    ],
                ],
                'max_tokens' => 200,
                'temperature' => 0.3,
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $aiResponse = $result['choices'][0]['message']['content'] ?? 'OK';

                if (str_starts_with($aiResponse, 'WARNING:')) {
                    return [
                        'is_flagged' => true,
                        'reason' => substr($aiResponse, 8),
                    ];
                }

                return ['is_flagged' => false, 'reason' => null];
            }

            Log::error('OpenAI API request failed', ['response' => $response->body()]);
            return ['is_flagged' => false, 'reason' => null];
        } catch (\Exception $e) {
            Log::error('OpenAI API error', ['error' => $e->getMessage()]);
            return ['is_flagged' => false, 'reason' => null];
        }
    }

    /**
     * Generate AI response for @checkAI mentions
     */
    public function generateResponse(string $question, string $context = ''): ?string
    {
        if (empty($this->apiKey)) {
            Log::warning('OpenAI API key not configured');
            return 'AI機能が設定されていません。';
        }

        try {
            $systemPrompt = 'あなたは技術的な質問に答えるAIアシスタントです。DeepDive Devという学習プラットフォームで、ユーザーの技術的な質問に簡潔かつ正確に答えてください。';

            if (!empty($context)) {
                $systemPrompt .= ' 以下は会話の文脈です: ' . $context;
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(15)->post($this->apiUrl, [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemPrompt,
                    ],
                    [
                        'role' => 'user',
                        'content' => $question,
                    ],
                ],
                'max_tokens' => 500,
                'temperature' => 0.7,
            ]);

            if ($response->successful()) {
                $result = $response->json();
                return $result['choices'][0]['message']['content'] ?? null;
            }

            Log::error('OpenAI API request failed', ['response' => $response->body()]);
            return 'AIからの応答を取得できませんでした。';
        } catch (\Exception $e) {
            Log::error('OpenAI API error', ['error' => $e->getMessage()]);
            return 'AIからの応答を取得できませんでした。';
        }
    }
}
