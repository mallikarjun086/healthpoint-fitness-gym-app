package com.healthpoint.ai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ai.openai")
public class AiProperties {
    private String apiKey;
    private String baseUrl = "https://api.openai.com/v1";
    private Models models = new Models();
    private int timeoutMs = 30000;
    private int maxTokens = 500;
    private int memoryWindow = 10;

    public static class Models {
        private String chat = "gpt-4o-mini";
        private String reasoning = "gpt-4o";
        public String getChat() { return chat; }
        public void setChat(String chat) { this.chat = chat; }
        public String getReasoning() { return reasoning; }
        public void setReasoning(String reasoning) { this.reasoning = reasoning; }
    }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
    public Models getModels() { return models; }
    public void setModels(Models models) { this.models = models; }
    public int getTimeoutMs() { return timeoutMs; }
    public void setTimeoutMs(int timeoutMs) { this.timeoutMs = timeoutMs; }
    public int getMaxTokens() { return maxTokens; }
    public void setMaxTokens(int maxTokens) { this.maxTokens = maxTokens; }
    public int getMemoryWindow() { return memoryWindow; }
    public void setMemoryWindow(int memoryWindow) { this.memoryWindow = memoryWindow; }
}
