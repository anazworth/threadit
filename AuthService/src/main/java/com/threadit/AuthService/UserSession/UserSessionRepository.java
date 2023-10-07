package com.threadit.AuthService.UserSession;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends CrudRepository<UserSession, String> {
    Optional<UserSession> findOneByUsername(String username);
    Optional<ArrayList<UserSession>> findAllByUsername(String username);
}
//@Repository
//public class UserSessionRepository {
//    private HashOperations hashOperations;
////    private ValueOperations valueOperations;
//
//
//    public UserSessionRepository(RedisTemplate redisTemplate) {
//        this.hashOperations = redisTemplate.opsForHash();
////        this.valueOperations = redisTemplate.opsForValue();
//    }
//
//    public void save(UserSession userSession) {
//        try {
////            valueOperations.set(userSession.getId(), userSession);
////            hashOperations.put("UserSession", userSession.getId(), userSession);
//            hashOperations.put(userSession.getId(), userSession.getId(), userSession.getUsername());
//        } catch (Exception e) {
//            System.out.println(e.getMessage());
//        }
//
//
//    }
//
//    public Optional<UserSession> findById(String id) {
//        try {
//            return Optional.ofNullable((UserSession) hashOperations.get(id, id));
//        } catch (Exception e) {
//            System.out.println(e.getMessage());
//            return Optional.empty();
//        }
//    }
//
//    // delete by id
//    public void deleteById(String id) {
//        if (hashOperations.hasKey("UserSession", id)) {
//            hashOperations.delete("UserSession", id);
//        }
//    }
//
//    // get all sessions by username
//    public Optional<UserSession> findByUsername(String username) {
//        try {
//            return Optional.ofNullable((UserSession) hashOperations.get("UserSession", username));
//        } catch (Exception e) {
//            System.out.println(e.getMessage());
//            return Optional.empty();
//        }
//    }
//}
