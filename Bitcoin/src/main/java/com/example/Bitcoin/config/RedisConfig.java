package com.example.Bitcoin.config;

import com.example.Bitcoin.service.MarketDataConsumer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.stream.Subscription;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean
    public StringRedisTemplate redisTemplate(RedisConnectionFactory connectionFactory) {
        // Yeh template hume Redis se baat karne mein help karega
        return new StringRedisTemplate(connectionFactory);
    }

    @Bean
    public Subscription subscription(RedisConnectionFactory factory, MarketDataConsumer consumer) {
        StreamMessageListenerContainer.StreamMessageListenerContainerOptions<String, MapRecord<String, String, String>> options =
                StreamMessageListenerContainer.StreamMessageListenerContainerOptions.builder()
                        .pollTimeout(Duration.ofMillis(100)) // Har 100ms mein check karega (Micro-latency)
                        .build();

        StreamMessageListenerContainer<String, MapRecord<String, String, String>> container =
                StreamMessageListenerContainer.create(factory, options);

        Subscription subscription = container.receive(
                StreamOffset.create("market-ticks", ReadOffset.lastConsumed()),
                consumer
        );

        container.start();
        return subscription;
    }
}
