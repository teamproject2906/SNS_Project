//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Service;
//
//import java.time.Duration;
//import java.util.Map;
//import java.util.UUID;
//
//@Service
//public class TokenService {
//
//    private static final String TOKEN_PREFIX = "TOKEN_";
//
//    @Autowired
//    private RedisTemplate<String, Object> redisTemplate;
//
//    public void saveToken(Integer userId, String token, String tokenType, long expirationTimeInMinutes) {
//        String key = TOKEN_PREFIX + token;
//        Map<String, Object> tokenData = Map.of(
//                "userId", userId.toString(),
//                "tokenType", tokenType,
//                "expired", false,
//                "revoked", false
//        );
//        redisTemplate.opsForHash().putAll(key, tokenData);
//        redisTemplate.expire(key, Duration.ofMinutes(expirationTimeInMinutes));
//    }
//
//    public Map<Object, Object> getTokenData(String token) {
//        String key = TOKEN_PREFIX + token;
//        return redisTemplate.opsForHash().entries(key);
//    }
//
//    public void revokeToken(String token) {
//        String key = TOKEN_PREFIX + token;
//        redisTemplate.opsForHash().put(key, "revoked", true);
//    }
//
//    public void expireToken(String token) {
//        String key = TOKEN_PREFIX + token;
//        redisTemplate.opsForHash().put(key, "expired", true);
//    }
//
//    public void deleteToken(String token) {
//        String key = TOKEN_PREFIX + token;
//        redisTemplate.delete(key);
//    }
//
//    public void revokeAllUserTokens(Integer userId) {
//        // Assuming we have a way to find all tokens by userId
//        // Here, we would iterate over all tokens for the user and revoke them
//    }
//
//    public boolean isTokenValid(String token) {
//        Map<Object, Object> tokenData = getTokenData(token);
//        if (tokenData.isEmpty()) {
//            return false;
//        }
//        Boolean expired = (Boolean) tokenData.get("expired");
//        Boolean revoked = (Boolean) tokenData.get("revoked");
//        return expired != null && revoked != null && !expired && !revoked;
//    }
//}
